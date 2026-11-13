/** Racer chase camera stays steady while typing (no per-keystroke zoom pulse or rider bobbing). */
import { test, expect } from '@playwright/test';

test('racer camera is steady while the bot types', async ({ page }) => {
  await page.goto('/dev/preview/?template=racer&letters=fjdks&bot=pass&tier=5&havoc=0');
  await page.waitForTimeout(3000);
  const r = await page.evaluate(async () => {
    const host = (window as any).__preview.host;
    let rider: any = null;
    host.scene.traverse((o: any) => {
      if (!rider && o.isMesh && o.geometry.type === 'BoxGeometry' && Math.abs(o.geometry.parameters.width - 1.4) < 1e-6) rider = o;
    });
    const ys: number[] = [];
    const fovs: number[] = [];
    for (let i = 0; i < 90; i++) {
      await new Promise((res) => requestAnimationFrame(res));
      ys.push(rider.getWorldPosition(new host.rig.camera.position.constructor()).project(host.rig.camera).y);
      fovs.push(host.rig.camera.fov);
    }
    const spread = (a: number[]) => Math.max(...a) - Math.min(...a);
    const jerk = (a: number[]) => {
      let m = 0;
      for (let i = 2; i < a.length; i++) m = Math.max(m, Math.abs(a[i] - 2 * a[i - 1] + a[i - 2]));
      return m;
    };
    return { ySpread: spread(ys), fovJerk: jerk(fovs) };
  });
  // Before the fix: rider moved ~0.14 of the screen and the FOV jumped ~14° frame to frame.
  expect(r.ySpread).toBeLessThan(0.04);
  expect(r.fovJerk).toBeLessThan(0.5);
});
