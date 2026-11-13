/** Platformer view: ground blocks with gaps, a hop over every gap, notes that pop when collected. */
import * as THREE from 'three';
import type { TemplateView } from '@/render/types';
import { presetPose } from '@/render/rig';
import { fromQ, Pool } from '@/render/util';
import { makeLabel, setLabel } from '@/render/labels';
import { GlyphTrail } from '@/render/glyphTrail';
import { HOP_MARGIN, Q1, type PlatformerState } from './sim';

const HOP_HEIGHT = 1.3;
const RIGHT = new THREE.Vector3(1, 0, 0);

/** Height of the runner at world x: an arc over any gap it is crossing, 0 on solid ground. */
export function hopHeight(x: number, gaps: readonly number[]): number {
  const m = fromQ(HOP_MARGIN);
  for (const gq of gaps) {
    const g = fromQ(gq);
    const start = g - m;
    const end = g + fromQ(Q1) + m;
    if (x > start && x < end) return Math.sin(((x - start) / (end - start)) * Math.PI) * HOP_HEIGHT;
  }
  return 0;
}

const view: TemplateView = {
  id: 'template.platformer',
  rules: [
    { icon: '🏃', text: 'Type the letters in front of you to run over them.' },
    { icon: '⬆️', text: 'Every Space opens a gap ahead — you hop over it.' },
    { icon: '🎶', text: 'Hop through the notes to collect them.' },
  ],
  create({ root, style, avatar }) {
    const blocks = new THREE.Group();
    root.add(blocks);
    const notes = new THREE.Group();
    root.add(notes);
    root.add(avatar.root);
    const blockPool = new Pool<number, THREE.Mesh>(blocks, (i) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.98, 1), style.material(i % 2 ? 'ground' : 'prop'));
      m.position.set(i + 0.5, -0.5, 0);
      return m;
    });
    const notePool = new Pool<number, THREE.Mesh>(notes, () => new THREE.Mesh(new THREE.OctahedronGeometry(0.25), style.material('accent')));
    const sparkle = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.3, 24), style.material('glow'));
    sparkle.visible = false;
    root.add(sparkle);
    const counter = makeLabel('♪ 0', 0.6);
    root.add(counter);
    // Letters stand on the ground ahead of the runner; Space (␣) marks each hop.
    const trail = new GlyphTrail({ mode: 'upright', start: 1.6, gap: 1.15, size: 0.95 });
    root.add(trail.group);
    let lastCollect = -1;
    return {
      pose: (sim) => presetPose('2d', 10, new THREE.Vector3(fromQ((sim.state.tpl as PlatformerState).x) + 3, -0.6, 0)),
      update(sim, alpha, now) {
        const s = sim.state.tpl as PlatformerState;
        const x = fromQ(s.x + sim.state.motion.v * alpha);
        const gaps = s.gaps.map((g) => Math.round(fromQ(g)));
        const ids: number[] = [];
        for (let i = Math.floor(x) - 6; i < Math.floor(x) + 14; i++) if (!gaps.includes(i)) ids.push(i);
        blockPool.sync(ids);
        const nmap = notePool.sync(s.coins);
        for (const [c, m] of nmap) {
          m.position.set(fromQ(c), HOP_HEIGHT + 0.45 + Math.sin(now / 300 + c) * 0.08, 0.2);
          m.rotation.y = now / 400;
        }
        const y = hopHeight(x, s.gaps);
        avatar.root.position.set(x, y, 0.3);
        if (s.lastCollect !== lastCollect) {
          if (lastCollect !== -1 || s.lastCollect >= 0) {
            avatar.play('powerup', now);
            sparkle.userData.t0 = now;
          }
          lastCollect = s.lastCollect;
        }
        const age = (now - (sparkle.userData.t0 ?? -1e9)) / 400;
        sparkle.visible = age < 1;
        if (sparkle.visible) {
          sparkle.position.set(x, y + 1, 0.4);
          sparkle.scale.setScalar(1 + age * 4);
          (sparkle.material as THREE.Material).opacity = 1 - age;
        }
        setLabel(counter, `♪ ${s.collected}`, 0.6);
        counter.position.set(x + 4.5, 3.4, 0.5);
        const p = sim.state.prompt;
        trail.update(p.text, p.pos, new THREE.Vector3(x, 0.65, 0.6), RIGHT, now);
        avatar.update(now, y > 0 ? 0 : Math.min(1, sim.state.motion.v / 4000));
      },
      dispose() {
        trail.dispose();
      },
    };
  },
};
export default view;
