/** Typing metrics on plain integer state (docs/10 §4). */
import { abs, clamp, floorDiv, median } from '@/core/fixed';

export const INTERVAL_CAP_MIN_MS = 2000;

/**
 * Cap for one interval in active time and rhythm (docs/10 §4.3): max(2000 ms, 3 × the level's
 * target interval), so slow beginners' normal gaps count fully while long idle gaps do not.
 */
export function intervalCapMs(targetWpmP: number): number {
  return Math.max(INTERVAL_CAP_MIN_MS, 3 * floorDiv(12_000_000, Math.max(1, targetWpmP)));
}
export const RECENT_WINDOW = 30;
export const RHYTHM_WINDOW = 12;

export interface WindowMetrics {
  /** 1 = correct, 0 = error, last RECENT_WINDOW judged keys */
  recent: number[];
  /** capped intervals between consecutive correct keys, last RHYTHM_WINDOW */
  rhythm: number[];
  lastKeyT: number; // -1 = none
  lastCorrectT: number;
}

export interface StageMetrics {
  correct: number;
  errors: number;
  activeMs: number;
  lastKeyT: number;
  steadySamples: number[]; // steadiness after each correct key (permille)
  missed: number; // prompt positions with >=1 error
  posHadError: number; // 0/1 for current position
}

export function newWindow(): WindowMetrics {
  return { recent: [], rhythm: [], lastKeyT: -1, lastCorrectT: -1 };
}
export function newStageMetrics(): StageMetrics {
  return { correct: 0, errors: 0, activeMs: 0, lastKeyT: -1, steadySamples: [], missed: 0, posHadError: 0 };
}

export function steadiness(intervals: readonly number[]): number {
  if (intervals.length < 4) return 500;
  const m = median(intervals);
  if (m <= 0) return 0;
  let sum = 0;
  for (const i of intervals) sum += abs(i - m);
  const mad = floorDiv(sum, intervals.length);
  return clamp(1000 - floorDiv(1000 * mad, m), 0, 1000);
}

export function recordKey(w: WindowMetrics, s: StageMetrics, t: number, correct: boolean, capMs: number): void {
  w.recent.push(correct ? 1 : 0);
  if (w.recent.length > RECENT_WINDOW) w.recent.shift();
  if (s.lastKeyT >= 0) s.activeMs += Math.min(t - s.lastKeyT, capMs);
  s.lastKeyT = t;
  w.lastKeyT = t;
  if (correct) {
    s.correct++;
    if (w.lastCorrectT >= 0) {
      w.rhythm.push(Math.min(t - w.lastCorrectT, capMs));
      if (w.rhythm.length > RHYTHM_WINDOW) w.rhythm.shift();
    }
    w.lastCorrectT = t;
    s.steadySamples.push(steadiness(w.rhythm));
    if (s.posHadError) s.missed++;
    s.posHadError = 0;
  } else {
    s.errors++;
    s.posHadError = 1;
  }
}

/** WPM in permille units: (correct/5)/(activeMs/60000) × 1000. */
export function wpmP(correct: number, activeMs: number): number {
  if (activeMs <= 0) return 0;
  return floorDiv(correct * 12_000 * 1000, activeMs);
}
export function accP(correct: number, errors: number): number {
  const n = correct + errors;
  return n === 0 ? 1000 : floorDiv(correct * 1000, n);
}
export function recentAccP(w: WindowMetrics): number {
  if (w.recent.length === 0) return 1000;
  let c = 0;
  for (const r of w.recent) c += r;
  return floorDiv(c * 1000, w.recent.length);
}
