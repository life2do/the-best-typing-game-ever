import { describe, expect, it } from 'vitest';
import { abilities, voiceEffects } from '@/content/registry';
import { NORMAL_VOICE, activeVoiceEffect, effectOfAbility, unlockedVoiceEffects } from '@/audio/voiceEffects';
import { adHocSetup } from '@/campaign/setup';
import { templateSim } from '@/sim/templates';
import { runBot } from '../../tools/bot/bot';

describe('collectible voice effects (M2.8)', () => {
  it('every voice effect is unlocked by a collectible ability, and "voice" unlocks the chipmunk', () => {
    expect(voiceEffects.length).toBeGreaterThanOrEqual(4);
    for (const v of voiceEffects) {
      const ab = abilities.find((a) => a.voiceEffect?.split('@')[0] === v.id);
      expect(ab?.type, v.id).toBe('collectible');
      expect(v.icon.length).toBeGreaterThan(0);
      expect(v.name.en && v.name.ru).toBeTruthy();
    }
    const chip = abilities.find((a) => a.triggerWords.en?.includes('voice'));
    expect(effectOfAbility(chip!.id)?.id).toBe('voice.chipmunk');
    expect(effectOfAbility('ability.jump')).toBeUndefined();
  });

  it('only collected effects are offered, named in the player language', () => {
    expect(unlockedVoiceEffects([])).toEqual([]);
    expect(unlockedVoiceEffects(['ability.jump'])).toEqual([]);
    const got = unlockedVoiceEffects(['ability.voice-giant', 'ability.jump', 'ability.voice-chipmunk'], 'ru');
    expect(got.map((e) => e.id)).toEqual(['voice.chipmunk', 'voice.giant']);
    expect(got[0].name).toBe('Бурундук');
    expect(got[0]).toMatchObject({ pitch: 2, rate: 1.3 });
  });

  it('the chosen effect applies only while it is collected; otherwise the normal voice', () => {
    expect(activeVoiceEffect(undefined, ['ability.voice-giant'])).toBe(NORMAL_VOICE);
    expect(activeVoiceEffect('voice.giant', ['ability.voice-giant'])).toMatchObject({ id: 'voice.giant', pitch: 0.3, rate: 0.8 });
    expect(activeVoiceEffect('voice.giant', [])).toBe(NORMAL_VOICE); // e.g. an edited export
    expect(activeVoiceEffect('voice.nope', ['ability.voice-giant'])).toBe(NORMAL_VOICE);
  });

  it('typing a trigger word quickly in a level collects its voice ability', () => {
    // Letters for "robot" and "voice"; look for a seed whose level text offers a voice word.
    const letters = 'fjdkslarobtvice'.split('');
    let found = false;
    for (let i = 0; i < 40 && !found; i++) {
      const setup = adHocSetup(`voice-${i}`, 'template.pulse-runner', letters, { tier: 4 });
      const run = runBot(setup, templateSim(setup.templateId), { profile: 'pass', botSeed: `voice-${i}`, fastForward: true });
      const got = run.sim.state.collected.filter((id) => effectOfAbility(id));
      if (got.length) {
        found = true;
        expect(unlockedVoiceEffects(got).length).toBe(got.length);
      }
    }
    expect(found).toBe(true);
  });
});
