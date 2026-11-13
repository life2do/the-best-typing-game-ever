/** Pause handling in logs (regression: "key event while paused" when loading a saved run). */
import { describe, expect, it } from 'vitest';
import { LevelSim } from '@/sim/level';
import { adHocSetup } from '@/campaign/setup';
import { templateSim } from '@/sim/templates';
import type { LogEvent } from '@/sim/types';

const setup = adHocSetup('pause', 'template.pulse-runner', ['f', 'j'], { tier: 4 });
const start: LogEvent[] = [
  { k: 'key', t: 500, code: 'KeyF' },
  { k: 'key', t: 520, code: 'KeyJ' },
  { k: 'key', t: 800, code: 'KeyF' },
];

describe('pause events', () => {
  it('ignores keys logged while paused (old logs missing a resume) instead of throwing', () => {
    const sim = new LevelSim(setup, templateSim(setup.templateId));
    const log: LogEvent[] = [...start, { k: 'pause', t: 900 }, { k: 'key', t: 950, code: 'KeyJ' }, { k: 'key', t: 1000, code: 'KeyF' }];
    expect(() => log.forEach((e) => sim.feed(e))).not.toThrow();
    const before = new LevelSim(setup, templateSim(setup.templateId));
    [...start, { k: 'pause', t: 900 } as LogEvent].forEach((e) => before.feed(e));
    expect(sim.state.correctTotal + sim.state.errorTotal).toBe(before.state.correctTotal + before.state.errorTotal);
  });

  it('keys after a resume count again', () => {
    const sim = new LevelSim(setup, templateSim(setup.templateId));
    const n0 = (() => {
      start.forEach((e) => sim.feed(e));
      return sim.state.correctTotal + sim.state.errorTotal;
    })();
    sim.feed({ k: 'pause', t: 900 });
    sim.feed({ k: 'resume', t: 900 });
    sim.feed({ k: 'key', t: 1200, code: 'KeyJ' });
    expect(sim.state.correctTotal + sim.state.errorTotal).toBe(n0 + 1);
  });
});
