/** Key-group levels 27–33 (docs/01 Key order): Shift, punctuation, digits, symbols, editing keys. */
import { describe, expect, it } from 'vitest';
import { campaignFor, language } from '@/campaign/setup';
import { groupCharsFor } from '@/campaign/campaign';
import { generateStageText } from '@/typing/text';
import { Rng } from '@/core/rng';
import { runLevel, SEED } from '../helpers/bot';
import { budgetFor } from '../../tools/bot/bot';

const camp = campaignFor(SEED);
const en = language('en');

describe('key-group campaign', () => {
  it('has 26 letter levels then one level per key group', () => {
    expect(camp.levels).toHaveLength(26 + en.keyGroups.length);
    expect(camp.levels.slice(0, 26).every((l) => !l.keyGroup && l.groupChars.length === 0)).toBe(true);
    expect(camp.levels.slice(26).map((l) => l.keyGroup?.id)).toEqual(en.keyGroups.map((g) => g.id));
  });

  it('Shift adds every capital; editing keys add their characters', () => {
    const shift = camp.levels[26];
    expect(shift.newKeys).toHaveLength(26);
    expect(shift.newKeys.every((c) => /^[A-Z]$/.test(c))).toBe(true);
    expect(camp.levels[32].newKeys).toEqual(['\b', '\n', '\t']);
    expect(groupCharsFor(['Shift'], en, ['f', 'j', ';'])).toEqual(['F', 'J']);
  });

  it('every key-group character has a physical key (Shift where needed)', () => {
    for (const l of camp.levels.slice(26))
      for (const c of l.newKeys) {
        expect(en.codeOf[c], JSON.stringify(c)).toBeTruthy();
        if (/[A-Z?!():"]/.test(c)) expect(en.needsShift[c]).toBe(true);
      }
  });
});

describe('key-group text', () => {
  const gen = (level: number, seed = 's') => {
    const l = camp.levels[level - 1];
    return generateStageText(Rng.fromSeed(seed), {
      letters: l.letters, newKeys: l.newKeys, weakKeys: [], stageIndex: 0, stageCount: 3, length: 400,
      words: [], specials: [], blockWords: en.blockWords, blockSubstrings: en.blockSubstrings, groupChars: l.groupChars,
    }).text;
  };
  it('uses the new group characters and only known characters', () => {
    for (let level = 27; level <= 33; level++) {
      const l = camp.levels[level - 1];
      const t = gen(level);
      expect(l.newKeys.some((c) => t.includes(c)), `level ${level}`).toBe(true);
      for (const ch of t) if (ch !== ' ') expect(l.letters.includes(ch), `level ${level}: ${JSON.stringify(ch)}`).toBe(true);
    }
  });
  it('capitalises chunks instead of mixing capitals into pseudo-words', () => {
    const chunks = gen(27).split(' ');
    for (const c of chunks) expect(/^.[^A-Z]*$/.test(c), c).toBe(true);
  });
  it('editing keys are chunks of their own', () => {
    const chunks = gen(33, 'edit').split(' ');
    for (const c of chunks) if (/[\b\n\t]/.test(c)) expect(c).toHaveLength(1);
  });
});

describe('key-group levels with bots', () => {
  for (const tier of [1, 4, 7])
    for (let level = 27; level <= 33; level++)
      it(`pass bot completes level ${level} at tier ${tier}`, () => {
        const { run } = runLevel(level, tier, 'pass');
        expect(run.completed).toBe(true);
        expect(run.sim.state.bestStars).toBeGreaterThanOrEqual(1);
        expect(run.simulatedMs).toBeLessThanOrEqual(budgetFor(tier));
      });
  for (const level of [27, 30, 33])
    it(`struggle bot does not complete level ${level}`, () => {
      expect(runLevel(level, 4, 'struggle').run.completed).toBe(false);
    });
});
