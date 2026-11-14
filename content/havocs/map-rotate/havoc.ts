/**
 * Map rotation: the board slowly turns around the point the camera is looking at. Reduced motion: no
 * rotation. Never touches input.
 *
 * It used to turn the world around the origin, which is fine for boards centred there (tower defence,
 * word city) but swung travelling tracks (marble run, dungeon crawler, maze snake) off screen once they
 * were far from the origin. Turning around the camera target keeps what the player is watching in place.
 */
import type { HavocVisual } from '@/render/types';

const havoc: HavocVisual = {
  id: 'havoc.map-rotate',
  apply({ world, rig, intensityP, time, reducedMotion }) {
    const want = reducedMotion ? 0 : (intensityP / 1000) * (Math.PI / 2) * Math.sin(time / 9000);
    const a = world.rotation.y + (want - world.rotation.y) * 0.05;
    world.rotation.y = a;
    // Keep the pivot (the camera target, in world-local coordinates) where it is: position = P − R(a)·P.
    const p = rig.pose.target;
    const c = Math.cos(a);
    const s = Math.sin(a);
    world.position.set(p.x - (p.x * c + p.z * s), 0, p.z - (-p.x * s + p.z * c));
  },
  reset({ world }) {
    world.rotation.y = 0;
    world.position.set(0, 0, 0);
  },
};
export default havoc;
