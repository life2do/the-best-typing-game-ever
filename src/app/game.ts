/**
 * Game controller: start screen → level intro → play → crossroads → transition → next level.
 * Every keystroke is appended to the segment log first and then fed to the simulation, so live play
 * and replay are the same code path (docs/10 §1.1).
 */
import { LevelSim } from '@/sim/level';
import type { LogEvent, SimEvent } from '@/sim/types';
import { campaignFor, language, planSetup } from '@/campaign/setup';
import { drillSetup, weakestKey } from '@/campaign/drill';
import type { Campaign, LevelPlan } from '@/campaign/campaign';
import { templateSim } from '@/sim/templates';
import { palettes, scales, abilities, illustrations, templates } from '@/content/registry';
import { RenderHost, TRANSITION_MS } from '@/render/host';
import { templateViews } from '@/render/registry';
import { AvatarRig, clampToUnlocked, normalizeCustomization } from '@/avatar/procedural';
import { avatarScreen } from '@/ui/avatarScreen';
import { statsScreen } from '@/ui/statsScreen';
import { computeStats } from '@/stats/analytics';
import { Hud } from '@/ui/hud';
import { h, toast } from '@/ui/dom';
import { crossroadsScreen, drillOfferScreen, introScreen, nagScreen, settingsScreen, pauseScreen, startScreen, wordBookScreen, type VoiceEffectRows } from '@/ui/screens';
import { WordArt } from '@/ui/wordArt';
import { pinPad, profilePicker } from '@/ui/profiles';
import { adultCheck, parentScreen, sessionOverScreen } from '@/ui/parents';
import { buildExport, checkPin, parseImport, pinHash } from '@/storage/profileIO';
import { StretchBreak } from '@/ui/stretchBreak';
import { KeyboardInput } from '@/input/keyboard';
import { AudioEngine, Voice } from '@/audio/audio';
import { activeVoiceEffect, effectOfAbility, unlockedVoiceEffects } from '@/audio/voiceEffects';
import {
  DEFAULT_SETTINGS, allSegments, deleteProfile, deleteSegment, fontOf, freshSeed, listProfiles, loadProfileById, loadSegment, migrateProfiles, newProfile, profileSeeds,
  saveProfile, saveSegment, segmentKey, segmentsFor, startNewRun, totalStars, weakKeys,
  type Profile, type Segment, type Settings,
} from '@/storage/profile';
import { creditLevel } from '@/campaign/progress';
import { runFingerprint } from '@/proof/fingerprint';
import { buildProof, nameHash, PROOF_KEYWORD, type Identity } from '@/proof/bundle';
import { addITXt } from '@/proof/png';
import { artifactPng, artifactScreen, type IdentityChoice } from '@/ui/artifact';
import type { RunFile } from './replay';
import { nextTurn, partyStarsKey, roundPlans, swapsAfter, type Party, type PartyPlayerPlan } from '@/party/party';
import { handoverScreen, iconOf, partyResultsScreen, partySetupScreen, type PartyResultRow, type PartySetupResult } from '@/ui/party';
import { BUILD } from './build-info';
import { fingerName, homeKeys, keyName, tr } from '@/content/i18n';

interface PartySlot {
  profile: Profile;
  camp: Campaign;
  lang: string;
  plan: LevelPlan;
  pp: PartyPlayerPlan;
  seg: Segment;
  sim: LevelSim;
  done: boolean;
  /** this player's local clock origin (set on their first turn) */
  segStart?: number;
  grewTo?: string;
}

interface PartyRun {
  party: Party;
  profiles: Profile[];
  slots: PartySlot[];
  turn: number;
}

export class Game {
  readonly host: RenderHost;
  private ui: HTMLElement;
  private input = new KeyboardInput(language('en'));
  private audio = new AudioEngine();
  private voice = new Voice('en-US', language('en').tts?.preferredVoices);
  private profile!: Profile;
  private camp!: Campaign;
  private plan!: LevelPlan;
  private sim: LevelSim | null = null;
  private seg!: Segment;
  private hud: Hud | null = null;
  private overlay: HTMLElement | null = null;
  private nag: HTMLElement | null = null;
  private segStart = 0;
  private paused = false;
  private pauseReason: 'menu' | 'hidden' | 'break' | 'session' | 'handover' | null = null;
  /** Hot-seat party in progress (docs/06): one slot per player, `turn` is the player typing now. */
  private party: PartyRun | null = null;
  /** Between turns: the handover overlay waits for F and J together (press times). */
  private handover: { f: number; j: number } | null = null;
  /** A stage just ended and the turn passes on shortly: keys wait. */
  private swapPending = false;
  /** Play time in this session (parent area session limit), and minutes a grown-up added to the limit. */
  private sessionMs = 0;
  private sessionExtraMin = 0;
  private sessionProfileId = '';
  private lastSave = 0;
  private playMs = 0;
  private lastFrame = 0;
  private hintSpoken = -1;
  private stuckShown = false;
  private screen: 'start' | 'level' | 'victory' = 'start';
  private showIntro: () => void = () => {};
  private lastCollect = -2;
  private lastKeyAt = 0;
  private wordArt: WordArt;
  private breakUi: StretchBreak | null = null;
  /** A fix-it drill is running (practice for one weak key; not saved as a segment). */
  private drill: { key: string; level: number } | null = null;
  /** A fix-it drill offer is on screen: F accepts, J declines. */
  private offer: { yes: () => void; no: () => void } | null = null;

