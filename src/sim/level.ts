/**
 * Deterministic level simulation (docs/10 §1). Time comes only from the input log.
 * Frame loop per frame f: process f's events (tick + impulse / error) → decay → template.step → snapshot.
 */
import { Rng, seedState } from '@/core/rng';
import { clamp, floorDiv, median } from '@/core/fixed';
import { hashState, type Hash } from '@/core/hash';
import { accP, intervalCapMs, newStageMetrics, newWindow, recentAccP, recordKey, steadiness, wpmP } from '@/typing/metrics';
import { generateStageText, typeable } from '@/typing/text';
import { levelTargetWpmP, starsFor, tierWpmP } from '@/typing/tiers';
import type { LevelSetup, LogEvent, SimEvent, SimState, StageResult, Target, TemplateCtx, TemplateSim } from './types';

export const FRAMES_PER_SNAPSHOT = 600;
export const V_EPS = 64;
export const MIN_VISIBILITY = 350;
export const STUCK_FRAMES = 10_800; // 3 minutes
export const IDLE_HINT_FRAMES = 300; // 5 s
export const INTRO_WINDOW_MS = 500;

export const frameOf = (t: number) => floorDiv(t * 3, 50);
const msToFrames = (ms: number) => floorDiv(ms * 3, 50);

const IGNORED_CODES = /^(Shift|Control|Alt|Meta|CapsLock|Fn|F\d+|Escape|OS|ContextMenu)/;

export interface Snapshot {
  frame: number;
  kind: 'start' | 'periodic' | 'stage' | 'level';
  hash: Hash;
  state?: string;
}

export interface LevelSimOptions {
  /** Skip frames while the world is at rest (docs/10 §1.4). Default true. */
  fastForward?: boolean;
  /** Keep serialised states with snapshots (for replay seeking). */
  keepStates?: boolean;
}

export class LevelSim {
  state: SimState;
  readonly snapshots: Snapshot[] = [];
  readonly events: SimEvent[] = [];
  private listeners: ((e: SimEvent) => void)[] = [];
  private readonly fastForward: boolean;
  private readonly keepStates: boolean;
  readonly targetWpmP: number;
  readonly capMs: number;

  constructor(readonly setup: LevelSetup, readonly template: TemplateSim, opts: LevelSimOptions = {}, restore?: SimState) {
    this.fastForward = opts.fastForward ?? true;
    this.keepStates = opts.keepStates ?? false;
    const offHome = setup.newKeys.some((c) => {
      const code = setup.language.codeOf[c];
      return code ? setup.language.layout[code].row !== 'home' && setup.language.layout[code].row !== 'space' : false;
    });
    this.targetWpmP = levelTargetWpmP(setup.tier, setup.letters.length, offHome);
    this.capMs = intervalCapMs(this.targetWpmP);
    if (restore) {
      this.state = restore;
      return;
    }
    const base = `${setup.seed}:level:${setup.levelIndex}`;
    this.state = {
      frame: 0, simT: 0, pausedMs: 0, pauseAt: -1, phase: 'intro', introF: -1, introJ: -1,
      rng: { text: seedState(`${base}:text`), drops: seedState(`${base}:drops`), tpl: seedState(`${base}:tpl`) },
      stage: 0, attempt: 0,
      prompt: { text: '', pos: 0, spans: [], chunks: [], nextChunk: 0 },
      targets: [], lockedTarget: -1, nextTargetId: 1,
      win: newWindow(), sm: newStageMetrics(),
      levelStartFrame: 0, stageStartFrame: 0, results: [], bestStars: 0,
      motion: { v: 0, speedMul: 1000 },
      correctTotal: 0, errorTotal: 0, accStreak: 0, rhythmStreak: 0, ticksSinceDrop: 0,
      fogUntil: 0, stumbleUntil: 0, slowUntil: 0, revealUntil: 0, shieldCharges: 0, shieldUntil: 0,
      spanStartT: -1, collected: [...setup.collected], perKey: {}, lastKeyFrame: 0,
      tpl: null,
    };
    this.state.tpl = template.init(this.ctx());
    this.newStageText();
    this.snapshot('start');
  }

