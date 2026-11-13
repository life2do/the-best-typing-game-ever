/** End-to-end: start → intro → play a level by keyboard → crossroads → next level → verify page. */
import { startLevel } from './helpers';
import { test, expect, type Page } from '@playwright/test';

const CODE: Record<string, string> = { f: 'KeyF', j: 'KeyJ', d: 'KeyD', k: 'KeyK', s: 'KeyS', l: 'KeyL', a: 'KeyA', ' ': 'Space', ';': 'Semicolon' };

async function typeUntil(page: Page, phase: string, maxMs: number, jitter = true): Promise<void> {
  const end = Date.now() + maxMs;
  let i = 0;
  while (Date.now() < end) {
    const st = await page.evaluate(() => {
      const g = (window as any).__game;
      return g.sim ? { phase: g.sim.state.phase, exp: g.sim.expectedChars() } : null;
    });
    if (!st || st.phase === phase) return;
    if (st.phase === 'play' && st.exp.length) await page.keyboard.press(CODE[st.exp[0]] ?? 'KeyF');
    await page.waitForTimeout(jitter ? 40 + ((i++ * 37) % 50) : 60);
  }
  throw new Error(`did not reach ${phase}`);
}

test('play level 1, choose the next world, then verify the run', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.locator('.start h1')).toBeVisible();
  await page.locator('.scale button').nth(6).click();
  await page.locator('button', { hasText: 'Start' }).click();
  await expect(page.locator('.intro')).toBeVisible();
  await expect(page.locator('.intro .newkey')).toHaveText(['F', 'J']);
  await startLevel(page);
  await expect(page.locator('.intro')).toHaveCount(0);
  await expect(page.locator('.prompt')).toBeVisible();
  await typeUntil(page, 'crossroads', 120_000);
  await expect(page.locator('.crossroads')).toBeVisible();
  await page.keyboard.press('KeyJ');
  await expect(page.locator('.intro .newkey')).toHaveText(['D'], { timeout: 10_000 });
  await page.goto('/verify/');
  await page.locator('.runs button').first().click();
  await expect(page.locator('.verdict.ok')).toBeVisible();
  const v = await page.evaluate(() => (window as any).__verify.verdicts.map((x: any) => ({ level: x.level, ok: x.ok, complete: x.complete })));
  expect(v[0]).toEqual({ level: 1, ok: true, complete: true });
  await expect(page.locator('.seek .mark')).toHaveCount(2);
  expect(errors).toEqual([]);
});

test('pause menu logs pause and resume events', async ({ page }) => {
  await page.goto('/');
  await page.locator('.scale button').nth(6).click();
  await page.locator('button', { hasText: 'Start' }).click();
  await startLevel(page); // waits for the intro (the level loads asynchronously), then F+J
  for (let i = 0; i < 10; i++) await page.keyboard.press('KeyF');
  await page.keyboard.press('Escape');
  await expect(page.locator('.pause')).toBeVisible();
  await page.waitForTimeout(500);
  await page.keyboard.press('Escape');
  await expect(page.locator('.pause')).toHaveCount(0);
  const kinds = await page.evaluate(() => (window as any).__game.seg.log.map((e: any) => e.k));
  expect(kinds).toContain('pause');
  expect(kinds).toContain('resume');
});

test('pause → main menu → continue keeps typing working and the run verifies', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.locator('.scale button').nth(6).click();
  await page.locator('button', { hasText: 'Start' }).click();
  await startLevel(page);
  await typeUntilCount(page, 8);
  await page.keyboard.press('Escape');
  await page.locator('button', { hasText: 'Main menu' }).click();
  await page.locator('button', { hasText: 'Continue' }).click();
  await expect(page.locator('.prompt')).toBeVisible();
  const before = await page.evaluate(() => (window as any).__game.sim.state.correctTotal);
  await typeUntilCount(page, 8);
  const after = await page.evaluate(() => (window as any).__game.sim.state.correctTotal);
  expect(after).toBeGreaterThan(before); // keys after continuing are counted
  await page.goto('/verify/');
  await page.locator('.runs button').first().click();
  await expect(page.locator('.verdict.ok')).toBeVisible();
  expect(errors).toEqual([]);
});

async function typeUntilCount(page: Page, n: number): Promise<void> {
  for (let i = 0; i < n; i++) {
    const ch = await page.evaluate(() => (window as any).__game.sim.expectedChars()[0]);
    await page.keyboard.press(CODE[ch] ?? 'KeyF');
    await page.waitForTimeout(90);
  }
}
