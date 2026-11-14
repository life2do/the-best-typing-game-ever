/**
 * Bubble-popper — deterministic part (targeting input). Bubbles carry words up from the sea floor;
 * typing a word pops its bubble. Bubbles only rise while the world moves (ctx.v), so stopping typing
 * stops the world (docs/02). Nothing is lost when a bubble reaches the top.
 */
import type { TemplateSim, TemplateCtx, Target } from '@/sim/types';
import { floorDiv } from '@/core/fixed';

export interface Bubble {
  id: number; // target id
  y: number; // Q16 height above the floor
  col: number; // 0..3
  popped: number; // frame popped, -1 = floating
}
export interface BubbleState {
  bubbles: Bubble[];
  pops: number;
  stumble: number;
}

export const TOP = 9 * 65536;
const GAP = 3 * 65536;

function floating(s: BubbleState): Bubble[] {
  return s.bubbles.filter((b) => b.popped < 0);
}

function fill(s: BubbleState, ctx: TemplateCtx): void {
  const want = 2 + Math.min(ctx.state.stage, 2);
  while (floating(s).length < want) {
    const t = ctx.spawnTarget();
    if (!t) return;
    // Pick the column whose lowest bubble is highest up, so labels never overlap.
    let col = 0;
    let best = -1;
    for (let c = 0; c < 4; c++) {
      const low = floating(s).filter((b) => b.col === c).reduce((m, b) => Math.min(m, b.y), TOP + GAP);
      if (low > best) {
        best = low;
        col = c;
      }
    }
    s.bubbles.push({ id: t.id, y: Math.min(0, best - GAP), col, popped: -1 });
  }
}

const sim: TemplateSim<BubbleState> = {
  id: 'template.bubble-popper',
  vBase: 2400,
  init: () => ({ bubbles: [], pops: 0, stumble: -1 }),
  onStageStart(s, ctx) {
    s.bubbles = s.bubbles.filter((b) => b.popped >= 0).slice(-6);
    fill(s, ctx);
  },
  onTick(s, ctx) {
    fill(s, ctx);
  },
  onTargetComplete(s, ctx, t: Target) {
    const b = s.bubbles.find((x) => x.id === t.id);
    if (b) {
      b.popped = ctx.frame;
      s.pops++;
    }
    s.bubbles = s.bubbles.filter((x) => x.popped < 0 || ctx.frame - x.popped < 120).slice(-12);
    fill(s, ctx);
  },
  onError(s, ctx) {
    s.stumble = ctx.frame;
  },
  step(s, ctx) {
    if (ctx.v === 0) return;
    const d = floorDiv(floorDiv(ctx.v, 4) * ctx.hazardP, 1000);
    for (const b of s.bubbles) {
      if (b.popped >= 0) continue;
      b.y += d;
      if (b.y >= TOP) b.y = TOP - GAP; // reached the surface: sinks back a little
    }
  },
  isAtRest: () => true,
};
export default sim;
