import { describe, expect, it } from 'vitest';
import { runTemplate } from '../../../tests/helpers/bot';
import { nextLane, type RacerState } from './sim';

describe('racer route: every Space steps one lane over', () => {
  it('neighbour lanes only', () => {
    expect(nextLane(-1, true)).toBe(0);
    expect(nextLane(1, false)).toBe(0);
    expect(nextLane(0, true)).toBe(1);
    expect(nextLane(0, false)).toBe(-1);
  });
  it('the planned lanes are a neighbour walk and the rider ends in the planned lane', () => {
    const { run } = runTemplate('template.racer', 'fjdks', 4, 'pass');
    const s = run.sim.state.tpl as RacerState;
    expect(s.wordLanes.length).toBeGreaterThan(3);
    for (let i = 1; i < s.wordLanes.length; i++) expect(Math.abs(s.wordLanes[i] - s.wordLanes[i - 1])).toBe(1);
    expect(s.lane).toBe(s.wordLanes[s.word]);
  });
});
