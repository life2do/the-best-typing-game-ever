/** Racer view (3D chase cam): road, lanes, cones, overhead text signs, speed lines, super-speed trails. */
import * as THREE from 'three';
import type { TemplateView } from '@/render/types';
import { presetPose } from '@/render/rig';
import { fromQ, Pool } from '@/render/util';
import { makeLabel, setLabel } from '@/render/labels';
import { SUPER_SPEED_WPM_P } from '@/typing/tiers';
import type { RacerState } from './sim';

const LANE_W = 2.2;

const view: TemplateView = {
  id: 'template.racer',
  rules: [
    { icon: '🏎️', text: 'Type to drive. A steady rhythm is faster than rushing.' },
    { icon: '↔️', text: 'Space switches lanes.' },
    { icon: '✨', text: 'Type really fast for super-speed!' },
  ],
  create({ root, style, avatar }) {
    const road = new THREE.Group();
    root.add(road);
    const segPool = new Pool<number, THREE.Group>(road, (i) => {
      const g = new THREE.Group();
      const slab = new THREE.Mesh(new THREE.BoxGeometry(LANE_W * 3 + 1, 0.2, 9.8), style.material(i % 2 ? 'ground' : 'sky'));
      g.add(slab);
      for (const lx of [-LANE_W / 2, LANE_W / 2]) {
        const mark = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 3), style.material('glow'));
        mark.position.x = lx;
        g.add(mark);
      }
      for (const side of [-1, 1]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.5, 0.3), style.material('prop'));
        post.position.set(side * (LANE_W * 1.5 + 1), 0.75, 0);
        g.add(post);
      }
      g.position.z = -i * 10;
      return g;
    });
    const cones = new THREE.Group();
    root.add(cones);
    const conePool = new Pool<number, THREE.Mesh>(cones, () => new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.8, 10), style.material('hazard')));
    const board = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.15, 2.2), style.material('accent'));
    const rider = new THREE.Group();
    board.position.y = 0.3;
    avatar.root.position.y = 0.38;
    rider.add(board, avatar.root);
    root.add(rider);
    const sign = makeLabel(' ', 1.4);
    root.add(sign);
    const lines = new THREE.Group();
    root.add(lines);
    const lineMat = style.material('glow');
    for (let i = 0; i < 40; i++) {
      const l = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 4), lineMat);
      l.position.set((i % 8) - 4 + (i % 3) * 0.3, 0.5 + (i % 5), -i * 2);
      lines.add(l);
    }
    let laneX = 0;
    return {
      pose: (sim) => {
        const s = sim.state.tpl as RacerState;
        const p = presetPose('3d', 6, new THREE.Vector3(laneX * 0.5, 1.2, -fromQ(s.z) - 4));
        const sp = Math.min(1, sim.state.motion.v / 9000);
        p.fov = 60 + sp * 12;
        return p;
      },
      update(sim, alpha, now) {
        const s = sim.state.tpl as RacerState;
        const z = fromQ(s.z + sim.state.motion.v * alpha);
        const base = Math.floor(z / 10);
        segPool.sync(Array.from({ length: 16 }, (_, i) => base - 1 + i));
        const cmap = conePool.sync(s.cones.map((c) => c[0]).filter((cz) => fromQ(cz) > z - 5));
        for (const c of s.cones) {
          const m = cmap.get(c[0]);
          if (m) m.position.set(c[1] * LANE_W, 0.5, -fromQ(c[0]));
        }
        laneX += (s.lane * LANE_W - laneX) * 0.12;
        rider.position.set(laneX, 0, -z);
        rider.rotation.z = (s.lane * LANE_W - laneX) * -0.15;
        const p = sim.state.prompt;
        setLabel(sign, p.text.slice(p.pos, p.pos + 12).replace(/ /g, '·') || ' ', 1.4);
        sign.position.set(0, 4.2, -z - 14);
        const wpm = sim.liveWpmP();
        const sp = Math.min(1, sim.state.motion.v / 9000);
        const superSpeed = wpm >= SUPER_SPEED_WPM_P;
        lines.visible = sp > 0.3 || superSpeed;
        lines.position.z = -z - 10;
        for (const l of lines.children) {
          l.position.z = ((l.position.z + sp * 3 + (superSpeed ? 3 : 0)) % 80) - 80;
          l.scale.z = superSpeed ? 4 : 1 + sp * 2;
        }
        avatar.update(now, sp);
      },
      dispose() {},
    };
  },
};
export default view;
