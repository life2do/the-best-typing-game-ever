/** Bubble-popper view (2D underwater): rising word bubbles that pop into sparkles. */
import * as THREE from 'three';
import type { TemplateView } from '@/render/types';
import { presetPose } from '@/render/rig';
import { fromQ, Pool } from '@/render/util';
import { makeLabel, setLabel } from '@/render/labels';
import { TOP, type Bubble, type BubbleState } from './sim';

// Columns spread across the (zoomed-out) width so neighbouring word labels don't overlap.
export const COL_X = [-7.2, -2.4, 2.4, 7.2];
export const FLOOR = -4.5;
const SEABED = 9;
/**
 * Framing: the bottom ~38% of the screen holds the typing prompt and the keyboard, so the camera is aimed
 * below the play area and zoomed out a little — the sea floor sits just above the prompt and every bubble,
 * from the floor to the surface, stays in view.
 */
export const FRAME_HEIGHT = 18.5;
export const CAMERA_Y = FLOOR + 0.12 * FRAME_HEIGHT; // floor at 62% of the screen height
export const LABEL_H = 1.2;
/** How far a bubble rises from the floor to the surface (world units). */
const RISE = 7;
/** Lowest and highest points a bubble (ball and label) reaches, in world units. */
export const BUBBLE_SPAN = { bottom: FLOOR + 0.8 - 0.75, top: FLOOR + 0.8 + RISE + 1.15 + LABEL_H * 1.35 / 2 };

const view: TemplateView = {
  id: 'template.bubble-popper',
  rules: [
    { icon: '🫧', text: 'Bubbles carry words up from the sea floor.' },
    { icon: '⌨️', text: 'Type a bubble\'s word, then Space, to pop it.' },
    { icon: '✨', text: 'Pop them all for stars — bubbles never hurt anyone.' },
  ],
  create({ root, style, avatar }) {
    // The water and the seabed reach well below the floor line: the camera keeps the bubbles above the
    // typing prompt and keyboard, and the seabed fills the screen behind them.
    const water = new THREE.Mesh(new THREE.PlaneGeometry(48, 30), style.material('sky'));
    water.position.set(0, -2.5, -1);
    root.add(water);
    const floor = new THREE.Mesh(new THREE.BoxGeometry(48, SEABED, 1), style.material('ground'));
    floor.position.set(0, FLOOR - SEABED / 2, 0);
    root.add(floor);
    for (let i = 0; i < 5; i++) {
      const weed = new THREE.Mesh(new THREE.ConeGeometry(0.25, 1.2 + (i % 3) * 0.4, 6), style.material('prop'));
      weed.position.set(-9.6 + i * 4.8, FLOOR + 0.5, -0.5);
      root.add(weed);
    }
    avatar.root.scale.setScalar(0.7);
    avatar.root.position.set(0, FLOOR, 0.3);
    root.add(avatar.root);
    const group = new THREE.Group();
    root.add(group);
    const pool = new Pool<number, THREE.Group>(group, () => {
      const g = new THREE.Group();
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.75, 20, 14), style.material('ice'));
      ball.name = 'ball';
      const shine = new THREE.Mesh(new THREE.CircleGeometry(0.16, 12), style.material('glow'));
      shine.position.set(-0.3, 0.3, 0.75);
      const label = makeLabel(' ', LABEL_H, undefined, undefined, true);
      label.name = 'label';
      label.position.y = 1.15;
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.7, 0.8, 24), style.material('glow'));
      ring.name = 'ring';
      g.add(ball, shine, label, ring);
      return g;
    });
    let lastPops = 0;
    return {
      pose: () => presetPose('2d', FRAME_HEIGHT, new THREE.Vector3(0, CAMERA_Y, 0)),
      update(sim, _alpha, now) {
        const s = sim.state.tpl as BubbleState;
        const map = pool.sync(s.bubbles.map((b: Bubble) => b.id));
        const anyLocked = sim.state.lockedTarget >= 0;
        const wobble = sim.state.frame - s.stumble < 20 ? 0.12 : 0.04;
        for (const b of s.bubbles) {
          const g = map.get(b.id)!;
          const y = FLOOR + 0.8 + (fromQ(b.y) / fromQ(TOP)) * RISE;
          g.position.set(COL_X[b.col] + Math.sin(now / 500 + b.id) * 0.25, y, 0);
          const ball = g.getObjectByName('ball')!;
          const ring = g.getObjectByName('ring') as THREE.Mesh;
          const label = g.getObjectByName('label') as THREE.Sprite;
          if (b.popped >= 0) {
            const age = (sim.state.frame - b.popped) / 120;
            ball.visible = false;
            label.visible = false;
            ring.visible = true;
            ring.scale.setScalar(1 + age * 2);
            (ring.material as THREE.Material).opacity = Math.max(0, 1 - age);
            continue;
          }
          ball.visible = true;
          ring.visible = false;
          ball.scale.set(1 + Math.sin(now / 180 + b.id) * wobble, 1 - Math.sin(now / 180 + b.id) * wobble, 1);
          const t = sim.state.targets.find((x) => x.id === b.id);
          label.visible = !!t;
          if (t) {
            const locked = sim.suggestedTargetId() === t.id;
            const rest = t.text.slice(t.progress).replace(/ /g, '␣');
            if (locked) setLabel(label, rest, LABEL_H * 1.35, '#1a1a1a', 'rgba(255,209,102,0.97)');
            else setLabel(label, rest, LABEL_H, '#ffffff', 'rgba(0,0,0,0.65)');
            (label.material as THREE.SpriteMaterial).opacity = locked || !anyLocked ? 1 : 0.45;
            label.renderOrder = locked ? 12 : 10;
          }
        }
        if (s.pops !== lastPops) {
          lastPops = s.pops;
          avatar.play('celebrate', now);
        }
        avatar.update(now, 0);
      },
      dispose() {},
    };
  },
};
export default view;
