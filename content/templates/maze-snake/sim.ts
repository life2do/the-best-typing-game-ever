/**
 * Maze snake — deterministic part. Each correct key moves the snake one cell along a fixed serpentine
 * maze path; the snake grows as it goes. Integer maths only (docs/10 §2).
 */
import type { TemplateSim } from '@/sim/types';
import { floorDiv } from '@/core/fixed';

export const BERRY_EVERY = 5;
export const MAX_LEN = 14;

export interface SnakeState {
  steps: number; // cells moved this level
  length: number; // body segments
  berries: number; // berries eaten
  lastStep: number; // frame of the last step
  stumble: number; // frame of the last mistake
}

const sim: TemplateSim<SnakeState> = {
  id: 'template.maze-snake',
  vBase: 2600,
  init: () => ({ steps: 0, length: 3, berries: 0, lastStep: -1, stumble: -1 }),
  onTick(s, ctx) {
    s.steps++;
    s.lastStep = ctx.frame;
    s.length = Math.min(MAX_LEN, 3 + floorDiv(s.steps, 8));
    if (s.steps % BERRY_EVERY === 0) s.berries++;
  },
  onError(s, ctx) {
    s.stumble = ctx.frame;
  },
  step() {},
  isAtRest: () => true,
};
export default sim;