  constructor(canvas: HTMLCanvasElement, ui: HTMLElement) {
    this.ui = ui;
    this.host = new RenderHost(canvas);
    // Word illustrations live behind the world canvas, whose sky is transparent.
    this.wordArt = new WordArt(language('en'), () => !!this.profile?.settings.reducedMotion);
    canvas.before(this.wordArt.el);
    this.wordArt.onComplete = (c) => this.onWordRevealed(c.word, c.golden);
    this.input.onPress((k) => this.onKey(k.code, k.shift));
    this.input.onEscape(() => this.togglePause());
    this.input.onChordRelease((a, b, ms) => {
      if (ms >= 300 && [a, b].sort().join() === 'KeyF,KeyJ' && this.debugSkipAllowed()) this.debugSkip();
    });
    this.input.onLayoutMismatch(() => toast(this.ui, '⌨️ Your keyboard is set to another language. That is OK — we use key positions — but the letters may look different.'));
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.screen === 'level' && !this.paused) this.pause('hidden');
    });
    addEventListener('beforeunload', () => void this.persist());
    requestAnimationFrame((t) => this.loop(t));
    (window as any).__game = this; // for e2e tests
  }

  async boot(): Promise<void> {
    await migrateProfiles().catch(() => {});
    await this.showProfiles();
    if (!this.host.webgl) toast(this.ui, 'Your browser has 3D graphics turned off, so the worlds are hidden. Typing, sound and progress still work.');
  }

  // ------------------------------------------------------------------ screens
  private setOverlay(el: HTMLElement | null): void {
    if (this.artifactUi && el !== this.overlay) {
      this.artifactUi.dispose();
      this.artifactUi = null;
    }
    if (this.breakUi && el !== this.breakUi.el) {
      this.breakUi.destroy();
      this.breakUi = null;
    }
    this.overlay?.remove();
    this.overlay = el;
    if (el) this.ui.append(el);
  }

  private leaveLevel(): void {
    this.screen = 'start';
    this.sim = null;
    this.wordArt?.clear();
    this.hud?.el.remove();
    this.hud = null;
  }

  /** Start: the profile picker, or the new-player form when this device has no profiles yet (docs/07). */
  async showProfiles(message?: string): Promise<void> {
    this.leaveLevel();
    const profiles = await listProfiles().catch(() => [] as Profile[]);
    if (!profiles.length) return this.showNewPlayer(false);
    this.setOverlay(
      profilePicker(profiles, scales, {
        onPick: (p) => this.unlock(p, () => this.showStart(p)),
        onNew: () => this.showNewPlayer(true),
        onImport: (f) => void this.importProfile(f),
        onParents: () => this.setOverlay(adultCheck(() => void this.showParents(), () => void this.showProfiles())),
        onParty: profiles.length >= 2 ? () => this.showPartySetup(profiles) : undefined,
      }, message),
    );
  }

  /** Ask for the profile's PIN, if it has one, then continue. */
  private unlock(p: Profile, then: () => void, error?: string): void {
    if (!p.pinHash) return then();
    this.setOverlay(
      pinPad({
        title: `${p.name || 'Player'}: enter your PIN`,
        error,
        onDone: (pin) => (checkPin(p, pin) ? then() : this.unlock(p, then, 'Not quite — try again.')),
        onCancel: () => void this.showProfiles(),
      }),
    );
  }

  private randomScale() {
    return scales[Math.floor(Math.random() * scales.length)]; // cosmetic: a different theme every load
  }

  private showNewPlayer(canGoBack: boolean): void {
    this.leaveLevel();
    this.setOverlay(
      startScreen(this.randomScale(), undefined, async (c) => {
        this.audio.unlock();
        const p = newProfile(c.name, c.scale, c.tier, freshSeed(), c.language);
        await this.play(p);
      }, undefined, { onBack: canGoBack ? () => void this.showProfiles() : undefined, onImport: (f) => void this.importProfile(f) }),
    );
  }

  /** A profile's home: continue, new run, word book, export, PIN, switch player, delete. */
  private showStart(stored: Profile): void {
    this.leaveLevel();
    const showBook = () =>
      this.setOverlay(
        wordBookScreen(stored.wordBook ?? {}, illustrations.map((i) => ({ word: i.words.en?.[0] ?? i.id, svg: i.svg })), language('en').wordEmoji ?? {}, () => this.showStart(stored)),
      );
    this.setOverlay(
      startScreen(this.randomScale(), stored, async (c) => {
        this.audio.unlock();
        let p: Profile = { ...stored, settings: { ...DEFAULT_SETTINGS, ...stored.settings } };
        // The name and the speed goal chosen here are saved (the goal applies from the next level started).
        p.name = c.name;
        if (c.action === 'continue') p.tier = c.tier;
        if (c.action === 'new') p = startNewRun(p, freshSeed(), c.tier, c.language);
        await this.play(p);
      }, showBook, {
        onArtifact: stored.campaign.level > campaignFor(stored.campaign.seed, stored.campaign.language).levels.length ? () => void this.showArtifact(stored) : undefined,
        onAvatar: () => this.showAvatar(stored),
        onStats: () => void this.showStats(stored),
        onSettings: () => this.showSettings(stored),
        onParents: () => this.setOverlay(adultCheck(() => void this.showParents(stored), () => this.showStart(stored))),
        onExport: () => void this.exportProfile(stored),
        onPin: () => this.changePin(stored),
        onSwitch: () => void this.showProfiles(),
        onDelete: () => void this.removeProfile(stored),
      }),
    );
  }

  private showSettings(p: Profile): void {
    this.setOverlay(
      settingsScreen(p.settings, (s) => {
        p.settings = s;
        this.applySettings(s, p);
        void saveProfile(p);
      }, () => this.showStart(p), this.voiceRows(p)),
    );
  }

  /** Parent area: limits for `current` (if any) and management of every player on this device. */
  private async showParents(current?: Profile): Promise<void> {
    const players = await listProfiles();
    const back = () => (current ? this.showStart(current) : void this.showProfiles());
    this.setOverlay(
      parentScreen(current, players, {
        onSettings: (s) => {
          if (!current) return;
          current.settings = s;
          void saveProfile(current);
        },
        onRemovePin: (p) => {
          p.pinHash = undefined;
          void saveProfile(p).then(() => this.showParents(current));
        },
        onDelete: (p) => {
          if (!confirm(`Delete ${p.name || 'this player'} and their progress on this device?`)) return;
          void deleteProfile(p).then(async () => {
            // Deleted the current player, or nobody is left: back to the start (new-player form if empty).
            if ((current && p.profileId === current.profileId) || !(await listProfiles()).length) return this.showProfiles();
            await this.showParents(current);
          });
        },
        onClose: back,
      }),
    );
  }

  private async showStats(p: Profile): Promise<void> {
    const stats = computeStats(p, await allSegments());
    const scale = scales.find((s) => s.id === p.avatar.scale) ?? scales[0];
    this.setOverlay(statsScreen(p.name, language(p.campaign.language), stats, (t) => scale.steps[t - 1]?.name.en ?? `tier ${t}`, () => this.showStart(p)));
  }

  private showAvatar(p: Profile): void {
    const screen = avatarScreen({
      scales, scaleId: p.avatar.scale, tier: p.tier, custom: p.avatar.customization, stars: totalStars(p),
      onSave: (scaleId, custom) => {
        p.avatar = { scale: scaleId, customization: custom };
        void saveProfile(p).then(() => {
          toast(this.ui, '🎨 Avatar saved');
          this.showStart(p);
        });
      },
      onClose: () => this.showStart(p),
    });
    this.setOverlay(screen.el);
  }

  private async play(p: Profile): Promise<void> {
    this.party = null;
    p.lastPlayed = Date.now();
    // The session limit counts per player: it restarts only when a different player starts playing.
    if (this.sessionProfileId !== p.profileId) {
      this.sessionProfileId = p.profileId;
      this.sessionMs = 0;
      this.sessionExtraMin = 0;
    }
    this.profile = p;
    this.applySettings(p.settings, p);
    await saveProfile(p);
    this.camp = campaignFor(p.campaign.seed, p.campaign.language);
    // Keys, voice and word pictures follow the campaign's language (docs/04 Language packs).
    const lang = language(this.camp.language);
    this.input.setLanguage(lang);
    this.voice.setLanguage(lang.tts?.lang ?? 'en-US', lang.tts?.preferredVoices);
    if (p.name) this.voice.speak(tr(lang, 'sayHi', "Hi {name}! Let's type.", { name: p.name }));
    await this.startLevel(p.campaign.level, false);
  }

  /** Set a PIN (chosen twice), or remove the current one. */
  private changePin(p: Profile): void {
    if (p.pinHash) {
      if (!confirm(`Remove the PIN from ${p.name || 'this player'}?`)) return;
      p.pinHash = undefined;
      void saveProfile(p).then(() => this.showStart(p));
      return;
    }
    const ask = (error?: string) =>
      this.setOverlay(
        pinPad({
          title: 'Choose a PIN (4 shapes)',
          error,
          onCancel: () => this.showStart(p),
          onDone: (first) =>
            this.setOverlay(
              pinPad({
                title: 'Once more, the same PIN',
                onCancel: () => this.showStart(p),
                onDone: (second) => {
                  if (second !== first) return ask('Those were different. Choose again.');
                  p.pinHash = pinHash(p.profileId, first);
                  void saveProfile(p).then(() => {
                    toast(this.ui, '🔒 PIN set');
                    this.showStart(p);
                  });
                },
              }),
            ),
        }),
      );
    ask();
  }

  private async exportProfile(p: Profile): Promise<void> {
    const seeds = profileSeeds(p);
    const segments = (await allSegments()).filter((s) => seeds.includes(s.campaignSeed) || s.profileId === p.profileId); // + hot-seat party levels
    const blob = new Blob([JSON.stringify(buildExport(p, segments, BUILD, Date.now()))], { type: 'application/json' });
    const safe = (p.name || 'player').replace(/[^\p{L}\p{N}_-]+/gu, '_');
    const a = h('a', { href: URL.createObjectURL(blob), download: `${safe}.tbtge-profile.json` });
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  private async importProfile(file: File): Promise<void> {
    let data;
    try {
      data = parseImport(await file.text());
    } catch (e) {
      return this.showProfiles(`⚠️ ${(e as Error).message}`);
    }
    const existing = await loadProfileById(data.profile.profileId);
    if (existing && !confirm(`${existing.name || 'This player'} already exists on this device. Replace with the imported copy?`)) return this.showProfiles();
    for (const seg of data.segments) await saveSegment(seg);
    await saveProfile(data.profile);
    await this.showProfiles(`✅ Imported ${data.profile.name || 'player'} (${data.segments.length} saved levels).`);
  }

  private async removeProfile(p: Profile): Promise<void> {
    if (!confirm(`Delete ${p.name || 'this player'}? Their progress on this device is removed. (Export first to keep a copy.)`)) return;
    await deleteProfile(p);
    await this.showProfiles();
  }

  /** Collected voice effects for the Settings rows; picking one previews it in that voice. */
  private voiceRows(p: Profile): VoiceEffectRows {
    const lang = language(p.campaign.language);
    const code = lang.id.replace(/^lang\./, '');
    return {
      effects: unlockedVoiceEffects(p.collected ?? [], code),
      available: this.voice.available(),
      onPreview: (id) => {
        const e = activeVoiceEffect(id, p.collected ?? [], code);
        this.voice.pitch = e.pitch;
        this.voice.rate = e.rate;
        this.voice.speak(tr(lang, 'sayVoice', 'Hello! This is my {name} voice.', { name: e.name }));
      },
    };
  }

  /**
   * Debug mode: F and J held down together for 300 ms skip the level. Fast typing often overlaps keys for a
   * moment (rollover), so only a deliberate hold counts; both keys are still typed as usual.
   */
  private debugChord(code: string): void {
    if (!this.debugSkipAllowed() || (code !== 'KeyF' && code !== 'KeyJ') || !this.input.held.has(code === 'KeyF' ? 'KeyJ' : 'KeyF')) return;
    // Still holding both after 300 ms: skip without waiting for the release (the release check covers a busy page).
    const sim = this.sim;
    setTimeout(() => {
      const held = this.input.held;
      if (this.sim === sim && this.debugSkipAllowed() && held.has('KeyF') && held.has('KeyJ') && performance.now() - Math.max(held.get('KeyF')!, held.get('KeyJ')!) >= 300) this.debugSkip();
    }, 320);
  }

  private debugSkipAllowed(): boolean {
    return !!this.profile?.settings.debug && !this.party && !this.drill && this.screen === 'level' && this.sim?.state.phase === 'play' && !this.paused && !this.offer && !this.host.transitioning;
  }

  /**
   * Debug skip: the crossroads screen at once. J moves on to the next level without stars or stats, and the
   * skipped level isn't kept as a run segment (replays and proofs stay honest); F keeps playing this level.
   */
  private debugSkip(): void {
    const index = this.plan.index;
    const key = this.seg.key;
    this.paused = true;
    const el = crossroadsScreen(this.sim!.state.bestStars, language(this.camp.language));
    el.classList.add('debug-skip');
    el.querySelector('.card')?.prepend(h('p', { class: 'msg' }, '🛠 Debug skip — J: next level (no stars, this level is not saved) · F: keep playing'));
    this.offer = {
      yes: () => {
        this.offer = null;
        this.paused = false;
        this.setOverlay(null);
      },
      no: () => {
        this.offer = null;
        void (async () => {
          this.sim = null; // nothing saves this level any more
          this.paused = false;
          await deleteSegment(key);
          this.profile.campaign.level = index + 1;
          await saveProfile(this.profile);
          await this.startLevel(index + 1, true);
        })();
      },
    };
    this.setOverlay(el);
  }

  /** The progress bar's avatar icon and, in debug mode, the level label (number · game · palette). */
  private hudExtras(templateId = this.plan.templateId): void {
    if (!this.hud) return;
    this.hud.setAvatar(iconOf(this.profile, scales));
    const label = this.drill ? `drill ${this.drill.key.toUpperCase()}` : `L${this.plan.index}`;
    this.hud.setDebugLabel(this.profile.settings.debug ? `${label} · ${templateId.replace(/^template\./, '')} · ${this.plan.paletteId.replace(/^palette\./, '')}` : null);
  }

  private applySettings(s: Settings, p: Profile | undefined = this.profile): void {
    this.host.reducedMotion = s.reducedMotion;
    this.audio.setVolumes(s.musicVolume, s.sfxVolume);
    this.voice.enabled = s.voice;
    document.body.classList.toggle('reduced-motion', s.reducedMotion);
    const font = fontOf(s);
    document.body.classList.toggle('font-dyslexic', font === 'dyslexic');
    document.body.classList.toggle('font-system', font === 'system');
    this.voice.volume = s.voiceVolume ?? 1;
    const fx = activeVoiceEffect(s.voiceEffect, p?.collected ?? [], p ? language(p.campaign.language).id.replace(/^lang\./, '') : 'en');
    this.voice.pitch = fx.pitch;
    this.voice.rate = fx.rate;
    document.body.classList.toggle('high-contrast', s.highContrast);
    document.body.classList.toggle('cb-patterns', s.colorBlindPatterns);
    document.documentElement.style.setProperty('--text-scale', String(s.textScale));
    this.host.quality.setOverride(s.quality === 'auto' ? null : s.quality);
  }

  // ------------------------------------------------------------------ levels
  private avatar(): AvatarRig {
    const sc = scales.find((s) => s.id === this.profile.avatar.scale) ?? scales[0];
    // Locked values (e.g. from an edited export) fall back to defaults.
    return new AvatarRig(sc, this.profile.tier, clampToUnlocked(sc, normalizeCustomization(this.profile.avatar.customization), totalStars(this.profile)));
  }

  async startLevel(index: number, transition: boolean): Promise<void> {
    if (index > this.camp.levels.length) return this.victory();
    this.screen = 'level';
    this.drill = null;
    this.offer = null;
    const key = segmentKey(this.camp.seed, index);
    const existing = await loadSegment(key);
    const resume = existing && !existing.complete ? existing : null;
    // A level keeps the plan it started with (template, letters, look), even if newer content changes the
    // campaign's seeded choice for that level.
    this.plan = resume?.plan ?? this.camp.levels[index - 1];
    this.seg = resume ?? {
      key, build: BUILD, campaignSeed: this.camp.seed, language: this.camp.language, level: index,
      tier: this.profile.tier, targetStars: 1, collected: [...this.profile.collected], weakKeys: weakKeys(this.profile.perKey),
      log: [], snapshots: [], complete: false, stars: 0, startedAt: Date.now(), plan: this.plan,
    };
    const setup = planSetup(this.camp.seed, this.camp.language, this.plan, { tier: this.seg.tier, targetStars: this.seg.targetStars, collected: this.seg.collected, weakKeys: this.seg.weakKeys });
    const sim = new LevelSim(setup, templateSim(setup.templateId));
    for (const e of this.seg.log) sim.feed(e); // exact resume (deterministic replay of the saved log)
    sim.on((e) => this.onSimEvent(e));
    this.sim = sim;
    this.lastCollect = -2;
    const lastT = this.seg.log.length ? this.seg.log[this.seg.log.length - 1].t : 0;
    this.segStart = performance.now() - lastT - 1;
    this.paused = false;
    // A level saved while paused (pause menu → main menu, reload, hidden tab) continues here, so log
    // the matching resume; otherwise every later key would be recorded as typed while paused.
    if (sim.state.pauseAt >= 0) {
      const e: LogEvent = { k: 'resume', t: lastT };
      this.seg.log.push(e);
      sim.feed(e);
    }
    // Save the level as soon as it starts, so the run (and the verify page) always includes it,
    // instead of relying on a later keypress or a save during page unload (WebKit skips the latter).
    await this.persist();
    this.stuckShown = false;
    this.hintSpoken = -1;
    const lang = language(this.camp.language);
    if (!this.hud) {
      this.hud = new Hud(lang, this.profile.settings);
      this.ui.prepend(this.hud.el);
    }
    this.hud.keyboard.setKnown(this.plan.letters); // in play only the next key is highlighted
    this.hudExtras();
    const palette = palettes.find((p) => p.id === this.plan.paletteId) ?? palettes[0];
    const look = { templateId: this.plan.templateId, view: this.plan.view, styleId: this.plan.styleId, palette, havocIds: this.plan.havocIds, havocMaxP: this.plan.havocMaxP };
    this.host.setLevel(look, this.avatar(), sim, performance.now(), transition);
    this.wordArt.clear();
    this.wordArt.setLanguage(lang);
    this.wordArt.setPalette(palette);
    if (transition) this.audio.whoosh();
    const showIntro = (this.showIntro = () => {
      if (this.sim !== sim) return;
      if (sim.state.phase === 'intro') {
        // A fresh level may first offer a fix-it drill for a weak key learned in earlier levels.
        const drillKey = this.seg.log.some((e) => e.k === 'key') ? null : this.drillCandidate(false);
        if (drillKey) return this.offerDrill(drillKey, showIntro);
        const rules = templateViews[this.plan.templateId]?.rules ?? [];
        const scale = scales.find((s) => s.id === this.profile.avatar.scale) ?? scales[0];
        const tierName = scale.steps[this.seg.tier - 1]?.name.en ?? `tier ${this.seg.tier}`;
        this.setOverlay(introScreen(lang, this.plan, rules, tierName));
        const nk = this.plan.newKeys.filter((k) => k !== ' ');
        const [hf, hj] = homeKeys(lang);
        const what = this.plan.keyGroup?.keys.includes('Shift')
          ? tr(lang, 'sayShift', 'Capitals: hold Shift with the little finger of the other hand')
          : nk.map((k) => tr(lang, 'sayKey', '{key}, with your {finger}', { key: keyName(lang, k), finger: fingerName(lang, lang.layout[lang.codeOf[k]]?.finger ?? 'li') })).join('. ');
        const intro = this.plan.keyGroup
          ? tr(lang, 'sayGroup', 'Level {n}: {group}. {keys}.', { n: index, group: this.plan.keyGroup.name, keys: what })
          : tr(lang, 'sayIntro', 'Level {n}. New key: {keys}.', { n: index, keys: what });
        // Template rules are English text for now; they are only read out in English.
        const ruleText = lang.id === 'lang.en' ? rules.map((r) => r.text).join(' ') : '';
        this.voice.speak(`${intro} ${ruleText} ${tr(lang, 'sayPress', `Put your fingers on ${hf} and ${hj}, then press them together.`)}`);
      } else if (sim.state.phase === 'crossroads') this.setOverlay(crossroadsScreen(sim.state.bestStars, lang));
      else this.setOverlay(null);
    });
    if (transition) this.afterTransition(showIntro);
    else showIntro();
  }

  // ------------------------------------------------------------------ hot seat (docs/06)
  private showPartySetup(profiles: Profile[]): void {
    this.setOverlay(partySetupScreen(profiles, scales, (r) => this.unlockAll(r.players, () => void this.startParty(r)), () => void this.showProfiles()));
  }

  /** PINs are asked once, at party start (not at every swap). */
  private unlockAll(players: Profile[], then: () => void): void {
    const next = (i: number): void => (i >= players.length ? then() : this.unlock(players[i], () => next(i + 1)));
    next(0);
  }

  async startParty(r: PartySetupResult): Promise<void> {
    const party: Party = {
      schemaVersion: 1, partyId: freshSeed(), mode: r.mode, seed: freshSeed(), language: r.players[0].campaign.language,
      players: r.players.map((p) => p.profileId), round: 1, swap: r.swap, createdAt: Date.now(),
    };
    for (const p of r.players) {
      p.lastPlayed = Date.now();
      await saveProfile(p);
    }
    this.party = { party, profiles: r.players, slots: [], turn: 0 };
    this.sessionProfileId = `party:${party.partyId}`;
    this.sessionMs = 0;
    this.sessionExtraMin = 0;
    await this.startPartyRound(false);
  }

  /** One level per player: their own segment and sim (their own input stream), then the first turn. */
  private async startPartyRound(transition: boolean): Promise<void> {
    const run = this.party!;
    const { party, profiles } = run;
    const camps = profiles.map((p) => campaignFor(p.campaign.seed, p.campaign.language));
    const partyCamp = campaignFor(party.seed, party.language);
    const plans = roundPlans(party, profiles, camps, partyCamp);
    run.slots = [];
    for (const pp of plans) {
      const p = profiles[pp.player];
      const lang = party.mode === 'companions' ? p.campaign.language : party.language;
      // Companions continue their own campaign level, resuming it if it was started earlier.
      const existing = pp.advancesCampaign ? await loadSegment(pp.segKey) : undefined;
      const resume = existing && !existing.complete ? existing : null;
      const plan = resume?.plan ?? pp.plan;
      const tags = { partyId: party.partyId, profileId: p.profileId, player: pp.player };
      const seg: Segment = resume
        ? { ...resume, ...tags }
        : {
            key: pp.segKey, build: BUILD, campaignSeed: pp.campaignSeed, language: lang, level: plan.index, tier: p.tier, targetStars: 1,
            collected: [...p.collected], weakKeys: weakKeys(p.perKey), log: [], snapshots: [], complete: false, stars: 0, startedAt: Date.now(), plan, ...tags,
          };
      const setup = planSetup(seg.campaignSeed, lang, plan, { tier: seg.tier, targetStars: seg.targetStars, collected: seg.collected, weakKeys: seg.weakKeys });
      const sim = new LevelSim(setup, templateSim(setup.templateId));
      for (const e of seg.log) sim.feed(e);
      if (sim.state.pauseAt >= 0) {
        const e: LogEvent = { k: 'resume', t: seg.log[seg.log.length - 1].t };
        seg.log.push(e);
        sim.feed(e);
      }
      sim.on((e) => this.onSimEvent(e));
      seg.snapshots = sim.snapshots.map((x) => x.hash);
      await saveSegment(seg);
      run.slots.push({ profile: p, camp: pp.advancesCampaign ? camps[pp.player] : partyCamp, lang, plan, pp, seg, sim, done: sim.state.phase === 'done' });
    }
    const first = run.slots.findIndex((x) => !x.done);
    if (first < 0) return this.showPartyResults();
    this.beginTurn(first, transition);
  }

  /** Make slot `i` the active player: their profile, keys, voice, world and avatar. */
  private beginTurn(i: number, transition: boolean): void {
    const run = this.party!;
    run.turn = i;
    const slot = run.slots[i];
    Object.assign(this, { profile: slot.profile, camp: slot.camp, plan: slot.plan, seg: slot.seg, sim: slot.sim });
    this.screen = 'level';
    this.drill = null;
    this.offer = null;
    this.swapPending = false;
    this.applySettings(slot.profile.settings, slot.profile);
    const lang = language(slot.lang);
    this.input.setLanguage(lang);
    this.voice.setLanguage(lang.tts?.lang ?? 'en-US', lang.tts?.preferredVoices);
    this.hud?.el.remove();
    this.hud = new Hud(lang, slot.profile.settings);
    this.ui.prepend(this.hud.el);
    this.hud.keyboard.setKnown(slot.plan.letters);
    this.hudExtras();
    const palette = palettes.find((p) => p.id === slot.plan.paletteId) ?? palettes[0];
    const look = { templateId: slot.plan.templateId, view: slot.plan.view, styleId: slot.plan.styleId, palette, havocIds: slot.plan.havocIds, havocMaxP: slot.plan.havocMaxP };
    this.host.setLevel(look, this.avatar(), slot.sim, performance.now(), transition);
    this.wordArt.clear();
    this.wordArt.setLanguage(lang);
    this.wordArt.setPalette(palette);
    this.stuckShown = false;
    this.hintSpoken = -1;
    this.lastCollect = -2;
    slot.segStart ??= performance.now() - (slot.seg.log.length ? slot.seg.log[slot.seg.log.length - 1].t : 0) - 1;
    this.segStart = slot.segStart;
    const name = slot.profile.name || `Player ${i + 1}`;
    const icon = iconOf(slot.profile, scales);
    const [hf, hj] = homeKeys(lang);
    if (slot.sim.state.phase === 'intro') {
      // A player's first turn in the round: the level intro (F + J starts their level).
      this.paused = false;
      this.pauseReason = null;
      this.setOverlay(null);
      const show = () => {
        if (this.sim !== slot.sim || slot.sim.state.phase !== 'intro') return;
        const rules = templateViews[slot.plan.templateId]?.rules ?? [];
        const scale = scales.find((s) => s.id === slot.profile.avatar.scale) ?? scales[0];
        const tierName = scale.steps[slot.seg.tier - 1]?.name.en ?? `tier ${slot.seg.tier}`;
        this.setOverlay(introScreen(lang, slot.plan, rules, tierName, `${icon} ${name}'s turn · round ${run.party.round}`));
        this.voice.speak(`${name}'s turn. ${tr(lang, 'sayPress', `Put your fingers on ${hf} and ${hj}, then press them together.`)}`);
      };
      if (transition) this.afterTransition(show);
      else show();
    } else {
      // Later turns: the world stays frozen until this player presses F and J together.
      this.paused = true;
      this.pauseReason = 'handover';
      this.handover = { f: -1e9, j: -1e9 };
      this.setOverlay(handoverScreen(slot.profile, icon, lang, slot.plan.letters, slot.plan.newKeys, run.party.round));
      this.voice.speak(`${name}'s turn. ${tr(lang, 'sayPress', `Put your fingers on ${hf} and ${hj}, then press them together.`)}`);
    }
  }

  /** Handover: F and J pressed within half a second of each other continue the game. */
  private handoverKey(code: string): void {
    const h = this.handover!;
    const now = performance.now();
    if (code === 'KeyF') h.f = now;
    else if (code === 'KeyJ') h.j = now;
    else return;
    if (Math.abs(h.f - h.j) > 500) return;
    this.handover = null;
    this.paused = false;
    this.pauseReason = null;
    if (this.sim!.state.pauseAt >= 0) this.record({ k: 'resume', t: this.logT() });
    else this.segStart = performance.now() - this.lastLoggedT() - 1;
    this.party!.slots[this.party!.turn].segStart = this.segStart;
    this.setOverlay(null);
    this.voice.speak(tr(language(this.camp.language), 'sayGo', 'Go!'));
  }

  /** A stage ended: the turn passes on shortly (unless this was the last stage: the crossroads moves on). */
  private queueSwap(sim: LevelSim): void {
    this.swapPending = true;
    setTimeout(() => {
      if (this.party && this.sim === sim && sim.state.phase === 'play' && this.swapPending) this.endTurn();
      else this.swapPending = false;
    }, 900);
  }

  /** The active player's turn ends: freeze their level (a pause in their own stream) and hand over. */
  private endTurn(): void {
    const run = this.party!;
    this.swapPending = false;
    const done = run.slots.map((x) => x.done);
    const next = nextTurn(run.turn, done);
    if (next < 0) return void this.showPartyResults();
    if (next === run.turn) return; // everyone else has finished: keep typing
    const slot = run.slots[run.turn];
    if (!slot.done && this.sim && !this.paused) this.record({ k: 'pause', t: this.logT() });
    void this.persist();
    this.beginTurn(next, false);
  }

  /** The active player finished their level: credit their own profile, then the next turn. */
  private async partySlotDone(): Promise<void> {
    const run = this.party!;
    const slot = run.slots[run.turn];
    const s = slot.sim.state;
    slot.seg.complete = true;
    slot.seg.stars = s.bestStars;
    await this.persist();
    const own = slot.pp.advancesCampaign;
    const promoted = creditLevel(slot.profile, {
      level: slot.plan.index, starsKey: own ? String(slot.plan.index) : partyStarsKey(run.party.partyId, run.party.round), tier: slot.seg.tier,
      letters: slot.plan.letters.length, lastStage: slot.sim.setup.stageLengths.length - 1, state: s, advanceTo: own ? slot.plan.index + 1 : undefined,
    });
    if (promoted) {
      const scale = scales.find((x) => x.id === slot.profile.avatar.scale) ?? scales[0];
      slot.grewTo = scale.steps[promoted.to - 1]?.name.en;
      this.celebratePromotion(slot.profile, promoted.to);
    }
    await saveProfile(slot.profile);
    slot.done = true;
    this.endTurn();
  }

  /** Everyone finished the round: the shared result screen. */
  private showPartyResults(): void {
    const run = this.party!;
    this.screen = 'start';
    this.sim = null;
    this.paused = false;
    this.pauseReason = null;
    this.handover = null;
    this.hud?.el.remove();
    this.hud = null;
    const rows: PartyResultRow[] = run.slots.map((slot) => {
      const last = slot.sim.setup.stageLengths.length - 1;
      const best = slot.sim.state.results.filter((r) => r.stage === last).sort((a, b) => b.stars - a.stars || b.wpmP - a.wpmP)[0];
      return { profile: slot.profile, icon: iconOf(slot.profile, scales), stars: slot.sim.state.bestStars, wpmP: best?.wpmP ?? 0, accP: best?.accP ?? 0, complete: slot.done, grewTo: slot.grewTo };
    });
    this.audio.fanfare();
    this.voice.speak(`Round ${run.party.round} done! Well played, everyone!`);
    this.setOverlay(
      partyResultsScreen(run.party, rows, () => {
        run.party.round++;
        void this.startPartyRound(true);
      }, () => void this.endParty(), run.party.mode === 'companions' ? undefined : () => {
        // One picture for the party: its fingerprint covers every player's stream so far.
        const letters = [...new Set(run.slots.flatMap((x) => x.plan.letters))];
        void this.showArtifact(run.profiles[0], { seed: run.party.seed, language: run.party.language, mode: run.party.mode, letters, round: run.party.round, back: () => this.showPartyResults() });
      }),
    );
  }

  private async endParty(): Promise<void> {
    if (this.sim && this.seg) await this.persist();
    this.party = null;
    this.handover = null;
    this.swapPending = false;
    this.paused = false;
    this.pauseReason = null;
    await this.showProfiles();
  }

  // ------------------------------------------------------------------ fix-it drill
  /** The weakest key worth a drill now, or null (at most one offer per level; docs/01 Weakness detection). */
  private drillCandidate(includeNewKeys: boolean): string | null {
    if (this.party || this.drill || !this.profile || this.profile.drillOfferedAt === this.plan.index) return null;
    const letters = includeNewKeys ? this.plan.letters : this.plan.letters.filter((c) => !this.plan.newKeys.includes(c));
    return weakestKey(this.profile.perKey, weakKeys(this.profile.perKey), letters);
  }

  /** Offer a one-minute drill for `key` (public for e2e tests). A level in play is paused meanwhile. */
  offerDrill(key: string, onDecline: () => void = () => this.showIntro()): void {
    if (!this.sim || this.drill || this.screen !== 'level') return;
    this.profile.drillOfferedAt = this.plan.index;
    void saveProfile(this.profile);
    const wasPlaying = this.sim.state.phase === 'play' && !this.paused;
    if (wasPlaying) {
      this.paused = true;
      this.record({ k: 'pause', t: this.logT() });
      void this.persist();
    }
    const K = key.toUpperCase();
    this.voice.speak(`${K} is tricky. Train it for one minute? Press F for yes, or J for not now.`);
    const yes = () => void this.startDrill(key);
    const no = () => {
      this.offer = null;
      this.setOverlay(null);
      if (wasPlaying && this.sim) {
        this.paused = false;
        this.record({ k: 'resume', t: this.logT() });
      }
      onDecline();
    };
    this.offer = { yes, no };
    this.setOverlay(drillOfferScreen(key, yes, no));
  }

  private async startDrill(key: string): Promise<void> {
    this.offer = null;
    await this.persist(); // the level (at its intro, or paused) continues after the drill
    const level = this.plan.index;
    const lang = language(this.camp.language);
    const known = this.plan.letters.filter((c) => !this.plan.newKeys.includes(c));
    const setup = drillSetup(this.camp.seed, level, known.length >= 2 ? known : this.plan.letters, key, this.profile.tier, this.profile.collected);
    this.drill = { key, level };
    this.seg = {
      key: `drill:${level}`, build: BUILD, campaignSeed: this.camp.seed, language: this.camp.language, level, tier: setup.tier,
      targetStars: 0, collected: setup.collected, weakKeys: [key], log: [], snapshots: [], complete: false, stars: 0, startedAt: Date.now(),
    };
    const sim = new LevelSim(setup, templateSim(setup.templateId));
    sim.on((e) => this.onSimEvent(e));
    this.sim = sim;
    this.segStart = performance.now();
    this.paused = false;
    this.pauseReason = null;
    this.stuckShown = true; // practice: no stuck nag inside a drill
    this.hintSpoken = -1;
    this.hud?.keyboard.setKnown(setup.letters);
    this.hudExtras(setup.templateId);
    const tpl = templates.find((t) => t.id === setup.templateId)!;
    const palette = palettes.find((p) => p.id === this.plan.paletteId) ?? palettes[0];
    this.host.setLevel({ templateId: setup.templateId, view: tpl.views[0], styleId: this.plan.styleId, palette, havocIds: [], havocMaxP: 0 }, this.avatar(), sim, performance.now(), true);
    this.wordArt.clear();
    this.audio.whoosh();
    const K = key.toUpperCase();
    const rules = [
      { icon: '🛠️', text: `One minute of ${K}. Every ${K} you type makes it stronger.` },
      ...(templateViews[setup.templateId]?.rules ?? []).slice(0, 1),
      { icon: '🔙', text: `Then you go back to level ${level}.` },
    ];
    const show = (this.showIntro = () => {
      if (this.sim !== sim) return;
      if (sim.state.phase !== 'intro') return this.setOverlay(null);
      this.setOverlay(introScreen(lang, { ...this.plan, letters: setup.letters, newKeys: [key] }, rules, `${K} practice`, `Fix-it drill: ${K}`));
      this.voice.speak(`Fix-it drill. Type ${K} with your ${fingerName(lang, lang.layout[lang.codeOf[key]]?.finger ?? 'li')}. ${tr(lang, 'sayPress', 'Put your fingers on F and J, then press them together.')}`);
    });
    this.afterTransition(show);
  }

  private async endDrill(): Promise<void> {
    const d = this.drill;
    const sim = this.sim;
    if (!d || !sim) return;
    const p = this.profile;
    // Practice counts toward the per-key stats, so a key that got better stops being "weak".
    for (const [k, v] of Object.entries(sim.state.perKey)) {
      const acc = (p.perKey[k] ??= [0, 0, 0]);
      acc[0] += v[0];
      acc[1] += v[1];
      acc[2] += v[2];
    }
    await saveProfile(p);
    const [ok, slips] = sim.state.perKey[d.key] ?? [0, 0];
    const K = d.key.toUpperCase();
    this.audio.fanfare();
    toast(this.ui, `🛠️ ${K} practice done: ${ok} right${slips ? `, ${slips} slips` : ', no slips'}!`);
    this.voice.speak(`Great practice! Back to level ${d.level}.`, false);
    this.drill = null;
    await this.startLevel(d.level, true);
  }

  /**
   * Run `fn` once the level transition has finished. Keys are ignored while the host is transitioning, so
   * the intro ("press F and J") must not appear before that: it used to show at 80% of the transition,
   * and presses in the remaining time (longer on slow machines or with reduced motion) did nothing.
   */
  private afterTransition(fn: () => void): void {
    const check = () => (this.host.transitioning ? setTimeout(check, 50) : fn());
    setTimeout(check, TRANSITION_MS * 0.8);
  }

  private victory(): void {
    this.screen = 'victory';
    this.sim = null;
    this.hud?.el.remove();
    this.hud = null;
    this.audio.fanfare();
    this.voice.speak('You learned every letter! The artifact is waking up. Type each letter to scratch it free.');
    void this.showArtifact(this.profile);
  }

  // ------------------------------------------------------------------ artifact (docs/03, docs/05)
  /** The artifact screen while it is open: typed letters scratch glyphs free. */
  private artifactUi: { scratch: (char: string) => boolean; lang: string; dispose: () => void } | null = null;

  /** A campaign's artifact (its segments on this device); also the party picture (`party` given). */
  async showArtifact(p: Profile, party?: { seed: string; language: string; mode: string; letters: string[]; round: number; back: () => void }): Promise<void> {
    const seed = party?.seed ?? p.campaign.seed;
    const langId = party?.language ?? p.campaign.language;
    const segments = await segmentsFor(seed);
    const run: RunFile = { format: 'tbtge-run/1', build: BUILD, campaign: { language: langId, seed }, segments };
    const fingerprint = runFingerprint(run.campaign, segments);
    const learned = party?.letters ?? [...new Set(segments.filter((s) => s.complete).flatMap((s) => s.plan?.letters ?? []))];
    const letters = learned.filter((c) => /^\p{Ll}$/u.test(c));
    const back = party?.back ?? (() => this.showStart(p));
    const name = party ? undefined : p.name || undefined;
    const caption = party ? `A party of ${new Set(segments.map((s) => s.profileId)).size} · round ${party.round}` : `${p.name || 'A player'} · ${letters.length} letters`;
    const identity = (choice: IdentityChoice): Identity => {
      if (choice === 'plain' && name) return { mode: 'plain', name };
      if (choice === 'hashed' && name) {
        const salt = freshSeed();
        return { mode: 'hashed', salt, nameHash: nameHash(salt, name) };
      }
      return { mode: 'none' };
    };
    const fileBase = `typing-artifact-${seed.slice(0, 8)}`;
    const ui = artifactScreen({
      title: party ? '🔷 Your party picture' : '🔷 The artifact',
      subtitle: party ? 'One picture for the whole party: its fingerprint covers every player.' : 'Every letter you learned lives in this tesseract. Its colours and turns come from your run alone.',
      letters, fingerprint, reducedMotion: !!p.settings?.reducedMotion, name,
      onSavePng: async (choice) => {
        const proof = await buildProof(run, identity(choice), party?.mode ?? null);
        const png = addITXt(await artifactPng(fingerprint, letters, caption), PROOF_KEYWORD, JSON.stringify(proof));
        this.download(png, `${fileBase}.png`, 'image/png');
      },
      onSaveProof: async (choice) => {
        const proof = await buildProof(run, identity(choice), party?.mode ?? null);
        this.download(JSON.stringify(proof), `${fileBase}.proof`, 'application/json');
      },
      onClose: () => {
        this.artifactUi = null;
        back();
      },
    });
    this.setOverlay(ui.el);
    this.artifactUi = { scratch: ui.scratch, lang: langId, dispose: ui.dispose };
  }

  private download(data: Uint8Array | string, name: string, type: string): void {
    const blob = new Blob([data as BlobPart], { type });
    const a = h('a', { href: URL.createObjectURL(blob), download: name });
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  // ------------------------------------------------------------------ input
  private logT(): number {
    return Math.max(this.lastLoggedT() , Math.round(performance.now() - this.segStart));
  }

  private lastLoggedT(): number {
    const l = this.seg?.log;
    return l && l.length ? l[l.length - 1].t : 0;
  }

  private record(e: LogEvent): void {
    this.seg.log.push(e);
    this.sim!.feed(e);
  }

  private onKey(code: string, shift: boolean): void {
    this.audio.unlock();
    this.lastKeyAt = performance.now();
    if (this.offer) {
      if (code === 'KeyF') this.offer.yes();
      else if (code === 'KeyJ') this.offer.no();
      return;
    }
    if (this.artifactUi) {
      const ch = language(this.artifactUi.lang).layout[code]?.char;
      if (ch) this.artifactUi.scratch(ch);
      return;
    }
    if (this.handover) return this.handoverKey(code);
    if (this.swapPending) return; // the turn passes on in a moment
    if (this.drill && this.sim?.state.phase !== 'play' && this.sim?.state.phase !== 'intro') return; // drill is ending
    if (this.screen !== 'level' || !this.sim || this.paused || this.host.transitioning) return;
    this.debugChord(code);
    const e: LogEvent = shift ? { k: 'key', t: this.logT(), code, shift: 1 } : { k: 'key', t: this.logT(), code };
    const before = this.sim.state.phase;
    this.record(e);
    const after = this.sim.state.phase;
    if (before === 'intro' && after === 'play') {
      this.setOverlay(null);
      this.voice.speak(tr(language(this.camp.language), 'sayGo', 'Go!'));
    }
    if (performance.now() - this.lastSave > 3000) void this.persist();
  }

  private togglePause(): void {
    if (this.screen !== 'level' || !this.sim || this.offer) return;
    if (this.pauseReason === 'session') return; // the session-over screen can't be skipped with Escape
    if (this.pauseReason === 'handover' || this.swapPending) return;
    if (this.pauseReason === 'break') this.breakUi?.tryFinish(); // Escape can't skip the stretch break
    else if (this.paused) this.resume();
    else this.pause('menu');
  }

  private pause(reason: 'menu' | 'hidden' | 'break' | 'session'): void {
    if (!this.sim || this.paused) return;
    this.paused = true;
    this.pauseReason = reason;
    this.record({ k: 'pause', t: this.logT() });
    void this.persist();
    if (reason === 'session') return this.showSessionOver();
    if (reason === 'break') {
      const lang = language(this.camp.language);
      const s = this.profile.settings;
      this.breakUi = new StretchBreak({
        seconds: s.breakSeconds ?? 120,
        lang,
        avatar: this.avatar(),
        voice: s.voice ? this.voice : undefined,
        reducedMotion: s.reducedMotion,
        onDone: () => {
          this.breakUi = null;
          this.resume();
        },
      });
      this.setOverlay(this.breakUi.el);
    }
    else
      this.setOverlay(
        pauseScreen(
          this.profile.settings,
          (s) => {
            this.profile.settings = s;
            this.applySettings(s);
            void saveProfile(this.profile);
          },
          () => this.resume(),
          () => {
            void this.persist();
            if (this.party) void this.endParty();
            else this.showStart(this.profile);
          },
          () => void this.exportRun(),
          this.voiceRows(this.profile),
          {
            name: this.profile.name,
            tier: this.profile.tier,
            scale: scales.find((s) => s.id === this.profile.avatar.scale) ?? scales[0],
            onChange: (name, tier) => {
              // Saved at once; the level in progress keeps its tier (seg.tier), the next level uses the new one.
              this.profile.name = name;
              this.profile.tier = tier;
              void saveProfile(this.profile);
            },
          },
        ),
      );
  }

  /** Session limit reached: only a grown-up (adult check) can add 15 minutes; otherwise back to the menu. */
  private showSessionOver(): void {
    this.setOverlay(
      sessionOverScreen(
        () => this.showStart(this.profile),
        () =>
          this.setOverlay(
            adultCheck(
              () => {
                this.sessionExtraMin += 15;
                this.resume();
              },
              () => this.showSessionOver(),
            ),
          ),
      ),
    );
  }

  /** Start a stretch break now (also used by e2e tests with a short duration). */
  breakNow(seconds?: number): void {
    if (seconds !== undefined) this.profile.settings.breakSeconds = seconds;
    this.playMs = 0;
    this.pause('break');
  }

  private resume(): void {
    if (!this.sim || !this.paused) return;
    this.paused = false;
    this.pauseReason = null;
    this.record({ k: 'resume', t: this.logT() });
    const ph = this.sim.state.phase;
    this.setOverlay(ph === 'crossroads' ? crossroadsScreen(this.sim.state.bestStars, language(this.camp.language)) : null);
    if (ph === 'intro') this.showIntro();
  }

  // ------------------------------------------------------------------ sim events
  private onSimEvent(e: SimEvent): void {
    const sim = this.sim!;
    const now = performance.now();
    const slow = sim.state.frame < sim.state.slowUntil;
    switch (e.type) {
      case 'correct': {
        this.hud?.flash(true);
        const r = sim.state.win.rhythm;
        this.audio.correct(e.char, sim.steadinessP(), r.length ? r[r.length - 1] : 400, slow);
        break;
      }
      case 'error':
        this.wordArt.noteError();
        this.hud?.flash(false);
        this.hud?.markError(e.frame);
        this.audio.error();
        break;
      case 'stage':
        this.audio.stage(e.result.stars);
        toast(this.ui, e.result.stars ? `Stage ${e.result.stage + 1}: ${'★'.repeat(e.result.stars)}` : `Stage ${e.result.stage + 1} done — keep going!`);
        if (this.party && swapsAfter(this.party.party, 'stage')) this.queueSwap(sim);
        break;
      case 'powerup': {
        this.audio.powerup();
        const names: Record<string, string> = { 'powerup.shield': '🛡️ Shield!', 'powerup.slow-mo': '🐢 Slow motion!', 'powerup.reveal': '🔦 Lights on!' };
        toast(this.ui, names[e.id] ?? e.id);
        break;
      }
      case 'ability': {
        const ab = abilities.find((a) => a.id === e.id);
        const fx = effectOfAbility(e.id);
        if (fx && e.quick) {
          // A new voice effect: icon + name on screen (works without a speech voice), then a taste of it.
          const lang = language(this.camp.language);
          const name = fx.name[lang.id.replace(/^lang\./, '')] ?? fx.name.en ?? fx.id;
          toast(this.ui, `${fx.icon} New voice: ${name}! Pick it in Settings.`);
          const [p0, r0] = [this.voice.pitch, this.voice.rate];
          [this.voice.pitch, this.voice.rate] = [fx.pitch, fx.rate];
          this.voice.speak(tr(lang, 'sayNewVoice', 'New voice: {name}!', { name }), false);
          [this.voice.pitch, this.voice.rate] = [p0, r0];
        } else {
          toast(this.ui, e.quick ? `✨ You found "${e.word}"!` : `"${e.word}" — type it faster next time to keep it!`);
          if (e.quick) this.voice.speak(e.word, false);
        }
        void ab;
        break;
      }
      case 'crossroads':
        if (this.drill) {
          void this.endDrill();
          break;
        }
        if (this.party) {
          // In a party a player who reached their target moves on (logged like pressing J at the crossroads).
          setTimeout(() => {
            if (this.sim === sim && sim.state.phase === 'crossroads') this.record({ k: 'key', t: this.logT(), code: 'KeyJ' });
          }, 300);
          break;
        }
        this.audio.fanfare();
        {
          const lang = language(this.camp.language);
          const [hf, hj] = homeKeys(lang);
          this.setOverlay(crossroadsScreen(sim.state.bestStars, lang));
          this.voice.speak(tr(lang, 'sayCross', `You did it! Press ${hf} to stay for more stars, or ${hj} to go to the next world.`));
        }
        break;
      case 'more':
        this.setOverlay(null);
        break;
      case 'done':
        this.setOverlay(null);
        void (this.party ? this.partySlotDone() : this.finishLevel());
        break;
      default:
        break;
    }
    void now;
  }

  private async finishLevel(): Promise<void> {
    const sim = this.sim!;
    const s = sim.state;
    this.seg.complete = true;
    this.seg.stars = s.bestStars;
    await this.persist();
    const p = this.profile;
    const promoted = creditLevel(p, {
      level: this.plan.index, starsKey: String(this.plan.index), tier: this.seg.tier, letters: this.plan.letters.length,
      lastStage: sim.setup.stageLengths.length - 1, state: s, advanceTo: this.plan.index + 1,
    });
    if (promoted) this.celebratePromotion(p, promoted.to);
    await saveProfile(p);
    await this.startLevel(this.plan.index + 1, true);
  }

  /** A word's picture was fully revealed: add it to the word book. */
  private onWordRevealed(word: string, golden: boolean): void {
    const p = this.profile;
    const book = (p.wordBook ??= {});
    const prev = book[word];
    book[word] = { golden: golden || !!prev?.golden, count: (prev?.count ?? 0) + 1, first: prev?.first ?? Date.now() };
    if (!prev) toast(this.ui, golden ? `✨ Golden new word: ${word}!` : `📖 New word for your book: ${word}`);
    else if (golden && !prev.golden) toast(this.ui, `✨ ${word} is golden now!`);
    if (!prev || (golden && !prev.golden)) void saveProfile(p);
  }

  private celebratePromotion(p: Profile, tier: number): void {
    const scale = scales.find((s) => s.id === p.avatar.scale) ?? scales[0];
    const name = scale.steps[tier - 1]?.name.en ?? '';
    toast(this.ui, `🎉 ${this.party ? `${p.name || 'Player'} grew` : 'You grew'} into a ${name}!`);
    this.voice.speak(`Amazing! ${this.party && p.name ? `${p.name} grew` : 'You grew'} into a ${name}!`, false);
  }

  async persist(): Promise<void> {
    if (!this.sim || !this.seg || this.drill) return; // drills are practice: never saved as a run segment
    this.lastSave = performance.now();
    this.seg.snapshots = this.sim.snapshots.map((s) => s.hash);
    await saveSegment(this.seg);
  }

  async exportRun(): Promise<void> {
    await this.persist();
    const segments = await segmentsFor(this.camp.seed);
    const blob = new Blob([JSON.stringify({ format: 'tbtge-run/1', build: BUILD, campaign: { language: this.camp.language, seed: this.camp.seed }, name: this.profile.name || undefined, segments }, null, 0)], { type: 'application/json' });
    const a = h('a', { href: URL.createObjectURL(blob), download: `typing-run-${this.camp.seed.slice(0, 8)}.proof.json` });
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  // ------------------------------------------------------------------ frame loop
  private loop(now: number): void {
    requestAnimationFrame((t) => this.loop(t));
    const dt = this.lastFrame ? now - this.lastFrame : 16;
    this.lastFrame = now;
    const sim = this.sim;
    if (sim && this.screen === 'level' && !this.paused) {
      const t = Math.round(now - this.segStart);
      if (sim.state.phase !== 'done' && t >= this.lastLoggedT()) sim.advanceTo(t);
      if (sim.state.phase === 'play') {
        this.playMs += dt;
        this.sessionMs += dt;
        const limitMin = this.profile.settings.sessionMinutes ?? 0;
        if (limitMin > 0 && this.sessionMs > (limitMin + this.sessionExtraMin) * 60_000) this.pause('session');
        else if (this.playMs > this.profile.settings.breakMinutes * 60_000) {
          this.playMs = 0;
          this.pause('break');
        }
        if (sim.idleHint() && this.hintSpoken !== sim.state.lastKeyFrame) {
          this.hintSpoken = sim.state.lastKeyFrame;
          const ch = sim.expectedChars()[0];
          const lang = language(this.camp.language);
          const code = ch !== undefined ? lang.codeOf[ch] : undefined;
          if (code) this.voice.speak(tr(lang, 'sayFind', 'Find the {key} with your {finger}.', { key: keyName(lang, ch), finger: fingerName(lang, lang.layout[code].finger) }));
        }
        if (!this.stuckShown && sim.stuck()) {
          this.stuckShown = true;
          this.showStuckNag();
        }
      }
    }
    this.audio.tick(!!sim && this.screen === 'level' && !this.paused && sim.state.phase === 'play', now - this.lastKeyAt);
    const alpha = sim && !this.paused ? (((now - this.segStart) * 3) / 50) % 1 : 0;
    this.host.render(this.screen === 'level' ? sim : null, alpha, now);
    if (sim && this.screen === 'level' && !this.paused) this.wordArt.update(sim, now);
    if (sim && this.hud && this.screen === 'level') {
      this.hud.update(sim);
      const q = this.host.quality;
      this.hud.setFps(this.profile.settings.showFps !== false ? `${q.fps.toFixed(0)} fps · ${q.frameMs.toFixed(1)} ms · ${q.pixelRatio.toFixed(2)}×${this.host.webgl ? '' : ' · no WebGL'}` : null);
      // Templates that collect things expose a `lastCollect` frame stamp in their state.
      const lc = (sim.state.tpl as { lastCollect?: number } | null)?.lastCollect ?? -1;
      if (lc !== this.lastCollect) {
        if (lc >= 0 && this.lastCollect !== -2) this.audio.collect();
        this.lastCollect = lc;
      }
    }
  }

  private showStuckNag(): void {
    // Stuck (docs/02 Getting stuck): first offer a fix-it drill for the weakest key, then the easier goal.
    const k = this.drillCandidate(true);
    if (k) return this.offerDrill(k, () => this.showTierNag());
    this.showTierNag();
  }

  private showTierNag(): void {
    const p = this.profile;
    this.nag?.remove();
    if (p.tier <= 1) {
      this.nag = nagScreen('Tricky one! Slow and steady wins — watch the glowing key and take your time.', 'OK', () => this.nag?.remove(), () => this.nag?.remove());
    } else {
      const scale = scales.find((s) => s.id === p.avatar.scale) ?? scales[0];
      const lower = scale.steps[p.tier - 2]?.name.en ?? '';
      this.nag = nagScreen(`This one is hard. Want an easier goal (${lower}) from the next level?`, 'Yes, easier', () => {
        p.tier -= 1;
        void saveProfile(p);
        toast(this.ui, `Next level uses the ${lower} goal.`);
        this.nag?.remove();
      }, () => this.nag?.remove());
    }
    this.ui.append(this.nag);
  }
}
