/**
 * Garden grower — deterministic part. Each correct key plants (waters) the next seed in the bed; a
 * Space after a word marks that seed as a sunflower. Integer maths only (docs/10 §2).
 */
import type { TemplateSim } from '@/sim/types';

export const SEED_GAP = 65536; // one world unit per seed

export interface GardenState {
  x: number; // Q16 distance walked by the gardener
  planted: number; // seeds watered this level
  plantedAt: number[]; // frame each of the last 40 seeds was watered (ring buffer by index % 40)
  sunflowers: number[]; // seed indices that became sunflowers (last 12)
  stumble: number;
}

const sim: TemplateSim<GardenState> = {
  id: 'template.garden-grower',
  vBase: 3200,
  init: () => ({ x: 0, planted: 0, plantedAt: [], sunflowers: [], stumble: -1 }),
  onTick(s, ctx, char) {
    s.plantedAt[s.planted % 40] = ctx.frame;
    if (char === ' ' && s.planted > 0) s.sunflowers = [...s.sunflowers, s.planted - 1].slice(-12);
    s.planted++;
  },
  onError(s, ctx) {
    s.stumble = ctx.frame;
  },
  step(s, ctx) {
    // The gardener walks toward the next seed and stops there.
    const goal = s.planted * SEED_GAP;
    if (s.x < goal) s.x = Math.min(goal, s.x + Math.max(ctx.v, 1200));
  },
  isAtRest: (s) => s.x >= s.planted * SEED_GAP,
};
export default sim;
