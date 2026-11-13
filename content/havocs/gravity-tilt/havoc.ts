/** Gravity tilt: the world sways (camera roll). Reduced motion: a small fixed tilt. Never touches input. */
import type { HavocVisual } from '@/render/types';

const havoc: HavocVisual = {
  id: 'havoc.gravity-tilt',
  apply({ rig, intensityP, time, reducedMotion }) {
    const max = 12 * (intensityP / 1000);
    rig.extraRoll = reducedMotion ? max * 0.3 : Math.sin(time / 2600) * max;
  },
  reset({ rig }) {
    rig.extraRoll = 0;
  },
};
export default havoc;
