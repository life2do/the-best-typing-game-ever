/** Re-simulating recorded segments (shared by the verify page and tests). */
import { LevelSim } from '@/sim/level';
import { campaignFor, planSetup } from '@/campaign/setup';
import { templateSim } from '@/sim/templates';
import { timingCheck, type TimingVerdict } from '@/proof/timing';
import type { Segment } from '@/storage/profile';
import type { LogEvent } from '@/sim/types';
import type { Campaign } from '@/campaign/campaign';

export interface RunFile {
  format: 'tbtge-run/1';
  build: string;
  campaign: { language: string; seed: string };
  name?: string;
  segments: Segment[];
}

export interface SegmentVerdict {
  level: number;
  letters: string;
  ok: boolean;
  snapshotsMatch: boolean;
  recorded: number;
  stars: number;
  starsClaimed: number;
  complete: boolean;
  buildMatches: boolean;
  timing: TimingVerdict;
  durationMs: number;
  stageTimes: number[];
}

/** The plan a segment was played with: stored in the segment, or (M1 segments) the campaign's. */
export const planOf = (camp: Campaign, seg: Segment) => seg.plan ?? camp.levels[seg.level - 1];

export function simFor(camp: Campaign, seg: Segment, keepStates = false): LevelSim {
  const setup = planSetup(camp.seed, camp.language, planOf(camp, seg), { tier: seg.tier, targetStars: seg.targetStars, collected: seg.collected, weakKeys: seg.weakKeys });
  return new LevelSim(setup, templateSim(setup.templateId), { keepStates });
}

export function verifySegment(camp: Campaign, seg: Segment, currentBuild: string): SegmentVerdict {
  const sim = simFor(camp, seg);
  const stageTimes: number[] = [];
  let lastT = 0;
  sim.on((e) => {
    if (e.type === 'stage') stageTimes.push(lastT);
  });
  for (const e of seg.log) {
    lastT = e.t;
    sim.feed(e);
  }
  const hashes = sim.snapshots.map((s) => s.hash);
  const n = Math.min(hashes.length, seg.snapshots.length);
  const snapshotsMatch = seg.snapshots.length > 0 && hashes.slice(0, n).every((h, i) => h === seg.snapshots[i]) && (seg.complete ? hashes.length === seg.snapshots.length : true);
  const complete = sim.state.phase === 'done';
  const timing = timingCheck(seg.log);
  return {
    level: seg.level,
    letters: planOf(camp, seg)?.newKeys.filter((k) => k !== ' ').join('').toUpperCase() ?? '?',
    ok: snapshotsMatch && complete === seg.complete && sim.state.bestStars === seg.stars,
    snapshotsMatch,
    recorded: seg.snapshots.length,
    stars: sim.state.bestStars,
    starsClaimed: seg.stars,
    complete,
    buildMatches: seg.build === currentBuild,
    timing,
    durationMs: seg.log.length ? seg.log[seg.log.length - 1].t : 0,
    stageTimes,
  };
}

/** Feed a fresh sim with all events up to local time t (fast: whole levels simulate in milliseconds). */
export function simAt(camp: Campaign, seg: Segment, t: number): { sim: LevelSim; next: number } {
  const sim = simFor(camp, seg);
  let i = 0;
  const log: LogEvent[] = seg.log;
  while (i < log.length && log[i].t <= t) sim.feed(log[i++]);
  if (sim.state.pauseAt < 0) sim.advanceTo(Math.max(t, sim.state.simT + sim.state.pausedMs));
  return { sim, next: i };
}

export function campaignOf(run: RunFile): Campaign {
  return campaignFor(run.campaign.seed, run.campaign.language);
}
