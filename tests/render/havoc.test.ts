/** Map-rotate havoc turns the world around the camera target, so travelling tracks stay in view. */
import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import mapRotate from '../../content/havocs/map-rotate/havoc';

describe('havoc.map-rotate', () => {
  it('keeps the camera target fixed while the world turns, even far from the origin', () => {
    const world = new THREE.Group();
    const target = new THREE.Vector3(6, -15, -44); // e.g. a marble 186 tiles along its track
    const rig = { pose: { target } } as never;
    for (let f = 0; f < 600; f++) mapRotate.apply({ world, rig, intensityP: 1000, time: 20_000 + f * 16, reducedMotion: false });
    expect(Math.abs(world.rotation.y)).toBeGreaterThan(0.1); // it really turned (~10°)
    world.updateMatrixWorld(true);
    const seen = world.localToWorld(target.clone());
    expect(seen.distanceTo(target)).toBeLessThan(1e-6);
    mapRotate.reset({ world, rig });
    expect(world.rotation.y).toBe(0);
    expect(world.position.length()).toBe(0);
  });
});
