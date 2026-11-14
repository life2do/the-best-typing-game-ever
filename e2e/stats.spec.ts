/** Local analytics: the stats screen shows numbers derived from the player's saved runs. */
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

// Node-generated pass-bot runs (tools/gen-e2e-fixtures.ts): levels 1–4 at tiers 1, 4, 7 for one seed.
const runs = JSON.parse(readFileSync('e2e/fixtures/bot-runs.json', 'utf8')) as { seed: string; level: number; tier: number; log: unknown[]; hashes: string[] }[];

test('stats screen: tiles, charts with hover tooltips, table and key heatmap from the saved runs', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.locator('input[aria-label="Your name"]')).toBeVisible();
  const mine = runs.filter((r) => r.tier === 4);
  const seed = mine[0].seed;
  // A player whose campaign is that seed, with the four runs saved as segments.
  await page.evaluate(
    ({ seed, mine }) =>
      new Promise<void>((resolve, reject) => {
        const req = indexedDB.open('tbtge', 1);
        req.onupgradeneeded = () => {
          for (const s of ['profiles', 'segments', 'settings', 'proofs']) if (!req.result.objectStoreNames.contains(s)) req.result.createObjectStore(s);
        };
        req.onsuccess = () => {
          const db = req.result;
          const t = db.transaction(['profiles', 'segments', 'settings'], 'readwrite');
          t.objectStore('profiles').put({ schemaVersion: 2, profileId: seed, name: 'Stat', avatar: { scale: 'scale.flowers', customization: {} }, tier: 4, tierHistory: [], starsByTier: { '4': { '1': 2, '2': 2, '3': 2, '4': 2 } }, results: [], campaign: { language: 'en', seed, level: 5 }, collected: [], perKey: {}, settings: {}, createdAt: 1, wordBook: { ask: { golden: true, count: 1, first: 1 } } }, seed);
          mine.forEach((r, i) => t.objectStore('segments').put({ key: `${seed}:${r.level}`, build: 'b', campaignSeed: seed, language: 'en', level: r.level, tier: 4, targetStars: 1, collected: [], weakKeys: [], log: r.log, snapshots: r.hashes, complete: true, stars: 2, startedAt: 1000 + i }, `${seed}:${r.level}`));
          t.objectStore('settings').put(seed, 'currentProfile');
          t.oncomplete = () => { db.close(); resolve(); };
          t.onerror = () => reject(t.error);
        };
        req.onerror = () => reject(req.error);
      }),
    { seed, mine },
  );
  await page.reload();
  await page.locator('.profile-tile', { hasText: 'Stat' }).click();
  await page.locator('button', { hasText: 'Stats' }).click();
  await expect(page.locator('.stats h2')).toContainText('Stat');
  await expect(page.locator('.stat-tile').first()).toContainText('4'); // levels finished
  await expect(page.locator('.stat-tile', { hasText: 'stars' })).toContainText('8 ★');
  await expect(page.locator('.stat-chart')).toHaveCount(3);
  await expect(page.locator('.stat-chart').first().locator('.pt')).toHaveCount(4);
  await expect(page.locator('.stat-chart').first().locator('.pt title').first()).toContainText('Level 1 (FJ)');
  await expect(page.locator('.stat-table tbody tr')).toHaveCount(4);
  // Heatmap: the home keys were typed and have tooltips with latency; untyped keys are marked.
  await expect(page.locator('.heat-key[title^="F:"]')).toHaveAttribute('title', /ms per key/);
  await expect(page.locator('.heat-key.none').first()).toHaveAttribute('title', /not typed yet/);
  if (process.env.STATS_SHOT) await page.screenshot({ path: process.env.STATS_SHOT, fullPage: true });
  expect(errors).toEqual([]);
});
