/** Dungeon crawler view (isometric): a staircase of rooms, letters on the floor ahead, gems and torches. */
import * as THREE from 'three';
import type { TemplateView } from '@/render/types';
import { presetPose } from '@/render/rig';
import { Pool } from '@/render/util';
import { makeLabel, setLabel } from '@/render/labels';
import { GEM_AT, ROOM, type DungeonState } from './sim';

/** Rooms alternate between heading +x and heading -z (away from the camera, up the screen). */
const dirOf = (r: number) => (r % 2 === 0 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 0, -1));
const sideOf = (r: number) => (r % 2 === 0 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(1, 0, 0));

function roomOrigin(r: number): THREE.Vector3 {
  const o = new THREE.Vector3();
  for (let i = 0; i < r; i++) o.addScaledVector(dirOf(i), ROOM);
  return o;
}

/** World position of step n. */
export function cellAt(n: number): THREE.Vector3 {
  const r = Math.floor(n / ROOM);
  return roomOrigin(r).addScaledVector(dirOf(r), n - r * ROOM);
}

const view: TemplateView = {
  id: 'template.dungeon-crawler',
  rules: [
    { icon: '🗝️', text: 'Walk through the rooms one step at a time.' },
    { icon: '🔤', text: 'Type the letter on the next tile to take a step.' },
    { icon: '💎', text: 'Every room hides a gem — collect them all. No monsters here!' },
  ],
  create({ root, style, avatar }) {
    const rooms = new THREE.Group();
    root.add(rooms);
    const roomPool = new Pool<number, THREE.Group>(rooms, (r) => {
      const g = new THREE.Group();
      const d = dirOf(r);
      const side = sideOf(r);
      for (let k = 0; k < ROOM; k++)
        for (let w = -1; w <= 1; w++) {
          const t = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.2, 0.96), style.material((k + w) % 2 ? 'ground' : 'prop'));
          t.position.copy(d.clone().multiplyScalar(k)).addScaledVector(side, w).setY(-0.1);
          g.add(t);
        }
      // Corner pillars (rooms change direction, so full walls would cross each other) with torches on top.
      for (const k of [-0.5, ROOM - 0.5])
        for (const w of [-1.6, 1.6]) {
          const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.1, 0.35), style.material('hazard'));
          pillar.position.copy(d.clone().multiplyScalar(k)).addScaledVector(side, w).setY(0.55);
          const torch = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), style.material('glow'));
          torch.name = 'torch';
          torch.position.copy(pillar.position).setY(1.25);
          g.add(pillar, torch);
        }
      const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.28), style.material('accent'));
      gem.name = 'gem';
      gem.position.copy(d.clone().multiplyScalar(GEM_AT)).setY(0.45);
      g.add(gem);
      g.position.copy(roomOrigin(r));
      return g;
    });
    const labels = new THREE.Group();
    root.add(labels);
    const labelPool = new Pool<number, THREE.Sprite>(labels, () => makeLabel(' ', 0.75, undefined, undefined, true));
    root.add(avatar.root);
    const hero = new THREE.Vector3();
    return {
      pose: () => presetPose('iso', 14, hero.clone().add(new THREE.Vector3(0, -2.6, 1))),
      update(sim, _alpha, now) {
        const s = sim.state.tpl as DungeonState;
        const p = sim.state.prompt;
        const r = Math.floor(s.steps / ROOM);
        const rm = roomPool.sync([r - 1, r, r + 1, r + 2].filter((x) => x >= 0));
        for (const [ri, g] of rm) {
          const gemTaken = ri * ROOM + GEM_AT <= s.steps;
          const gem = g.getObjectByName('gem')!;
          gem.visible = !gemTaken || sim.state.frame - s.lastGem < 40;
          gem.rotation.y = now / 600;
          gem.position.y = gemTaken ? 0.45 + Math.min(1.5, (sim.state.frame - s.lastGem) / 25) : 0.45 + Math.sin(now / 300) * 0.08;
          g.traverse((o) => {
            if (o.name === 'torch') o.scale.setScalar(gemTaken ? 1.4 : 0.6);
          });
        }
        const lm = labelPool.sync(Array.from({ length: 6 }, (_, i) => i));
        for (const [i, l] of lm) {
          const ch = p.text[p.pos + i];
          l.visible = ch !== undefined && sim.state.phase === 'play';
          if (ch === undefined) continue;
          l.position.copy(cellAt(s.steps + 1 + i)).setY(0.6);
          if (i === 0) setLabel(l, ch === ' ' ? '␣' : ch, 0.95, '#1a1a1a', 'rgba(255,209,102,0.97)');
          else setLabel(l, ch === ' ' ? '␣' : ch, 0.7, '#ffffff', 'rgba(0,0,0,0.6)');
          (l.material as THREE.SpriteMaterial).opacity = Math.max(0.35, 1 - i * 0.13);
        }
        hero.lerp(cellAt(s.steps), 0.25);
        const bump = sim.state.frame - s.stumble < 15 ? Math.sin(now / 20) * 0.06 : 0;
        avatar.root.position.copy(hero).add(new THREE.Vector3(bump, 0, 0));
        if (sim.state.frame - s.lastGem === 1) avatar.play('celebrate', now);
        avatar.update(now, 0);
      },
      dispose() {},
    };
  },
};
export default view;
