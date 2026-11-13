/** Third-person racer — deterministic part. Space switches lanes to pass cones; words give a boost. */
import type { TemplateSim } from '@/sim/types';

export interface RacerState {
  z: number; // Q16 distance
  lane: number; // -1, 0, 1
  laneFrame: number; // frame of last lane change
  cones: [number, number][]; // [z Q16, lane]
  boostFrame: number;
  stumble: number;
}

const sim: TemplateSim<RacerState> = {
  id: 'template.racer',
  vBase: 9000,
  init: () => ({ z: 0, lane: 0, laneFrame: -1, cones: [], boostFrame: -1, stumble: -1 }),
  onTick(s, ctx, ch) {
    if (ch === ' ') {
      const choices = [-1, 0, 1].filter((l) => l !== s.lane);
      s.lane = ctx.rng.pick(choices);
      s.laneFrame = ctx.frame;
      s.boostFrame = ctx.frame;
    }
    if (ctx.rng.chance(150)) {
      s.cones.push([s.z + 20 * 65536 + ctx.rng.int(10 * 65536), ctx.rng.int(3) - 1]);
      if (s.cones.length > 16) s.cones.shift();
    }
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
