/** Avatar customisation: pick a theme and options, locked options can't be picked, the choice shows in game. */
import { test, expect } from '@playwright/test';
import { startLevel } from './helpers';

test('customise the avatar; locked options stay locked; the game uses the saved avatar', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.locator('input[aria-label="Your name"]').fill('Mia');
  await page.locator('.scale button').nth(0).click();
  await page.locator('button', { hasText: /^▶ Start$/ }).click();
  await startLevel(page);
  await page.keyboard.press('Escape');
  await page.locator('button', { hasText: 'Main menu' }).click();

  await page.locator('button', { hasText: 'Avatar' }).click();
  await expect(page.locator('.avatar-themes .theme')).toHaveCount(13);
  await page.locator('.avatar-themes .theme[data-scale="scale.cats"]').click();
  // No stars yet: values 4–10 are locked and show their star price.
  const locked = page.locator('.opt[data-slot="accessory"][data-value="9"]');
  await expect(locked).toHaveAttribute('aria-disabled', 'true');
  await expect(locked).toContainText('60★');
  await locked.click({ force: true }); // a locked option is aria-disabled; clicking it anyway does nothing
  await expect(locked).not.toHaveClass(/sel/);
  await page.locator('.opt[data-slot="accessory"][data-value="3"]').click();
  await page.locator('.opt[data-slot="primary-color"][data-value="2"]').click();
  await expect(page.locator('.opt[data-slot="accessory"][data-value="3"]')).toHaveClass(/sel/);
  await page.locator('button', { hasText: 'Save' }).click();

  const saved = await page.evaluate(() => (window as any).__game.profile.avatar);
  expect(saved.scale).toBe('scale.cats');
  expect(saved.customization).toMatchObject({ accessory: 3, primary: 2 });
  // In game: the cat avatar wears its crown.
  await page.locator('button', { hasText: /Continue/ }).click();
  await expect.poll(() => page.evaluate(() => {
    const host = (window as any).__game.host;
    const a = host.current?.avatar;
    return a ? `${a.scaleId}:${!!a.root.getObjectByName('accessory')}` : '';
  })).toBe('cats:true');
  expect(errors).toEqual([]);
});
