/**
 * Third-person racer — deterministic part.
 * The route is planned per stage: every Space in the stage text moves the route one lane over
 * (edge ↔ middle; from the middle, left or right by seed), and a cone blocks the old lane right after
 * the turn. Typing Space makes the rider take the turn. Words give a boost.
 */
import type { TemplateSim, TemplateCtx } from '@/sim/types';

export interface RacerState {
  z: number; // Q16 distance
  lane: number; // -1, 0, 1 — the lane the rider is in
  laneFrame: number; // frame of last lane change
  /** Lane of each word in the current stage text: wordLanes[w] for the w-th word (0-based). */
  wordLanes: number[];
  /** Index of the word being typed (number of Spaces typed in this stage). */
  word: number;
  boostFrame: number;
  stumble: number;
}

/** Neighbour lane only: from an edge go to the middle; from the middle go left or right. */
export function nextLane(lane: number, pickRight: boolean): number {
  if (lane !== 0) return 0;
  return pickRight ? 1 : -1;
}

function planLanes(s: RacerState, ctx: TemplateCtx): void {
  const words = ctx.state.prompt.text.split(' ').length;
  const lanes = [s.lane];
  for (let w = 1; w < words; w++) lanes.push(nextLane(lanes[w - 1], ctx.rng.chance(500)));
  s.wordLanes = lanes;
  s.word = 0;
}

const sim: TemplateSim<RacerState> = {
  id: 'template.racer',
  vBase: 9000,
  init: () => ({ z: 0, lane: 0, laneFrame: -1, wordLanes: [0], word: 0, boostFrame: -1, stumble: -1 }),
  onStageStart(s, ctx) {
    planLanes(s, ctx);
  },
  onTick(s, ctx, ch) {
    if (ch !== ' ') return;
    s.word = Math.min(s.word + 1, s.wordLanes.length - 1);
    s.lane = s.wordLanes[s.word];
    s.laneFrame = ctx.frame;
    s.boostFrame = ctx.frame;
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
