/** M2.8: collectible voice effects — the collection toast, the Settings picker and the speech voice. */
import { test, expect } from '@playwright/test';
import { startLevel } from './helpers';

test('collected voice effects show up in Settings and change the speech voice', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.locator('input[aria-label="Your name"]').fill('Vic');
  await page.locator('.scale button').nth(2).click();
  await page.locator('button', { hasText: /^▶ Start$/ }).click();
  await startLevel(page);

  // Collecting a voice word quickly: icon + name on screen (works without a speech voice).
  await page.evaluate(() => (window as any).__game.onSimEvent({ type: 'ability', id: 'ability.voice-robot', word: 'robot', quick: true }));
  await expect(page.locator('.toast', { hasText: 'New voice: Robot' })).toContainText('🤖');
  // The level keeps the normal voice until the player picks the effect.
  expect(await page.evaluate(() => (window as any).__game.voice.pitch)).toBe(1);

  // Nothing collected yet in the profile: Settings shows only the normal voice and a hint.
  await page.evaluate(() => (window as any).__game.showStart((window as any).__game.profile));
  await page.locator('button', { hasText: 'Settings' }).click();
  await expect(page.locator('[data-voice-effect]')).toHaveCount(1);
  await expect(page.locator('.voice-effects .hint').first()).toContainText('voice');
  await page.locator('button', { hasText: 'Done' }).click();

  // With two collected effects, both can be picked; the choice persists and sets pitch and speed.
  await page.evaluate(() => {
    const g = (window as any).__game;
    g.profile.collected = [...g.profile.collected, 'ability.voice-giant', 'ability.voice-chipmunk'];
  });
  await page.locator('button', { hasText: 'Settings' }).click();
  await expect(page.locator('[data-voice-effect]')).toHaveCount(3);
  await expect(page.locator('[data-voice-effect="normal"]')).toHaveAttribute('aria-checked', 'true');
  await page.locator('[data-voice-effect="voice.giant"]').click();
  await expect(page.locator('[data-voice-effect="voice.giant"]')).toHaveAttribute('aria-checked', 'true');
  await page.locator('button', { hasText: 'Done' }).click();
  const after = await page.evaluate(() => {
    const g = (window as any).__game;
    return { effect: g.profile.settings.voiceEffect, pitch: g.voice.pitch, rate: g.voice.rate };
  });
  expect(after).toEqual({ effect: 'voice.giant', pitch: 0.3, rate: 0.8 });

  // Continuing the game keeps the chosen voice.
  await page.locator('button', { hasText: /Continue/ }).click();
  await expect(page.locator('.intro')).toBeVisible();
  expect(await page.evaluate(() => (window as any).__game.voice.pitch)).toBe(0.3);
  expect(errors).toEqual([]);
});
