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
import { crossroadsScreen, drillOfferScreen, introScreen, nagScreen, pauseScreen, startScreen, wordBookScreen } from '@/ui/screens';
import { WordArt } from '@/ui/wordArt';
import { pinPad, profilePicker } from '@/ui/profiles';
import { buildExport, checkPin, parseImport, pinHash } from '@/storage/profileIO';
import { StretchBreak } from '@/ui/stretchBreak';
import { KeyboardInput } from '@/input/keyboard';
import { AudioEngine, Voice } from '@/audio/audio';
import {
  DEFAULT_SETTINGS, allSegments, deleteProfile, freshSeed, listProfiles, loadProfileById, loadSegment, migrateProfiles, newProfile, profileSeeds,
  saveProfile, saveSegment, segmentKey, segmentsFor, startNewRun, totalStars, weakKeys,
  type Profile, type Segment, type Settings,
} from '@/storage/profile';
import { levelTargetWpmP, tierAcc } from '@/typing/tiers';
import { BUILD } from './build-info';
import { fingerName, homeKeys, keyName, tr } from '@/content/i18n';

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
  private pauseReason: 'menu' | 'hidden' | 'break' | null = null;
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
        if (c.name) p.name = c.name;
        if (c.action === 'new') p = startNewRun(p, freshSeed(), c.tier, c.language);
        await this.play(p);
      }, showBook, {
        onAvatar: () => this.showAvatar(stored),
        onStats: () => void this.showStats(stored),
        onExport: () => void this.exportProfile(stored),
        onPin: () => this.changePin(stored),
        onSwitch: () => void this.showProfiles(),
        onDelete: () => void this.removeProfile(stored),
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
    p.lastPlayed = Date.now();
    this.profile = p;
    this.applySettings(p.settings);
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
    const segments = (await allSegments()).filter((s) => seeds.includes(s.campaignSeed));
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

  private applySettings(s: Settings): void {
    this.host.reducedMotion = s.reducedMotion;
    this.audio.setVolumes(s.musicVolume, s.sfxVolume);
    this.voice.enabled = s.voice;
    document.body.classList.toggle('reduced-motion', s.reducedMotion);
    document.body.classList.toggle('dyslexic', s.dyslexicFont);
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
    if (transition) setTimeout(showIntro, TRANSITION_MS * 0.8);
    else showIntro();
  }

  // ------------------------------------------------------------------ fix-it drill
  /** The weakest key worth a drill now, or null (at most one offer per level; docs/01 Weakness detection). */
  private drillCandidate(includeNewKeys: boolean): string | null {
    if (this.drill || !this.profile || this.profile.drillOfferedAt === this.plan.index) return null;
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
    setTimeout(show, TRANSITION_MS * 0.8);
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

  private victory(): void {
    this.screen = 'victory';
    this.sim = null;
    this.hud?.el.remove();
    this.hud = null;
    this.audio.fanfare();
    this.voice.speak('You learned every letter! The artifact is waking up.');
    this.setOverlay(
      h('div', { class: 'overlay' }, h('div', { class: 'card' }, h('h1', {}, '🔷 All letters collected!'), h('p', {}, 'The multidimensional artifact is waking up. (Its full reveal arrives in the next milestone.)'), h('div', { class: 'row-btns' }, h('a', { href: './verify/' }, h('button', {}, 'Watch your replay')), h('button', { class: 'secondary', onclick: () => this.showStart(this.profile) }, 'Main menu')))),
    );
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
    if (this.drill && this.sim?.state.phase !== 'play' && this.sim?.state.phase !== 'intro') return; // drill is ending
    if (this.screen !== 'level' || !this.sim || this.paused || this.host.transitioning) return;
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
    if (this.pauseReason === 'break') this.breakUi?.tryFinish(); // Escape can't skip the stretch break
    else if (this.paused) this.resume();
    else this.pause('menu');
  }

  private pause(reason: 'menu' | 'hidden' | 'break'): void {
    if (!this.sim || this.paused) return;
    this.paused = true;
    this.pauseReason = reason;
    this.record({ k: 'pause', t: this.logT() });
    void this.persist();
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
            this.showStart(this.profile);
          },
          () => void this.exportRun(),
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
        break;
      case 'powerup': {
        this.audio.powerup();
        const names: Record<string, string> = { 'powerup.shield': '🛡️ Shield!', 'powerup.slow-mo': '🐢 Slow motion!', 'powerup.reveal': '🔦 Lights on!' };
        toast(this.ui, names[e.id] ?? e.id);
        break;
      }
      case 'ability': {
        const ab = abilities.find((a) => a.id === e.id);
        toast(this.ui, e.quick ? `✨ You found "${e.word}"!` : `"${e.word}" — type it faster next time to keep it!`);
        if (e.quick) this.voice.speak(e.word, false);
        void ab;
        break;
      }
      case 'crossroads':
        if (this.drill) {
          void this.endDrill();
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
        void this.finishLevel();
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
    const tierKey = String(this.seg.tier);
    p.starsByTier[tierKey] ??= {};
    p.starsByTier[tierKey][String(this.plan.index)] = Math.max(p.starsByTier[tierKey][String(this.plan.index)] ?? 0, s.bestStars);
    const best = s.results.filter((r) => r.stage === sim.setup.stageLengths.length - 1).sort((a, b) => b.stars - a.stars || b.wpmP - a.wpmP)[0];
    if (best) p.results.push({ level: this.plan.index, tier: this.seg.tier, stars: best.stars, wpmP: best.wpmP, accP: best.accP, letters: this.plan.letters.length });
    for (const [k, v] of Object.entries(s.perKey)) {
      const acc = (p.perKey[k] ??= [0, 0, 0]);
      acc[0] += v[0];
      acc[1] += v[1];
      acc[2] += v[2];
    }
    p.collected = [...new Set([...p.collected, ...s.collected])];
    this.maybePromote();
    p.campaign.level = this.plan.index + 1;
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

  /** Automatic promotion: >= 2 stars at the next tier's 1-star target for 2 levels in a row (docs/01). */
  private maybePromote(): void {
    const p = this.profile;
    if (p.tier >= 7) return;
    const next = p.tier + 1;
    const last2 = p.results.slice(-2);
    if (last2.length < 2) return;
    const ok = last2.every((r) => r.accP >= tierAcc(next) && r.wpmP >= Math.floor((levelTargetWpmP(next, r.letters, false) * 12) / 10));
    if (!ok) return;
    p.tierHistory.push({ level: this.plan.index, from: p.tier, to: next });
    p.tier = next;
    const scale = scales.find((s) => s.id === p.avatar.scale) ?? scales[0];
    const name = scale.steps[next - 1]?.name.en ?? '';
    toast(this.ui, `🎉 You grew into a ${name}!`);
    this.voice.speak(`Amazing! You grew into a ${name}!`, false);
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
        if (this.playMs > this.profile.settings.breakMinutes * 60_000) {
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
