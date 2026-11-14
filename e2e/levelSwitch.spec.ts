/**
 * Regression (main CI, Firefox): starting a level assigned the new level's sim before its world was
 * mounted (a save to IndexedDB happens in between), so frames drew the old world with the new game's
 * state and the view threw ("s.creatures is undefined" from tower defence). A slow save reproduces it.
 */
import { test, expect } from '@playwright/test';
import { startLevel } from './helpers';

test('switching to a level of another game never draws the old world with the new state', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.locator('.scale button').nth(3).click();
  await page.locator('button', { hasText: /^▶ Start$/ }).click();
  await startLevel(page);
  await page.evaluate(async () => {
    const g = (window as any).__game;
    g.camp.levels[26] = { ...g.camp.levels[26], templateId: 'template.tower-defence', view: 'iso' };
    await g.startLevel(27, false);
  });
  await expect(page.locator('.intro h2')).toContainText('Level 27');
  await page.evaluate(async () => {
    const g = (window as any).__game;
    g.camp.levels[32] = { ...g.camp.levels[32], templateId: 'template.pulse-runner', view: '2d' };
    // Slow storage (like Firefox's IndexedDB on a busy machine): many frames render during the save.
    const persist = g.persist.bind(g);
    g.persist = async () => {
      await new Promise((r) => setTimeout(r, 600));
      return persist();
    };
    await g.startLevel(33, false);
  });
  await expect(page.locator('.intro h2')).toContainText('Level 33');
  await page.waitForTimeout(300);
  expect(errors).toEqual([]);
});
