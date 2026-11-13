/** Cross-browser determinism (docs/10 §6): hash fixtures + Node-generated bot logs replay identically in every engine. */
import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const hashFixtures = readdirSync(join(root, 'tests/fixtures/hash')).map((f) => JSON.parse(readFileSync(join(root, 'tests/fixtures/hash', f), 'utf8')));
const runs = JSON.parse(readFileSync(join(root, 'e2e/fixtures/bot-runs.json'), 'utf8'));

test('canonical JSON + hash fixtures match in this browser', async ({ page }) => {
  await page.goto('/dev/preview/?template=pulse-runner&letters=fj');
  const got = await page.evaluate(async (fx) => {
    const load = (m: string) => import(/* @vite-ignore */ m);
    const h = await load('/src/core/hash.ts');
    return fx.map((f: any) => h.hashValue(f.input));
  }, hashFixtures);
  expect(got).toEqual(hashFixtures.map((f) => f.hash));
});

test('Node-generated bot logs replay to identical snapshot hashes', async ({ page }) => {
  await page.goto('/dev/preview/?template=pulse-runner&letters=fj');
  const got = await page.evaluate(async (rs) => {
    const load = (m: string) => import(/* @vite-ignore */ m);
    const setup = await load('/src/campaign/setup.ts');
    const level = await load('/src/sim/level.ts');
    const tpls = await load('/src/sim/templates.ts');
    return rs.map((r: any) => {
      const s = setup.levelSetup(setup.campaignFor(r.seed), r.level, { tier: r.tier });
      const sim = new level.LevelSim(s, tpls.templateSim(s.templateId));
      for (const e of r.log) sim.feed(e);
      return sim.snapshots.map((x: any) => x.hash);
    });
  }, runs);
  for (let i = 0; i < runs.length; i++) expect(got[i], `tier ${runs[i].tier} level ${runs[i].level}`).toEqual(runs[i].hashes);
});
