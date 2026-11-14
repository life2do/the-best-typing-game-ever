/** M2.9 hot seat: two players, PIN at party start, turns with handovers, shared results, stats per player, verify. */
import { test, expect, type Page } from '@playwright/test';

async function newPlayer(page: Page, name: string): Promise<void> {
  await page.locator('input[aria-label="Your name"]').fill(name);
  await page.locator('.scale button').nth(2).click();
  await page.locator('button', { hasText: /^▶ Start$/ }).click();
  await expect(page.locator('.intro')).toBeVisible();
}

async function fj(page: Page): Promise<void> {
  await page.keyboard.down('KeyF');
  await page.keyboard.down('KeyJ');
  await page.keyboard.up('KeyF');
  await page.keyboard.up('KeyJ');
}

/** Plays the party round like the players would: F + J at intros and handovers, otherwise the next expected key. */
async function playRound(page: Page): Promise<{ handovers: number; turns: string[] }> {
  const end = Date.now() + 150_000;
  let handovers = 0;
  const turns: string[] = [];
  let lastTurn = -1;
  while (Date.now() < end) {
    const st = await page.evaluate(() => {
      const g = (window as any).__game;
      if (document.querySelector('.party-results')) return { kind: 'results' };
      if (!g.party || !g.sim) return { kind: 'wait' };
      const turn = g.party.turn;
      const name = g.party.slots[turn].profile.name;
      if (g.handover) return { kind: 'handover', turn, name };
      if (g.host.transitioning || g.swapPending) return { kind: 'wait' };
      const phase = g.sim.state.phase;
      if (phase === 'intro') return { kind: document.querySelector('.intro') ? 'intro' : 'wait', turn, name };
      if (phase !== 'play') return { kind: 'wait' };
      const ch = g.sim.expectedChars()[0];
      return { kind: 'type', turn, name, code: g.sim.setup.language.codeOf[ch] };
    });
    if (st.kind === 'results') return { handovers, turns };
    if ('turn' in st && st.turn !== lastTurn) {
      lastTurn = st.turn as number;
      turns.push(st.name as string);
    }
    if (st.kind === 'handover') {
      handovers++;
      await expect(page.locator('.handover h1')).toContainText(`${st.name}'s turn`);
      await fj(page);
      await expect(page.locator('.handover')).toHaveCount(0);
    } else if (st.kind === 'intro') {
      await expect(page.locator('.intro h1, .intro h2').first()).toContainText(`${st.name}'s turn`);
      await fj(page);
      await page.waitForTimeout(150);
    } else if (st.kind === 'type' && st.code) {
      await page.keyboard.press(st.code as string);
      await page.waitForTimeout(25);
    } else await page.waitForTimeout(100);
  }
  throw new Error('the party round did not finish');
}

