/** Tower defence view (isometric): path, crystal tower, blobs with letters, ice cubes. */
import * as THREE from 'three';
import type { TemplateView } from '@/render/types';
import { presetPose } from '@/render/rig';
import { fromQ, Pool } from '@/render/util';
import { makeLabel, setLabel } from '@/render/labels';
import { PATH_LEN, type TowerState, type Creature } from './sim';

// Winding path on the board: straight, axis-aligned segments, parameterised 0..1 by arc length.
const WAY = [new THREE.Vector3(-6, 0, -5), new THREE.Vector3(-2, 0, -5), new THREE.Vector3(-2, 0, 0), new THREE.Vector3(3, 0, 0), new THREE.Vector3(3, 0, 4), new THREE.Vector3(6, 0, 4)];
const curve = new THREE.CurvePath<THREE.Vector3>();
for (let i = 1; i < WAY.length; i++) curve.add(new THREE.LineCurve3(WAY[i - 1], WAY[i]));
const PATH_W = 1.2;
const LABEL_H = 1.25;

/**
 * Flat path made of non-overlapping planes: a square at every waypoint plus one strip between each pair.
 * Planes have no side faces, so adjoining pieces can't z-fight. (The earlier flattened tube twisted
 * through itself at the corners and z-fought with its own faces.)
 */
function buildPath(mat: THREE.Material): THREE.Group {
  const g = new THREE.Group();
  const piece = (w: number, d: number, x: number, z: number) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, 0.05, z);
    g.add(m);
  };
  for (const w of WAY) piece(PATH_W, PATH_W, w.x, w.z);
  for (let i = 1; i < WAY.length; i++) {
    const a = WAY[i - 1];
    const b = WAY[i];
    const len = a.distanceTo(b) - PATH_W;
    if (len <= 0) continue;
    const horizontal = Math.abs(b.x - a.x) > Math.abs(b.z - a.z);
    piece(horizontal ? len : PATH_W, horizontal ? PATH_W : len, (a.x + b.x) / 2, (a.z + b.z) / 2);
  }
  return g;
}

const view: TemplateView = {
  id: 'template.tower-defence',
  rules: [
    { icon: '🫧', text: 'Friendly blobs carry letters to the crystal tower.' },
    { icon: '⌨️', text: 'Type a blob\'s letters, then press Space to freeze it into an ice cube.' },
    { icon: '🛡️', text: 'Nothing can hurt you — but freeze them all for stars!' },
  ],
  create({ root, style, avatar }) {
    const board = new THREE.Mesh(new THREE.BoxGeometry(16, 0.4, 14), style.material('ground'));
    board.position.y = -0.2;
    root.add(board);
    root.add(buildPath(style.material('prop')));
    const tower = new THREE.Group();
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(1), style.material('accent'));
    crystal.scale.set(0.8, 1.6, 0.8);
    crystal.position.y = 1.8;
    tower.add(crystal);
    tower.position.copy(WAY[WAY.length - 1]).add(new THREE.Vector3(1.2, 0, 0));
    root.add(tower);
    avatar.root.position.set(4.5, 0, 6);
    root.add(avatar.root);
    const creatures = new THREE.Group();
    root.add(creatures);
    const pool = new Pool<number, THREE.Group>(creatures, () => {
      const g = new THREE.Group();
      const blob = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 12), style.material('hazard'));
      blob.name = 'blob';
      blob.position.y = 0.45;
      const ice = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), style.material('ice'));
      ice.name = 'ice';
      ice.position.y = 0.55;
      const label = makeLabel(' ', LABEL_H, undefined, undefined, true);
      label.name = 'label';
      label.position.y = 1.9;
      g.add(blob, ice, label);
      return g;
    });
    let lastFrozen = 0;
    let lastBonk = -1;
    return {
      pose: () => presetPose('iso', 21, new THREE.Vector3(0, -2.6, 0)),
      update(sim, _alpha, now) {
        const s = sim.state.tpl as TowerState;
        const targets = sim.state.targets;
        const map = pool.sync(s.creatures.map((c: Creature) => c.id));
        for (const c of s.creatures) {
          const g = map.get(c.id)!;
          const u = Math.min(1, fromQ(c.pos) / fromQ(PATH_LEN));
          const p = curve.getPointAt(u);
          g.position.set(p.x + (c.lane - 1) * 0.3, 0, p.z + (c.lane - 1) * 0.3);
          const ice = g.getObjectByName('ice')!;
          const blob = g.getObjectByName('blob')!;
          const label = g.getObjectByName('label') as THREE.Sprite;
          const t = targets.find((x) => x.id === c.id);
          if (c.frozen >= 0) {
            ice.visible = true;
            const age = (sim.state.frame - c.frozen) / 600;
            g.scale.setScalar(Math.max(0.01, 1 - age));
            blob.scale.setScalar(0.8);
            label.visible = false;
          } else {
            ice.visible = false;
            g.scale.setScalar(1);
            blob.scale.set(1 + Math.sin(now / 200 + c.id) * 0.06, 1 - Math.sin(now / 200 + c.id) * 0.06, 1);
            label.visible = !!t;
            if (t) {
              const anyLocked = sim.state.lockedTarget >= 0;
              const locked = sim.state.lockedTarget === t.id;
              // Typed letters disappear; the trailing Space shows as ␣ (it confirms the freeze).
              const rest = t.text.slice(t.progress).replace(/ /g, '␣');
              if (locked) setLabel(label, rest, LABEL_H * 1.4, '#1a1a1a', 'rgba(255,209,102,0.97)');
              else setLabel(label, rest, LABEL_H, '#ffffff', 'rgba(0,0,0,0.7)');
              const mat = label.material as THREE.SpriteMaterial;
              mat.opacity = locked || !anyLocked ? 1 : 0.45;
              label.renderOrder = locked ? 12 : 10;
              label.position.y = locked ? 2.2 : 1.9;
            }
          }
        }
        if (s.frozenCount !== lastFrozen) {
          lastFrozen = s.frozenCount;
          avatar.play('celebrate', now);
        }
        if (s.lastBonk !== lastBonk) {
          lastBonk = s.lastBonk;
          crystal.scale.set(0.9, 1.5, 0.9);
        }
        crystal.scale.lerp(new THREE.Vector3(0.8, 1.6, 0.8), 0.05);
        crystal.rotation.y = now / 1500;
        avatar.update(now, 0);
      },
      dispose() {},
    };
  },
};
export default view;
