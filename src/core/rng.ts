/**
 * Seeded PRNG: sfc32 (docs/10 §2 rule 6). State is a plain [u32,u32,u32,u32] array
 * stored inside simulation state, so it serialises and snapshots with everything else.
 */
import { sha256Bytes } from './hash';

export type RngState = [number, number, number, number];

export function seedState(seed: string): RngState {
  const b = sha256Bytes(seed);
  const s: RngState = [0, 0, 0, 0];
  for (let i = 0; i < 4; i++) s[i] = ((b[i * 4] << 24) | (b[i * 4 + 1] << 16) | (b[i * 4 + 2] << 8) | b[i * 4 + 3]) >>> 0;
  if ((s[0] | s[1] | s[2] | s[3]) === 0) s[3] = 1;
  const r = new Rng(s);
  for (let i = 0; i < 12; i++) r.u32();
  return s;
}

/** Seed for a named sub-stream: sha256(parentSeed + ":" + name). */
export function forkSeed(parentSeed: string, name: string): string {
  return `${parentSeed}:${name}`;
}

export class Rng {
  constructor(public readonly s: RngState) {}

  static fromSeed(seed: string): Rng {
    return new Rng(seedState(seed));
  }

  u32(): number {
    const s = this.s;
    const t = (((s[0] + s[1]) >>> 0) + s[3]) >>> 0;
    s[3] = (s[3] + 1) >>> 0;
    s[0] = (s[1] ^ (s[1] >>> 9)) >>> 0;
    s[1] = (s[2] + (s[2] << 3)) >>> 0;
    s[2] = ((s[2] << 21) | (s[2] >>> 11)) >>> 0;
    s[2] = (s[2] + t) >>> 0;
    return t;
  }

  /** Unbiased integer in [0, n). */
  int(n: number): number {
    if (!Number.isSafeInteger(n) || n <= 0 || n > 0x100000000) throw new Error(`rng.int: bad bound ${n}`);
    const limit = 0x100000000 - (0x100000000 % n);
    let x: number;
    do x = this.u32();
    while (x >= limit);
    return x % n;
  }

  /** Integer in [lo, hi]. */
  range(lo: number, hi: number): number {
    return lo + this.int(hi - lo + 1);
  }

  /** true with probability permille/1000. */
  chance(permille: number): boolean {
    return this.int(1000) < permille;
  }

  pick<T>(items: readonly T[]): T {
    return items[this.int(items.length)];
  }

  /** Weighted pick; weights are non-negative integers. */
  weighted<T>(items: readonly T[], weights: readonly number[]): T {
    let total = 0;
    for (const w of weights) total += w;
    let r = this.int(total);
    for (let i = 0; i < items.length; i++) {
      r -= weights[i];
      if (r < 0) return items[i];
    }
    return items[items.length - 1];
  }

  shuffle<T>(items: T[]): T[] {
    for (let i = items.length - 1; i > 0; i--) {
      const j = this.int(i + 1);
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }
}
