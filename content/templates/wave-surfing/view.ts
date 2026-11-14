/** Beat-wave surfing view (3D chase): rolling wave crests, letters floating ahead, a surfer riding the energy. */
import * as THREE from 'three';
import type { TemplateView } from '@/render/types';
import { presetPose } from '@/render/rig';
import { fromQ, Pool } from '@/render/util';
import { GlyphTrail } from '@/render/glyphTrail';
import type { SurfState } from './sim';

const FORWARD = new THREE.Vector3(0, 0, -1);
const CREST_GAP = 4;

const view: TemplateView = {
  id: 'template.wave-surfing',
  rules: [
    { icon: '🏄', text: 'Type the letters floating on the water to paddle over them.' },
    { icon: '🌊', text: 'Every right key builds the wave under your board.' },
    { icon: '🎵', text: 'Keep a steady beat and the wave stays big!' },
  ],
  create({ root, style, avatar }) {
    const sea = new THREE.Mesh(new THREE.PlaneGeometry(60, 140), style.material('sky'));
    sea.rotation.x = -Math.PI / 2;
    sea.position.y = -0.05;
    root.add(sea);
    const crests = new THREE.Group();
    root.add(crests);
    // Each crest is two halves with a calm lane in the middle, so the letters on the water stay visible.
    const pool = new Pool<number, THREE.Group>(crests, (i) => {
      const g = new THREE.Group();
      for (const side of [-1, 1]) {
        const m = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 8, 10, 1, false, 0, Math.PI), style.material(i % 2 ? 'ice' : 'glow'));
        m.rotation.z = Math.PI / 2;
        m.position.x = side * 6;
        g.add(m);
      }
      g.position.z = -i * CREST_GAP;
      return g;
    });
    const sun = new THREE.Mesh(new THREE.CircleGeometry(4, 32), style.material('accent'));
    root.add(sun);
    const board = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 2.4), style.material('accent'));
    const rider = new THREE.Group();
    board.position.y = 0.2;
    avatar.root.position.y = 0.26;
    avatar.root.scale.setScalar(0.75);
    rider.add(board, avatar.root);
    root.add(rider);
    const trail = new GlyphTrail({ mode: 'ground', start: 5.4, gap: 2.3, size: 2 });
    root.add(trail.group);
    let renderZ = 0;
    return {
      pose: () => {
        const p = presetPose('3d', 9, new THREE.Vector3(0, 0.7, -renderZ - 0.5));
        p.follow = 1;
        return p;
      },
      update(sim, alpha, now) {
        const s = sim.state.tpl as SurfState;
        renderZ = fromQ(s.z + sim.state.motion.v * alpha);
        const e = s.energy / 1000;
        const first = Math.floor(renderZ / CREST_GAP) - 1;
        const map = pool.sync(Array.from({ length: 24 }, (_, i) => first + i));
        for (const [i, g] of map) {
          // Crests swell with the wave energy and roll gently.
          const swell = 0.4 + e * 1.6;
          for (const m of g.children) m.scale.set(1, 1, swell);
          g.position.y = Math.sin(now / 500 + i) * 0.15 * (0.5 + e);
        }
        sea.position.z = -renderZ - 40;
        sun.position.set(6, 6, -renderZ - 70);
        const wob = sim.state.frame - s.stumble < 20 ? Math.sin(now / 30) * 0.2 : 0;
        rider.position.set(Math.sin(now / 900) * 0.6, 0.2 + e * 0.9 + Math.sin(now / 250) * 0.08 * e, -renderZ);
        rider.rotation.z = wob + Math.sin(now / 700) * 0.12 * e;
        rider.rotation.x = -0.15 * e;
        const p = sim.state.prompt;
        trail.update(p.text, p.pos, new THREE.Vector3(0, 0.06, -renderZ), FORWARD, now);
        if (sim.state.frame - s.lastBeat === 1) avatar.play('move', now);
        avatar.update(now, Math.min(1, sim.state.motion.v / 9000));
      },
      dispose() {
        trail.dispose();
      },
    };
  },
};
export default view;
