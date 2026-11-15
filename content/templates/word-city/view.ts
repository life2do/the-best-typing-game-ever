/**
 * Word city view (isometric): a 4×4 grid of plots; open plots show words, built ones grow block towers.
 * A finished district floats away on balloons and the empty pads of the next one settle in.
 */
import * as THREE from 'three';
import type { TemplateView } from '@/render/types';
import { presetPose } from '@/render/rig';
import { fromQ, Pool } from '@/render/util';
import { makeLabel, setLabel } from '@/render/labels';
import { PLOTS, type CityState } from './sim';

const SIZE = 2.6; // plot spacing
const LABEL_H = 0.95;
/** frames the finished district takes to float away (3 s) */
const LIFT_FRAMES = 180;
const ease = (k: number) => k * k * (3 - 2 * k);
const plotPos = (i: number) => new THREE.Vector3(((i % 4) - 1.5) * SIZE, 0, (Math.floor(i / 4) - 1.5) * SIZE);

const view: TemplateView = {
  id: 'template.word-city',
  rules: [
    { icon: '🏗️', text: 'Empty plots wait for a word.' },
    { icon: '⌨️', text: 'Type a plot\'s word, then Space, to build a house there.' },
    { icon: '🏙️', text: 'Longer words make taller buildings. Fill all 16 plots and the district floats away on balloons!' },
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
    // The district that lifted off last: its houses float up on balloons, built when a lift starts.
    const lifted = new THREE.Group();
    root.add(lifted);
    const balloonGeo = new THREE.SphereGeometry(0.45, 14, 10);
    const stringGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.4, 4);
    let liftShown = -1;
    const buildLifted = (heights: number[]) => {
      lifted.clear();
      heights.forEach((hgt, i) => {
        const house = new THREE.Group();
        for (let f = 0; f < hgt; f++) {
          const m = new THREE.Mesh(floorGeo, style.material(f % 2 ? 'accent' : 'ice'));
          m.position.y = 0.25 + f * 0.52;
          house.add(m);
        }
        const top = 0.25 + hgt * 0.52;
        const balloon = new THREE.Mesh(balloonGeo, style.material(i % 3 === 0 ? 'hazard' : i % 3 === 1 ? 'glow' : 'accent'));
        balloon.position.y = top + 1.6;
        const string = new THREE.Mesh(stringGeo, style.material('prop'));
        string.position.y = top + 0.7;
        house.add(balloon, string);
        house.position.copy(plotPos(i));
        house.userData.phase = i;
        lifted.add(house);
      });
    };
    // District counter on a little sign at the front of the board.
    const sign = makeLabel(' ', 0.9, undefined, undefined, true);
    sign.position.set(0, 0.9, SIZE * 2.4);
    sign.visible = false;
    root.add(sign);
    let signFor = -1;
    let lastBuilt = 0;
    return {
      // Framed like tower defence: the board sits above the prompt bar.
      pose: () => presetPose('iso', 21, new THREE.Vector3(0, -2.4, 0)),
      update(sim, _alpha, now) {
        const s = sim.state.tpl as CityState;
        const map = pool.sync(Array.from({ length: PLOTS }, (_, i) => i));
        const anyLocked = sim.state.lockedTarget >= 0;
        // A finished district floats up and away; the new district's pads settle in meanwhile.
        const liftK = s.liftAt >= 0 ? (sim.state.frame - s.liftAt) / LIFT_FRAMES : 1;
        if (liftK < 1) {
          if (liftShown !== s.liftAt) {
            liftShown = s.liftAt;
            buildLifted(s.lifted);
          }
          lifted.visible = true;
          const k = ease(Math.max(0, liftK));
          lifted.children.forEach((house) => {
            const ph = house.userData.phase as number;
            house.position.y = k * 16 + Math.sin(now / 400 + ph) * 0.15 * k;
            house.rotation.y = Math.sin(now / 900 + ph) * 0.2 * k;
          });
        } else if (lifted.visible) {
          lifted.visible = false;
          lifted.clear();
          liftShown = -1;
        }
        const settle = liftK < 1 ? 0.3 + 0.7 * ease(Math.max(0, liftK)) : 1;
        if (signFor !== s.district) {
          signFor = s.district;
          sign.visible = s.district > 0;
          if (s.district > 0) setLabel(sign, `🏙️ ${s.district} ${s.district === 1 ? 'district' : 'districts'} built`, 0.9, '#1a1a1a', 'rgba(255,209,102,0.95)');
        }
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
          g.scale.setScalar(p.height > 0 || t ? 1 : settle);
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
        balloonGeo.dispose();
        stringGeo.dispose();
      },
    };
  },
};
export default view;
