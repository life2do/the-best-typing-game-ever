/** Stretch break: can't be skipped early (supportive nudges), countdown + ring, resumes when done. */
import { test, expect } from '@playwright/test';

test('stretch break blocks early exit with nudges and resumes after the countdown', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.locator('.scale button').nth(3).click();
  await page.locator('button', { hasText: 'Start' }).click();
  await expect(page.locator('.intro')).toBeVisible(); // the level loads asynchronously (save lookup)
  await page.keyboard.down('KeyF');
  await page.keyboard.down('KeyJ');
  await page.keyboard.up('KeyF');
  await page.keyboard.up('KeyJ');
  await page.evaluate(() => (window as any).__game.breakNow(3));
  const brk = page.locator('.overlay.break');
  await expect(brk).toBeVisible();
  await expect(page.locator('.break-count')).toHaveText(/0:0[1-3]/);
  // Early click → a supportive phrase, break stays.
  await page.locator('.break-button').click();
  await expect(page.locator('.break-nudge')).not.toBeEmpty();
  const first = await page.locator('.break-nudge').textContent();
  expect(first?.length).toBeGreaterThan(10);
  // Escape and typing can't skip it either.
  await page.keyboard.press('Escape');
  await page.keyboard.press('KeyF');
  await expect(brk).toBeVisible();
  // After the countdown the button lets the player go.
  await expect(page.locator('.overlay.break.done')).toBeVisible({ timeout: 8000 });
  await expect(page.locator('.break-button')).toHaveText(/I'm ready/);
  await page.locator('.break-button').click();
  await expect(brk).toHaveCount(0);
  const kinds = await page.evaluate(() => (window as any).__game.seg.log.map((e: any) => e.k));
  expect(kinds.filter((k: string) => k === 'pause').length).toBe(1);
  expect(kinds.filter((k: string) => k === 'resume').length).toBe(1);
  expect(errors).toEqual([]);
});
