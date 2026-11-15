/** Name and speed goal: changed from the pause menu (saved at once, new goal from the next level) and on Continue. */
import { test, expect, type Page } from '@playwright/test';
import { startLevel } from './helpers';

const stored = (page: Page) =>
  page.evaluate(async () => {
    const { listProfiles } = await (await import(/* @vite-ignore */ '/src/storage/profile.ts' as string));
    const p = (await listProfiles())[0];
    return { name: p.name, tier: p.tier };
  });

test('pause menu: rename and change the speed goal; saved, and the goal applies from the next level', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.locator('input[aria-label="Your name"]').fill('Ann');
  await page.locator('.scale button').nth(2).click(); // tier 3
  await page.locator('button', { hasText: /^▶ Start$/ }).click();
  await startLevel(page);
  const segTier = await page.evaluate(() => (window as any).__game.seg.tier);
  expect(segTier).toBe(3);

  await page.keyboard.press('Escape');
  await expect(page.locator('.pause')).toBeVisible();
  await page.locator('[data-player="name"]').fill('Annie');
  await page.locator('.pause [data-tier="5"]').click();
  await expect(page.locator('.pause [data-tier="5"]')).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('[data-player="note"]')).toContainText('next level');
  await expect.poll(() => stored(page)).toEqual({ name: 'Annie', tier: 5 });
  await page.keyboard.press('Escape');
  await expect(page.locator('.pause')).toHaveCount(0);

  // The level in progress keeps its goal (exact replay); the next level starts at the new one.
  expect(await page.evaluate(() => (window as any).__game.seg.tier)).toBe(3);
  await page.evaluate(() => (window as any).__game.startLevel(2, false));
  await expect(page.locator('.intro')).toBeVisible();
  expect(await page.evaluate(() => (window as any).__game.seg.tier)).toBe(5);

  // Survives a reload.
  await page.reload();
  expect(await stored(page)).toEqual({ name: 'Annie', tier: 5 });
  expect(errors).toEqual([]);
});

test('player home: Continue saves the speed goal and the name', async ({ page }) => {
  await page.goto('/');
  await page.locator('input[aria-label="Your name"]').fill('Bob');
  await page.locator('.scale button').nth(1).click(); // tier 2
  await page.locator('button', { hasText: /^▶ Start$/ }).click();
  await expect(page.locator('.intro')).toBeVisible();
  await page.evaluate(() => (window as any).__game.showStart((window as any).__game.profile));
  await page.locator('input[aria-label="Your name"]').fill('Bobby');
  await page.locator('.scale button').nth(5).click(); // tier 6
  await page.locator('button', { hasText: /Continue/ }).click();
  await expect(page.locator('.intro')).toBeVisible();
  await expect.poll(() => stored(page)).toEqual({ name: 'Bobby', tier: 6 });
});
