/** Music: the held chord fades out when the player stops typing (it used to hang on one chord). */
import { test, expect } from '@playwright/test';

test('music pad goes silent when no keys are pressed', async ({ page }) => {
  await page.goto('/');
  await page.locator('.scale button').nth(6).click();
  await page.locator('button', { hasText: 'Start' }).click();
  await expect(page.locator('.intro')).toBeVisible(); // the level loads asynchronously (save lookup)
  await page.keyboard.down('KeyF');
  await page.keyboard.down('KeyJ');
  await page.keyboard.up('KeyF');
  await page.keyboard.up('KeyJ');
  const CODE: Record<string, string> = { f: 'KeyF', j: 'KeyJ', ' ': 'Space' };
  for (let i = 0; i < 24; i++) {
    const ch = await page.evaluate(() => (window as any).__game.sim.expectedChars()[0]);
    await page.keyboard.press(CODE[ch] ?? 'KeyF');
    await page.waitForTimeout(120);
  }
  const state = () =>
    page.evaluate(() => {
      const g = (window as any).__game;
      return { silent: g.audio.silent, ctx: g.audio.ctx?.state ?? 'none', phase: g.sim.state.phase, paused: g.paused, idle: Math.round(performance.now() - g.lastKeyAt) };
    });
  const typing = await state();
  expect(typing.silent, JSON.stringify(typing)).toBe(false);
  // Stop typing: the pad fades out shortly after (IDLE_SILENCE_MS = 1.2 s).
  await expect.poll(() => page.evaluate(() => (window as any).__game.audio.silent), { timeout: 5000 }).toBe(true);
});
