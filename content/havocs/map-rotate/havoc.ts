/** Map rotation: the board slowly turns around its centre. Reduced motion: no rotation. Never touches input. */
import type { HavocVisual } from '@/render/types';

const havoc: HavocVisual = {
  id: 'havoc.map-rotate',
  apply({ world, intensityP, time, reducedMotion }) {
    if (reducedMotion) {
      world.rotation.y = 0;
      return;
    }
    const target = (intensityP / 1000) * (Math.PI / 2) * Math.sin(time / 9000);
    world.rotation.y += (target - world.rotation.y) * 0.05;
  },
  reset({ world }) {
    world.rotation.y = 0;
  },
};
export default havoc;