  on(fn: (e: SimEvent) => void): void {
    this.listeners.push(fn);
  }

  // ---------------------------------------------------------------- time
  /** Feed one log event. */
  feed(e: LogEvent): void {
    const s = this.state;
    if (s.phase === 'done') return;
    if (e.k === 'pause') {
      if (s.pauseAt < 0) {
        this.advanceTo(e.t);
        s.pauseAt = e.t;
      }
      return;
    }
    if (e.k === 'resume') {
      if (s.pauseAt >= 0) {
        s.pausedMs += e.t - s.pauseAt;
        s.pauseAt = -1;
      }
      return;
    }
    if (s.pauseAt >= 0) throw new Error('key event while paused');
    this.advanceTo(e.t);
    // simT changes only on logged events, so state never depends on how often advanceTo was called.
    s.simT = e.t - s.pausedMs;
    if (e.k === 'end') return;
    this.handleKey(e);
  }

  /** Advance simulated time to log time t without an event (live play between keys). */
  advanceTo(t: number): void {
    const s = this.state;
    if (s.pauseAt >= 0 || s.phase === 'done') return;
    const simT = t - s.pausedMs;
    if (simT < s.simT) throw new Error(`time went backwards: ${simT} < ${s.simT}`);
    const target = frameOf(simT);
    if (target < s.frame) return;
    while (s.frame < target) {
      if (this.fastForward && this.atRest()) {
        // Frames at rest are no-ops apart from periodic snapshots (docs/10 §1.4).
        let next = (floorDiv(s.frame, FRAMES_PER_SNAPSHOT) + 1) * FRAMES_PER_SNAPSHOT;
        if (next > target) next = target;
        s.frame = next;
        if (s.frame % FRAMES_PER_SNAPSHOT === 0) this.snapshot('periodic');
        continue;
      }
      this.closeFrame();
      s.frame++;
      if (s.frame % FRAMES_PER_SNAPSHOT === 0) this.snapshot('periodic');
    }
  }

  /** decay + template step for the current open frame. */
  private closeFrame(): void {
    const s = this.state;
    const m = s.motion;
    m.v = m.v - floorDiv(m.v * 15, 128);
    if (m.v < V_EPS) m.v = 0;
    if (s.phase === 'play' || s.phase === 'crossroads') this.template.step(s.tpl, this.ctx());
  }

  atRest(): boolean {
    const s = this.state;
    return s.motion.v === 0 && this.template.isAtRest(s.tpl);
  }

  // ---------------------------------------------------------------- input
  private handleKey(e: Extract<LogEvent, { k: 'key' }>): void {
    const s = this.state;
    if (IGNORED_CODES.test(e.code)) return;
    if (s.phase === 'intro') return this.handleIntro(e);
    if (s.phase === 'crossroads') {
      if (e.code === 'KeyF') this.chooseMore();
      else if (e.code === 'KeyJ') this.chooseAdvance();
      return;
    }
    const key = this.setup.language.layout[e.code];
    const ch = key ? (e.shift ? key.shift ?? key.char : key.char) : `[${e.code}]`;
    const expected = this.expectedChars();
    const correct = expected.includes(ch);
    this.judged(e.t, ch, correct, expected[0] ?? '');
  }

  private handleIntro(e: Extract<LogEvent, { k: 'key' }>): void {
    const s = this.state;
    if (e.code === 'KeyF') s.introF = e.t;
    else if (e.code === 'KeyJ') s.introJ = e.t;
    else return;
    if (s.introF >= 0 && s.introJ >= 0 && Math.abs(s.introF - s.introJ) <= INTRO_WINDOW_MS) {
      s.phase = 'play';
      s.levelStartFrame = s.frame;
      s.stageStartFrame = s.frame;
      this.emit({ type: 'start', frame: s.frame });
    }
  }

