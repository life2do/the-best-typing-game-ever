/** Climbing tower view (3D orbit): holds spiral up a tower, letters on the next holds, flags on word ends. */
import * as THREE from 'three';
import type { TemplateView } from '@/render/types';
import { presetPose } from '@/render/rig';
import { Pool } from '@/render/util';
import { makeLabel, setLabel } from '@/render/labels';
import type { ClimbState } from './sim';

const R = 2.6; // tower radius
const TURN = 0.32; // radians per hold
const RISE = 0.42; // height per hold

/** Hold n on the spiral (just outside the tower wall). */
export function holdAt(n: number, r = R + 0.25): THREE.Vector3 {
  const a = n * TURN;
  return new THREE.Vector3(Math.sin(a) * r, n * RISE, Math.cos(a) * r);
}

const view: TemplateView = {
  id: 'template.climbing-tower',
  rules: [
    { icon: '🧗', text: 'Climb the tower one handhold at a time.' },
    { icon: '🔤', text: 'Type the letter on the next hold to reach it.' },
    { icon: '🚩', text: 'Each Space plants a flag. No falling — just keep climbing!' },
  ],
  create({ root, style, avatar }) {
    const tower = new THREE.Group();
    root.add(tower);
    const segPool = new Pool<number, THREE.Group>(tower, (k) => {
      const g = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 4, 24), style.material(k % 2 ? 'ground' : 'prop'));
      g.add(body);
      for (let w = 0; w < 6; w++) {
        const win = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.1), style.material('sky'));
        const a = (w / 6) * Math.PI * 2 + k;
        win.position.set(Math.sin(a) * (R + 0.02), 0.6, Math.cos(a) * (R + 0.02));
        win.rotation.y = a;
        g.add(win);
      }
      g.position.y = k * 4 + 2;
      return g;
    });
    const holds = new THREE.Group();
    root.add(holds);
    const holdPool = new Pool<number, THREE.Group>(holds, (n) => {
      const g = new THREE.Group();
      const h = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), style.material(n % 3 === 0 ? 'accent' : n % 3 === 1 ? 'hazard' : 'glow'));
      const flag = new THREE.Group();
      flag.name = 'flag';
      const pole = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.7, 0.04), style.material('prop'));
      pole.position.y = 0.35;
      const cloth = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.25), style.material('accent'));
      cloth.position.set(0.2, 0.58, 0);
      flag.add(pole, cloth);
      g.add(h, flag);
      g.position.copy(holdAt(n));
      return g;
    });
    const labels = new THREE.Group();
    root.add(labels);
    const labelPool = new Pool<number, THREE.Sprite>(labels, () => makeLabel(' ', 0.6, undefined, undefined, true));
    avatar.root.scale.setScalar(0.7);
    root.add(avatar.root);
    const climber = new THREE.Vector3();
    let climbT = 0;
    return {
      pose: () => {
        // Orbit camera: outside the tower, looking at the climber from its side of the spiral.
        // Aimed below the climber so they (and the holds ahead) sit above the prompt bar.
        const p = presetPose('3d', 9.5, climber.clone().add(new THREE.Vector3(0, -1.1, 0)));
        p.yaw = (climbT * TURN * 180) / Math.PI; // the rig places the camera along (sin yaw, cos yaw) from the target
        p.pitch = 10;
        return p;
      },
      update(sim, _alpha, now) {
        const s = sim.state.tpl as ClimbState;
        const p = sim.state.prompt;
        climbT += (s.holds - climbT) * 0.2;
        const k0 = Math.floor((s.holds * RISE) / 4) - 2;
        segPool.sync([0, 1, 2, 3, 4, 5].map((i) => k0 + i).filter((k) => k >= 0));
        const first = Math.max(0, s.holds - 10);
        const hm = holdPool.sync(Array.from({ length: 18 }, (_, i) => first + i));
        for (const [n, g] of hm) (g.getObjectByName('flag') as THREE.Group).visible = s.flags.includes(n);
        const lm = labelPool.sync(Array.from({ length: 6 }, (_, i) => i));
        for (const [i, l] of lm) {
          const ch = p.text[p.pos + i];
          l.visible = ch !== undefined && sim.state.phase === 'play';
          if (ch === undefined) continue;
          l.position.copy(holdAt(s.holds + 1 + i, R + 0.75));
          if (i === 0) setLabel(l, ch === ' ' ? '␣' : ch, 0.8, '#1a1a1a', 'rgba(255,209,102,0.97)');
          else setLabel(l, ch === ' ' ? '␣' : ch, 0.6, '#ffffff', 'rgba(0,0,0,0.6)');
          (l.material as THREE.SpriteMaterial).opacity = Math.max(0.4, 1 - i * 0.12);
        }
        const hug = sim.state.frame - s.stumble < 20 ? 0.12 : 0;
        climber.copy(holdAt(climbT, R + 0.45 - hug));
        avatar.root.position.copy(climber).add(new THREE.Vector3(0, -0.3, 0));
        avatar.root.rotation.y = climbT * TURN;
        if (sim.state.frame - s.lastHold === 1) avatar.play('move', now);
        avatar.update(now, 0);
      },
      dispose() {},
    };
  },
};
export default view;
