/** Racer: the rider steers around cones instead of driving over them. */
import { test, expect } from '@playwright/test';

test('rider never drives over a cone', async ({ page }) => {
  await page.goto('/dev/preview/?template=racer&letters=fjdks&bot=pass&tier=4&seed=4');
  await page.waitForTimeout(2000);
  const closest = await page.evaluate(async () => {
    const { host, sim } = (window as any).__preview;
    let rider: any = null;
    host.scene.traverse((o: any) => {
      if (!rider && o.isMesh && o.geometry.type === 'BoxGeometry' && Math.abs(o.geometry.parameters.width - 1.4) < 1e-6) rider = o.parent;
    });
    let min = 99;
    let passes = 0;
    for (let i = 0; i < 400; i++) {
      await new Promise((r) => requestAnimationFrame(r));
      for (const c of sim.state.tpl.cones) {
        const cx = c[1] * 2.2;
        const cz = -c[0] / 65536;
        if (Math.abs(rider.position.z - cz) < 1.1) {
          // board is 2.2 long: the cone is alongside the board
          passes++;
          min = Math.min(min, Math.abs(rider.position.x - cx));
        }
      }
    }
    return { min, passes };
  });
  expect(closest.passes).toBeGreaterThan(0);
  // board half-width 0.7 + cone radius 0.35
  expect(closest.min).toBeGreaterThan(1.05);
});
