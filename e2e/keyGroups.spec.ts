/** Key-group levels in the browser: capitals need Shift; Enter, Backspace and Tab are typed, not acted on. */
import { test, expect, type Page } from '@playwright/test';
import { startLevel } from './helpers';

/** Type the expected characters (with Shift where needed) until `until` has been typed or n keys pass. */
async function typeExpected(page: Page, n: number, until?: (ch: string) => boolean): Promise<string[]> {
  const typed: string[] = [];
  for (let i = 0; i < n; i++) {
    const { ch, code, shift } = await page.evaluate(() => {
      const g = (window as any).__game;
      const ch = g.sim.expectedChars()[0] as string;
      const lang = g.sim.setup.language;
      return { ch, code: lang.codeOf[ch] as string, shift: !!lang.needsShift[ch] };
    });
    await page.keyboard.press(shift ? `Shift+${code}` : code);
    typed.push(ch);
    await page.waitForTimeout(50);
    if (until?.(ch)) break;
  }
  return typed;
}

test('capitals with Shift and editing keys count as correct; the page does not react to them', async ({ page }) => {
  test.setTimeout(150_000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.locator('.scale button').nth(3).click();
  await page.locator('button', { hasText: /^▶ Start$/ }).click();
  await expect(page.locator('.intro')).toBeVisible();

  // Level 27 (Capitals): the intro names the group; typing capitals with Shift is correct.
  await page.evaluate(() => (window as any).__game.startLevel(27, false));
  await expect(page.locator('.intro h2')).toContainText('Level 27: Capitals');
  await startLevel(page);
  const typed = await typeExpected(page, 120, (c) => /[A-Z]/.test(c));
  expect(typed.some((c) => /[A-Z]/.test(c))).toBe(true);
  const s27 = await page.evaluate(() => (window as any).__game.sim.state.sm);
  expect(s27.errors).toBe(0);
  expect(s27.correct).toBe(typed.length);
  // A capital typed without Shift is a mistake: type up to the next capital, then press it without Shift.
  for (let i = 0; i < 200; i++) {
    const ch = await page.evaluate(() => (window as any).__game.sim.expectedChars()[0] as string);
    if (/[A-Z]/.test(ch)) break;
    await typeExpected(page, 1);
  }
  const code = await page.evaluate(() => {
    const g = (window as any).__game;
    return g.sim.setup.language.codeOf[g.sim.expectedChars()[0]] as string;
  });
  await page.keyboard.press(code);
  await expect.poll(() => page.evaluate(() => (window as any).__game.sim.state.sm.errors)).toBe(1);

  // Level 33 (Editing keys): Enter, Backspace and Tab are typed like letters and don't move focus or navigate.
  await page.evaluate(() => (window as any).__game.startLevel(33, false));
  await expect(page.locator('.intro h2')).toContainText('Level 33: Editing keys');
  await startLevel(page);
  const url = page.url();
  const typed33 = await typeExpected(page, 400, (c) => /[\b\n\t]/.test(c));
  expect(typed33.some((c) => /[\b\n\t]/.test(c))).toBe(true);
  const s33 = await page.evaluate(() => (window as any).__game.sim.state.sm);
  expect(s33.errors).toBe(0);
  expect(page.url()).toBe(url);
  expect(await page.evaluate(() => document.activeElement === document.body || document.activeElement === null)).toBe(true);
  expect(errors).toEqual([]);
});
