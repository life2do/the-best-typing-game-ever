/** Milestone 1 test matrix (docs/10 §6), Node part. Cross-browser replay lives in e2e/. */
import { describe, expect, it } from 'vitest';
import { runLevel, replayLog } from '../helpers/bot';
import { budgetFor } from '../../tools/bot/bot';
import { templateSim } from '@/sim/templates';
import { timingCheck } from '@/proof/timing';
import { campaignFor } from '@/campaign/setup';

const LEVELS = [1, 2, 3, 4];

describe('campaign', () => {
  it('pins M1 templates for levels 1-4, covers all 26 letters, then the 7 key groups', () => {
    const c = campaignFor('any');
    expect(c.levels.slice(0, 4).map((l) => l.templateId)).toEqual(['template.pulse-runner', 'template.platformer', 'template.tower-defence', 'template.racer']);
    expect(c.levels.length).toBe(33); // 26 letter levels + 7 key-group levels (M2.2)
    expect(c.levels[25].letters.length).toBe(27); // 26 letters + ';'
    expect(c.levels[25].keyGroup).toBeUndefined();
    expect(c.levels[26].keyGroup?.id).toBe('shift');
  });
  it('never repeats a template within 3 levels and uses the whole genre library (M2.3)', () => {
    const used = new Set<string>();
    for (let i = 0; i < 20; i++) {
      const ids = campaignFor(`seed-${i}`).levels.map((l) => l.templateId);
      ids.forEach((t) => used.add(t));
      for (let l = 1; l < ids.length; l++) expect(ids.slice(Math.max(0, l - 3), l), `seed-${i} level ${l + 1}`).not.toContain(ids[l]);
    }
    expect(used.size).toBeGreaterThanOrEqual(15);
  });
  it('is seeded: same seed same plan, different seed different later levels', () => {
    expect(campaignFor('a')).toEqual(campaignFor('a'));
    const a = campaignFor('a').levels.map((l) => l.templateId + l.styleId + l.paletteId).join();
    const b = campaignFor('b').levels.map((l) => l.templateId + l.styleId + l.paletteId).join();
    expect(a).not.toEqual(b);
  });
});

describe('completion: pass bot', () => {
  for (const tier of [1, 4, 7])
    for (const level of LEVELS)
      it(`tier ${tier} level ${level}: >= 1 star within budget`, () => {
        const { run } = runLevel(level, tier, 'pass');
        expect(run.completed).toBe(true);
        expect(run.sim.state.bestStars).toBeGreaterThanOrEqual(1);
        expect(run.simulatedMs).toBeLessThanOrEqual(budgetFor(tier));
      });
});

describe('star ceiling', () => {
  it('star3 bot at tier 4 reaches 3 stars on at least one level', () => {
    const stars = LEVELS.map((l) => runLevel(l, 4, 'star3').run.sim.state.bestStars);
    expect(Math.max(...stars)).toBe(3);
  });
});

describe('no false completion: struggle bot', () => {
  for (const tier of [1, 4, 7])
    it(`tier ${tier}: never completes, stuck flow fires within 3-4 simulated minutes`, () => {
      const { run } = runLevel(2, tier, 'struggle');
      expect(run.completed).toBe(false);
      expect(run.stuckAtMs).toBeGreaterThanOrEqual(180_000);
      expect(run.stuckAtMs).toBeLessThanOrEqual(240_000);
      expect(run.minVisibility).toBeGreaterThanOrEqual(350);
    });
});

describe('robustness: masher bot', () => {
  for (const level of LEVELS)
    it(`level ${level}: no exceptions, minimum visibility respected`, () => {
      const { run } = runLevel(level, 4, 'masher');
      expect(run.minVisibility).toBeGreaterThanOrEqual(350);
      expect(run.sim.state.errorTotal).toBeGreaterThan(run.sim.state.correctTotal);
    });
});

describe('determinism', () => {
  for (const level of LEVELS)
    it(`level ${level}: same seed + profile twice gives identical snapshot hashes`, () => {
      const a = runLevel(level, 4, 'pass').run.sim.snapshots.map((s) => s.hash);
      const b = runLevel(level, 4, 'pass').run.sim.snapshots.map((s) => s.hash);
      expect(b).toEqual(a);
    });
  it('replaying the recorded log reproduces the same hashes', () => {
    const { setup, run } = runLevel(3, 4, 'pass');
    const replay = replayLog(setup, templateSim(setup.templateId), run.log);
    expect(replay.snapshots.map((s) => s.hash)).toEqual(run.sim.snapshots.map((s) => s.hash));
  });
  it('different seeds give different runs', () => {
    const a = runLevel(1, 4, 'pass', { seed: 'x' }).run.sim.snapshots.at(-1)!.hash;
    const b = runLevel(1, 4, 'pass', { seed: 'y' }).run.sim.snapshots.at(-1)!.hash;
    expect(a).not.toBe(b);
  });
});

describe('fast-forward equivalence (docs/10 §1.4)', () => {
  for (const level of LEVELS)
    it(`level ${level}: idle run with fast-forward on vs off gives identical hashes`, () => {
      const { setup, run } = runLevel(level, 4, 'idle');
      const off = replayLog(setup, templateSim(setup.templateId), run.log, { fastForward: false });
      expect(run.idleHintSeen).toBe(true);
      expect(off.snapshots.map((s) => s.hash)).toEqual(run.sim.snapshots.map((s) => s.hash));
    });
});

describe('timing plausibility', () => {
  it('robot bot is flagged suspicious, pass bot is not', () => {
    expect(timingCheck(runLevel(2, 4, 'robot').run.log).suspicious).toBe(true);
    expect(timingCheck(runLevel(2, 4, 'pass').run.log).suspicious).toBe(false);
  });
});
