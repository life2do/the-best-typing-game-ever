/**
 * Local analytics for one player (docs/07 Local analytics screen). Everything is derived by replaying the
 * player's saved run segments, so the numbers always match the stored runs (and the profile export).
 */
import { campaignFor } from '@/campaign/setup';
import type { Campaign } from '@/campaign/campaign';
import { planOf, simFor } from '@/app/replay';
import { profileSeeds, type Profile, type Segment } from '@/storage/profile';

export interface LevelStat {
  /** order played (0 = first) */
  n: number;
  level: number;
  language: string;
  tier: number;
  newKeys: string;
  complete: boolean;
  stars: number;
  /** best final-stage result, in permille units (WPM × 1000, accuracy ‰, steadiness ‰) */
  wpmP: number;
  accP: number;
  steadyP: number;
  activeMs: number;
  startedAt: number;
}

export interface KeyStat {
  key: string;
  n: number;
  errors: number;
  /** error rate in permille */
  errP: number;
  /** mean latency in ms */
  latencyMs: number;
}

export interface PlayerStats {
  levels: LevelStat[];
  keys: KeyStat[];
  /** active typing time across all segments (pauses excluded) */
  timeMs: number;
  totalStars: number;
  starsByTier: { tier: number; stars: number }[];
  tierHistory: Profile['tierHistory'];
  words: number;
  goldenWords: number;
  abilities: string[];
  bestWpmP: number;
}

export function computeStats(profile: Profile, segments: Segment[]): PlayerStats {
  const seeds = profileSeeds(profile);
  const mine = segments.filter((s) => seeds.includes(s.campaignSeed)).sort((a, b) => a.startedAt - b.startedAt || a.level - b.level);
  const camps = new Map<string, Campaign>();
  const levels: LevelStat[] = [];
  const keys = new Map<string, [number, number, number]>();
  let timeMs = 0;
  for (const seg of mine) {
    const ck = `${seg.campaignSeed}|${seg.language}`;
    if (!camps.has(ck)) camps.set(ck, campaignFor(seg.campaignSeed, seg.language));
    const camp = camps.get(ck)!;
    const plan = planOf(camp, seg);
    if (!plan) continue;
    const sim = simFor(camp, seg);
    for (const e of seg.log) sim.feed(e);
    const s = sim.state;
    const lastT = seg.log.length ? seg.log[seg.log.length - 1].t : 0;
    const active = Math.max(0, lastT - s.pausedMs);
    timeMs += active;
    for (const [k, [n, e, lat]] of Object.entries(s.perKey)) {
      const acc = keys.get(k) ?? [0, 0, 0];
      keys.set(k, [acc[0] + n, acc[1] + e, acc[2] + lat]);
    }
    const last = sim.setup.stageLengths.length - 1;
    const finals = s.results.filter((r) => r.stage === last);
    const best = (finals.length ? finals : s.results).slice().sort((a, b) => b.stars - a.stars || b.wpmP - a.wpmP)[0];
    levels.push({
      n: levels.length, level: seg.level, language: seg.language, tier: seg.tier,
      newKeys: plan.newKeys.filter((k) => k !== ' ').join('').toUpperCase(),
      complete: s.phase === 'done' || seg.complete, stars: s.bestStars,
      wpmP: best?.wpmP ?? 0, accP: best?.accP ?? 0, steadyP: best?.steadyP ?? 0, activeMs: active, startedAt: seg.startedAt,
    });
  }
  const keyStats: KeyStat[] = [...keys.entries()]
    .filter(([k]) => k !== ' ')
    .map(([key, [n, errors, lat]]) => ({ key, n, errors, errP: n + errors ? Math.round((errors * 1000) / (n + errors)) : 0, latencyMs: n ? Math.round(lat / n) : 0 }))
    .sort((a, b) => (a.key < b.key ? -1 : 1));
  const starsByTier = Object.entries(profile.starsByTier ?? {})
    .map(([tier, lv]) => ({ tier: Number(tier), stars: Object.values(lv).reduce((a, b) => a + b, 0) }))
    .sort((a, b) => a.tier - b.tier);
  const book = Object.values(profile.wordBook ?? {});
  return {
    levels,
    keys: keyStats,
    timeMs,
    totalStars: starsByTier.reduce((a, b) => a + b.stars, 0),
    starsByTier,
    tierHistory: profile.tierHistory ?? [],
    words: book.length,
    goldenWords: book.filter((w) => w.golden).length,
    abilities: [...(profile.collected ?? [])].sort(),
    bestWpmP: levels.filter((l) => l.complete).reduce((m, l) => Math.max(m, l.wpmP), 0),
  };
}
