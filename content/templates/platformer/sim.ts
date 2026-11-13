/** Side platformer — deterministic part. Space = jump over a gap that opens ahead. */
import type { TemplateSim } from '@/sim/types';

export interface PlatformerState {
  x: number; // Q16
  jumps: number[]; // frames when jumps started (last 8)
  gaps: number[]; // Q16 x positions of gaps (last 12)
  coins: number[]; // Q16 x positions of collectible notes
  stumble: number;
}

const GAP_AHEAD = 2 * 65536;

const sim: TemplateSim<PlatformerState> = {
  id: 'template.platformer',
  vBase: 3000,
  init: () => ({ x: 0, jumps: [], gaps: [], coins: [], stumble: -1 }),
  onTick(s, ctx, ch) {
    if (ch === ' ') {
      s.jumps.push(ctx.frame);
      if (s.jumps.length > 8) s.jumps.shift();
      s.gaps.push(s.x + GAP_AHEAD);
      if (s.gaps.length > 12) s.gaps.shift();
    } else if (ctx.rng.chance(120)) {
      s.coins.push(s.x + 3 * 65536 + ctx.rng.int(65536));
      if (s.coins.length > 12) s.coins.shift();
    }
  },
  onError(s, ctx) {
    s.stumble = ctx.frame;
  },
  step(s, ctx) {
    s.x += ctx.v;
  },
  isAtRest: () => true,
};
export default sim;
