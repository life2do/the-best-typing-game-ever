/** M2.7: settings from the player home (fonts, contrast, volumes), the parent area and the session limit. */
import { test, expect, type Page } from '@playwright/test';
import { startLevel } from './helpers';

async function newPlayer(page: Page, name: string): Promise<void> {
  await page.locator('input[aria-label="Your name"]').fill(name);
  await page.locator('.scale button').nth(2).click();
  await page.locator('button', { hasText: /^▶ Start$/ }).click();
  await expect(page.locator('.intro')).toBeVisible();
}

async function passAdultCheck(page: Page): Promise<void> {
  const word = await page.locator('.adult-word').getAttribute('data-word');
  await page.locator('.adult-check input').fill('nope');
  await page.locator('.adult-check button', { hasText: 'Continue' }).click();
  await expect(page.locator('.adult-check .msg.bad')).toBeVisible();
  await page.locator('.adult-check input').fill([...word!].reverse().join(''));
  await page.locator('.adult-check button', { hasText: 'Continue' }).click();
}

test('settings, parent area and session limit', async ({ page }) => {
  test.setTimeout(150_000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('dialog', (d) => void d.accept());
  await page.goto('/');
  await newPlayer(page, 'Kim');
  await page.evaluate(() => (window as any).__game.showStart((window as any).__game.profile));

  // Settings from the player home: the dyslexia font loads and applies; high contrast; voice volume persists.
  await page.locator('button', { hasText: 'Settings' }).click();
  await page.locator('select[data-setting="font"]').selectOption('dyslexic');
  await page.locator('input[data-setting="highContrast"]').check();
  await page.locator('input[data-setting="voiceVolume"]').fill('0.4');
  await expect(page.locator('body')).toHaveClass(/font-dyslexic/);
  await expect(page.locator('body')).toHaveClass(/high-contrast/);
  expect(await page.evaluate(() => getComputedStyle(document.body).fontFamily)).toContain('OpenDyslexic');
  await expect.poll(() => page.evaluate(() => document.fonts.check('16px OpenDyslexic'))).toBe(true);
  await page.locator('button', { hasText: 'Done' }).click();
  const saved = await page.evaluate(() => (window as any).__game.profile.settings);
  expect(saved).toMatchObject({ font: 'dyslexic', highContrast: true, voiceVolume: 0.4 });

  // Parent area behind the adult check: limits persist.
  await page.locator('button', { hasText: 'Parents' }).click();
  await passAdultCheck(page);
  await expect(page.locator('.parents h2')).toContainText('Parent area');
  await page.locator('select[data-parent="sessionMinutes"]').selectOption('15');
  await page.locator('select[data-parent="breakMinutes"]').selectOption('10');
  await expect.poll(() => page.evaluate(() => (window as any).__game.profile.settings.sessionMinutes)).toBe(15);
  expect(await page.evaluate(() => (window as any).__game.profile.settings.breakMinutes)).toBe(10);
  await page.locator('.parents button', { hasText: 'Done' }).click();

  // Session limit: when it is reached the game stops; Escape can't skip it; a grown-up can add 15 minutes.
  await page.locator('button', { hasText: /Continue/ }).click();
  await startLevel(page);
  await page.evaluate(() => { (window as any).__game.sessionMs = 15 * 60_000 + 1; });
  await expect(page.locator('.session-over')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.session-over')).toBeVisible();
  await page.locator('.session-over button', { hasText: '15 more minutes' }).click();
  await passAdultCheck(page);
  await expect(page.locator('.session-over')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => (window as any).__game.paused)).toBe(false);

  // Parent area from the profile picker: delete a player.
  await page.keyboard.press('Escape');
  await page.locator('button', { hasText: 'Main menu' }).click();
  await page.locator('button', { hasText: 'Switch player' }).click();
  await page.locator('.profiles button', { hasText: 'Parents' }).click();
  await passAdultCheck(page);
  await expect(page.locator('.parent-player')).toHaveCount(1);
  await page.locator('.parent-player button', { hasText: 'Delete' }).click();
  await expect(page.locator('input[aria-label="Your name"]')).toBeVisible(); // no players left
  expect(errors).toEqual([]);
});
