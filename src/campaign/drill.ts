/**
 * Fix-it drill (docs/01 Weakness detection, D9): a one-minute, single-stage pulse-runner run that
 * drills one weak key mixed with the keys the player already knows. It is practice: it never changes
 * campaign progress and isn't saved as a run segment; only its per-key stats are added to the profile,
 * so a key that got better stops being "weak".
 */
import type { LevelSetup } from '@/sim/types';
import { TIER_WPM } from '@/typing/tiers';
import { adHocSetup } from './setup';

export const DRILL_TEMPLATE = 'template.pulse-runner';

/** Characters in a drill: about one minute of typing at the tier's target speed (5 characters per word). */
export function drillLength(tier: number): number {
  const wpm = TIER_WPM[Math.min(7, Math.max(1, tier)) - 1];
  return Math.min(200, Math.max(20, wpm * 5));
}

/**
 * The weakest key among `letters`: the highest error rate among the weak keys (ties: slower, then
 * alphabetical). Null when no key is weak.
 */
export function weakestKey(perKey: Record<string, [number, number, number]>, weak: string[], letters: string[]): string | null {
  const rate = (k: string) => {
    const [n, e] = perKey[k] ?? [0, 0, 0];
    return n + e ? e / (n + e) : 0;
  };
  const lat = (k: string) => {
    const [n, , l] = perKey[k] ?? [0, 0, 0];
    return n ? l / n : 0;
  };
  const cands = weak.filter((k) => letters.includes(k));
  cands.sort((a, b) => rate(b) - rate(a) || lat(b) - lat(a) || (a < b ? -1 : 1));
  return cands[0] ?? null;
}

/**
 * Setup for a drill of `key` within `letters`. The weak key takes the "new key" share of the text
 * (40% in a one-stage level) and is weighted up among the rest; a single stage that ends at the
 * crossroads whatever the stars (target 0★).
 */
export function drillSetup(campaignSeed: string, level: number, letters: string[], key: string, tier: number, collected: string[] = []): LevelSetup {
  const ls = [...new Set([...letters.filter((c) => c !== ' '), key])];
  const setup = adHocSetup(`${campaignSeed}:drill:${level}:${key}`, DRILL_TEMPLATE, ls, { tier, targetStars: 0, weakKeys: [key], collected });
  return { ...setup, levelIndex: level, newKeys: [key], stageLengths: [drillLength(tier)] };
}
