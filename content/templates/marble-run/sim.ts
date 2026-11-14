/**
 * Marble run — deterministic part. Each correct key lays the next track tile; the marble rolls along the
 * laid tiles and stops at the newest one. Integer maths only (docs/10 §2).
 */
import type { TemplateSim } from '@/sim/types';
import { floorDiv } from '@/core/fixed';

export const TILE = 65536; // Q16 distance per tile

export interface MarbleState {
  laid: number; // tiles laid this level
  pos: number; // Q16 marble position along the track
  bells: number[]; // tile indices with a bell (last 16)
  stumble: number;
}

const sim: TemplateSim<MarbleState> = {
  id: 'template.marble-run',
  vBase: 3000,
  init: () => ({ laid: 1, pos: 0, bells: [], stumble: -1 }),
  onTick(s, _ctx, char) {
    if (char === ' ') s.bells = [...s.bells, s.laid].slice(-16);
    s.laid++;
  },
  onError(s, ctx) {
    s.stumble = ctx.frame;
  },
  step(s, ctx) {
    const goal = (s.laid - 1) * TILE;
    // Rolls at the world speed, and catches up faster when it falls behind fast typing.
    if (s.pos < goal) s.pos = Math.min(goal, s.pos + Math.max(ctx.v, 2000, floorDiv(goal - s.pos, 10)));
  },
  isAtRest: (s) => s.pos >= (s.laid - 1) * TILE,
};
export default sim;
