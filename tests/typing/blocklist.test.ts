/**
 * Hashed blocklist: the mechanics (with made-up test words), that the shipped lists hold no readable words,
 * and that generated stage text never contains a blocked word or part.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { blockEntry, blockHash, blockSalt, isBlocked, parseBlocklist } from '@/typing/blocklist';
import { campaignFor, levelSetup, language } from '@/campaign/setup';
import { LevelSim } from '@/sim/level';
import { templateSim } from '@/sim/templates';
import { generateStageText, typeable } from '@/typing/text';
import { Rng } from '@/core/rng';

const SALT = blockSalt('lang.test');
const list = (...lines: string[]) => parseBlocklist(lines.join('\n'), SALT);

describe('hashed blocklist mechanics (made-up words)', () => {
  const b = list('# test list', blockEntry(SALT, 'zorp', false, 'test'), blockEntry(SALT, 'qux', true, 'test'));
  it('blocks whole words case-insensitively, but not longer words', () => {
    expect(isBlocked('zorp', b)).toBe(true);
    expect(isBlocked('ZoRp', b)).toBe(true);
    expect(isBlocked('zorps', b)).toBe(false);
    expect(isBlocked('zor', b)).toBe(false);
  });
  it('blocks a part anywhere inside a word', () => {
    expect(isBlocked('qux', b)).toBe(true);
    expect(isBlocked('aquxb', b)).toBe(true);
    expect(isBlocked('QUXa', b)).toBe(true);
    expect(isBlocked('qu-x', b)).toBe(false);
  });
  it('stores only hashes, salted per language', () => {
    const line = blockEntry(SALT, 'zorp', false);
    expect(line).not.toContain('zorp');
    expect(blockHash(SALT, 'zorp')).not.toBe(blockHash(blockSalt('lang.other'), 'zorp'));
    expect(blockEntry(SALT, 'qux', true)).toMatch(/^s 3 [A-Za-z0-9_-]{43}$/);
  });
  it('rejects malformed lines with their line number', () => {
    expect(() => list('w notahash')).toThrow(/line 1/);
    expect(() => list('# ok', 'x 1 2')).toThrow(/line 2/);
    expect(() => list('s 0 ' + blockHash(SALT, 'a'))).toThrow(/line 1/);
  });
});

describe('shipped blocklists', () => {
  const root = join(import.meta.dirname, '../../content/languages');
  for (const lang of readdirSync(root)) {
    const m = JSON.parse(readFileSync(join(root, lang, 'manifest.json'), 'utf8'));
    it(`${lang}: only hashes, no readable words`, () => {
      expect(m.blocklist).toMatch(/\.hashes$/);
      const text = readFileSync(join(root, lang, m.blocklist), 'utf8');
      const entries = text.split('\n').map((l) => l.replace(/#.*$/, '').trim()).filter(Boolean);
      expect(entries.length).toBeGreaterThan(10);
      for (const e of entries) expect(e).toMatch(/^(w [A-Za-z0-9_-]{43}|s \d+ [A-Za-z0-9_-]{43})$/);
      expect(() => parseBlocklist(text, blockSalt(m.id))).not.toThrow();
    });
  }
});

describe('generated text is blocklist-clean', () => {
  for (const langId of ['en', 'ru']) {
    it(`${langId}: every level, several seeds, all stages`, () => {
      const lang = language(langId);
      let tokens = 0;
      for (let seed = 0; seed < 6; seed++) {
        const camp = campaignFor(`clean-${seed}`, langId);
        for (let lv = 1; lv <= camp.levels.length; lv++) {
          const setup = levelSetup(camp, lv, { tier: 4 });
          const texts = [new LevelSim(setup, templateSim(setup.templateId)).state.prompt.text];
          for (let st = 0; st < 3; st++)
            texts.push(generateStageText(Rng.fromSeed(`${seed}:${lv}:${st}`), {
              letters: setup.letters, newKeys: setup.newKeys, weakKeys: [], groupChars: setup.groupChars ?? [], stageIndex: st, stageCount: 3, length: 80,
              words: (lang.wordLists.common ?? []).filter((w) => typeable(w, setup.letters)), specials: [], blocklist: lang.blocklist,
            }).text);
          for (const t of texts)
            for (const tok of t.split(/\s+/).filter(Boolean)) {
              tokens++;
              expect(isBlocked(tok, lang.blocklist)).toBe(false);
              // letters only (e.g. a capital in front, punctuation around): also clean
              const letters = tok.replace(/[^\p{L};]/gu, '');
              if (letters) expect(isBlocked(letters, lang.blocklist)).toBe(false);
            }
        }
      }
      expect(tokens).toBeGreaterThan(1000);
    });
  }
});
