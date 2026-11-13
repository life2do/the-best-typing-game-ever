/** Platformer view: ground with gaps, jump arcs on Space, collectible notes. */
import * as THREE from 'three';
import type { TemplateView } from '@/render/types';
import { presetPose } from '@/render/rig';
import { fromQ, Pool } from '@/render/util';
import { makeLabel, setLabel } from '@/render/labels';
import type { PlatformerState } from './sim';

const view: TemplateView = {
  id: 'template.platformer',
  rules: [
    { icon: '🏃', text: 'Type to run.' },
    { icon: '⬆️', text: 'Space makes you jump over the gap ahead.' },
    { icon: '🎶', text: 'Steady typing makes you faster.' },
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
    const text = makeLabel(' ', 0.9);
    text.position.set(0, 3.4, 0.5);
    root.add(text);
    let lastJump = -1;
    return {
      pose: (sim) => presetPose('2d', 10, new THREE.Vector3(fromQ((sim.state.tpl as PlatformerState).x) + 3, -0.6, 0)),
      update(sim, alpha, now) {
        const s = sim.state.tpl as PlatformerState;
        const x = fromQ(s.x + sim.state.motion.v * alpha);
        const gaps = s.gaps.map((g) => Math.floor(fromQ(g)));
        const ids: number[] = [];
        for (let i = Math.floor(x) - 6; i < Math.floor(x) + 14; i++) if (!gaps.includes(i)) ids.push(i);
        blockPool.sync(ids);
        const nmap = notePool.sync(s.coins.filter((c) => fromQ(c) > x - 1));
        for (const [c, m] of nmap) {
          m.position.set(fromQ(c), 1.6 + Math.sin(now / 300 + c) * 0.15, 0.2);
          m.rotation.y = now / 400;
        }
        const j = s.jumps[s.jumps.length - 1] ?? -1;
        if (j !== lastJump && j >= 0) {
          lastJump = j;
          avatar.play('jump', now);
        }
        avatar.root.position.set(x, 0, 0.3);
        const p = sim.state.prompt;
        setLabel(text, p.text.slice(p.pos, p.pos + 14).replace(/ /g, '·') || ' ', 0.9);
        text.position.x = x + 3;
        avatar.update(now, Math.min(1, sim.state.motion.v / 4000));
      },
      dispose() {},
    };
  },
};
export default view;
