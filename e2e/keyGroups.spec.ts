/** Key-group levels in the browser: capitals need Shift; Enter, Backspace and Tab are typed, not acted on. */
import { test, expect, type Page } from '@playwright/test';
import { startLevel } from './helpers';

/** Type the expected characters (with Shift where needed) until `until` has been typed or n keys pass. */
async function typeExpected(page: Page, n: number, until?: (ch: string) => boolean): Promise<string[]> {
  const typed: string[] = [];
  for (let i = 0; i < n; i++) {
    // A long run can finish the level; at the crossroads F keeps playing (more stars).
    if ((await page.evaluate(() => (window as any).__game.sim.state.phase)) === 'crossroads') {
      await page.keyboard.press('KeyF');
      await expect.poll(() => page.evaluate(() => (window as any).__game.sim.state.phase)).toBe('play');
    }
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

// Level 27's game is picked by the (random) campaign seed; run it as a one-line game and as a targeting game.
for (const forced of ['template.pulse-runner', 'template.tower-defence'])
test(`capitals with Shift (${forced.replace('template.', '')}) and editing keys count as correct; the page does not react to them`, async ({ page }) => {
  test.setTimeout(150_000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.locator('.scale button').nth(3).click();
  await page.locator('button', { hasText: /^▶ Start$/ }).click();
  await expect(page.locator('.intro')).toBeVisible();

  // Level 27 (Capitals): the intro names the group; typing capitals with Shift is correct.
  await page.evaluate((t) => {
    const g = (window as any).__game;
    g.camp.levels[26] = { ...g.camp.levels[26], templateId: t, view: t === 'template.tower-defence' ? 'iso' : '2d' };
    return g.startLevel(27, false);
  }, forced);
  await expect(page.locator('.intro h2')).toContainText('Level 27: Capitals');
  await startLevel(page);
  const typed = await typeExpected(page, 120, (c) => /[A-Z]/.test(c));
  expect(typed.some((c) => /[A-Z]/.test(c))).toBe(true);
  // Level-wide totals: the per-stage counters (state.sm) reset when a stage ends, and with a random
  // campaign seed the first capital can come after the first stage.
  const totals = () => page.evaluate(() => { const s = (window as any).__game.sim.state; return { correct: s.correctTotal as number, errors: s.errorTotal as number }; });
  const s27 = await totals();
  expect(s27.errors).toBe(0);
  expect(s27.correct).toBe(typed.length);
  // A capital typed without Shift is a mistake: type up to a capital, then press it without Shift. Pick a
  // capital whose lower-case letter is not also a valid next key: in a targeting game it would correctly
  // start another target instead of counting as a mistake.
  let code = '';
  for (let i = 0; i < 300 && !code; i++) {
    // Typing on can finish the level (180 characters); at the crossroads F keeps playing for more stars.
    if ((await page.evaluate(() => (window as any).__game.sim.state.phase)) === 'crossroads') {
      await page.keyboard.press('KeyF');
      await expect.poll(() => page.evaluate(() => (window as any).__game.sim.state.phase)).toBe('play');
    }
    code = await page.evaluate(() => {
      const g = (window as any).__game;
      if (g.sim.state.phase !== 'play') return '';
      const exp = g.sim.expectedChars() as string[];
      const cap = exp.find((c) => /[A-Z]/.test(c) && !exp.includes(c.toLowerCase()));
      return cap ? (g.sim.setup.language.codeOf[cap] as string) : '';
    });
    if (!code) await typeExpected(page, 1);
  }
  expect(code, 'a capital to press without Shift').not.toBe('');
  await page.keyboard.press(code);
  await expect.poll(async () => (await totals()).errors).toBe(1);

  // Level 33 (Editing keys): Enter, Backspace and Tab are typed like letters and don't move focus or navigate.
  await page.evaluate(() => (window as any).__game.startLevel(33, false));
  await expect(page.locator('.intro h2')).toContainText('Level 33: Editing keys');
  await startLevel(page);
  const url = page.url();
  // Diagnostics: record every mistake the game judges (what was expected vs typed), so a failure says why.
  await page.evaluate(() => {
    const g = (window as any).__game;
    (window as any).__mistakes = [];
    g.sim.on((e: any) => {
      if (e.type === 'error') (window as any).__mistakes.push({ typed: e.char, expected: e.expected, frame: e.frame, template: g.sim.setup.templateId, targets: g.sim.state.targets.map((t: any) => `${JSON.stringify(t.text)}@${t.progress}`), locked: g.sim.state.lockedTarget });
    });
  });
  const typed33 = await typeExpected(page, 400, (c) => /[\b\n\t]/.test(c));
  expect(typed33.some((c) => /[\b\n\t]/.test(c))).toBe(true);
  const s33 = await totals();
  expect(s33.errors, `mistakes judged in level 33: ${JSON.stringify(await page.evaluate(() => (window as any).__mistakes))}`).toBe(0);
  expect(page.url()).toBe(url);
  expect(await page.evaluate(() => document.activeElement === document.body || document.activeElement === null)).toBe(true);
  expect(errors).toEqual([]);
});
