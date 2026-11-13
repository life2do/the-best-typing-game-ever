/**
 * Timing plausibility check (docs/05 Known limitation): flags obviously robotic runs as "suspicious".
 * A hint only — a clever bot can always pass.
 */
import { abs, floorDiv, median } from '@/core/fixed';
import type { LogEvent } from '@/sim/types';

export interface TimingVerdict {
  suspicious: boolean;
  reasons: string[];
  keys: number;
  medianMs: number;
  spreadP: number; // median absolute deviation / median, permille
}

export function timingCheck(log: readonly LogEvent[]): TimingVerdict {
  const ts = log.filter((e) => e.k === 'key').map((e) => e.t);
  const iv: number[] = [];
  for (let i = 1; i < ts.length; i++) {
    const d = ts[i] - ts[i - 1];
    if (d > 0 && d < 2000) iv.push(d);
  }
  const m = median(iv);
  // Median absolute deviation: robust against a few long pauses (intro, crossroads).
  const mad = median(iv.map((d) => abs(d - m)));
  const spreadP = iv.length && m ? floorDiv(mad * 1000, m) : 1000;
  const reasons: string[] = [];
  if (iv.length >= 50 && spreadP < 20) reasons.push('keystroke timing is almost perfectly regular');
  if (iv.length >= 50 && m > 0 && m < 35) reasons.push('keystrokes faster than humanly plausible');
  return { suspicious: reasons.length > 0, reasons, keys: ts.length, medianMs: m, spreadP };
}
