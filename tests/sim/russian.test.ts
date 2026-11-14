/** Russian language pack and campaign (M2.4). */
import { describe, expect, it } from 'vitest';
import { campaignFor, language, levelSetup } from '@/campaign/setup';
import { templateSim } from '@/sim/templates';
import { runBot, budgetFor } from '../../tools/bot/bot';
import { tr, homeKeys, fingerName } from '@/content/i18n';

const ru = language('ru');
const camp = campaignFor('ru-test', 'ru');
const run = (level: number, tier: number, profile: 'pass' | 'struggle') => {
  const setup = levelSetup(camp, level, { tier });
  return runBot(setup, templateSim(setup.templateId), { profile, botSeed: 'ru-test' });
};

describe('Russian pack', () => {
  it('maps ЙЦУКЕН by physical key code, with А and О under the index fingers', () => {
    expect(ru.layout.KeyF.char).toBe('а');
    expect(ru.layout.KeyJ.char).toBe('о');
    expect(ru.codeOf['й']).toBe('KeyQ');
    expect(ru.codeOf['ё']).toBe('Backquote');
    expect(ru.codeOf['.']).toBe('Slash');
    expect(ru.codeOf[',']).toBe('Slash');
    expect(ru.needsShift[',']).toBe(true);
    expect(ru.needsShift['Ж']).toBe(true);
    expect(homeKeys(ru)).toEqual(['А', 'О']);
    expect(ru.alphabet).toHaveLength(33);
  });
  it('has only Russian, blocklist-clean words', () => {
    for (const w of ru.wordLists.common) {
      expect(w).toMatch(/^[а-яё]+$/);
      for (const b of ru.blockSubstrings) expect(w.includes(b), `${w} contains ${b}`).toBe(false);
    }
    expect(ru.wordLists.common.length).toBeGreaterThan(150);
  });
  it('speaks and shows in-level text in Russian, falling back to English', () => {
    expect(tr(ru, 'sayGo', 'Go!')).toBe('Вперёд!');
    expect(tr(ru, 'introNewKey', 'Level {n}: new key', { n: 5 })).toBe('Уровень 5: новая клавиша');
    expect(fingerName(ru, 'li')).toBe('левый указательный');
    expect(tr(ru, 'no-such-key', 'English fallback')).toBe('English fallback');
  });
});

describe('Russian campaign', () => {
  it('has 32 letter levels (33 letters) then 7 key groups, levels 1–4 pinned', () => {
    expect(camp.levels).toHaveLength(39);
    expect(camp.levels[0].newKeys).toEqual(['а', 'о', ' ']);
    expect(camp.levels.slice(0, 4).map((l) => l.templateId)).toEqual(['template.pulse-runner', 'template.platformer', 'template.tower-defence', 'template.racer']);
    expect(camp.levels[31].letters).toHaveLength(33);
    expect(camp.levels[32].keyGroup?.id).toBe('shift');
  });
  for (const tier of [1, 4, 7])
    for (const level of [1, 2, 3, 4])
      it(`pass bot completes Russian level ${level} at tier ${tier}`, () => {
        const r = run(level, tier, 'pass');
        expect(r.completed).toBe(true);
        expect(r.sim.state.bestStars).toBeGreaterThanOrEqual(1);
        expect(r.simulatedMs).toBeLessThanOrEqual(budgetFor(tier));
      });
  it('struggle bot does not complete Russian level 2', () => {
    expect(run(2, 4, 'struggle').completed).toBe(false);
  });
  it('real Russian words appear once their letters are known', () => {
    const r = run(20, 4, 'pass');
    const words = r.sim.state.prompt.text.split(' ');
    expect(words.some((w) => ru.wordLists.common.includes(w))).toBe(true);
  });
});
