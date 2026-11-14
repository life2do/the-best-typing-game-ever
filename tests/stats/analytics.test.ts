/** Local analytics are derived from the stored segments (M2.6). */
import { describe, expect, it } from 'vitest';
import { computeStats } from '@/stats/analytics';
import { newProfile, type Segment } from '@/storage/profile';
import { campaignFor } from '@/campaign/setup';
import { runLevel } from '../helpers/bot';

function segmentFor(level: number, tier: number, seed: string, startedAt: number): Segment {
  const { run, setup } = runLevel(level, tier, 'pass', { seed });
  const camp = campaignFor(seed);
  return {
    key: `${seed}:${level}`, build: 'b', campaignSeed: seed, language: 'en', level, tier, targetStars: setup.targetStars,
    collected: [], weakKeys: [], log: run.log, snapshots: run.sim.snapshots.map((s) => s.hash), complete: run.completed,
    stars: run.sim.state.bestStars, startedAt, plan: camp.levels[level - 1],
  };
}

describe('player analytics', () => {
  const seed = 'stats-seed';
  const p = newProfile('Mia', 'scale.flowers', 4, seed);
  p.starsByTier = { '4': { '1': 2, '2': 1 } };
  p.wordBook = { cat: { golden: true, count: 1, first: 1 }, sun: { golden: false, count: 2, first: 2 } };
  p.collected = ['ability.jump'];
  const segs = [segmentFor(1, 4, seed, 1000), segmentFor(2, 4, seed, 2000), { ...segmentFor(1, 4, 'someone-else', 500) }];
  const stats = computeStats(p, segs);

  it('only counts this player\'s segments, in the order they were played', () => {
    expect(stats.levels.map((l) => l.level)).toEqual([1, 2]);
    expect(stats.levels.every((l) => l.complete)).toBe(true);
  });
  it('level numbers match the replayed runs', () => {
    for (const l of stats.levels) {
      expect(l.stars).toBeGreaterThanOrEqual(1);
      expect(l.wpmP).toBeGreaterThan(0);
      expect(l.accP).toBeGreaterThan(800);
      expect(l.activeMs).toBeGreaterThan(0);
    }
    expect(stats.levels[0].newKeys).toBe('FJ');
    expect(stats.timeMs).toBe(stats.levels.reduce((a, l) => a + l.activeMs, 0));
    expect(stats.bestWpmP).toBe(Math.max(...stats.levels.map((l) => l.wpmP)));
  });
  it('builds a per-key heatmap of error rate and latency', () => {
    const f = stats.keys.find((k) => k.key === 'f')!;
    expect(f.n).toBeGreaterThan(10);
    expect(f.errP).toBeGreaterThanOrEqual(0);
    expect(f.latencyMs).toBeGreaterThan(0);
    expect(stats.keys.some((k) => k.key === ' ')).toBe(false);
  });
  it('summarises stars, words and abilities from the profile', () => {
    expect(stats.totalStars).toBe(3);
    expect(stats.starsByTier).toEqual([{ tier: 4, stars: 3 }]);
    expect(stats.words).toBe(2);
    expect(stats.goldenWords).toBe(1);
    expect(stats.abilities).toEqual(['ability.jump']);
  });
});
