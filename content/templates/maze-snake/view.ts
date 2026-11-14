/** Maze snake view (top-down 2D): hedge maze, letters on the path cells, a growing snake, berries. */
import * as THREE from 'three';
import type { TemplateView } from '@/render/types';
import { presetPose } from '@/render/rig';
import { Pool } from '@/render/util';
import { makeLabel, setLabel } from '@/render/labels';
import { BERRY_EVERY, type SnakeState } from './sim';

const ACROSS = 8; // cells per horizontal run
const PERIOD = 2 * ACROSS + 2; // right run, 1 down, left run, 1 down

/** Cell n of the serpentine path: 8 cells right, 1 down, 8 left, 1 down, … (y grows downward as negative). */
export function cellAt(n: number): { x: number; y: number } {
  const per = Math.floor(n / PERIOD);
  const k = n - per * PERIOD;
  const y0 = -per * 4;
  if (k < ACROSS) return { x: k, y: y0 };
  if (k === ACROSS) return { x: ACROSS - 1, y: y0 - 1 };
  if (k === ACROSS + 1) return { x: ACROSS - 1, y: y0 - 2 };
  if (k < 2 * ACROSS + 1) return { x: ACROSS - 1 - (k - ACROSS - 1), y: y0 - 2 };
  return { x: 0, y: y0 - 3 };
}

const view: TemplateView = {
  id: 'template.maze-snake',
  rules: [
    { icon: '🐍', text: 'Your snake follows the path through the maze.' },
    { icon: '🔤', text: 'Type the letter on the next tile to move one step.' },
    { icon: '🍓', text: 'Eat berries to grow longer. The snake never gets hurt.' },
  ],
  create({ root, style }) {
    const tiles = new THREE.Group();
    const hedges = new THREE.Group();
    const body = new THREE.Group();
    root.add(tiles, hedges, body);
    const key = (x: number, y: number) => `${x},${y}`;
    const tilePool = new Pool<number, THREE.Group>(tiles, (n) => {
      const g = new THREE.Group();
      const t = new THREE.Mesh(new THREE.PlaneGeometry(0.94, 0.94), style.material('prop'));
      const label = makeLabel(' ', 0.62);
      label.name = 'label';
      label.position.z = 0.3;
      const berry = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 8), style.material('glow'));
      berry.name = 'berry';
      berry.position.set(0.3, 0.3, 0.2);
      g.add(t, label, berry);
      const c = cellAt(n);
      g.position.set(c.x, c.y, 0);
      return g;
    });
    const hedgePool = new Pool<string, THREE.Mesh>(hedges, (k) => {
      const [x, y] = k.split(',').map(Number);
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.96, 0.5), style.material('ground'));
      m.position.set(x, y, 0.1);
      return m;
    });
    const segPool = new Pool<number, THREE.Mesh>(body, (i) => new THREE.Mesh(new THREE.SphereGeometry(i === 0 ? 0.4 : 0.32, 16, 12), style.material(i === 0 ? 'avatar' : 'accent')));
    const head = { x: 0, y: 0 };
    return {
      // The head sits in the upper part of the screen, so the path ahead stays clear of the prompt bar.
      pose: () => presetPose('2d', 13, new THREE.Vector3(ACROSS / 2 - 0.5, head.y - 3, 0)),
      update(sim, _alpha, now) {
        const s = sim.state.tpl as SnakeState;
        const p = sim.state.prompt;
        // Path tiles from the tail to 12 cells ahead; letters on the cells ahead of the head.
        const from = Math.max(0, s.steps - s.length - 2);
        const ids: number[] = [];
        for (let n = from; n <= s.steps + 12; n++) ids.push(n);
        const onPath = new Set<string>();
        for (let n = Math.max(0, s.steps - 40); n <= s.steps + 40; n++) {
          const c = cellAt(n);
          onPath.add(key(c.x, c.y));
        }
        const map = tilePool.sync(ids);
        for (const [n, g] of map) {
          const i = n - s.steps - 1; // 0 = next cell
          const ch = i >= 0 ? p.text[p.pos + i] : undefined;
          const label = g.getObjectByName('label') as THREE.Sprite;
          label.visible = ch !== undefined && sim.state.phase === 'play';
          if (ch !== undefined) setLabel(label, ch === ' ' ? '␣' : ch, i === 0 ? 0.8 : 0.6, i === 0 ? '#1a1a1a' : '#ffffff', i === 0 ? 'rgba(255,209,102,0.97)' : 'rgba(0,0,0,0.5)');
          (g.getObjectByName('berry') as THREE.Mesh).visible = n > s.steps && n % BERRY_EVERY === 0;
        }
        // Hedges: every grid cell near the head that isn't on the path.
        const hc = cellAt(s.steps);
        head.x += (hc.x - head.x) * 0.25;
        head.y += (hc.y - head.y) * 0.25;
        const hk: string[] = [];
        for (let y = Math.floor(hc.y) - 7; y <= Math.floor(hc.y) + 4; y++)
          for (let x = -1; x <= ACROSS; x++) if (!onPath.has(key(x, y))) hk.push(key(x, y));
        hedgePool.sync(hk);
        // Snake: head eases toward its cell, body segments sit on the previous cells.
        const segs = Array.from({ length: s.length }, (_, i) => i);
        const sm = segPool.sync(segs);
        const wiggle = sim.state.frame - s.stumble < 20 ? Math.sin(now / 25) * 0.12 : 0;
        for (const [i, m] of sm) {
          if (i === 0) {
            m.position.set(head.x + wiggle, head.y, 0.35);
            continue;
          }
          const c = cellAt(Math.max(0, s.steps - i));
          m.position.set(c.x, c.y, 0.3);
          m.visible = s.steps - i >= 0;
        }
      },
      dispose() {},
    };
  },
};
export default view;
