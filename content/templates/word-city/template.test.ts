import { templateSuite } from '../../../tests/helpers/templateSuite';

templateSuite('template.word-city', 'fjdkslae');

import { describe, expect, it } from 'vitest';
import { adHocSetup } from '@/campaign/setup';
import { templateSim } from '@/sim/templates';
import { createBot } from '../../../tools/bot/bot';
import { PLOTS, type CityState } from './sim';

describe('word city districts', () => {
  it('one house per plot; a full district lifts off and a fresh one starts', () => {
    const setup = adHocSetup('districts', 'template.word-city', 'fjdkslaeirgh'.split(''), { tier: 4 });
    const bot = createBot(setup, templateSim(setup.templateId), { profile: 'pass', botSeed: 'districts' });
    let lifts = 0;
    let lastDistrict = 0;
    while (bot.step()) {
      const s = bot.sim.state.tpl as CityState;
      // A plot with a house is never offered another word in the same district.
      for (const p of s.plots) expect(p.id >= 0 && p.height > 0).toBe(false);
      expect(s.built).toBe(s.district * PLOTS + s.plots.filter((p) => p.height > 0).length);
      if (s.district !== lastDistrict) {
        lifts++;
        lastDistrict = s.district;
        expect(s.lifted).toHaveLength(PLOTS);
        expect(s.lifted.every((h) => h >= 1 && h <= 9)).toBe(true);
        expect(s.liftAt).toBe(bot.sim.state.frame);
        expect(s.plots.every((p) => p.height === 0 || p.builtAt === bot.sim.state.frame)).toBe(true);
      }
    }
    expect(bot.sim.state.phase).toBe('done');
    expect(lifts).toBeGreaterThanOrEqual(1);
  });
});
