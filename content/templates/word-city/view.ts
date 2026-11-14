/** Word city view (isometric): a 4×4 grid of plots; open plots show words, built ones grow block towers. */
import * as THREE from 'three';
import type { TemplateView } from '@/render/types';
import { presetPose } from '@/render/rig';
import { fromQ, Pool } from '@/render/util';
import { makeLabel, setLabel } from '@/render/labels';
import { PLOTS, type CityState } from './sim';

const SIZE = 2.6; // plot spacing
const LABEL_H = 0.95;
const plotPos = (i: number) => new THREE.Vector3(((i % 4) - 1.5) * SIZE, 0, (Math.floor(i / 4) - 1.5) * SIZE);

const view: TemplateView = {
  id: 'template.word-city',
  rules: [
    { icon: '🏗️', text: 'Empty plots wait for a word.' },
    { icon: '⌨️', text: 'Type a plot\'s word, then Space, to build a house there.' },
    { icon: '🏙️', text: 'Longer words make taller buildings — fill the whole city!' },
  ],
  create({ root, style, avatar }) {
    const board = new THREE.Mesh(new THREE.BoxGeometry(SIZE * 4 + 1, 0.4, SIZE * 4 + 1), style.material('ground'));
    board.position.y = -0.2;
    root.add(board);
    const plots = new THREE.Group();
    root.add(plots);
    const floorGeo = new THREE.BoxGeometry(1.7, 0.5, 1.7);
    const pool = new Pool<number, THREE.Group>(plots, (i) => {
      const g = new THREE.Group();
      const pad = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.08, 2.1), style.material('prop'));
      pad.position.y = 0.04;
      const tower = new THREE.Group();
      tower.name = 'tower';
      for (let f = 0; f < 9; f++) {
        const m = new THREE.Mesh(floorGeo, style.material(f % 2 ? 'accent' : 'ice'));
        m.position.y = 0.25 + f * 0.52;
        m.visible = false;
        tower.add(m);
      }
      const label = makeLabel(' ', LABEL_H, undefined, undefined, true);
      label.name = 'label';
      g.add(pad, tower, label);
      g.position.copy(plotPos(i));
      return g;
    });
    pool.sync(Array.from({ length: PLOTS }, (_, i) => i));
    const crane = new THREE.Group();
    const mast = new THREE.Mesh(new THREE.BoxGeometry(0.2, 6, 0.2), style.material('hazard'));
    mast.position.y = 3;
    const jib = new THREE.Mesh(new THREE.BoxGeometry(4, 0.18, 0.18), style.material('hazard'));
    jib.position.set(1.6, 6, 0);
    crane.add(mast, jib);
    crane.position.set(SIZE * 2.3, 0, -SIZE * 2.3);
    root.add(crane);
    avatar.root.position.set(-SIZE * 2.3, 0, SIZE * 2.3);
    root.add(avatar.root);
    let lastBuilt = 0;
    return {
      // Framed like tower defence: the board sits above the prompt bar.
      pose: () => presetPose('iso', 21, new THREE.Vector3(0, -2.4, 0)),
      update(sim, _alpha, now) {
        const s = sim.state.tpl as CityState;
        const map = pool.sync(Array.from({ length: PLOTS }, (_, i) => i));
        const anyLocked = sim.state.lockedTarget >= 0;
        for (const [i, g] of map) {
          const p = s.plots[i];
          const t = p.id >= 0 ? sim.state.targets.find((x) => x.id === p.id) : undefined;
          const tower = g.getObjectByName('tower')!;
          // Floors: built height, plus scaffolding for letters typed so far on an open plot.
          const grow = p.builtAt >= 0 ? Math.min(1, (sim.state.frame - p.builtAt) / 40) : 1;
          const typed = t ? t.progress : 0;
          tower.children.forEach((m, f) => {
            m.visible = f < p.height + typed;
            m.scale.set(1, f >= p.height ? 0.6 : f === p.height - 1 ? grow : 1, 1);
          });
          const label = g.getObjectByName('label') as THREE.Sprite;
          label.visible = !!t;
          label.position.y = 1.5 + (p.height + typed) * 0.52;
          if (t) {
            const locked = sim.suggestedTargetId() === t.id;
            const rest = t.text.slice(t.progress).replace(/ /g, '␣');
            if (locked) setLabel(label, rest, LABEL_H * 1.35, '#1a1a1a', 'rgba(255,209,102,0.97)');
            else setLabel(label, rest, LABEL_H, '#ffffff', 'rgba(0,0,0,0.7)');
            (label.material as THREE.SpriteMaterial).opacity = locked || !anyLocked ? 1 : 0.45;
            label.renderOrder = locked ? 12 : 10;
          }
        }
        const wob = sim.state.frame - s.stumble < 20 ? Math.sin(now / 30) * 0.1 : 0;
        crane.rotation.y = Math.sin(fromQ(s.crane) / 6) * 0.8 + wob;
        if (s.built !== lastBuilt) {
          lastBuilt = s.built;
          avatar.play('celebrate', now);
        }
        avatar.update(now, 0);
      },
      dispose() {
        floorGeo.dispose();
      },
    };
  },
};
export default view;
