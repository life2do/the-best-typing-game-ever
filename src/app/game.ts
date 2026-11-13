/**
 * Game controller: start screen → level intro → play → crossroads → transition → next level.
 * Every keystroke is appended to the segment log first and then fed to the simulation, so live play
 * and replay are the same code path (docs/10 §1.1).
 */
import { LevelSim } from '@/sim/level';
import type { LogEvent, SimEvent } from '@/sim/types';
import { campaignFor, language, levelSetup } from '@/campaign/setup';
import type { Campaign, LevelPlan } from '@/campaign/campaign';
import { templateSim } from '@/sim/templates';
import { palettes, scales, abilities, illustrations } from '@/content/registry';
import { RenderHost, TRANSITION_MS } from '@/render/host';
import { templateViews } from '@/render/registry';
import { AvatarRig } from '@/avatar/procedural';
import { Hud } from '@/ui/hud';
import { h, toast } from '@/ui/dom';
import { crossroadsScreen, introScreen, nagScreen, pauseScreen, startScreen, wordBookScreen } from '@/ui/screens';
import { WordArt } from '@/ui/wordArt';
import { StretchBreak } from '@/ui/stretchBreak';
import { KeyboardInput } from '@/input/keyboard';
import { AudioEngine, Voice } from '@/audio/audio';
import {
  DEFAULT_SETTINGS, freshSeed, loadProfile, loadSegment, newProfile, saveProfile, saveSegment, segmentKey, segmentsFor, weakKeys,
  type Profile, type Segment, type Settings,
} from '@/storage/profile';
import { levelTargetWpmP, tierAcc } from '@/typing/tiers';
import { BUILD } from './build-info';
import { FINGER_NAMES } from '@/ui/dom';

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
    const stored = await loadProfile().catch(() => undefined);
    this.showStart(stored);
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

  private showStart(stored?: Profile): void {
    this.screen = 'start';
    this.wordArt?.clear();
    this.hud?.el.remove();
    this.hud = null;
    const scale = scales[Math.floor(Math.random() * scales.length)]; // cosmetic: a different theme every load
    const showBook = stored
      ? () =>
          this.setOverlay(
            wordBookScreen(stored.wordBook ?? {}, illustrations.map((i) => ({ word: i.words.en?.[0] ?? i.id, svg: i.svg })), language('en').wordEmoji ?? {}, () => this.showStart(stored)),
          )
      : undefined;
    this.setOverlay(
      startScreen(scale, stored, async (c) => {
        this.audio.unlock();
        if (c.action === 'continue' && stored) {
          this.profile = stored;
          this.profile.settings = { ...DEFAULT_SETTINGS, ...stored.settings };
          if (c.name) this.profile.name = c.name;
        } else {
          this.profile = newProfile(c.name, c.scale, c.tier, freshSeed());
          if (stored) this.profile.settings = stored.settings;
        }
        this.profile.tier = c.action === 'new' ? c.tier : this.profile.tier;
        this.applySettings(this.profile.settings);
        await saveProfile(this.profile);
        this.camp = campaignFor(this.profile.campaign.seed, this.profile.campaign.language);
        if (this.profile.name) this.voice.speak(`Hi ${this.profile.name}! Let's type.`);
        await this.startLevel(this.profile.campaign.level, false);
      }, showBook),
    );
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
    return new AvatarRig(sc, this.profile.tier, this.profile.avatar.customization);
  }

  async startLevel(index: number, transition: boolean): Promise<void> {
    if (index > this.camp.levels.length) return this.victory();
    this.screen = 'level';
    this.plan = this.camp.levels[index - 1];
    const key = segmentKey(this.camp.seed, index);
    const existing = await loadSegment(key);
    const resume = existing && !existing.complete ? existing : null;
    this.seg = resume ?? {
      key, build: BUILD, campaignSeed: this.camp.seed, language: this.camp.language, level: index,
      tier: this.profile.tier, targetStars: 1, collected: [...this.profile.collected], weakKeys: weakKeys(this.profile.perKey),
      log: [], snapshots: [], complete: false, stars: 0, startedAt: Date.now(),
    };
    const setup = levelSetup(this.camp, index, { tier: this.seg.tier, targetStars: this.seg.targetStars, collected: this.seg.collected, weakKeys: this.seg.weakKeys });
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
        const rules = templateViews[this.plan.templateId]?.rules ?? [];
        const scale = scales.find((s) => s.id === this.profile.avatar.scale) ?? scales[0];
        const tierName = scale.steps[this.seg.tier - 1]?.name.en ?? `tier ${this.seg.tier}`;
        this.setOverlay(introScreen(lang, this.plan, rules, tierName));
        const nk = this.plan.newKeys.filter((k) => k !== ' ');
        const finger = nk.map((k) => `${k.toUpperCase()}, with your ${FINGER_NAMES[lang.layout[lang.codeOf[k]]?.finger ?? 'li']}`).join('. ');
        this.voice.speak(`Level ${index}. New key: ${finger}. ${rules.map((r) => r.text).join(' ')} Put your fingers on F and J, then press them together.`);
      } else if (sim.state.phase === 'crossroads') this.setOverlay(crossroadsScreen(sim.state.bestStars));
      else this.setOverlay(null);
    });
    if (transition) setTimeout(showIntro, TRANSITION_MS * 0.8);
    else showIntro();
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
    if (this.screen !== 'level' || !this.sim || this.paused || this.host.transitioning) return;
    const e: LogEvent = shift ? { k: 'key', t: this.logT(), code, shift: 1 } : { k: 'key', t: this.logT(), code };
    const before = this.sim.state.phase;
    this.record(e);
    const after = this.sim.state.phase;
    if (before === 'intro' && after === 'play') {
      this.setOverlay(null);
      this.voice.speak('Go!');
    }
    if (performance.now() - this.lastSave > 3000) void this.persist();
  }

  private togglePause(): void {
    if (this.screen !== 'level' || !this.sim) return;
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
    this.setOverlay(ph === 'crossroads' ? crossroadsScreen(this.sim.state.bestStars) : null);
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
        this.audio.fanfare();
        this.setOverlay(crossroadsScreen(sim.state.bestStars));
        this.voice.speak('You did it! Press F to stay for more stars, or J to go to the next world.');
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
    if (!this.sim || !this.seg) return;
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
          if (code) this.voice.speak(`Find the ${ch === ' ' ? 'space bar' : ch.toUpperCase()} with your ${FINGER_NAMES[lang.layout[code].finger]}.`);
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
