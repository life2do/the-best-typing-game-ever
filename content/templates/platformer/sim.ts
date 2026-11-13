/**
 * Side platformer — deterministic part. Every typed Space opens a gap a little ahead and may hang a
 * note over it; the runner hops every gap it passes (the hop is derived from position, so it always
 * clears), and passing a note's position collects it.
 */
import type { TemplateSim } from '@/sim/types';
import { floorDiv } from '@/core/fixed';

export interface PlatformerState {
  x: number; // Q16 runner position
  gaps: number[]; // Q16 x of each 1-unit gap's left edge (last 12)
  coins: number[]; // Q16 x of notes still to collect (over gaps)
  collected: number;
  lastCollect: number; // frame of the last collected note, -1 = none
  stumble: number;
}

export const Q1 = 65536;
/** Gap opens this far ahead of the runner (Q16). */
export const GAP_AHEAD = 3 * Q1;
/** Hop starts this far before a gap and ends this far after it (Q16). */
export const HOP_MARGIN = Q1 / 2;

const sim: TemplateSim<PlatformerState> = {
  id: 'template.platformer',
  vBase: 3000,
  init: () => ({ x: 0, gaps: [], coins: [], collected: 0, lastCollect: -1, stumble: -1 }),
  onTick(s, ctx, ch) {
    if (ch !== ' ') return;
    // Snap the gap to the block grid so it removes exactly one block, and keep gaps apart.
    const gx = floorDiv(s.x + GAP_AHEAD, Q1) * Q1;
    const last = s.gaps[s.gaps.length - 1];
    if (last !== undefined && gx - last < 3 * Q1) return;
    s.gaps.push(gx);
    if (s.gaps.length > 12) s.gaps.shift();
    if (ctx.rng.chance(600)) {
      s.coins.push(gx + Q1 / 2); // over the middle of the gap = top of the hop
      if (s.coins.length > 12) s.coins.shift();
    }
  },
  onError(s, ctx) {
    s.stumble = ctx.frame;
  },
  step(s, ctx) {
    if (ctx.v === 0) return;
    s.x += ctx.v;
    while (s.coins.length && s.coins[0] <= s.x) {
      s.coins.shift();
      s.collected++;
      s.lastCollect = ctx.frame;
    }
  },
  isAtRest: () => true,
};
export default sim;
