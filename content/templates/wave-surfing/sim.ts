/**
 * Beat-wave surfing — deterministic part. Each correct key paddles forward and builds wave energy, which
 * drains while the sea is moving. Integer maths only (docs/10 §2).
 */
import type { TemplateSim } from '@/sim/types';

export interface SurfState {
  z: number; // Q16 distance
  energy: number; // permille wave energy
  lastBeat: number;
  stumble: number;
}

const sim: TemplateSim<SurfState> = {
  id: 'template.wave-surfing',
  vBase: 8000,
  init: () => ({ z: 0, energy: 0, lastBeat: -1, stumble: -1 }),
  onTick(s, ctx) {
    s.energy = Math.min(1000, s.energy + 120);
    s.lastBeat = ctx.frame;
  },
  onError(s, ctx) {
    s.stumble = ctx.frame;
  },
  step(s, ctx) {
    s.z += ctx.v;
    if (s.energy > 0) s.energy = Math.max(0, s.energy - 4);
  },
  isAtRest: (s) => s.energy === 0,
};
export default sim;
