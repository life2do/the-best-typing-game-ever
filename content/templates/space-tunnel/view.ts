/** Space tunnel view (first person): glowing rings, streaking stars, letters floating in the tunnel ahead. */
import * as THREE from 'three';
import type { TemplateView } from '@/render/types';
import { presetPose } from '@/render/rig';
import { fromQ, Pool } from '@/render/util';
import { GlyphTrail } from '@/render/glyphTrail';
import { RING_GAP, type TunnelState } from './sim';

const FORWARD = new THREE.Vector3(0, 0, -1);
const EYE_Y = 2;

const view: TemplateView = {
  id: 'template.space-tunnel',
  rules: [
    { icon: '🚀', text: 'Fly through the tunnel of rings.' },
    { icon: '🔤', text: 'Type the letters floating ahead to fly through them.' },
    { icon: '✨', text: 'A steady rhythm makes the rings shine brighter.' },
  ],
  create({ root, style }) {
    const rings = new THREE.Group();
    root.add(rings);
    const gap = fromQ(RING_GAP);
    const ringPool = new Pool<number, THREE.Mesh>(rings, (i) => {
      const m = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.12, 8, 40), style.material(i % 3 === 0 ? 'accent' : 'glow'));
      m.position.set(0, EYE_Y, -i * gap);
      return m;
    });
    const stars = new THREE.Group();
    root.add(stars);
    const starPool = new Pool<number, THREE.Mesh>(stars, (i) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.6), style.material('ice'));
      const a = (i * 2.399) % (Math.PI * 2);
      const r = 4.5 + ((i * 7) % 5);
      m.position.set(Math.cos(a) * r, EYE_Y + Math.sin(a) * r, -i * 0.9);
      return m;
    });
    const trail = new GlyphTrail({ mode: 'upright', start: 4, gap: 1.6, size: 0.9 });
    root.add(trail.group);
    let renderZ = 0;
    let shake = 0;
    return {
      pose: () => {
        const p = presetPose('fpv', 4, new THREE.Vector3(Math.sin(shake) * 0.05, EYE_Y, -renderZ - 3));
        p.follow = 1;
        return p;
      },
      update(sim, alpha, now) {
        const s = sim.state.tpl as TunnelState;
        renderZ = fromQ(s.z + sim.state.motion.v * alpha);
        shake = sim.state.frame - s.stumble < 15 ? now / 20 : 0;
        const first = Math.floor(renderZ / gap) - 1;
        const rm = ringPool.sync(Array.from({ length: 14 }, (_, i) => first + i));
        const beat = Math.max(0, 1 - (sim.state.frame - s.lastBeat) / 20);
        const steady = sim.steadinessP() / 1000;
        for (const [i, m] of rm) {
          m.scale.setScalar(1 + beat * 0.05 * (1 + steady));
          m.rotation.z = i * 0.3 + now / 3000;
        }
        const sf = Math.floor(renderZ / 0.9) - 2;
        starPool.sync(Array.from({ length: 50 }, (_, i) => sf + i));
        const p = sim.state.prompt;
        // Letters spiral around the tunnel axis so nearer ones never hide the next; the current letter sits
        // at the top centre, clear of the prompt bar below the middle of the screen.
        trail.update(p.text, p.pos, new THREE.Vector3(0, EYE_Y, -renderZ), FORWARD, now, (pt, _m, i) => {
          const a = (trail.aheadOf(i) - 4) * 0.6;
          pt.x += Math.sin(a) * 1.3;
          pt.y += Math.cos(a) * 1.0;
        });
      },
      dispose() {
        trail.dispose();
      },
    };
  },
};
export default view;
