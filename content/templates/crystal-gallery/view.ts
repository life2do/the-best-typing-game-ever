/** Crystal gallery view (first person): a cave, crystals drifting closer with word labels; sung ones flare up. */
import * as THREE from 'three';
import type { TemplateView } from '@/render/types';
import { presetPose } from '@/render/rig';
import { fromQ, Pool } from '@/render/util';
import { makeLabel, setLabel } from '@/render/labels';
import type { Crystal, GalleryState } from './sim';

const SLOT_X = [-4.2, -2.1, 0, 2.1, 4.2];
const SLOT_Y = [2.9, 3.7, 2.6, 3.7, 2.9];
const LABEL_H = 1.15;

const view: TemplateView = {
  id: 'template.crystal-gallery',
  rules: [
    { icon: '💎', text: 'Singing crystals float toward you through the cave.' },
    { icon: '⌨️', text: 'Type a crystal\'s word, then Space, to make it chime.' },
    { icon: '🎶', text: 'Chime them all for stars — the crystals love to sing.' },
  ],
  create({ root, style }) {
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 40), style.material('ground'));
    floor.rotation.x = -Math.PI / 2;
    floor.position.z = -14;
    root.add(floor);
    for (let i = 0; i < 14; i++) {
      const st = new THREE.Mesh(new THREE.ConeGeometry(0.35 + (i % 3) * 0.15, 1.5 + (i % 4) * 0.6, 6), style.material('prop'));
      st.rotation.x = Math.PI;
      st.position.set(-8 + ((i * 37) % 16), 5.5, -4 - ((i * 53) % 24));
      root.add(st);
    }
    const group = new THREE.Group();
    root.add(group);
    const pool = new Pool<number, THREE.Group>(group, (id) => {
      const g = new THREE.Group();
      const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.5), style.material(id % 3 === 0 ? 'accent' : id % 3 === 1 ? 'ice' : 'glow'));
      gem.name = 'gem';
      gem.scale.set(0.8, 1.4, 0.8);
      const label = makeLabel(' ', LABEL_H, undefined, undefined, true);
      label.name = 'label';
      label.position.y = 1.35;
      g.add(gem, label);
      return g;
    });
    return {
      pose: () => presetPose('fpv', 6, new THREE.Vector3(0, 2.4, -1)),
      update(sim, _alpha, now) {
        const s = sim.state.tpl as GalleryState;
        const map = pool.sync(s.crystals.map((c: Crystal) => c.id));
        const anyLocked = sim.state.lockedTarget >= 0;
        const flicker = sim.state.frame - s.stumble < 15 ? 0.15 : 0;
        for (const c of s.crystals) {
          const g = map.get(c.id)!;
          const gem = g.getObjectByName('gem')!;
          const label = g.getObjectByName('label') as THREE.Sprite;
          const z = -fromQ(c.d);
          g.position.set(SLOT_X[c.slot], SLOT_Y[c.slot] + Math.sin(now / 600 + c.id) * 0.12, z);
          if (c.sung >= 0) {
            const age = (sim.state.frame - c.sung) / 90;
            gem.rotation.y = age * 12;
            g.position.y += age * 2.5;
            gem.scale.set(0.8 * (1 + age), 1.4 * (1 + age), 0.8 * (1 + age));
            label.visible = false;
            continue;
          }
          gem.rotation.y = now / 900 + c.id;
          gem.scale.set(0.8, 1.4 + flicker, 0.8);
          const t = sim.state.targets.find((x) => x.id === c.id);
          label.visible = !!t;
          if (t) {
            const locked = sim.suggestedTargetId() === t.id;
            const rest = t.text.slice(t.progress).replace(/ /g, '␣');
            if (locked) setLabel(label, rest, LABEL_H * 1.35, '#1a1a1a', 'rgba(255,209,102,0.97)');
            else setLabel(label, rest, LABEL_H, '#ffffff', 'rgba(0,0,0,0.7)');
            (label.material as THREE.SpriteMaterial).opacity = locked || !anyLocked ? 1 : 0.45;
            label.renderOrder = locked ? 12 : 10;
          }
        }
      },
      dispose() {},
    };
  },
};
export default view;
