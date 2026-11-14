/** Space tunnel — deterministic part: each correct key pushes the ship forward through the ring tunnel. */
import type { TemplateSim } from '@/sim/types';

export const RING_GAP = 3 * 65536;

export interface TunnelState {
  z: number; // Q16 distance flown
  lastBeat: number;
  stumble: number;
}

const sim: TemplateSim<TunnelState> = {
  id: 'template.space-tunnel',
  vBase: 7000,
  init: () => ({ z: 0, lastBeat: -1, stumble: -1 }),
  onTick(s, ctx) {
    s.lastBeat = ctx.frame;
  },
  onError(s, ctx) {
    s.stumble = ctx.frame;
  },
  step(s, ctx) {
    s.z += ctx.v;
  },
  isAtRest: () => true,
};
export default sim;
