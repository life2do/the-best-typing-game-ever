/**
 * Profile PIN and export/import (docs/07 Profiles). Pure functions, no storage access, so they can be
 * unit-tested in Node.
 */
import { hashBytes } from '@/core/hash';
import type { Profile, Segment } from './profile';

export const PROFILE_FORMAT = 'tbtge-profile/1';

/** PIN digits are 0–9; each has a unique colour and shape for children who can't read numbers yet. */
export const PIN_LENGTH = 4;
export const PIN_DIGITS: { digit: number; color: string; shape: string; name: string }[] = [
  { digit: 0, color: '#f1f3f5', shape: '●', name: 'white circle' },
  { digit: 1, color: '#e03131', shape: '■', name: 'red square' },
  { digit: 2, color: '#f76707', shape: '▲', name: 'orange triangle' },
  { digit: 3, color: '#fcc419', shape: '◆', name: 'yellow diamond' },
  { digit: 4, color: '#37b24d', shape: '★', name: 'green star' },
  { digit: 5, color: '#1c7ed6', shape: '⬟', name: 'blue pentagon' },
  { digit: 6, color: '#9c36b5', shape: '♥', name: 'purple heart' },
  { digit: 7, color: '#8d5524', shape: '☾', name: 'brown moon' },
  { digit: 8, color: '#212529', shape: '✚', name: 'black cross' },
  { digit: 9, color: '#f783ac', shape: '⬢', name: 'pink hexagon' },
];

/** Salted with the profile id, so the same PIN gives different hashes on different profiles. */
export function pinHash(profileId: string, pin: string): string {
  if (!new RegExp(`^\\d{${PIN_LENGTH}}$`).test(pin)) throw new Error('PIN must be 4 digits');
  return hashBytes(`tbtge-pin:${profileId}:${pin}`);
}

export const checkPin = (p: Profile, pin: string) => !p.pinHash || p.pinHash === pinHash(p.profileId, pin);

export interface ProfileExport {
  format: typeof PROFILE_FORMAT;
  exportedAt: number;
  build: string;
  profile: Profile;
  segments: Segment[];
}

export function buildExport(profile: Profile, segments: Segment[], build: string, now: number): ProfileExport {
  return { format: PROFILE_FORMAT, exportedAt: now, build, profile, segments };
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/**
 * Parse and check an exported profile. Throws with a readable message on anything that isn't a profile
 * export; keeps only segments that belong to the profile's campaigns.
 */
export function parseImport(text: string): { profile: Profile; segments: Segment[] } {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('This file is not a profile export (not JSON).');
  }
  if (!isObj(data) || data.format !== PROFILE_FORMAT) throw new Error('This file is not a profile export.');
  const p = data.profile;
  if (!isObj(p) || typeof p.profileId !== 'string' || !p.profileId || !isObj(p.campaign) || typeof p.campaign.seed !== 'string')
    throw new Error('The profile in this file is incomplete.');
  if (typeof p.name !== 'string' || p.name.length > 64) throw new Error('The profile name in this file is invalid.');
  const profile = { ...(p as unknown as Profile), schemaVersion: 2 as const };
  const seeds = new Set([profile.campaign.seed, ...(Array.isArray(profile.pastSeeds) ? profile.pastSeeds : [])]);
  const segs = Array.isArray(data.segments) ? data.segments : [];
  const segments = segs.filter(
    (s): s is Segment => isObj(s) && typeof s.key === 'string' && typeof s.campaignSeed === 'string' && seeds.has(s.campaignSeed) && Array.isArray(s.log),
  );
  return { profile, segments };
}
