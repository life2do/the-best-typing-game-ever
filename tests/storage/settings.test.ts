/** Settings migration (M2.7): saves from before the font choice keep their dyslexia font. */
import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, fontOf } from '@/storage/profile';

describe('settings', () => {
  it('maps the old dyslexicFont switch to the font choice', () => {
    expect(fontOf({ ...DEFAULT_SETTINGS, font: undefined, dyslexicFont: true })).toBe('dyslexic');
    expect(fontOf({ ...DEFAULT_SETTINGS, font: undefined, dyslexicFont: false })).toBe('legible');
    expect(fontOf({ ...DEFAULT_SETTINGS, font: 'system' })).toBe('system');
  });
  it('has defaults for the new settings', () => {
    expect(DEFAULT_SETTINGS).toMatchObject({ voiceVolume: 1, font: 'legible', sessionMinutes: 0 });
  });
});
