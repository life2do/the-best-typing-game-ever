/** Dive/flatten transitions have no visible snap: the camera moves continuously (docs/09 acceptance). */
import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { CameraRig, presetPose } from '@/render/rig';

function sample(from: ReturnType<typeof presetPose>, to: ReturnType<typeof presetPose>) {
  const rig = new CameraRig();
  rig.setPose(from);
  rig.transition(to, 1000, 0);
  const out: { pos: THREE.Vector3; fov: number; visible: number }[] = [];
  for (let t = 0; t <= 1000; t += 10) {
    rig.update(t, 16 / 10);
    const cam = rig.camera;
    const dist = cam.position.distanceTo(rig.pose.target);
    out.push({ pos: cam.position.clone(), fov: cam.fov, visible: 2 * dist * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) });
  }
  return out;
}

describe('camera rig transitions', () => {
  const cases: [string, string][] = [['2d', 'iso'], ['iso', '3d'], ['3d', '2d'], ['2d', '3d']];
  for (const [a, b] of cases)
    it(`${a} → ${b}: continuous field of view and constant-ish frame height`, () => {
      const s = sample(presetPose(a as any, 10), presetPose(b as any, 10));
      for (let i = 1; i < s.length; i++) {
        expect(Math.abs(s[i].fov - s[i - 1].fov)).toBeLessThan(3); // degrees per 10 ms step
        expect(Math.abs(s[i].visible - 10)).toBeLessThan(1e-6); // dolly zoom keeps the frame height
      }
      expect(s[0].fov).toBeCloseTo(presetPose(a as any).fov, 5);
      expect(s[s.length - 1].fov).toBeCloseTo(presetPose(b as any).fov, 5);
    });
});