  /** Characters that would be judged correct right now. */
  expectedChars(): string[] {
    const s = this.state;
    if (this.setup.inputMode === 'dictated') {
      const ch = s.prompt.text[s.prompt.pos];
      return ch === undefined ? [] : [ch];
    }
    if (s.lockedTarget >= 0) {
      const t = s.targets.find((x) => x.id === s.lockedTarget);
      if (t) return [t.text[t.progress]];
    }
    const out: string[] = [];
    for (const t of s.targets) if (!out.includes(t.text[0])) out.push(t.text[0]);
    return out;
  }

  private judged(t: number, ch: string, correct: boolean, expected: string): void {
    const s = this.state;
    const f = s.frame;
    const lat = s.win.lastKeyT >= 0 ? Math.min(t - s.win.lastKeyT, this.capMs) : 0;
    recordKey(s.win, s.sm, t, correct, this.capMs);
    const pk = (s.perKey[expected] ??= [0, 0, 0]);
    s.lastKeyFrame = f;
    if (correct) {
      pk[0]++;
      pk[2] += lat;
      s.correctTotal++;
      s.accStreak++;
      const st = steadiness(s.win.rhythm);
      s.rhythmStreak = st >= 800 ? s.rhythmStreak + 1 : 0;
      s.motion.speedMul = 600 + floorDiv(1400 * st, 1000);
      const slow = f < s.slowUntil ? 500 : 1000;
      const impulse = floorDiv(floorDiv(this.template.vBase * s.motion.speedMul, 1000) * slow, 1000);
      if (impulse > s.motion.v) s.motion.v = impulse;
      this.emit({ type: 'correct', char: ch, frame: f });
      this.advancePrompt(t, ch);
      this.template.onTick(s.tpl, this.ctx(), ch);
      this.earnPowerups();
      this.checkStageEnd();
    } else {
      pk[1]++;
      s.errorTotal++;
      s.accStreak = 0;
      s.rhythmStreak = 0;
      const shielded = s.shieldCharges > 0 && f < s.shieldUntil;
      if (shielded) s.shieldCharges--;
      else {
        s.fogUntil = f + 45;
        s.stumbleUntil = f + 18;
        s.motion.v = floorDiv(s.motion.v, 2);
      }
      this.emit({ type: 'error', char: ch, expected, frame: f, shielded });
      this.template.onError?.(s.tpl, this.ctx(), ch);
    }
  }

  private advancePrompt(t: number, ch: string): void {
    const s = this.state;
    if (this.setup.inputMode === 'dictated') {
      const p = s.prompt;
      const span = p.spans.find((sp) => p.pos >= sp.start && p.pos < sp.end);
      if (span && p.pos === span.start) s.spanStartT = t;
      p.pos++;
      if (span && p.pos === span.end) this.wordDone(span.word, span.ability, t - s.spanStartT);
      return;
    }
    let tg = s.targets.find((x) => x.id === s.lockedTarget);
    if (!tg) {
      tg = s.targets.find((x) => x.text[0] === ch);
      if (!tg) return;
      s.lockedTarget = tg.id;
      s.spanStartT = t;
    }
    tg.progress++;
    if (tg.progress >= tg.text.length) {
      s.targets = s.targets.filter((x) => x.id !== tg!.id);
      s.lockedTarget = -1;
      if (tg.ability) this.wordDone(tg.text, tg.ability, t - s.spanStartT);
      this.template.onTargetComplete?.(s.tpl, this.ctx(), tg);
    }
  }

  private wordDone(word: string, abilityId: string, ms: number): void {
    const s = this.state;
    const ab = this.setup.abilities.find((a) => a.id === abilityId);
    if (!ab) return;
    const budget = ab.quickTypeBudgetMs?.[String(this.setup.tier)] ?? floorDiv(word.length * 12_000 * 1500, tierWpmP(this.setup.tier));
    const quick = ms <= budget;
    if (quick && !s.collected.includes(ab.id)) s.collected.push(ab.id);
    this.emit({ type: 'ability', id: ab.id, word, quick, frame: s.frame });
    if (quick && ab.powerup) this.grantPowerup(ab.powerup.split('@')[0], 'word');
  }

