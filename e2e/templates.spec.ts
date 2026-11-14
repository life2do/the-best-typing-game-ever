/**
 * Browser smoke test for every level template (game), one test per template, so each game is tested on
 * its own (D64). CI runs it per template (`TEMPLATES=<id>`) in its own job; locally it runs them all.
 *
 * For each template, in every view it supports: open the dev preview with the `pass` bot typing and
 * check there are no page errors, the simulation advances, and the world is actually drawn.
 */
import { test, expect } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd(); // Playwright runs from the repository root
const ORDER = 'fjdksla;ghrueiwoqptyvmcnxbz'.split('');
const only = process.env.TEMPLATES?.split(',').filter(Boolean);
const templates = readdirSync(join(ROOT, 'content/templates'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && (!only || only.includes(d.name)))
  .map((d) => ({ id: d.name, manifest: JSON.parse(readFileSync(join(ROOT, 'content/templates', d.name, 'manifest.json'), 'utf8')) }));

for (const { id, manifest } of templates) {
  const letters = ORDER.slice(0, Math.max(4, manifest.minLetters ?? 2)).filter((c) => c !== ';').join('');
  for (const view of manifest.views as string[]) {
    test(`@template ${id} (${view}) plays with the pass bot`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(`/dev/preview/?template=${id}&view=${view}&letters=${encodeURIComponent(letters)}&bot=pass&tier=7&seed=smoke`);
      await page.waitForFunction(() => (window as any).__preview?.sim);
      // The bot starts the level (F+J) and types; the prompt must advance.
      await expect
        .poll(async () => page.evaluate(() => { const s = (window as any).__preview.sim.state; return s.stage * 10_000 + s.prompt.pos + s.prompt.nextChunk * 100; }), { timeout: 30_000 })
        .toBeGreaterThan(20);
      // The world is drawn (skipped where the browser has no WebGL): some canvas pixels differ from the corner.
      const drawn = await page.evaluate(() => {
        const pv = (window as any).__preview;
        if (!pv.host.webgl) return null;
        const c = document.getElementById('world') as HTMLCanvasElement;
        const t = document.createElement('canvas');
        t.width = 64;
        t.height = 40;
        const g = t.getContext('2d')!;
        g.drawImage(c, 0, 0, 64, 40);
        const d = g.getImageData(0, 0, 64, 40).data;
        let n = 0;
        for (let i = 4; i < d.length; i += 4) if (d[i + 3] > 0 && Math.abs(d[i] - d[0]) + Math.abs(d[i + 1] - d[1]) + Math.abs(d[i + 2] - d[2]) > 30) n++;
        return n;
      });
      if (drawn !== null) expect(drawn, 'world pixels drawn').toBeGreaterThan(50);
      expect(errors).toEqual([]);
    });
  }
}
