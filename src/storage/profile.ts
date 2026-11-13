/** Player profile and run segments (local only, docs/07). */
import { db } from './db';
import type { AvatarCustomization } from '@/avatar/procedural';
import { DEFAULT_CUSTOMIZATION } from '@/avatar/procedural';
import type { LogEvent } from '@/sim/types';
import type { Hash } from '@/core/hash';

export interface Settings {
  reducedMotion: boolean;
  musicVolume: number; // 0..1
  sfxVolume: number;
  voice: boolean;
  keyboard: 'auto' | 'always' | 'off';
  quality: 'auto' | number;
  textScale: number;
  dyslexicFont: boolean;
  highContrast: boolean;
  colorBlindPatterns: boolean;
  breakMinutes: number;
  showFps: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  reducedMotion: typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches,
  musicVolume: 0.35, sfxVolume: 0.6, voice: true, keyboard: 'auto', quality: 'auto', textScale: 1,
  dyslexicFont: false, highContrast: false, colorBlindPatterns: false, breakMinutes: 20, showFps: true,
};

export interface LevelResult {
  level: number;
  tier: number;
  stars: number;
  wpmP: number;
  accP: number;
  letters: number;
}

export interface Profile {
  schemaVersion: 1;
  profileId: string;
  name: string;
  avatar: { scale: string; customization: AvatarCustomization };
  tier: number;
  tierHistory: { level: number; from: number; to: number }[];
  starsByTier: Record<string, Record<string, number>>;
  results: LevelResult[];
  campaign: { language: string; seed: string; level: number };
  collected: string[];
  /** Word book: words whose pictures were revealed (docs/07 Word art). */
  wordBook?: Record<string, { golden: boolean; count: number; first: number }>;
  perKey: Record<string, [number, number, number]>;
  settings: Settings;
  createdAt: number;
}

/** One level played on one build: everything needed to replay it exactly (docs/05 Proof bundle). */
export interface Segment {
  key: string;
  build: Hash | string;
  campaignSeed: string;
  language: string;
  level: number;
  tier: number;
  targetStars: number;
  collected: string[];
  weakKeys: string[];
  log: LogEvent[];
  snapshots: Hash[];
  complete: boolean;
  stars: number;
  startedAt: number;
}

export const PROFILE_KEY = 'current';

export function newProfile(name: string, scale: string, tier: number, seed: string): Profile {
  return {
    schemaVersion: 1,
    profileId: seed,
    name,
    avatar: { scale, customization: { ...DEFAULT_CUSTOMIZATION } },
    tier,
    tierHistory: [],
    starsByTier: {},
    results: [],
    campaign: { language: 'en', seed, level: 1 },
    collected: [],
    perKey: {},
    settings: { ...DEFAULT_SETTINGS },
    createdAt: Date.now(),
  };
}

export const loadProfile = () => db.get<Profile>('profiles', PROFILE_KEY);
export const saveProfile = (p: Profile) => db.put('profiles', PROFILE_KEY, p);

export const segmentKey = (seed: string, level: number) => `${seed}:${String(level).padStart(3, '0')}`;
export const loadSegment = (key: string) => db.get<Segment>('segments', key);
export const saveSegment = (s: Segment) => db.put('segments', s.key, s);
export async function segmentsFor(seed: string): Promise<Segment[]> {
  const all = await db.all<Segment>('segments');
  return all.filter((s) => s.campaignSeed === seed).sort((a, b) => a.level - b.level);
}
export async function allSegments(): Promise<Segment[]> {
  return db.all<Segment>('segments');
}

/** New random campaign seed (only place a non-seeded random is allowed: seeds themselves). */
export function freshSeed(): string {
  const b = new Uint8Array(12);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
}

/** Weak keys from accumulated per-key stats (docs/01 Weakness detection). */
export function weakKeys(perKey: Record<string, [number, number, number]>): string[] {
  let n = 0, err = 0;
  const lats: number[] = [];
  for (const [, [kn, ke, kl]] of Object.entries(perKey)) {
    n += kn + ke;
    err += ke;
    if (kn) lats.push(kl / kn);
  }
  if (!n) return [];
  const meanErr = err / n;
  lats.sort((a, b) => a - b);
  const medLat = lats[Math.floor(lats.length / 2)] ?? 0;
  return Object.entries(perKey)
    .filter(([k, [kn, ke, kl]]) => k.trim() && kn + ke >= 20 && (ke / (kn + ke) > 2 * meanErr || (kn && kl / kn > 1.5 * medLat)))
    .map(([k]) => k)
    .sort();
}
