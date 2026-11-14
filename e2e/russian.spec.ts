/** Russian campaign in the browser: physical keys work under an English OS layout (the browser default here). */
import { test, expect } from '@playwright/test';
import { startLevel } from './helpers';

test('a Russian player types by key position; the intro and keyboard are Russian', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.locator('.langs button[data-lang="ru"]').click();
  await page.locator('.scale button').nth(0).click();
  await page.locator('button', { hasText: /^▶ Start$/ }).click();
  await expect(page.locator('.intro h2')).toContainText('Уровень 1');
  await expect(page.locator('.intro .newkey')).toHaveText(['А', 'О']);
  await expect(page.locator('.intro .press')).toContainText('А и О');
  await expect(page.locator('.intro .kbd .key.known', { hasText: 'А' })).toHaveCount(1);
  // KeyF / KeyJ are the same physical keys as А / О, whatever the OS layout says.
  await startLevel(page);
  for (let i = 0; i < 12; i++) {
    const code = await page.evaluate(() => {
      const g = (window as any).__game;
      return g.sim.setup.language.codeOf[g.sim.expectedChars()[0]] as string;
    });
    await page.keyboard.press(code);
    await page.waitForTimeout(60);
  }
  const s = await page.evaluate(() => (window as any).__game.sim.state.sm);
  expect(s.correct).toBe(12);
  expect(s.errors).toBe(0);
  const lang = await page.evaluate(() => (window as any).__game.profile.campaign.language);
  expect(lang).toBe('ru');
  expect(errors).toEqual([]);
});
