import { expect, type Page } from '@playwright/test';

/**
 * Start the level from its intro: press F and J together. Under heavy CI load the two key presses can
 * arrive more than the game's 500 ms "together" window apart, so retry until the level is playing.
 */
export async function startLevel(page: Page): Promise<void> {
  await expect(page.locator('.intro')).toBeVisible();
  for (let i = 0; i < 6; i++) {
    await page.keyboard.down('KeyF');
    await page.keyboard.down('KeyJ');
    await page.keyboard.up('KeyF');
    await page.keyboard.up('KeyJ');
    const phase = await page.evaluate(() => (window as any).__game?.sim?.state.phase);
    if (phase === 'play') return;
    await page.waitForTimeout(300);
  }
  throw new Error('level did not start after pressing F and J');
}

/**
 * After finishing a level: wait for the next level's intro. A fresh level may first offer a fix-it drill for
 * a key that looked weak (more mistakes, or slower than 1.5× the median — uneven timing on a busy machine
 * can do that); decline it with J ("Not now") and the intro follows.
 */
export async function nextLevelIntro(page: Page): Promise<void> {
  await expect(page.locator('.intro, .drill-offer').first()).toBeVisible({ timeout: 20_000 });
  if (await page.locator('.drill-offer').count()) {
    await page.keyboard.press('KeyJ');
    await expect(page.locator('.intro')).toBeVisible();
  }
}
