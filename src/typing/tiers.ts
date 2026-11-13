/** Proficiency tiers, per-level targets and star rules (docs/01, docs/10 §4.5). Integer maths only. */
import { clamp, floorDiv } from '@/core/fixed';

export const TIER_WPM = [5, 10, 18, 28, 40, 60, 75] as const;
export const TIER_ACC = [850, 880, 900, 920, 950, 960, 970] as const; // permille
export const SUPER_SPEED_WPM_P = 70_000; // WPM in permille units
export const STEADY_FOR_3_STARS = 700;

export function tierWpmP(tier: number): number {
  return TIER_WPM[clamp(tier, 1, 7) - 1] * 1000;
}
export function tierAcc(tier: number): number {
  return TIER_ACC[clamp(tier, 1, 7) - 1];
}

/**
 * Target speed for a level, in WPM-permille (1 WPM = 1000).
 * target = tierWpm × clamp(0.5 + 0.5 × lettersKnown/12, 0.5, 1) × reach(newKeys)
 */
export function levelTargetWpmP(tier: number, lettersKnown: number, newKeysOffHomeRow: boolean): number {
  const scale = clamp(500 + floorDiv(500 * lettersKnown, 12), 500, 1000);
  const reach = newKeysOffHomeRow ? 900 : 1000;
  return floorDiv(tierWpmP(tier) * scale * reach, 1_000_000);
}

export interface StageMeasure {
  wpmP: number;
  accP: number;
  steadyP: number; // median steadiness over the stage
}

export function starsFor(m: StageMeasure, targetWpmP: number, tier: number): 0 | 1 | 2 | 3 {
  if (m.accP < tierAcc(tier) || m.wpmP < targetWpmP) return 0;
  if (m.wpmP >= floorDiv(targetWpmP * 14, 10) && m.steadyP >= STEADY_FOR_3_STARS) return 3;
  if (m.wpmP >= floorDiv(targetWpmP * 12, 10)) return 2;
  return 1;
}
