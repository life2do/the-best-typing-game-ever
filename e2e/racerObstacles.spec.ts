/** Racer: each Space turns the route into a neighbouring lane and a cone blocks the old lane. */
import { test, expect } from '@playwright/test';

test('cones block the lane left at each Space; letters and rider never hit them', async ({ page }) => {
  await page.goto('/dev/preview/?template=racer&letters=fjdks&bot=pass&tier=4&seed=4');
  await page.waitForTimeout(2000);
  const r = await page.evaluate(async () => {
    const { host } = (window as any).__preview;
    let rider: any = null;
    host.scene.traverse((o: any) => {
      if (!rider && o.isMesh && o.geometry.type === 'BoxGeometry' && Math.abs(o.geometry.parameters.width - 1.4) < 1e-6) rider = o.parent;
    });
    let riderMin = 99;
    let letterMin = 99;
    let conesSeen = 0;
    for (let i = 0; i < 300; i++) {
      await new Promise((res) => requestAnimationFrame(res));
      const cones: any[] = [];
      const glyphs: any[] = [];
      host.scene.traverse((o: any) => {
        if (!o.isMesh || !o.visible) return;
        if (o.geometry.type === 'ConeGeometry') cones.push(o);
        if (o.geometry.type === 'PlaneGeometry' && Math.abs(o.rotation.x + Math.PI / 2) < 1e-6 && o.material.opacity > 0.5) glyphs.push(o);
      });
      conesSeen = Math.max(conesSeen, cones.length);
      for (const c of cones) {
        if (Math.abs(rider.position.z - c.position.z) < 1.1) riderMin = Math.min(riderMin, Math.abs(rider.position.x - c.position.x));
        for (const g of glyphs) if (Math.abs(g.position.z - c.position.z) < 0.7) letterMin = Math.min(letterMin, Math.abs(g.position.x - c.position.x));
      }
    }
    return { riderMin, letterMin, conesSeen };
  });
  expect(r.conesSeen).toBeGreaterThan(0);
  expect(r.riderMin).toBeGreaterThan(1.05); // board half-width 0.7 + cone radius 0.4
  expect(r.letterMin).toBeGreaterThan(1.2);
});
