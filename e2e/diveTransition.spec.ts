/**
 * Visual check of the dive transition (docs/09 M1 acceptance: "no visible snap"): step the 2D platformer →
 * isometric tower defence transition frame by frame at 60 fps, screenshot each frame (so CSS effects on
 * the canvas count) and require that no frame changes much more than its neighbours.
 */
import { test, expect } from '@playwright/test';

const FRAME_MS = 1000 / 60;
const TRANSITION_MS = 2400; // src/render/host.ts
const T0 = 100_000;

test('dive transition has no visible snap', async ({ page }) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 480, height: 300 });
  await page.goto('/dev/preview/?template=platformer&letters=fjdk&havoc=0');
  await page.waitForFunction(() => (window as any).__preview?.host);
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    (window as any).__preview.stop();
    // Hide the HUD so only the world (canvas + page background) is compared.
    document.getElementById('ui')!.style.visibility = 'hidden';
  });

  /** Mean absolute RGB difference (0–255) between consecutive frames, measured on 96×60 thumbnails. */
  const frames: string[] = [];
  const shoot = async (i: number) => {
    await page.evaluate((t) => (window as any).__preview.renderAt(t), T0 + i * FRAME_MS);
    frames.push((await page.screenshot({ type: 'png' })).toString('base64'));
  };
  for (let i = -5; i < 0; i++) await shoot(i);
  await page.evaluate((t) => (window as any).__preview.dive('tower-defence', undefined, t), T0);
  const n = Math.ceil(TRANSITION_MS / FRAME_MS) + 10;
  for (let i = 0; i <= n; i++) await shoot(i);

  const diffs: number[] = await page.evaluate(async (pngs) => {
    const c = document.createElement('canvas');
    c.width = 96;
    c.height = 60;
    const g = c.getContext('2d', { willReadFrequently: true })!;
    g.imageSmoothingQuality = 'high';
    const px: Uint8ClampedArray[] = [];
    for (const b64 of pngs) {
      const bmp = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
      g.drawImage(bmp, 0, 0, 96, 60);
      px.push(g.getImageData(0, 0, 96, 60).data);
    }
    const out: number[] = [];
    for (let i = 1; i < px.length; i++) {
      let s = 0;
      for (let k = 0; k < px[i].length; k += 4) s += Math.abs(px[i][k] - px[i - 1][k]) + Math.abs(px[i][k + 1] - px[i - 1][k + 1]) + Math.abs(px[i][k + 2] - px[i - 1][k + 2]);
      out.push(s / ((px[i].length / 4) * 3));
    }
    return out;
  }, frames);

  // A snap is one frame that changes far more than the frames around it: compare each frame's change with
  // the median change of the 4 frames on either side. Edges crossing pixel boundaries while the camera
  // moves give up to ~3×; the world swap before its cross-fade gave ~6×.
  let worst = 0;
  let worstAt = -1;
  for (let i = 0; i < diffs.length; i++) {
    const near = [...diffs.slice(Math.max(0, i - 4), i), ...diffs.slice(i + 1, i + 5)].sort((a, b) => a - b);
    const ratio = diffs[i] / Math.max(0.25, near[Math.floor(near.length / 2)]);
    if (ratio > worst) [worst, worstAt] = [ratio, i];
  }
  if (process.env.DIVE_DEBUG) console.log(diffs.map((d) => d.toFixed(2)).join(' '));
  console.log(`max frame change ${Math.max(...diffs).toFixed(2)}, worst spike ×${worst.toFixed(2)} at frame ${worstAt}`);
  expect(worst, `frame ${worstAt} changes ×${worst.toFixed(2)} more than its neighbours`).toBeLessThan(3);
  expect(Math.max(...diffs)).toBeLessThan(6);
});
