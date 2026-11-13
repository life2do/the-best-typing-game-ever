/** Pulse runner — deterministic part. Integer maths only (docs/10 §2). */
import type { TemplateSim } from '@/sim/types';
import { floorDiv } from '@/core/fixed';

export interface PulseState {
  x: number; // Q16 world units travelled
  lit: number; // lanterns lit
  lastBeat: number; // frame of last heartbeat (correct key)
  stumble: number; // frame of last error
}

export const LANTERN_SPACING = 3 * 65536;

const sim: TemplateSim<PulseState> = {
  id: 'template.pulse-runner',
  vBase: 3600,
  init: () => ({ x: 0, lit: 0, lastBeat: -1, stumble: -1 }),
  onTick(s, ctx) {
    s.lastBeat = ctx.frame;
    // Light the next lantern once the runner has reached it.
    const reached = floorDiv(s.x, LANTERN_SPACING) + 1;
    if (s.lit < reached) s.lit = reached;
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
