/** M2.1 profiles: several players, colour/shape PIN, export → import on a fresh browser, M1 save migration. */
import { test, expect, type Page } from '@playwright/test';
import { startLevel } from './helpers';
import { readFileSync } from 'node:fs';

async function newPlayer(page: Page, name: string): Promise<void> {
  await page.locator('input[aria-label="Your name"]').fill(name);
  await page.locator('.scale button').nth(0).click();
  await page.locator('button', { hasText: /^▶ Start$/ }).click();
  await expect(page.locator('.intro')).toBeVisible();
}

async function toMenu(page: Page): Promise<void> {
  await startLevel(page);
  await page.keyboard.press('Escape');
  await page.locator('button', { hasText: 'Main menu' }).click();
}

async function typePin(page: Page, pin: string): Promise<void> {
  for (const d of pin) await page.keyboard.press(`Digit${d}`);
}

test('two players with separate saves; a PIN locks one of them', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');

  // First player: the new-player form (no profiles yet).
  await newPlayer(page, 'Mia');
  await toMenu(page);
  await expect(page.locator('.start h1')).toBeVisible();

  // Second player via Switch player → New player.
  await page.locator('button', { hasText: 'Switch player' }).click();
  await expect(page.locator('.profile-tile')).toHaveCount(2); // Mia + New player
  await page.locator('.profile-tile.new').click();
  await newPlayer(page, 'Leo');
  await toMenu(page);
  await page.locator('button', { hasText: 'Switch player' }).click();
  await expect(page.locator('.profile-tile:not(.new)')).toHaveText([/Leo/, /Mia/]); // most recent first

  // Mia sets a PIN; the picker then asks for it, rejects a wrong one and accepts the right one.
  await page.locator('.profile-tile', { hasText: 'Mia' }).click();
  await expect(page.locator('input[aria-label="Your name"]')).toHaveValue('Mia');
  await page.locator('button', { hasText: 'Set PIN' }).click();
  await typePin(page, '1234');
  await expect(page.locator('.pin h2')).toContainText('Once more');
  await typePin(page, '1234');
  await expect(page.locator('button', { hasText: 'Remove PIN' })).toBeVisible();
  await page.locator('button', { hasText: 'Switch player' }).click();
  await expect(page.locator('.profile-tile', { hasText: 'Mia' })).toContainText('🔒');
  await page.locator('.profile-tile', { hasText: 'Mia' }).click();
  await typePin(page, '9999');
  await expect(page.locator('.pin .msg.bad')).toBeVisible();
  await typePin(page, '1234');
  await expect(page.locator('input[aria-label="Your name"]')).toHaveValue('Mia');

  expect(errors).toEqual([]);
});

test('export a player and import them into a fresh browser', async ({ page, browser }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await newPlayer(page, 'Mia');
  await toMenu(page);
  await page.locator('button', { hasText: 'Set PIN' }).click();
  await typePin(page, '1234');
  await expect(page.locator('.pin h2')).toContainText('Once more');
  await typePin(page, '1234');
  await expect(page.locator('button', { hasText: 'Remove PIN' })).toBeVisible();

  // Export Mia and import her into a fresh browser profile: picker shows her, still locked, runs restored.
  const [download] = await Promise.all([page.waitForEvent('download'), page.locator('button', { hasText: 'Export player' }).click()]);
  const file = await download.path();
  const exported = JSON.parse(readFileSync(file!, 'utf8'));
  expect(exported.format).toBe('tbtge-profile/1');
  expect(exported.segments.length).toBeGreaterThan(0);

  const fresh = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p2 = await fresh.newPage();
  await p2.goto('/');
  await expect(p2.locator('input[aria-label="Your name"]')).toBeVisible(); // no profiles yet
  const chooser = p2.waitForEvent('filechooser');
  await p2.locator('button', { hasText: 'Import a player' }).click();
  await (await chooser).setFiles(file!);
  await expect(p2.locator('.profiles .msg')).toContainText('Imported Mia');
  await expect(p2.locator('.profile-tile', { hasText: 'Mia' })).toContainText('🔒');
  await p2.goto('/verify/');
  await expect(p2.locator('.runs button')).not.toHaveCount(0);
  await fresh.close();

  expect(errors).toEqual([]);
});

test('an M1 save (single profile under "current") is migrated on load', async ({ browser }) => {
  const legacy = await browser.newContext();
  const p3 = await legacy.newPage();
  const errors: string[] = [];
  p3.on('pageerror', (e) => errors.push(e.message));
  await p3.goto('/');
  await p3.evaluate(
    () =>
      new Promise<void>((resolve, reject) => {
        const req = indexedDB.open('tbtge', 1);
        req.onsuccess = () => {
          const t = req.result.transaction('profiles', 'readwrite');
          t.objectStore('profiles').put(
            { schemaVersion: 1, profileId: 'legacy-seed', name: 'Old', avatar: { scale: 'scale.flowers', customization: {} }, tier: 2, tierHistory: [], starsByTier: {}, results: [], campaign: { language: 'en', seed: 'legacy-seed', level: 3 }, collected: [], perKey: {}, settings: {}, createdAt: 1 },
            'current',
          );
          t.oncomplete = () => {
            req.result.close();
            resolve();
          };
          t.onerror = () => reject(t.error);
        };
        req.onerror = () => reject(req.error);
      }),
  );
  await p3.reload();
  await expect(p3.locator('.profile-tile', { hasText: 'Old' })).toContainText('Level 3');
  await legacy.close();

  expect(errors).toEqual([]);
});
