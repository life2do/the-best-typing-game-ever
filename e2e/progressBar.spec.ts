/** Level progress bar (stage sections, goal flag, avatar walking) and the parent-area debug mode (label, F+J skip). */
import { test, expect, type Page } from '@playwright/test';
import { startLevel } from './helpers';

async function typeKeys(page: Page, n: number): Promise<void> {
  for (let i = 0; i < n; i++) {
    const code = await page.evaluate(() => {
      const g = (window as any).__game;
      return g.sim.state.phase === 'play' ? g.sim.setup.language.codeOf[g.sim.expectedChars()[0]] : null;
    });
    if (code) await page.keyboard.press(code);
    await page.waitForTimeout(40);
  }
}

/** Hold F and J together (the debug skip needs a deliberate 300 ms hold). */
async function holdFJ(page: Page): Promise<void> {
  await page.keyboard.down('KeyF');
  await page.keyboard.down('KeyJ');
  await page.waitForTimeout(450);
  await page.keyboard.up('KeyF');
  await page.keyboard.up('KeyJ');
}

/** Fast rollover typing: J goes down while F is still held for a moment. Must not skip. */
async function rollFJ(page: Page): Promise<void> {
  await page.keyboard.down('KeyF');
  await page.keyboard.down('KeyJ');
  await page.waitForTimeout(40);
  await page.keyboard.up('KeyF');
  await page.keyboard.up('KeyJ');
}

test('progress bar: a section per stage, the goal flag, the avatar walks as you type', async ({ page }) => {
  await page.goto('/');
  await page.locator('input[aria-label="Your name"]').fill('Pia');
  await page.locator('.scale button').nth(2).click();
  await page.locator('button', { hasText: /^▶ Start$/ }).click();
  await startLevel(page);
  await expect(page.locator('.levelbar-sec')).toHaveCount(3);
  await expect(page.locator('.levelbar-flag')).toBeVisible();
  await expect(page.locator('.stages')).toHaveCount(0); // the old stage dots are gone
  const icon = await page.evaluate(() => (window as any).__game.hud.walker.textContent);
  expect(icon && icon !== '🙂').toBeTruthy(); // the avatar theme's icon
  await typeKeys(page, 16);
  // 16 of the first stage's ~42 characters ≈ 8–9% of the level (180 characters); the bar updates on the next frame.
  const now = () => page.locator('.levelbar').getAttribute('aria-valuenow').then(Number);
  await expect.poll(now).toBeGreaterThan(5);
  expect(await now()).toBeLessThan(15);
  await expect(page.locator('[data-debug-label]')).toBeHidden(); // debug is off by default
});

test('debug mode: level label, F+J skips to the crossroads; J moves on without stars, F keeps playing', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.locator('input[aria-label="Your name"]').fill('Dev');
  await page.locator('.scale button').nth(2).click();
  await page.locator('button', { hasText: /^▶ Start$/ }).click();
  await expect(page.locator('.intro')).toBeVisible();
  await page.evaluate(() => (window as any).__game.showStart((window as any).__game.profile));
  // Parent area (adult check: the word backwards) → Testing → Debug mode.
  await page.locator('button', { hasText: 'Parents' }).click();
  const word = await page.locator('.adult-word').getAttribute('data-word');
  await page.locator('.adult-check input').fill([...word!].reverse().join(''));
  await page.locator('.adult-check button', { hasText: 'Continue' }).click();
  await page.locator('input[data-parent="debug"]').check();
  await page.locator('.parents button', { hasText: 'Done' }).click();
  await page.locator('button', { hasText: /Continue/ }).click();
  await startLevel(page);

  const label = page.locator('[data-debug-label]');
  await expect(label).toBeVisible();
  const plan = await page.evaluate(() => { const g = (window as any).__game; return { t: g.plan.templateId.replace('template.', ''), p: g.plan.paletteId.replace('palette.', '') }; });
  await expect(label).toHaveText(`L1 · ${plan.t} · ${plan.p}`);

  // Fast typing that overlaps F and J for a moment doesn't skip; holding both does.
  await typeKeys(page, 4);
  await rollFJ(page);
  await page.waitForTimeout(500);
  await expect(page.locator('.crossroads')).toHaveCount(0);
  await holdFJ(page);
  await expect(page.locator('.crossroads.debug-skip')).toBeVisible();
  await page.keyboard.press('KeyJ');
  await expect(page.locator('.intro')).toContainText('Level 2', { timeout: 10_000 });
  const after = await page.evaluate(async () => {
    const g = (window as any).__game;
    const { allSegments } = await (await import(/* @vite-ignore */ '/src/storage/profile.ts' as string));
    const segs = await allSegments();
    return { level: g.profile.campaign.level, results: g.profile.results.length, stars: Object.keys(g.profile.starsByTier).length, keys: segs.map((s: any) => s.level) };
  });
  expect(after).toEqual({ level: 2, results: 0, stars: 0, keys: [2] }); // level 1 earned nothing and isn't kept
  await expect(label).toContainText('L2 · ');

  // F at the skip screen keeps playing the level.
  await startLevel(page);
  await holdFJ(page);
  await expect(page.locator('.crossroads.debug-skip')).toBeVisible();
  await page.keyboard.press('KeyF');
  await expect(page.locator('.crossroads')).toHaveCount(0);
  await typeKeys(page, 3);
  expect(await page.evaluate(() => (window as any).__game.sim.state.phase)).toBe('play');
  expect(errors).toEqual([]);
});
