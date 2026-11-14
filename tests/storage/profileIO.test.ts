/** Profile PIN + export/import (src/storage/profileIO.ts). */
import { describe, expect, it } from 'vitest';
import { buildExport, checkPin, parseImport, pinHash, PIN_DIGITS } from '@/storage/profileIO';
import { newProfile, startNewRun, type Segment } from '@/storage/profile';

const seg = (seed: string, level: number): Segment => ({
  key: `${seed}:${level}`, build: 'b', campaignSeed: seed, language: 'en', level, tier: 2, targetStars: 1,
  collected: [], weakKeys: [], log: [{ k: 'key', t: 10, code: 'KeyF' }], snapshots: [], complete: false, stars: 0, startedAt: 0,
});

describe('PIN', () => {
  it('has 10 unique colour + shape digits', () => {
    expect(new Set(PIN_DIGITS.map((d) => d.color)).size).toBe(10);
    expect(new Set(PIN_DIGITS.map((d) => d.shape)).size).toBe(10);
  });
  it('is salted per profile and checked', () => {
    const a = newProfile('Mia', 'scale.flowers', 2, 'seed-a');
    const b = newProfile('Leo', 'scale.flowers', 2, 'seed-b');
    expect(pinHash(a.profileId, '1234')).not.toBe(pinHash(b.profileId, '1234'));
    expect(checkPin(a, '0000')).toBe(true); // no PIN set
    a.pinHash = pinHash(a.profileId, '1234');
    expect(checkPin(a, '1234')).toBe(true);
    expect(checkPin(a, '4321')).toBe(false);
    expect(() => pinHash(a.profileId, '12')).toThrow();
  });
});

describe('export / import', () => {
  it('round-trips a profile with the segments of all its campaigns', () => {
    let p = newProfile('Mia', 'scale.flowers', 2, 'seed-a');
    p = startNewRun(p, 'seed-b', 3);
    expect(p.campaign).toMatchObject({ seed: 'seed-b', level: 1 });
    expect(p.pastSeeds).toContain('seed-a');
    const text = JSON.stringify(buildExport(p, [seg('seed-a', 1), seg('seed-b', 1), seg('other', 1)], 'build', 1));
    const back = parseImport(text);
    expect(back.profile.profileId).toBe(p.profileId);
    expect(back.segments.map((s) => s.key).sort()).toEqual(['seed-a:1', 'seed-b:1']); // foreign segment dropped
  });
  it('rejects files that are not profile exports', () => {
    expect(() => parseImport('not json')).toThrow(/not a profile export/);
    expect(() => parseImport(JSON.stringify({ format: 'tbtge-run/1' }))).toThrow(/not a profile export/);
    expect(() => parseImport(JSON.stringify({ format: 'tbtge-profile/1', profile: { name: 'x' } }))).toThrow(/incomplete/);
  });
});
