/** Shared per-template test suite (AGENTS.md "Add a level template", step 4). */
import { describe, expect, it } from 'vitest';
import { runTemplate } from './bot';
import { budgetFor } from '../../tools/bot/bot';

export function templateSuite(templateId: string, letters: string) {
  describe(`${templateId} (${letters})`, () => {
    for (const tier of [1, 4, 7]) {
      it(`pass bot completes with >= 1 star at tier ${tier} within budget`, () => {
        const { run } = runTemplate(templateId, letters, tier, 'pass');
        expect(run.completed).toBe(true);
        expect(run.sim.state.bestStars).toBeGreaterThanOrEqual(1);
        expect(run.simulatedMs).toBeLessThanOrEqual(budgetFor(tier));
      });
    }
    it('struggle bot does not complete', () => {
      const { run } = runTemplate(templateId, letters, 4, 'struggle');
      expect(run.completed).toBe(false);
    });
    it('masher bot does not crash and keeps minimum visibility', () => {
      const { run } = runTemplate(templateId, letters, 4, 'masher');
      expect(run.minVisibility).toBeGreaterThanOrEqual(350);
    });
    it('is deterministic (same seed, same snapshot hashes)', () => {
      const a = runTemplate(templateId, letters, 4, 'pass').run.sim.snapshots.map((s) => s.hash);
      const b = runTemplate(templateId, letters, 4, 'pass').run.sim.snapshots.map((s) => s.hash);
      expect(a.length).toBeGreaterThan(2);
      expect(b).toEqual(a);
    });
  });
}
