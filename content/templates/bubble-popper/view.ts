/** Bubble-popper view (2D underwater): rising word bubbles that pop into sparkles. */
import * as THREE from 'three';
import type { TemplateView } from '@/render/types';
import { presetPose } from '@/render/rig';
import { fromQ, Pool } from '@/render/util';
import { makeLabel, setLabel } from '@/render/labels';
import { TOP, type Bubble, type BubbleState } from './sim';

const COL_X = [-4.5, -1.5, 1.5, 4.5];
const FLOOR = -4.5;
const LABEL_H = 0.9;

const view: TemplateView = {
  id: 'template.bubble-popper',
  rules: [
    { icon: '🫧', text: 'Bubbles carry words up from the sea floor.' },
    { icon: '⌨️', text: 'Type a bubble\'s word, then Space, to pop it.' },
    { icon: '✨', text: 'Pop them all for stars — bubbles never hurt anyone.' },
  ],
  create({ root, style, avatar }) {
    const water = new THREE.Mesh(new THREE.PlaneGeometry(16, 12), style.material('sky'));
    water.position.z = -1;
    root.add(water);
    const floor = new THREE.Mesh(new THREE.BoxGeometry(16, 0.6, 1), style.material('ground'));
    floor.position.set(0, FLOOR - 0.3, 0);
    root.add(floor);
    for (let i = 0; i < 5; i++) {
      const weed = new THREE.Mesh(new THREE.ConeGeometry(0.25, 1.2 + (i % 3) * 0.4, 6), style.material('prop'));
      weed.position.set(-6 + i * 3.1, FLOOR + 0.5, -0.5);
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
      pose: () => presetPose('2d', 11, new THREE.Vector3(0, 0.3, 0)),
      update(sim, _alpha, now) {
        const s = sim.state.tpl as BubbleState;
        const map = pool.sync(s.bubbles.map((b: Bubble) => b.id));
        const anyLocked = sim.state.lockedTarget >= 0;
        const wobble = sim.state.frame - s.stumble < 20 ? 0.12 : 0.04;
        for (const b of s.bubbles) {
          const g = map.get(b.id)!;
          const y = FLOOR + 0.8 + (fromQ(b.y) / fromQ(TOP)) * 8;
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
