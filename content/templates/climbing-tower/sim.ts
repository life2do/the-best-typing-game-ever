/** Climbing tower — deterministic part: each correct key is the next handhold up a spiral; Space plants a flag. */
import type { TemplateSim } from '@/sim/types';

export interface ClimbState {
  holds: number; // holds reached this level
  flags: number[]; // hold indices with a flag (last 16)
  lastHold: number;
  stumble: number;
}

const sim: TemplateSim<ClimbState> = {
  id: 'template.climbing-tower',
  vBase: 2600,
  init: () => ({ holds: 0, flags: [], lastHold: -1, stumble: -1 }),
  onTick(s, ctx, char) {
    s.holds++;
    s.lastHold = ctx.frame;
    if (char === ' ') s.flags = [...s.flags, s.holds].slice(-16);
  },
  onError(s, ctx) {
    s.stumble = ctx.frame;
  },
  step() {},
  isAtRest: () => true,
};
export default sim;
