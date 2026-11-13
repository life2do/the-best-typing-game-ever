/**
 * Integer-only maths for simulation code (docs/10 §2).
 * Q16 fixed point: 1.0 === 65536. Ratios in permille: 1.0 === 1000.
 */
import sinTable from './tables/sin4096.json';

export const Q = 65536;
export const PERMILLE = 1000;

/** Floor division toward −∞. The only division allowed in simulation code. */
export function floorDiv(a: number, b: number): number {
  if (b === 0) throw new Error('floorDiv by zero');
  const q = (a - mod(a, b)) / b;
  return q === 0 ? 0 : q; // avoid -0
}

/** Mathematical modulo (result has the sign of b). */
export function mod(a: number, b: number): number {
  const r = a % b;
  const m = r !== 0 && (r < 0) !== (b < 0) ? r + b : r;
  return m === 0 ? 0 : m;
}

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export function abs(v: number): number {
  return v < 0 ? -v : v;
}

/** Integer square root (floor), Newton's method. */
export function isqrt(n: number): number {
  if (n < 0) throw new Error('isqrt of negative');
  if (n < 2) return n;
  let x = n;
  let y = floorDiv(x + 1, 2);
  while (y < x) {
    x = y;
    y = floorDiv(x + floorDiv(n, x), 2);
  }
  return x;
}

const SIN = sinTable as number[];
/** Angle units: 4096 per full turn. Returns Q16. */
export function isin(angle: number): number {
  return SIN[mod(angle, 4096)];
}
export function icos(angle: number): number {
  return SIN[mod(angle + 1024, 4096)];
}

/** Lower median of an integer array (does not mutate). */
export function median(values: readonly number[]): number {
  if (values.length === 0) return 0;
  const s = values.slice().sort((a, b) => a - b);
  return s[floorDiv(s.length - 1, 2)];
}

/** a * b / c with floor, for permille/Q16 scaling. */
export function mulDiv(a: number, b: number, c: number): number {
  return floorDiv(a * b, c);
}
