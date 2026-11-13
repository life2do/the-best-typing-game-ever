import type { RngState } from '@/core/rng';
import type { WindowMetrics, StageMetrics } from '@/typing/metrics';
import type { WordSpan } from '@/typing/text';
import type { AbilityManifest, InputMode, LanguagePack, PowerupManifest } from '@/content/types';
import type { Rng } from '@/core/rng';

/** Input-log events (docs/10 §1.2). All fields are integers or strings. */
export type LogEvent =
  | { k: 'key'; t: number; code: string; shift?: 0 | 1; p?: number }
  | { k: 'pause'; t: number }
  | { k: 'resume'; t: number }
  | { k: 'end'; t: number };

export type Phase = 'intro' | 'play' | 'crossroads' | 'done';

export interface StageResult {
  stage: number;
  attempt: number;
  correct: number;
  errors: number;
  activeMs: number;
  wpmP: number;
  accP: number;
  steadyP: number;
  stars: number;
}

export interface Target {
  id: number;
  text: string;
  progress: number;
  ability: string;
}

export interface SimState {
  frame: number;
  simT: number;
  pausedMs: number;
  pauseAt: number;
  phase: Phase;
  introF: number;
  introJ: number;
  rng: { text: RngState; drops: RngState; tpl: RngState };
  stage: number;
  attempt: number;
  prompt: { text: string; pos: number; spans: WordSpan[]; chunks: string[]; nextChunk: number };
  targets: Target[];
  lockedTarget: number;
  nextTargetId: number;
  win: WindowMetrics;
  sm: StageMetrics;
  levelStartFrame: number;
  stageStartFrame: number;
  results: StageResult[];
  bestStars: number;
  motion: { v: number; speedMul: number };
  correctTotal: number;
  errorTotal: number;
  accStreak: number;
  rhythmStreak: number;
  ticksSinceDrop: number;
  fogUntil: number;
  stumbleUntil: number;
  slowUntil: number;
  revealUntil: number;
  shieldCharges: number;
  shieldUntil: number;
  spanStartT: number;
  collected: string[];
  perKey: Record<string, [number, number, number]>; // [n, errors, latencySumMs]
  lastKeyFrame: number;
  tpl: any;
}

export interface LevelSetup {
  seed: string;
  levelIndex: number;
  language: LanguagePack;
  letters: string[];
  newKeys: string[];
  tier: number;
  targetStars: number;
  templateId: string;
  inputMode: InputMode;
  stageLengths: number[];
  abilities: AbilityManifest[];
  powerups: PowerupManifest[];
  collected: string[];
  weakKeys: string[];
}

export type SimEvent =
  | { type: 'correct'; char: string; frame: number }
  | { type: 'error'; char: string; expected: string; frame: number; shielded: boolean }
  | { type: 'start'; frame: number }
  | { type: 'stage'; result: StageResult; frame: number }
  | { type: 'powerup'; id: string; frame: number; source: string }
  | { type: 'ability'; id: string; word: string; quick: boolean; frame: number }
  | { type: 'crossroads'; frame: number }
  | { type: 'done'; frame: number; choice: 'advance' }
  | { type: 'more'; frame: number };

/** Context handed to template simulation code. Only integer maths, only ctx.rng. */
export interface TemplateCtx {
  rng: Rng;
  frame: number;
  setup: LevelSetup;
  state: Readonly<SimState>;
  /** Q16 world velocity after decay (engine-owned). */
  v: number;
  /** Hazard speed multiplier, permille (500 during slow-mo). */
  hazardP: number;
  /** Targeting mode: spawn the next target from the stage text; null when the stage text is used up. */
  spawnTarget(): Target | null;
}

export interface TemplateSim<S = any> {
  id: string;
  /** Base velocity (Q16 per frame) given to the world on a correct key at speed multiplier 1.0. */
  vBase: number;
  init(ctx: TemplateCtx): S;
  onStageStart?(s: S, ctx: TemplateCtx, stage: number): void;
  onTick(s: S, ctx: TemplateCtx, char: string): void;
  onError?(s: S, ctx: TemplateCtx, char: string): void;
  onTargetComplete?(s: S, ctx: TemplateCtx, target: Target): void;
  /** Continuous update; must be a no-op when isAtRest(s) and ctx.v === 0. */
  step(s: S, ctx: TemplateCtx): void;
  isAtRest(s: S): boolean;
}
