/**
 * Brick-breaker — deterministic part. Each correct key pops the next letter brick; the wall slides up one
 * row whenever a row is cleared. Integer maths only (docs/10 §2).
 */
import type { TemplateSim } from '@/sim/types';

export const COLS = 8;

export interface BrickState {
  x: number; // Q16 distance (drives the ball flight and paddle glide in the view)
  popped: number; // bricks popped this level
  lastHit: number; // frame of the last pop
  stumble: number; // frame of the last mistake
}

const sim: TemplateSim<BrickState> = {
  id: 'template.brick-breaker',
  vBase: 3000,
  init: () => ({ x: 0, popped: 0, lastHit: -1, stumble: -1 }),
  onTick(s, ctx) {
    s.popped++;
    s.lastHit = ctx.frame;
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