  private earnPowerups(): void {
    const s = this.state;
    for (const pu of this.setup.powerups) {
      for (const src of pu.earnedBy) {
        if (src.source === 'accuracy-streak' && s.accStreak >= (src.threshold ?? 25)) {
          s.accStreak = 0;
          this.grantPowerup(pu.id, src.source);
        } else if (src.source === 'rhythm-streak' && s.rhythmStreak >= (src.threshold ?? 20)) {
          s.rhythmStreak = 0;
          this.grantPowerup(pu.id, src.source);
        }
      }
    }
    // Rare seeded drops with a pity timer.
    s.ticksSinceDrop++;
    const drops = this.setup.powerups.filter((p) => p.earnedBy.some((e) => e.source === 'random-drop'));
    if (!drops.length) return;
    const rng = new Rng(s.rng.drops);
    if (rng.chance(4) || s.ticksSinceDrop >= 300) {
      s.ticksSinceDrop = 0;
      const weights = drops.map((p) => p.earnedBy.find((e) => e.source === 'random-drop')!.weight ?? 1);
      this.grantPowerup(rng.weighted(drops, weights).id, 'random-drop');
    }
  }

  grantPowerup(id: string, source: string): void {
    const s = this.state;
    const pu = this.setup.powerups.find((p) => p.id === id);
    if (!pu) return;
    const until = s.frame + msToFrames(pu.durationMs ?? 15_000);
    if (pu.effect === 'slow-mo') s.slowUntil = until;
    else if (pu.effect === 'reveal') s.revealUntil = until;
    else if (pu.effect === 'shield') {
      s.shieldCharges = pu.charges ?? 3;
      s.shieldUntil = until;
    }
    this.emit({ type: 'powerup', id, frame: s.frame, source });
  }

  // ---------------------------------------------------------------- stages
  private newStageText(): void {
    const s = this.state;
    const L = this.setup.stageLengths;
    const lang = this.setup.language;
    const letters = this.setup.letters;
    const words = (lang.wordLists.common ?? []).filter((w) => typeable(w, letters));
    const specials: { word: string; ability: string }[] = [];
    for (const ab of this.setup.abilities) {
      if (s.collected.includes(ab.id) && ab.type !== 'boost') continue;
      for (const w of ab.triggerWords[lang.id.replace(/^lang\./, '')] ?? []) if (typeable(w, letters)) specials.push({ word: w, ability: ab.id });
    }
    const txt = generateStageText(new Rng(s.rng.text), {
      letters, newKeys: this.setup.newKeys, weakKeys: this.setup.weakKeys,
      stageIndex: s.stage, stageCount: L.length, length: L[Math.min(s.stage, L.length - 1)],
      words, specials, blockWords: lang.blockWords, blockSubstrings: lang.blockSubstrings,
    });
    s.prompt = { text: txt.text, pos: 0, spans: txt.spans, chunks: txt.text.split(' '), nextChunk: 0 };
    s.targets = [];
    s.lockedTarget = -1;
    s.sm = newStageMetrics();
    s.stageStartFrame = s.frame;
    this.template.onStageStart?.(s.tpl, this.ctx(), s.stage);
  }

  private checkStageEnd(): void {
    const s = this.state;
    const done =
      this.setup.inputMode === 'dictated'
        ? s.prompt.pos >= s.prompt.text.length
        : s.prompt.nextChunk >= s.prompt.chunks.length && s.targets.length === 0;
    if (!done) return;
    const sm = s.sm;
    const measure = { wpmP: wpmP(sm.correct, sm.activeMs), accP: accP(sm.correct, sm.errors), steadyP: median(sm.steadySamples) };
    const stars = starsFor(measure, this.targetWpmP, this.setup.tier);
    const result: StageResult = { stage: s.stage, attempt: s.attempt, correct: sm.correct, errors: sm.errors, activeMs: sm.activeMs, ...measure, stars };
    s.results.push(result);
    this.emit({ type: 'stage', result, frame: s.frame });
    const last = this.setup.stageLengths.length - 1;
    if (s.stage < last) {
      s.stage++;
      this.newStageText();
      this.snapshot('stage');
      return;
    }
    if (stars > s.bestStars) s.bestStars = stars;
    if (s.bestStars >= this.setup.targetStars) {
      s.phase = 'crossroads';
      this.emit({ type: 'crossroads', frame: s.frame });
      this.snapshot('stage');
      return;
    }
    s.attempt++;
    this.newStageText();
    this.snapshot('stage');
  }

