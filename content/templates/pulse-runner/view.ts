/** Pulse runner view: dark 2D world, heartbeat rings, lanterns lighting up. */
import * as THREE from 'three';
import type { TemplateView } from '@/render/types';
import { presetPose } from '@/render/rig';
import { fromQ, Pool } from '@/render/util';
import { GlyphTrail } from '@/render/glyphTrail';
import type { PulseState } from './sim';
import { LANTERN_SPACING } from './sim';

const RIGHT = new THREE.Vector3(1, 0, 0);

const view: TemplateView = {
  id: 'template.pulse-runner',
  rules: [
    { icon: '💓', text: 'Type the letter in front of you — each one is a heartbeat that carries you forward.' },
    { icon: '🏮', text: 'Run past lanterns to light up the dark.' },
    { icon: '🎵', text: 'Keep a steady beat to run faster.' },
  ],
  create({ root, style, avatar }) {
    const ground = new THREE.Mesh(new THREE.BoxGeometry(400, 0.4, 1), style.material('ground'));
    ground.position.set(180, -0.2, 0);
    root.add(ground);
    const hills = new THREE.Group();
    for (let i = 0; i < 40; i++) {
      const h = new THREE.Mesh(new THREE.CircleGeometry(3 + (i % 3), 24, 0, Math.PI), style.material('sky'));
      h.position.set(i * 9 - 10, 0, -6);
      hills.add(h);
    }
    root.add(hills);
    root.add(avatar.root);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 48), style.material('glow'));
    root.add(ring);
    const lanterns = new THREE.Group();
    root.add(lanterns);
    const pool = new Pool<number, THREE.Group>(lanterns, (i) => {
      const g = new THREE.Group();
      const pole = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.4, 0.08), style.material('prop'));
      pole.position.y = 0.7;
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8), style.material('accent'));
      lamp.position.y = 1.5;
      lamp.name = 'lamp';
      g.add(pole, lamp);
      g.position.x = fromQ(i * LANTERN_SPACING) + 1.5;
      return g;
    });
    // Letters stand on the path ahead of the runner; each heartbeat carries the runner to the next one.
    const trail = new GlyphTrail({ mode: 'upright', start: 1.6, gap: 1.15, size: 0.95 });
    root.add(trail.group);
    let lastBeat = -1;
    return {
      pose: (sim) => {
        const s = sim.state.tpl as PulseState;
        return presetPose('2d', 10, new THREE.Vector3(fromQ(s.x) + 3, -0.6, 0));
      },
      update(sim, alpha, now) {
        const s = sim.state.tpl as PulseState;
        const x = fromQ(s.x + sim.state.motion.v * alpha);
        avatar.root.position.set(x, 0, 0.3);
        const first = Math.max(0, Math.floor(x / fromQ(LANTERN_SPACING)) - 3);
        const ids = Array.from({ length: 10 }, (_, i) => first + i);
        const map = pool.sync(ids);
        for (const [i, g] of map) {
          const lamp = g.getObjectByName('lamp') as THREE.Mesh;
          const on = i < s.lit;
          lamp.scale.setScalar(on ? 1.2 : 0.6);
          (lamp.material as THREE.MeshLambertMaterial).opacity = on ? 1 : 0.3;
          (lamp.material as THREE.Material).transparent = true;
        }
        if (s.lastBeat !== lastBeat) {
          lastBeat = s.lastBeat;
          avatar.play('move', now);
        }
        const beatAge = (sim.state.frame - s.lastBeat) / 30;
        ring.position.set(x, 0.8, 0.2);
        ring.scale.setScalar(s.lastBeat < 0 ? 0.01 : 0.5 + beatAge * 2.5);
        (ring.material as THREE.Material).opacity = Math.max(0, 0.7 - beatAge * 0.7);
        const p = sim.state.prompt;
        trail.update(p.text, p.pos, new THREE.Vector3(x, 0.65, 0.6), RIGHT, now);
        avatar.update(now, Math.min(1, sim.state.motion.v / 4000), false);
      },
      dispose() {
        trail.dispose();
      },
    };
  },
};
export default view;
