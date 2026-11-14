/**
 * Run fingerprint (docs/05): link₀ = H(campaign), linkₙ = H({prev: linkₙ₋₁, snap}) over every snapshot of
 * every segment, levels in order (in a hot-seat party, the players of a round in turn order).
 */
import { chainLink, fromBase64url, hashValue, type Hash } from '@/core/hash';

export interface CampaignRef {
  language: string;
  seed: string;
}

export interface ChainSegment {
  level: number;
  player?: number;
  snapshots: readonly string[];
}

export const segmentOrder = (a: ChainSegment, b: ChainSegment) => a.level - b.level || (a.player ?? 0) - (b.player ?? 0);

export function runFingerprint(campaign: CampaignRef, segments: readonly ChainSegment[]): Hash {
  // Profiles name languages "en", segments and campaigns "lang.en": both mean the same campaign.
  let link = hashValue({ campaign: { language: campaign.language.replace(/^lang\./, ''), seed: campaign.seed } });
  for (const seg of segments.slice().sort(segmentOrder)) for (const snap of seg.snapshots) link = chainLink(link, snap as Hash);
  return link;
}

/** The 32 bytes of a fingerprint. */
export const fingerprintBytes = (h: string): Uint8Array => fromBase64url(h.replace(/^sha256-/, ''));

/** Short human form: first 16 bytes as hex groups (what the code ring carries). */
export const shortFingerprint = (bytes: Uint8Array): string =>
  Array.from(bytes.slice(0, 16), (b) => b.toString(16).padStart(2, '0')).join('').replace(/(.{8})(?=.)/g, '$1 ');
