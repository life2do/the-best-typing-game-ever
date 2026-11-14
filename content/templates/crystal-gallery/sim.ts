/**
 * Crystal gallery — deterministic part (targeting input). Crystals drift toward the player; typing a
 * crystal's word makes it chime. They stop at arm's length, so nothing is ever lost. Integer maths only.
 */
import type { TemplateSim, TemplateCtx, Target } from '@/sim/types';
import { floorDiv } from '@/core/fixed';

export const FAR = 10 * 65536;
export const NEAR = 3 * 65536;
export const SLOTS = 5;

export interface Crystal {
  id: number;
  d: number; // Q16 distance from the player
  slot: number; // 0..4 across the view
  sung: number; // frame sung, -1 = waiting
}
export interface GalleryState {
  crystals: Crystal[];
  sung: number;
  stumble: number;
}

const waiting = (s: GalleryState) => s.crystals.filter((c) => c.sung < 0);

function fill(s: GalleryState, ctx: TemplateCtx): void {
  const want = 2 + Math.min(ctx.state.stage, 2);
  while (waiting(s).length < want) {
    const t = ctx.spawnTarget();
    if (!t) return;
    // A free slot, preferring the middle ones; deterministic order.
    const used = waiting(s).map((c) => c.slot);
    const slot = [2, 1, 3, 0, 4].find((x) => !used.includes(x)) ?? t.id % SLOTS;
    s.crystals.push({ id: t.id, d: FAR, slot, sung: -1 });
  }
}

const sim: TemplateSim<GalleryState> = {
  id: 'template.crystal-gallery',
  vBase: 2400,
  init: () => ({ crystals: [], sung: 0, stumble: -1 }),
  onStageStart(s, ctx) {
    s.crystals = s.crystals.filter((c) => c.sung >= 0).slice(-4);
    fill(s, ctx);
  },
  onTick(s, ctx) {
    fill(s, ctx);
  },
  onTargetComplete(s, ctx, t: Target) {
    const c = s.crystals.find((x) => x.id === t.id);
    if (c) {
      c.sung = ctx.frame;
      s.sung++;
    }
    s.crystals = s.crystals.filter((x) => x.sung < 0 || ctx.frame - x.sung < 90).slice(-10);
    fill(s, ctx);
  },
  onError(s, ctx) {
    s.stumble = ctx.frame;
  },
  step(s, ctx) {
    if (ctx.v === 0) return;
    const d = floorDiv(floorDiv(ctx.v, 3) * ctx.hazardP, 1000);
    for (const c of s.crystals) if (c.sung < 0 && c.d > NEAR) c.d = Math.max(NEAR, c.d - d);
  },
  isAtRest: () => true,
};
export default sim;
