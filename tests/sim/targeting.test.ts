/** Targeting input: a target's letters aim, Space confirms (docs/02 Input styles). */
import { describe, expect, it } from 'vitest';
import { LevelSim } from '@/sim/level';
import { adHocSetup } from '@/campaign/setup';
import { templateSim } from '@/sim/templates';

describe('targeting confirmation with Space', () => {
  it('a target completes only after Space', () => {
    const setup = adHocSetup('tgt', 'template.tower-defence', 'fjdk'.split(''), { tier: 4 });
    const sim = new LevelSim(setup, templateSim(setup.templateId));
    let t = 1000;
    const key = (code: string) => sim.feed({ k: 'key', t: (t += 300), code });
    key('KeyF');
    key('KeyJ');
    expect(sim.state.phase).toBe('play');
    const target = sim.state.targets[0];
    expect(target.text.endsWith(' ')).toBe(true);
    const letters = target.text.trimEnd();
    expect(sim.expectedChars()).not.toContain(' '); // Space never starts a target
    for (const ch of letters) key(setup.language.codeOf[ch]);
    expect(sim.state.targets.some((x) => x.id === target.id)).toBe(true); // aimed, not yet frozen
    expect(sim.expectedChars()).toEqual([' ']);
    key('Space');
    expect(sim.state.targets.some((x) => x.id === target.id)).toBe(false);
    expect(sim.state.lockedTarget).toBe(-1);
  });
});
