/** Marble run view (isometric): a zig-zag staircase track, letters over the next tiles, a rolling marble. */
import * as THREE from 'three';
import type { TemplateView } from '@/render/types';
import { presetPose } from '@/render/rig';
import { fromQ, Pool } from '@/render/util';
import { makeLabel, setLabel } from '@/render/labels';
import type { MarbleState } from './sim';

const RUN = 5; // tiles per straight run
const STEP = 0.35; // drop per run

/** Centre of track tile n: runs of 5 tiles alternate along +x and -x, moving away from the camera (up the screen) and down a step. */
export function tileAt(n: number): THREE.Vector3 {
  const run = Math.floor(n / RUN);
  const k = n - run * RUN;
  const x = run % 2 === 0 ? k : RUN - 1 - k;
  return new THREE.Vector3((x - (RUN - 1) / 2) * 1.2, -run * STEP, -run * 1.2);
}

/** Position along the track at a fractional tile index. */
function along(t: number): THREE.Vector3 {
  const a = Math.floor(t);
  return tileAt(a).lerp(tileAt(a + 1), t - a);
}

const view: TemplateView = {
  id: 'template.marble-run',
  rules: [
    { icon: '🔮', text: 'Every right key lays the next piece of track.' },
    { icon: '➡️', text: 'The marble rolls along as far as the track goes.' },
    { icon: '🔔', text: 'Each Space hangs a bell that rings when the marble rolls by.' },
  ],
  create({ root, style, avatar }) {
    const tiles = new THREE.Group();
    root.add(tiles);
    const pool = new Pool<number, THREE.Group>(tiles, (n) => {
      const g = new THREE.Group();
      const t = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.25, 1.15), style.material(n % 2 ? 'prop' : 'ground'));
      t.name = 'tile';
      const bell = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.35, 10), style.material('glow'));
      bell.name = 'bell';
      bell.position.set(0, 0.9, 0.45);
      g.add(t, bell);
      g.position.copy(tileAt(n));
      return g;
    });
    const labels = new THREE.Group();
    root.add(labels);
    const labelPool = new Pool<number, THREE.Sprite>(labels, () => makeLabel(' ', 0.8, undefined, undefined, true));
    const marble = new THREE.Mesh(new THREE.SphereGeometry(0.35, 20, 14), style.material('accent'));
    root.add(marble);
    avatar.root.scale.setScalar(0.8);
    root.add(avatar.root);
    const look = new THREE.Vector3();
    return {
      // The marble sits a little below the middle; the track ahead climbs up the screen, clear of the prompt.
      pose: () => presetPose('iso', 14, look.clone().add(new THREE.Vector3(0, -2.6, 1))),
      update(sim, _alpha, now) {
        const s = sim.state.tpl as MarbleState;
        const p = sim.state.prompt;
        const first = Math.max(0, s.laid - 12);
        const map = pool.sync(Array.from({ length: s.laid - first }, (_, i) => first + i));
        for (const [n, g] of map) {
          const bell = g.getObjectByName('bell')!;
          bell.visible = s.bells.includes(n);
          // Ring: the bell swings right after the marble passes it.
          const passed = fromQ(s.pos) - n;
          bell.rotation.z = passed > 0 && passed < 1.5 ? Math.sin(now / 60) * 0.5 * (1.5 - passed) : 0;
        }
        // Letters float over the tiles still to be laid.
        const lm = labelPool.sync(Array.from({ length: 6 }, (_, i) => i));
        for (const [i, l] of lm) {
          const ch = p.text[p.pos + i];
          l.visible = ch !== undefined && sim.state.phase === 'play';
          if (ch === undefined) continue;
          l.position.copy(tileAt(s.laid + i)).add(new THREE.Vector3(0, 0.8, 0));
          if (i === 0) setLabel(l, ch === ' ' ? '␣' : ch, 1.05, '#1a1a1a', 'rgba(255,209,102,0.97)');
          else setLabel(l, ch === ' ' ? '␣' : ch, 0.8, '#ffffff', 'rgba(0,0,0,0.6)');
          (l.material as THREE.SpriteMaterial).opacity = Math.max(0.35, 1 - i * 0.12);
        }
        const t = fromQ(s.pos);
        const wob = sim.state.frame - s.stumble < 20 ? Math.sin(now / 25) * 0.08 : 0;
        marble.position.copy(along(t)).add(new THREE.Vector3(wob, 0.47, 0));
        marble.rotation.z = -t * 2;
        look.lerp(along(t), 0.08);
        avatar.root.position.copy(tileAt(Math.max(0, Math.floor(t) - 2))).add(new THREE.Vector3(0, 0.12, 1));
        avatar.update(now, Math.min(1, sim.state.motion.v / 4000));
      },
      dispose() {},
    };
  },
};
export default view;
