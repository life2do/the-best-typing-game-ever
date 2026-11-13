/** Word art: which real word is being typed and how far (drives the background illustration reveal). */
import { describe, expect, it } from 'vitest';
import { LevelSim } from '@/sim/level';
import { adHocSetup } from '@/campaign/setup';
import { templateSim } from '@/sim/templates';
import { currentWord } from '@/ui/wordArt';
import { illustrations, illustrationFor } from '@/content/registry';

describe('word art', () => {
  it('has an SVG for every illustration', () => {
    expect(illustrations.length).toBeGreaterThanOrEqual(60);
    for (const i of illustrations) expect(i.svg).toContain('viewBox="0 0 100 100"');
    expect(illustrationFor('cat', 'en')?.id).toBe('illustration.cat');
  });

  it('tracks typing progress through real words and ignores letter patterns', () => {
    const setup = adHocSetup('wa', 'template.pulse-runner', 'fjdkslaeirc'.split(''), { tier: 4 });
    const sim = new LevelSim(setup, templateSim(setup.templateId));
    let t = 1000;
    sim.feed({ k: 'key', t: (t += 200), code: 'KeyF' });
    sim.feed({ k: 'key', t: (t += 200), code: 'KeyJ' });
    const seen: { word: string; typed: number }[] = [];
    for (let n = 0; n < 60; n++) {
      const cw = currentWord(sim);
      if (cw) seen.push({ word: cw.word, typed: cw.typed });
      const ch = sim.expectedChars()[0];
      sim.feed({ k: 'key', t: (t += 200), code: setup.language.codeOf[ch] });
    }
    expect(seen.length).toBeGreaterThan(0);
    const words = setup.language.wordLists.common;
    for (const s of seen) {
      expect(words.includes(s.word) || setup.abilities.some((a) => a.triggerWords.en?.includes(s.word))).toBe(true);
      expect(s.typed).toBeGreaterThanOrEqual(0);
      expect(s.typed).toBeLessThanOrEqual(s.word.length);
    }
    // Some word was typed all the way through.
    expect(seen.some((s) => s.typed === s.word.length)).toBe(true);
  });
});
