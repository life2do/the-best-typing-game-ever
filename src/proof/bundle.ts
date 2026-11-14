/**
 * Proof bundle `tbtge-proof/1` (docs/05): everything needed to re-simulate and verify a run, with each
 * segment's input log compressed (base64url of deflate-raw of its canonical JSON), a summary, the chosen
 * identity and the run fingerprint. Travels as a `.proof` file or inside the artifact PNG.
 */
import { canonicalize } from '@/core/canonical';
import { base64url, fromBase64url, hashValue, type Hash } from '@/core/hash';
import type { LevelPlan } from '@/campaign/campaign';
import type { LogEvent } from '@/sim/types';
import type { Segment } from '@/storage/profile';
import type { RunFile } from '@/app/replay';
import { campaignOf, simFor } from '@/app/replay';
import { runFingerprint, segmentOrder } from './fingerprint';

export const PROOF_FORMAT = 'tbtge-proof/1';
export const PROOF_KEYWORD = 'tbtge-proof';

export interface ProofSegment {
  key: string;
  build: string;
  level: number;
  player?: number;
  profileId?: string;
  partyId?: string;
  tier: number;
  targetStars: number;
  collected: string[];
  weakKeys: string[];
  plan?: LevelPlan;
  /** base64url(deflate-raw(canonical JSON of the log)) */
  log: string;
  snapshots: string[];
  complete: boolean;
  stars: number;
  startedAt: number;
}

export type Identity = { mode: 'none' } | { mode: 'hashed'; salt: string; nameHash: Hash } | { mode: 'plain'; name: string };

export interface ProofBundle {
  format: typeof PROOF_FORMAT;
  campaign: { language: string; seed: string; partyMode: string | null };
  segments: ProofSegment[];
  summary: { levels: number; stars: number[]; tiers: number[]; wpmP: number; accP: number; durationMs: number };
  identity: Identity;
  /** final chain hash = the fingerprint */
  run: Hash;
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const out = new Response(new Blob([bytes as BlobPart]).stream().pipeThrough(stream));
  return new Uint8Array(await out.arrayBuffer());
}
const enc = new TextEncoder();
export const packLog = async (log: readonly LogEvent[]) => base64url(await pipe(enc.encode(canonicalize(log)), new CompressionStream('deflate-raw')));
export const unpackLog = async (s: string): Promise<LogEvent[]> => JSON.parse(new TextDecoder().decode(await pipe(fromBase64url(s), new DecompressionStream('deflate-raw'))));

export const nameHash = (salt: string, name: string): Hash => hashValue({ salt, name: name.trim().normalize('NFC').toLowerCase() });

/** Summary of the replayed run: stars and tier per level, mean best final-stage WPM and accuracy, active time. */
export function summarize(run: RunFile): ProofBundle['summary'] {
  const camp = campaignOf(run);
  const segs = run.segments.slice().sort(segmentOrder);
  let wpm = 0;
  let acc = 0;
  let n = 0;
  let durationMs = 0;
  for (const seg of segs) {
    const sim = simFor(camp, seg);
    for (const e of seg.log) sim.feed(e);
    const last = sim.setup.stageLengths.length - 1;
    const best = sim.state.results.filter((r) => r.stage === last).sort((a, b) => b.stars - a.stars || b.wpmP - a.wpmP)[0];
    if (best) {
      wpm += best.wpmP;
      acc += best.accP;
      n++;
    }
    durationMs += Math.max(0, (seg.log.length ? seg.log[seg.log.length - 1].t : 0) - sim.state.pausedMs);
  }
  return {
    levels: segs.length, stars: segs.map((s) => s.stars), tiers: segs.map((s) => s.tier),
    wpmP: n ? Math.floor(wpm / n) : 0, accP: n ? Math.floor(acc / n) : 0, durationMs,
  };
}

export async function buildProof(run: RunFile, identity: Identity, partyMode: string | null = null): Promise<ProofBundle> {
  const segs = run.segments.slice().sort(segmentOrder);
  return {
    format: PROOF_FORMAT,
    campaign: { language: run.campaign.language, seed: run.campaign.seed, partyMode },
    segments: await Promise.all(
      segs.map(async (s) => ({
        key: s.key, build: String(s.build), level: s.level, player: s.player, profileId: s.profileId, partyId: s.partyId, tier: s.tier,
        targetStars: s.targetStars, collected: s.collected, weakKeys: s.weakKeys, plan: s.plan, log: await packLog(s.log),
        snapshots: s.snapshots.map(String), complete: s.complete, stars: s.stars, startedAt: s.startedAt,
      })),
    ),
    summary: summarize(run),
    identity,
    run: runFingerprint(run.campaign, segs),
  };
}

/** Parses and checks the shape of a proof bundle (text of a `.proof` file or the PNG chunk). */
export function parseProof(text: string): ProofBundle {
  const b = JSON.parse(text) as ProofBundle;
  if (!b || b.format !== PROOF_FORMAT || !b.campaign || !Array.isArray(b.segments) || typeof b.run !== 'string') throw new Error('This is not a typing-game proof.');
  return b;
}

/** The run (segments with their logs) inside a proof, ready to re-simulate. */
export async function proofToRun(b: ProofBundle): Promise<RunFile> {
  const segments: Segment[] = await Promise.all(
    b.segments.map(async (s) => ({
      key: s.key, build: s.build, campaignSeed: b.campaign.seed, language: b.campaign.language, level: s.level, tier: s.tier,
      targetStars: s.targetStars, collected: s.collected, weakKeys: s.weakKeys, log: await unpackLog(s.log), snapshots: s.snapshots as Hash[],
      complete: s.complete, stars: s.stars, startedAt: s.startedAt, plan: s.plan, player: s.player, profileId: s.profileId, partyId: s.partyId,
    })),
  );
  return { format: 'tbtge-run/1', build: segments[0]?.build ?? '', campaign: { language: b.campaign.language, seed: b.campaign.seed }, segments };
}

/** Hidden name: does `name` match the proof's identity? (plain: compared directly; none: never.) */
export function nameMatches(b: ProofBundle, name: string): boolean {
  if (b.identity.mode === 'plain') return b.identity.name.trim().toLowerCase() === name.trim().toLowerCase();
  if (b.identity.mode === 'hashed') return nameHash(b.identity.salt, name) === b.identity.nameHash;
  return false;
}
