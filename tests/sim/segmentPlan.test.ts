/** Segments keep their level plan, so replay/verify still match after new content changes the campaign. */
import { describe, expect, it } from 'vitest';
import { campaignFor } from '@/campaign/setup';
import { verifySegment } from '@/app/replay';
import type { Segment } from '@/storage/profile';
import { runLevel, SEED } from '../helpers/bot';

describe('segment plan', () => {
  it('verifies against the stored plan even when the campaign now picks a different template', () => {
    const camp = campaignFor(SEED);
    const plan = camp.levels[4];
    const { run, setup } = runLevel(5, 4, 'pass');
    const seg: Segment = {
      key: 'k', build: 'b', campaignSeed: SEED, language: 'en', level: 5, tier: 4, targetStars: setup.targetStars,
      collected: [], weakKeys: [], log: run.log, snapshots: run.sim.snapshots.map((s) => s.hash), complete: run.completed,
      stars: run.sim.state.bestStars, startedAt: 0, plan,
    };
    expect(verifySegment(camp, seg, 'b').ok).toBe(true);
    // Newer content: the campaign's level 5 is now another template. The stored plan still verifies.
    const other = camp.levels.find((l) => l.templateId !== plan.templateId)!;
    const changed = { ...camp, levels: camp.levels.map((l, i) => (i === 4 ? { ...l, templateId: other.templateId, view: other.view } : l)) };
    expect(verifySegment(changed, seg, 'b').ok).toBe(true);
    // Without the stored plan (an M1 segment) the changed campaign would not match.
    expect(verifySegment(changed, { ...seg, plan: undefined }, 'b').ok).toBe(false);
  });
});
