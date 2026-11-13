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
