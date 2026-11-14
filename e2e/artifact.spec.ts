/**
 * M2.10: the artifact (scratch letters free), the PNG with the proof inside, and the verify page: full check
 * of the PNG (fingerprint, summary, ring, hidden name), the ring-only screenshot lookup, and a segment from
 * another build re-simulated on that build's engine.
 */
import { test, expect, type Page } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';
import { readITXt } from '../src/proof/png';
import { startLevel } from './helpers';

async function finishLevel(page: Page): Promise<void> {
  const end = Date.now() + 120_000;
  while (Date.now() < end) {
    const st = await page.evaluate(() => {
      const g = (window as any).__game;
      const s = g.sim?.state;
      if (!s) return { phase: 'none' };
      return { phase: s.phase, code: s.phase === 'play' ? g.sim.setup.language.codeOf[g.sim.expectedChars()[0]] : null };
    });
    if (st.phase === 'crossroads') {
      await page.keyboard.press('KeyJ');
      return;
    }
    if (st.code) await page.keyboard.press(st.code);
    await page.waitForTimeout(30);
  }
  throw new Error('level 1 did not finish');
}

test('artifact: scratch letters, save the PNG with proof, verify it fully and by its ring', async ({ page }, info) => {
  test.setTimeout(180_000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.locator('input[aria-label="Your name"]').fill('Ada');
  await page.locator('.scale button').nth(2).click();
  await page.locator('button', { hasText: /^▶ Start$/ }).click();
  await startLevel(page);
  await finishLevel(page);
  await expect(page.locator('.intro')).toBeVisible();

  // The artifact: every learned letter starts under foil; typing a letter scratches it free. (Shown with no
  // level running, as in the game: a running level keeps adding snapshots, which moves the fingerprint on.)
  await page.evaluate(async () => {
    const g = (window as any).__game;
    await g.persist();
    await g.showProfiles();
    await g.showArtifact(g.profile);
  });
  await expect(page.locator('.artifact')).toBeVisible();
  await expect(page.locator('.artifact-progress')).toContainText('0 / ');
  await page.keyboard.press('KeyF');
  await expect(page.locator('.artifact-progress')).toContainText('1 / ');
  await page.keyboard.press('KeyF'); // already free: nothing more
  await page.keyboard.press('KeyJ');
  await expect(page.locator('.artifact-progress')).toContainText('Every letter is free! (2)'); // level 1 teaches F and J
  const shownFp = await page.locator('.artifact .fingerprint').textContent();
  const shot = info.outputPath('artifact-screenshot.png');
  await page.locator('.artifact-canvas').screenshot({ path: shot });

  // Save the picture with a hidden name: the PNG carries the proof in an iTXt chunk.
  await page.locator('[data-artifact="identity"]').selectOption('hashed');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.locator('[data-artifact="png"]').click()]);
  expect(dl.suggestedFilename()).toMatch(/^typing-artifact-.*\.png$/);
  const pngPath = info.outputPath('artifact.png');
  await dl.saveAs(pngPath);
  const proof = JSON.parse(readITXt(new Uint8Array(readFileSync(pngPath)), 'tbtge-proof')!);
  expect(proof.format).toBe('tbtge-proof/1');
  expect(proof.identity.mode).toBe('hashed');
  expect(JSON.stringify(proof)).not.toContain('Ada');
  const [dl2] = await Promise.all([page.waitForEvent('download'), page.locator('[data-artifact="proof"]').click()]);
  const proofPath = info.outputPath('run.proof');
  await dl2.saveAs(proofPath);

  // Full verification of the PNG: segments, fingerprint chain, summary, code ring, hidden name.
  await page.goto('/verify/');
  await page.locator('[data-verify="file"]').setInputFiles(pngPath);
  await expect(page.locator('.verdict.ok').first()).toBeVisible();
  await expect(page.locator('[data-check="chain"]')).toHaveClass(/ok/);
  await expect(page.locator('[data-check="summary"]')).toHaveClass(/ok/);
  await expect(page.locator('[data-check="ring"]')).toHaveClass(/ok/);
  await page.locator('[data-verify="name"]').fill('Leo');
  await expect(page.locator('[data-verify="name-result"]')).toContainText('not this name');
  await page.locator('[data-verify="name"]').fill('ada');
  await expect(page.locator('[data-verify="name-result"]')).toContainText('matches');
  const v = await page.evaluate(() => (window as any).__verify.verdicts.map((x: any) => x.ok));
  expect(v.length).toBeGreaterThanOrEqual(1);
  expect(v.every(Boolean)).toBe(true);

  // A screenshot carries only the ring: a fingerprint lookup among this device's runs.
  await page.goto('/verify/');
  await page.locator('[data-verify="file"]').setInputFiles(shot);
  await expect(page.locator('.fingerprint')).toContainText((shownFp ?? '').replace('Fingerprint ', ''));
  await expect(page.locator('.verdict.ok')).toContainText('matches');
  expect(await page.evaluate(() => (window as any).__verify.weak.matches)).toBe(1);

  // A segment recorded on another build is re-simulated on that build's engine (here: this build's own
  // engine page standing in for the published /v/<id>/verify/?engine=1).
  const other = JSON.parse(readFileSync(proofPath, 'utf8'));
  other.segments[0].build = 'sha256-anotherbuild0000000000';
  const otherPath = info.outputPath('other-build.proof');
  writeFileSync(otherPath, JSON.stringify(other));
  await page.goto('/verify/');
  await page.evaluate(() => ((window as any).__engineBase = '/verify/?engine=1'));
  await page.locator('[data-verify="file"]').setInputFiles(otherPath);
  await expect(page.locator('[data-check="own-build"]')).toBeVisible({ timeout: 20_000 });
  const checked = await page.evaluate(() => (window as any).__verify.verdicts.map((x: any) => [x.ok, x.checkedOn]));
  expect(checked[0]).toEqual([true, 'own']);
  expect(errors).toEqual([]);
});

test('a tampered proof fails the fingerprint check', async ({ page }, info) => {
  await page.goto('/');
  await page.locator('input[aria-label="Your name"]').fill('Bo');
  await page.locator('.scale button').nth(2).click();
  await page.locator('button', { hasText: /^▶ Start$/ }).click();
  await startLevel(page);
  for (let i = 0; i < 12; i++) await page.keyboard.press(i % 2 ? 'KeyJ' : 'KeyF');
  await page.evaluate(async () => {
    const g = (window as any).__game;
    await g.persist();
    await g.showProfiles();
    await g.showArtifact(g.profile);
  });
  const [dl] = await Promise.all([page.waitForEvent('download'), page.locator('[data-artifact="proof"]').click()]);
  const p = info.outputPath('t.proof');
  await dl.saveAs(p);
  const proof = JSON.parse(readFileSync(p, 'utf8'));
  proof.run = proof.run.slice(0, -4) + (proof.run.endsWith('AAAA') ? 'BBBB' : 'AAAA');
  writeFileSync(p, JSON.stringify(proof));
  await page.goto('/verify/');
  await page.locator('[data-verify="file"]').setInputFiles(p);
  await expect(page.locator('[data-check="chain"]')).toHaveClass(/bad/);
});
