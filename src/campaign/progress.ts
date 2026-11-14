/**
 * Crediting a finished level to a profile (shared by solo play and hot-seat parties, docs/06 Results):
 * stars, the level result, per-key stats, collected abilities and automatic tier promotion (docs/01).
 */
import type { Profile } from '@/storage/profile';
import type { SimState } from '@/sim/types';
import { levelTargetWpmP, tierAcc } from '@/typing/tiers';

export interface LevelCredit {
  /** level number recorded in results and the tier history */
  level: number;
  /** key in starsByTier[tier] (the campaign level, or a party round key) */
  starsKey: string;
  tier: number;
  letters: number;
  lastStage: number;
  state: Pick<SimState, 'bestStars' | 'results' | 'perKey' | 'collected'>;
  /** campaign level to continue from, if this level advances the player's own campaign */
  advanceTo?: number;
}

/** Applies the level to `p`; returns the promotion, if the player grew into the next tier. */
export function creditLevel(p: Profile, c: LevelCredit): { from: number; to: number } | null {
  const s = c.state;
  const tierKey = String(c.tier);
  p.starsByTier[tierKey] ??= {};
  p.starsByTier[tierKey][c.starsKey] = Math.max(p.starsByTier[tierKey][c.starsKey] ?? 0, s.bestStars);
  const best = s.results.filter((r) => r.stage === c.lastStage).sort((a, b) => b.stars - a.stars || b.wpmP - a.wpmP)[0];
  if (best) p.results.push({ level: c.level, tier: c.tier, stars: best.stars, wpmP: best.wpmP, accP: best.accP, letters: c.letters });
  for (const [k, v] of Object.entries(s.perKey)) {
    const acc = (p.perKey[k] ??= [0, 0, 0]);
    acc[0] += v[0];
    acc[1] += v[1];
    acc[2] += v[2];
  }
  p.collected = [...new Set([...p.collected, ...s.collected])];
  const promoted = maybePromote(p, c.level);
  if (c.advanceTo !== undefined) p.campaign.level = c.advanceTo;
  return promoted;
}

/** Automatic promotion: >= 2 stars at the next tier's 1-star target for 2 levels in a row (docs/01). */
export function maybePromote(p: Profile, level: number): { from: number; to: number } | null {
  if (p.tier >= 7) return null;
  const next = p.tier + 1;
  const last2 = p.results.slice(-2);
  if (last2.length < 2) return null;
  const ok = last2.every((r) => r.accP >= tierAcc(next) && r.wpmP >= Math.floor((levelTargetWpmP(next, r.letters, false) * 12) / 10));
  if (!ok) return null;
  const from = p.tier;
  p.tierHistory.push({ level, from, to: next });
  p.tier = next;
  return { from, to: next };
}
