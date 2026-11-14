/** Fix-it drill (src/campaign/drill.ts): one short stage on the weak key, deterministic, ends whatever the stars. */
import { describe, expect, it } from 'vitest';
import { drillLength, drillSetup, weakestKey } from '@/campaign/drill';
import { weakKeys } from '@/storage/profile';
import { templateSim } from '@/sim/templates';
import { runBot } from '../../tools/bot/bot';

const run = (tier: number, profile: 'pass' | 'struggle' | 'masher' = 'pass') => {
  const setup = drillSetup('seed-1', 3, ['f', 'j', 'd', 'k'], 'd', tier);
  return { setup, run: runBot(setup, templateSim(setup.templateId), { profile, botSeed: 'drill' }) };
};

describe('fix-it drill', () => {
  it('is a single stage of about a minute at the target speed', () => {
    expect(drillLength(1)).toBe(25);
    expect(drillLength(4)).toBe(140);
    expect(drillLength(7)).toBe(200);
    const { setup } = run(4);
    expect(setup.stageLengths).toEqual([140]);
    expect(setup.newKeys).toEqual(['d']);
    expect(setup.targetStars).toBe(0);
  });

  for (const tier of [1, 4, 7]) {
    it(`pass bot finishes it in one stage at tier ${tier}`, () => {
      const { run: r } = run(tier);
      expect(r.completed).toBe(true);
      expect(r.sim.state.results).toHaveLength(1);
    });
  }

  it('also ends for a struggling typist (practice has no star target)', () => {
    const { run: r } = run(4, 'struggle');
    expect(r.sim.state.results).toHaveLength(1);
    expect(r.sim.state.phase === 'crossroads' || r.sim.state.phase === 'done').toBe(true);
  });

  it('drills the weak key: it is the most frequent letter in the text', () => {
    const { run: r } = run(4);
    const typed = r.sim.state.perKey;
    const counts = Object.entries(typed).filter(([k]) => k !== ' ').sort((a, b) => b[1][0] - a[1][0]);
    expect(counts[0][0]).toBe('d');
  });

  it('is deterministic', () => {
    expect(run(4).run.sim.snapshots.map((s) => s.hash)).toEqual(run(4).run.sim.snapshots.map((s) => s.hash));
  });

  it('picks the weakest known key', () => {
    const perKey: Record<string, [number, number, number]> = {
      f: [100, 2, 30000], j: [100, 2, 30000], d: [40, 20, 20000], k: [40, 12, 20000], s: [30, 25, 9000],
    };
    const weak = weakKeys(perKey);
    expect(weak).toEqual(expect.arrayContaining(['d', 'k', 's']));
    expect(weakestKey(perKey, weak, ['f', 'j', 'd', 'k'])).toBe('d'); // s is weaker but not known here
    expect(weakestKey(perKey, weak, ['f', 'j', 'd', 'k', 's'])).toBe('s');
    expect(weakestKey(perKey, [], ['f', 'j'])).toBeNull();
  });
});
