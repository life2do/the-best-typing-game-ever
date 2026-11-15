/** Level progress bar: sections per stage, goal flag, repeats before the flag, bonus rounds after it. */
import { describe, expect, it } from 'vitest';
import { barModel, stageFraction } from '@/ui/progress';
import type { StageResult } from '@/sim/types';
import { adHocSetup } from '@/campaign/setup';
import { templateSim } from '@/sim/templates';
import { createBot } from '../../tools/bot/bot';

const L = [40, 60, 80];
const res = (stage: number, stars: number, attempt = 0): StageResult => ({ stage, attempt, stars, correct: 0, errors: 0, activeMs: 0, wpmP: 0, accP: 0, steadyP: 0 });
const base = { stageLengths: L, targetStars: 1 };

describe('level progress bar model', () => {
  it('starts with one section per stage and the flag at the end', () => {
    const m = barModel({ ...base, results: [], stage: 0, phase: 'intro', current: 0 });
    expect(m.sections.map((s) => [s.len, s.kind])).toEqual([[40, 'stage'], [60, 'stage'], [80, 'stage']]);
    expect(m.flagAfter).toBe(2);
    expect(m.reached).toBe(false);
    expect(m.pos).toBe(0);
  });

  it('moves the avatar by characters across stages', () => {
    const m = barModel({ ...base, results: [res(0, 2)], stage: 1, phase: 'play', current: 0.5 });
    expect(m.sections.map((s) => s.fill)).toEqual([1, 0.5, 0]);
    expect(m.pos).toBeCloseTo((40 + 30) / 180, 6);
    expect(m.sections[0].stars).toBe(2);
  });

  it('a missed last stage adds a repeat before the flag and the bar re-scales', () => {
    const m = barModel({ ...base, results: [res(0, 1), res(1, 1), res(2, 0)], stage: 2, phase: 'play', current: 0.25 });
    expect(m.sections.map((s) => s.kind)).toEqual(['stage', 'stage', 'stage', 'repeat']);
    expect(m.flagAfter).toBe(3);
    expect(m.reached).toBe(false);
    expect(m.pos).toBeCloseTo((180 + 20) / 260, 6);
    expect(m.pos).toBeLessThan(1);
  });

  it('reaching the target fills the bar up to a gold flag', () => {
    const m = barModel({ ...base, results: [res(0, 1), res(1, 1), res(2, 0), res(2, 1, 1)], stage: 2, phase: 'crossroads', current: 1 });
    expect(m.sections.map((s) => s.kind)).toEqual(['stage', 'stage', 'stage', 'repeat']);
    expect(m.flagAfter).toBe(3);
    expect(m.reached).toBe(true);
    expect(m.pos).toBe(1);
  });

  it('"stay for more stars" adds bonus sections after the flag, each ending in a shiny star', () => {
    const playing = barModel({ ...base, results: [res(0, 1), res(1, 1), res(2, 1)], stage: 2, phase: 'play', current: 0.5 });
    expect(playing.sections.map((s) => s.kind)).toEqual(['stage', 'stage', 'stage', 'bonus']);
    expect(playing.flagAfter).toBe(2);
    expect(playing.reached).toBe(true);
    expect(playing.sections[3].star).toBe('pending');
    expect(playing.pos).toBeCloseTo((180 + 40) / 260, 6);
    const after = barModel({ ...base, results: [res(0, 1), res(1, 1), res(2, 1), res(2, 3, 1), res(2, 2, 2)], stage: 2, phase: 'crossroads', current: 1 });
    expect(after.sections.slice(3).map((s) => [s.kind, s.star])).toEqual([['bonus', 'earned'], ['bonus', 'missed']]);
    expect(after.pos).toBe(1);
  });

  it('follows a real level: the avatar only moves forward within an attempt and ends at 1', () => {
    const setup = adHocSetup('bar', 'template.pulse-runner', 'fjdk'.split(''), { tier: 3 });
    const bot = createBot(setup, templateSim(setup.templateId), { profile: 'pass', botSeed: 'bar' });
    let last = 0;
    let shape = '';
    while (bot.step()) {
      const s = bot.sim.state;
      const m = barModel({ stageLengths: setup.stageLengths, targetStars: setup.targetStars, results: s.results, stage: s.stage, phase: s.phase, current: stageFraction(s, true) });
      const sh = m.sections.length;
      if (String(sh) === shape) expect(m.pos).toBeGreaterThanOrEqual(last - 1e-9);
      shape = String(sh);
      last = m.pos;
      expect(m.pos).toBeGreaterThanOrEqual(0);
      expect(m.pos).toBeLessThanOrEqual(1);
    }
    expect(bot.sim.state.phase).toBe('done');
    expect(last).toBe(1);
  });
});
