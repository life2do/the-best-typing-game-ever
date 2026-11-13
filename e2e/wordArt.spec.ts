/** Word art: a real word's picture is revealed behind the world while it is typed. */
import { test, expect } from '@playwright/test';

test('typing a real word reveals and completes its illustration', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/dev/preview/?template=pulse-runner&letters=fjdkslaeirc&bot=pass&tier=4&seed=2');
  await expect(page.locator('.word-art-card')).toHaveCount(1, { timeout: 60_000 });
  await expect(page.locator('.word-art-card.complete')).toHaveCount(1, { timeout: 60_000 });
  // The picture sits behind the world canvas.
  const z = await page.evaluate(() => [getComputedStyle(document.querySelector('.word-art-layer')!).zIndex, getComputedStyle(document.getElementById('world')!).zIndex]);
  expect(Number(z[0])).toBeLessThan(Number(z[1]));
  expect(errors).toEqual([]);
});
