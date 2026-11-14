/**
 * Word city — deterministic part (targeting input). Plots on a 4×4 grid carry words; typing a word and
 * Space raises that building. Integer maths only (docs/10 §2).
 */
import type { TemplateSim, TemplateCtx, Target } from '@/sim/types';

export const PLOTS = 16;

export interface Plot {
  id: number; // target id while open, -1 when idle
  height: number; // floors built (0 = empty)
  builtAt: number; // frame finished, -1 = never
  round: number; // how many times this plot has been built
}
export interface CityState {
  plots: Plot[];
  next: number; // next plot to open (round-robin)
  built: number;
  crane: number; // Q16 crane swing phase (cosmetic, driven by ctx.v)
  stumble: number;
}

function open(s: CityState): number {
  return s.plots.filter((p) => p.id >= 0).length;
}

function fill(s: CityState, ctx: TemplateCtx): void {
  const want = 2 + Math.min(ctx.state.stage, 2);
  let guard = 0;
  while (open(s) < want && guard++ < PLOTS) {
    const plot = s.plots[s.next];
    s.next = (s.next + 5) % PLOTS; // 5 is coprime with 16: visits every plot, spread across the board
    if (plot.id >= 0) continue;
    const t = ctx.spawnTarget();
    if (!t) return;
    plot.id = t.id;
  }
}

const sim: TemplateSim<CityState> = {
  id: 'template.word-city',
  vBase: 2400,
  init: () => ({ plots: Array.from({ length: PLOTS }, () => ({ id: -1, height: 0, builtAt: -1, round: 0 })), next: 0, built: 0, crane: 0, stumble: -1 }),
  onStageStart(s, ctx) {
    for (const p of s.plots) p.id = -1;
    fill(s, ctx);
  },
  onTick(s, ctx) {
    fill(s, ctx);
  },
  onTargetComplete(s, ctx, t: Target) {
    const p = s.plots.find((x) => x.id === t.id);
    if (p) {
      p.id = -1;
      p.round++;
      p.height = Math.min(9, p.height + t.text.trim().length);
      p.builtAt = ctx.frame;
      s.built++;
    }
    fill(s, ctx);
  },
  onError(s, ctx) {
    s.stumble = ctx.frame;
  },
  step(s, ctx) {
    s.crane += ctx.v;
  },
  isAtRest: () => true,
};
export default sim;
