import { describe, expect, it } from 'vitest';
import { Rng } from '@/core/rng';
import { floorDiv, mod, isqrt, isin, icos, median, clamp } from '@/core/fixed';

describe('Rng', () => {
  it('is deterministic per seed and differs across seeds', () => {
    const a = Rng.fromSeed('x'), b = Rng.fromSeed('x'), c = Rng.fromSeed('y');
    const sa = Array.from({ length: 20 }, () => a.u32());
    expect(Array.from({ length: 20 }, () => b.u32())).toEqual(sa);
    expect(Array.from({ length: 20 }, () => c.u32())).not.toEqual(sa);
  });
  it('pins the first outputs (golden values guard against accidental algorithm changes)', () => {
    const r = Rng.fromSeed('golden');
    const first = [r.u32(), r.u32(), r.u32()];
    expect(first.every((n) => Number.isInteger(n) && n >= 0 && n < 2 ** 32)).toBe(true);
    expect(first).toMatchSnapshot();
  });
  it('int() is in range and roughly uniform', () => {
    const r = Rng.fromSeed('u');
    const counts = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 60000; i++) counts[r.int(6)]++;
    for (const c of counts) expect(Math.abs(c - 10000)).toBeLessThan(500);
  });
  it('state is plain data and resumable', () => {
    const r = Rng.fromSeed('s');
    r.u32();
    const copy = new Rng([...r.s] as typeof r.s);
    expect(copy.u32()).toBe(r.u32());
  });
});

describe('fixed', () => {
  it('floorDiv floors toward -inf and never returns -0', () => {
    expect(floorDiv(7, 2)).toBe(3);
    expect(floorDiv(-7, 2)).toBe(-4);
    expect(floorDiv(7, -2)).toBe(-4);
    expect(Object.is(floorDiv(0, -5), 0)).toBe(true);
    expect(floorDiv(-1, 3)).toBe(-1);
  });
  it('mod', () => {
    expect(mod(-1, 4096)).toBe(4095);
    expect(mod(5, 3)).toBe(2);
  });
  it('isqrt', () => {
    for (const n of [0, 1, 2, 3, 4, 15, 16, 17, 1e12, 2 ** 52]) expect(isqrt(n) ** 2 <= n && (isqrt(n) + 1) ** 2 > n).toBe(true);
  });
  it('sin table', () => {
    expect(isin(0)).toBe(0);
    expect(isin(1024)).toBe(65536);
    expect(icos(0)).toBe(65536);
    expect(isin(3072)).toBe(-65536);
  });
  it('median/clamp', () => {
    expect(median([5, 1, 3, 2])).toBe(2);
    expect(median([5, 1, 3])).toBe(3);
    expect(clamp(5, 0, 3)).toBe(3);
  });
});
