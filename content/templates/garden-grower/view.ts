/** Garden grower view (2D side): a soil bed with letter seed markers; watered seeds sprout and bloom. */
import * as THREE from 'three';
import type { TemplateView } from '@/render/types';
import { presetPose } from '@/render/rig';
import { fromQ, Pool } from '@/render/util';
import { GlyphTrail } from '@/render/glyphTrail';
import { SEED_GAP, type GardenState } from './sim';

const RIGHT = new THREE.Vector3(1, 0, 0);

const view: TemplateView = {
  id: 'template.garden-grower',
  rules: [
    { icon: '🌱', text: 'Every right key waters the next seed in your garden.' },
    { icon: '🌷', text: 'Watered seeds sprout and bloom while you keep typing.' },
    { icon: '🌻', text: 'Finish a word to grow a big sunflower.' },
  ],
  create({ root, style, avatar }) {
    const bed = new THREE.Mesh(new THREE.BoxGeometry(80, 0.6, 1), style.material('ground'));
    bed.position.set(0, -0.3, 0);
    root.add(bed);
    root.add(avatar.root);
    const plants = new THREE.Group();
    root.add(plants);
    const pool = new Pool<number, THREE.Group>(plants, (i) => {
      const g = new THREE.Group();
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 1, 6), style.material('prop'));
      stem.name = 'stem';
      const head = new THREE.Mesh(new THREE.CircleGeometry(0.28, 10), style.material(i % 3 === 0 ? 'accent' : i % 3 === 1 ? 'hazard' : 'glow'));
      head.name = 'head';
      const leaf = new THREE.Mesh(new THREE.CircleGeometry(0.14, 6), style.material('prop'));
      leaf.name = 'leaf';
      g.add(stem, head, leaf);
      g.position.set(fromQ(i * SEED_GAP) + 1, 0, -0.2);
      return g;
    });
    const trail = new GlyphTrail({ mode: 'upright', start: 1, gap: fromQ(SEED_GAP), size: 0.8 });
    root.add(trail.group);
    return {
      // Same framing as the other side-view runners: the ground sits above the prompt bar.
      pose: (sim) => presetPose('2d', 10, new THREE.Vector3(fromQ((sim.state.tpl as GardenState).x) + 3, -0.6, 0)),
      update(sim, _alpha, now) {
        const s = sim.state.tpl as GardenState;
        const x = fromQ(s.x);
        avatar.root.position.set(x, 0, 0.3);
        bed.position.x = x + 5;
        const first = Math.max(0, s.planted - 14);
        const ids = Array.from({ length: s.planted - first }, (_, i) => first + i);
        const map = pool.sync(ids);
        for (const [i, g] of map) {
          const age = Math.min(1, (sim.state.frame - (s.plantedAt[i % 40] ?? sim.state.frame)) / 90);
          const sun = s.sunflowers.includes(i);
          const h = (sun ? 2.2 : 0.8) * (0.15 + 0.85 * age);
          const stem = g.getObjectByName('stem')!;
          stem.scale.y = h;
          stem.position.y = h / 2;
          const head = g.getObjectByName('head')!;
          head.position.y = h;
          head.scale.setScalar((sun ? 1.8 : 1) * Math.max(0.05, age) * (1 + Math.sin(now / 400 + i) * 0.05));
          const leaf = g.getObjectByName('leaf')!;
          leaf.position.set(0.12, h * 0.45, 0);
        }
        const p = sim.state.prompt;
        trail.update(p.text, p.pos, new THREE.Vector3(x, 0.55, 0.6), RIGHT, now);
        avatar.update(now, Math.min(1, sim.state.motion.v / 4000), false);
      },
      dispose() {
        trail.dispose();
      },
    };
  },
};
export default view;