  private chooseMore(): void {
    const s = this.state;
    s.phase = 'play';
    s.attempt++;
    this.emit({ type: 'more', frame: s.frame });
    this.newStageText();
  }

  private chooseAdvance(): void {
    const s = this.state;
    s.phase = 'done';
    this.emit({ type: 'done', frame: s.frame, choice: 'advance' });
    this.snapshot('level');
  }

  // ---------------------------------------------------------------- derived (never stored)
  /** World visibility, permille (docs/02 Feedback model). */
  visibility(): number {
    const s = this.state;
    if (s.frame < s.revealUntil) return 1000;
    const acc = recentAccP(s.win);
    const accScore = clamp((acc - 500) * 2, 0, 1000);
    const ramp = Math.min(1000, s.correctTotal * 20);
    let v = MIN_VISIBILITY + floorDiv(650 * floorDiv(accScore * ramp, 1000), 1000);
    if (s.frame < s.fogUntil) v -= 150;
    return clamp(v, MIN_VISIBILITY, 1000);
  }

  /** Keyboard overlay opacity, permille: brightens as accuracy drops. */
  keyboardOpacity(): number {
    const acc = recentAccP(this.state.win);
    return clamp(1000 - floorDiv((acc - 800) * 7, 2), 250, 1000);
  }

  steadinessP(): number {
    return steadiness(this.state.win.rhythm);
  }

  idleHint(): boolean {
    const s = this.state;
    return s.phase === 'play' && this.atRest() && s.frame - s.lastKeyFrame >= IDLE_HINT_FRAMES;
  }

  stuck(): boolean {
    const s = this.state;
    if (s.phase !== 'play' || s.bestStars >= this.setup.targetStars) return false;
    if (s.frame - s.levelStartFrame < STUCK_FRAMES) return false;
    // Judge the current stage once it has 20+ keys, otherwise the last finished stage.
    const sm = s.sm;
    if (sm.correct + sm.errors >= 20) {
      return starsFor({ wpmP: wpmP(sm.correct, sm.activeMs), accP: accP(sm.correct, sm.errors), steadyP: median(sm.steadySamples) }, this.targetWpmP, this.setup.tier) === 0;
    }
    const last = s.results[s.results.length - 1];
    return last ? last.stars === 0 : true;
  }

  liveWpmP(): number {
    return wpmP(this.state.sm.correct, this.state.sm.activeMs);
  }

  // ---------------------------------------------------------------- internals
  private ctx(): TemplateCtx {
    const s = this.state;
    return {
      rng: new Rng(s.rng.tpl),
      frame: s.frame,
      setup: this.setup,
      state: s,
      v: s.motion.v,
      hazardP: s.frame < s.slowUntil ? 500 : 1000,
      spawnTarget: () => this.spawnTarget(),
    };
  }

  private spawnTarget(): Target | null {
    const s = this.state;
    const p = s.prompt;
    if (p.nextChunk >= p.chunks.length) return null;
    // chunk start offset in text to look up ability spans
    let offset = 0;
    for (let i = 0; i < p.nextChunk; i++) offset += p.chunks[i].length + 1;
    const span = p.spans.find((sp) => sp.start === offset);
    const t: Target = { id: s.nextTargetId++, text: p.chunks[p.nextChunk++], progress: 0, ability: span?.ability ?? '' };
    s.targets.push(t);
    return t;
  }

  private emit(e: SimEvent): void {
    this.events.push(e);
    for (const l of this.listeners) l(e);
  }

  snapshot(kind: Snapshot['kind']): Snapshot {
    const json = this.keepStates ? JSON.stringify(this.state) : undefined;
    const snap: Snapshot = { frame: this.state.frame, kind, hash: hashState(this.state), state: json };
    this.snapshots.push(snap);
    return snap;
  }
}
