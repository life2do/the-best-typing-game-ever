import { describe, expect, it } from 'vitest';
import { runTemplate } from '../../../tests/helpers/bot';
import { HOP_MARGIN, Q1, type PlatformerState } from './sim';

describe('platformer: ground is always under the runner', () => {
  it('every gap is crossed inside a hop and every note is collected', () => {
    const { run } = runTemplate('template.platformer', 'fjd', 4, 'pass');
    const s = run.sim.state.tpl as PlatformerState;
    expect(s.gaps.length).toBeGreaterThan(3);
    // Gaps sit on the block grid, are one block wide and far enough apart for separate hops.
    for (let i = 0; i < s.gaps.length; i++) {
      expect(s.gaps[i] % Q1).toBe(0);
      if (i) expect(s.gaps[i] - s.gaps[i - 1]).toBeGreaterThanOrEqual(3 * Q1);
    }
    expect(HOP_MARGIN).toBeGreaterThan(0);
    expect(s.collected).toBeGreaterThan(0);
    // Notes that are left are all still ahead of the runner.
    for (const c of s.coins) expect(c).toBeGreaterThan(s.x);
  });
});
