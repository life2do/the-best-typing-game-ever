/** Player profile and run segments (local only, docs/07). */
import { db } from './db';
import type { AvatarCustomization } from '@/avatar/procedural';
import { DEFAULT_CUSTOMIZATION } from '@/avatar/procedural';
import type { LogEvent } from '@/sim/types';
import type { Hash } from '@/core/hash';
import type { LevelPlan } from '@/campaign/campaign';

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
  /** length of the stretch break */
  breakSeconds: number;
  showFps: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  reducedMotion: typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches,
  musicVolume: 0.35, sfxVolume: 0.6, voice: true, keyboard: 'auto', quality: 'auto', textScale: 1,
  dyslexicFont: false, highContrast: false, colorBlindPatterns: false, breakMinutes: 20, breakSeconds: 120, showFps: true,
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
  /** 1 = M1 (single profile stored under the key "current"); 2 = several profiles keyed by profileId. */
  schemaVersion: 1 | 2;
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
  /** Level at which a fix-it drill was last offered (offered at most once per level). */
  drillOfferedAt?: number;
  perKey: Record<string, [number, number, number]>;
  settings: Settings;
  createdAt: number;
  /** Optional 4-digit colour/shape PIN, stored as a salted hash (a lock against siblings, not security; docs/07). */
  pinHash?: string;
  /** Seeds of this profile's earlier campaigns ("New run"), so export includes their segments. */
  pastSeeds?: string[];
  /** Last time this profile was played (orders the profile picker). */
  lastPlayed?: number;
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
  /** The level plan (template, letters, look) this segment was played with; absent in M1 segments. */
  plan?: LevelPlan;
}

/** M1 stored its single profile under this key; migrateProfiles() moves it to its profileId. */
export const LEGACY_PROFILE_KEY = 'current';
const CURRENT_KEY = 'currentProfile';

export function newProfile(name: string, scale: string, tier: number, seed: string, language = 'en'): Profile {
  return {
    schemaVersion: 2,
    profileId: seed,
    name,
    avatar: { scale, customization: { ...DEFAULT_CUSTOMIZATION } },
    tier,
    tierHistory: [],
    starsByTier: {},
    results: [],
    campaign: { language, seed, level: 1 },
    collected: [],
    perKey: {},
    settings: { ...DEFAULT_SETTINGS },
    createdAt: Date.now(),
  };
}

/** Move an M1 save (one profile under "current") to the multi-profile layout. Idempotent. */
export async function migrateProfiles(): Promise<void> {
  const legacy = await db.get<Profile>('profiles', LEGACY_PROFILE_KEY);
  if (!legacy) return;
  const p: Profile = { ...legacy, schemaVersion: 2 };
  await db.put('profiles', p.profileId, p);
  await db.put('settings', CURRENT_KEY, p.profileId);
  await db.del('profiles', LEGACY_PROFILE_KEY);
}

/** All profiles, most recently played first. */
export async function listProfiles(): Promise<Profile[]> {
  const all = (await db.all<Profile>('profiles')).filter((p) => p && p.profileId);
  return all.sort((a, b) => (b.lastPlayed ?? b.createdAt) - (a.lastPlayed ?? a.createdAt));
}

export const currentProfileId = () => db.get<string>('settings', CURRENT_KEY);
export const loadProfileById = (id: string) => db.get<Profile>('profiles', id);

/** The profile that was played last, if any. */
export async function loadProfile(): Promise<Profile | undefined> {
  const id = await currentProfileId();
  return id ? loadProfileById(id) : undefined;
}

export async function saveProfile(p: Profile): Promise<void> {
  p.schemaVersion = 2;
  await db.put('profiles', p.profileId, p);
  await db.put('settings', CURRENT_KEY, p.profileId);
}

/** Seeds of every campaign this profile has played. */
export const profileSeeds = (p: Profile) => [...new Set([p.campaign.seed, ...(p.pastSeeds ?? [])])];

/** Delete a profile and all its run segments. */
export async function deleteProfile(p: Profile): Promise<void> {
  const seeds = profileSeeds(p);
  for (const s of await db.all<Segment>('segments')) if (seeds.includes(s.campaignSeed)) await db.del('segments', s.key);
  await db.del('profiles', p.profileId);
  if ((await currentProfileId()) === p.profileId) await db.del('settings', CURRENT_KEY);
}

/** Start a new campaign ("New run") for an existing profile: new seed, level 1; stats and collections stay. */
export function startNewRun(p: Profile, seed: string, tier: number, language = p.campaign.language): Profile {
  return { ...p, pastSeeds: profileSeeds(p), campaign: { language, seed, level: 1 }, tier, drillOfferedAt: undefined };
}

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