test('hot seat: coop round with two players, handovers, shared results, verify', async ({ page }) => {
  test.setTimeout(240_000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('dialog', (d) => void d.accept());
  await page.goto('/');
  await page.evaluate(() => ((window as any).__load = (m: string) => import(/* @vite-ignore */ m)));
  await newPlayer(page, 'Mia');
  // Mia gets a PIN: 1-2-3-4 (asked once, when the party starts).
  await page.evaluate(async () => {
    const g = (window as any).__game;
    const { pinHash } = await (window as any).__load('/src/storage/profileIO.ts');
    g.profile.pinHash = pinHash(g.profile.profileId, '1234');
    const { saveProfile } = await (window as any).__load('/src/storage/profile.ts');
    await saveProfile(g.profile);
    await g.showProfiles();
  });
  await page.locator('.profile-tile.new').click();
  await newPlayer(page, 'Leo');
  await page.evaluate(() => (window as any).__game.showProfiles());

  await page.locator('[data-party="open"]').click();
  await expect(page.locator('[data-party="start"]')).toBeDisabled();
  const tiles = page.locator('[data-party-player]');
  await expect(tiles).toHaveCount(2);
  await page.locator('.party-setup .profile-tile', { hasText: 'Mia' }).click();
  await page.locator('.party-setup .profile-tile', { hasText: 'Leo' }).click();
  await page.locator('[data-party-mode="coop"]').click();
  await page.locator('[data-party="start"]').click();
  // Mia's PIN, then the party starts with Mia's turn.
  await expect(page.locator('.pin')).toBeVisible();
  for (const d of ['Digit1', 'Digit2', 'Digit3', 'Digit4']) await page.keyboard.press(d);

  const { handovers, turns } = await playRound(page);
  expect(turns.slice(0, 4)).toEqual(['Mia', 'Leo', 'Mia', 'Leo']); // turns swap after every stage
  expect(handovers).toBeGreaterThanOrEqual(2);
  await expect(page.locator('[data-party-result]')).toHaveCount(2);

  // Both players typed the same letters, and each got their own result and stats.
  const r = await page.evaluate(() => {
    const g = (window as any).__game;
    return g.party.slots.map((s: any) => ({ letters: s.plan.letters.join(''), results: s.profile.results.length, stars: s.seg.stars, complete: s.seg.complete, keys: Object.keys(s.profile.perKey).length }));
  });
  expect(r[0].letters).toBe(r[1].letters);
  for (const x of r) expect(x).toMatchObject({ results: 1, complete: true, keys: expect.any(Number) });
  for (const x of r) expect(x.stars).toBeGreaterThanOrEqual(1);

  await page.locator('[data-party="end"]').click();
  await expect(page.locator('.profiles')).toBeVisible();

  // The party run re-simulates on the verify page, one stream per player.
  await page.goto('/verify/');
  await page.locator('.runs button', { hasText: 'Party' }).click();
  await expect(page.locator('.verdict.ok')).toBeVisible();
  const v = await page.evaluate(() => (window as any).__verify.verdicts.map((x: any) => ({ ok: x.ok, player: x.player, complete: x.complete })));
  expect(v).toEqual([{ ok: true, player: 0, complete: true }, { ok: true, player: 1, complete: true }]);
  expect(errors).toEqual([]);
});

test('hot seat: side by side gives each player their own letters; companions their own campaign', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => ((window as any).__load = (m: string) => import(/* @vite-ignore */ m)));
  await newPlayer(page, 'Ana');
  await page.evaluate(() => (window as any).__game.showProfiles());
  await page.locator('.profile-tile.new').click();
  await newPlayer(page, 'Ben');
  const plans = await page.evaluate(async () => {
    const g = (window as any).__game;
    const { listProfiles, saveProfile } = await (window as any).__load('/src/storage/profile.ts');
    const ps = (await listProfiles()).sort((a: any, b: any) => (a.name < b.name ? -1 : 1));
    ps[1].campaign.level = 5; // Ben is further along
    await saveProfile(ps[1]);
    const out: any = {};
    for (const mode of ['side', 'companions']) {
      await g.startParty({ players: ps, mode, swap: 'stage' });
      out[mode] = g.party.slots.map((s: any) => ({ letters: s.plan.letters.length, template: s.plan.templateId, seed: s.seg.campaignSeed, own: s.profile.campaign.seed }));
      await g.endParty();
    }
    return out;
  });
  expect(plans.side[0].template).toBe(plans.side[1].template);
  expect(plans.side[1].letters).toBeGreaterThan(plans.side[0].letters);
  for (const s of plans.companions) expect(s.seed).toBe(s.own);
  // The handover/intro shows whose turn it is.
  await page.evaluate(async () => {
    const g = (window as any).__game;
    const { listProfiles } = await (window as any).__load('/src/storage/profile.ts');
    await g.startParty({ players: await listProfiles(), mode: 'side', swap: 'level' });
  });
  await expect(page.locator('.intro')).toContainText("'s turn");
});
