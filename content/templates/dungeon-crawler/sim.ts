/**
 * Dungeon crawler — deterministic part. Each correct key is one step through a chain of rooms; each room
 * holds a gem halfway along. Integer maths only (docs/10 §2).
 */
import type { TemplateSim } from '@/sim/types';

export const ROOM = 6; // steps per room
export const GEM_AT = 3; // step within a room where its gem lies

export interface DungeonState {
  steps: number;
  gems: number;
  lastGem: number; // frame the last gem was collected
  lastStep: number;
  stumble: number;
}

const sim: TemplateSim<DungeonState> = {
  id: 'template.dungeon-crawler',
  vBase: 2600,
  init: () => ({ steps: 0, gems: 0, lastGem: -1, lastStep: -1, stumble: -1 }),
  onTick(s, ctx) {
    s.steps++;
    s.lastStep = ctx.frame;
    if (s.steps % ROOM === GEM_AT) {
      s.gems++;
      s.lastGem = ctx.frame;
    }
  },
  onError(s, ctx) {
    s.stumble = ctx.frame;
  },
  step() {},
  isAtRest: () => true,
};
export default sim;
