/** Brick-breaker view (2D): a wall of letter bricks, a paddle and a ball; popped bricks burst into confetti. */
import * as THREE from 'three';
import type { TemplateView } from '@/render/types';
import { presetPose } from '@/render/rig';
import { Pool } from '@/render/util';
import { makeLabel, setLabel } from '@/render/labels';
import { COLS, type BrickState } from './sim';

const W = 1.5; // brick width
const H = 0.7; // brick height
const SHOWN = 16; // upcoming bricks with letters

/** Brick n sits in row floor(n / COLS), column n % COLS; rows read left to right, top to bottom like text. */
function brickPos(n: number, rowOffset: number): THREE.Vector3 {
  const row = Math.floor(n / COLS);
  const col = n % COLS;
  return new THREE.Vector3((col - (COLS - 1) / 2) * W, 3.6 - (row - rowOffset) * H * 1.25, 0);
}

const view: TemplateView = {
  id: 'template.brick-breaker',
  rules: [
    { icon: '🧱', text: 'The next letters are written on the bricks.' },
    { icon: '⚪', text: 'Every right key sends the ball to its brick — pop!' },
    { icon: '🎉', text: 'Clear a row and the wall slides up. Nothing can go wrong — just keep typing.' },
  ],
  create({ root, style, avatar }) {
    const back = new THREE.Mesh(new THREE.PlaneGeometry(COLS * W + 2, 11), style.material('sky'));
    back.position.set(0, 0, -1);
    root.add(back);
    const paddle = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.3, 0.6), style.material('accent'));
    paddle.position.set(0, -4, 0);
    root.add(paddle);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), style.material('glow'));
    root.add(ball);
    avatar.root.scale.setScalar(0.6);
    avatar.root.position.set(-COLS * W * 0.5 - 0.6, -4.3, 0.3);
    root.add(avatar.root);
    const bricks = new THREE.Group();
    root.add(bricks);
    const pool = new Pool<number, THREE.Group>(bricks, (n) => {
      const g = new THREE.Group();
      const b = new THREE.Mesh(new THREE.BoxGeometry(W * 0.92, H * 0.9, 0.5), style.material(n % 3 === 0 ? 'prop' : n % 3 === 1 ? 'ground' : 'hazard'));
      b.name = 'brick';
      const label = makeLabel(' ', H * 0.8);
      label.name = 'label';
      label.position.z = 0.4;
      g.add(b, label);
      return g;
    });
    const confetti = new THREE.Group();
    root.add(confetti);
    const bits = Array.from({ length: 10 }, (_, i) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.16), style.material(i % 2 ? 'accent' : 'glow'));
      confetti.add(m);
      return m;
    });
    let rowOffset = 0;
    let popAt = -1e9;
    let popPos = new THREE.Vector3();
    let lastHit = -1;
    return {
      pose: () => presetPose('2d', 11.5, new THREE.Vector3(0, -0.2, 0)),
      update(sim, _alpha, now) {
        const s = sim.state.tpl as BrickState;
        const p = sim.state.prompt;
        // Smoothly slide the wall down as rows are cleared.
        const wantOffset = Math.floor(s.popped / COLS);
        rowOffset += (wantOffset - rowOffset) * 0.08;
        const ids = Array.from({ length: SHOWN }, (_, i) => s.popped + i);
        const map = pool.sync(ids);
        for (const [n, g] of map) {
          const i = n - s.popped;
          g.position.copy(brickPos(n, rowOffset));
          const ch = p.text[p.pos + i];
          const label = g.getObjectByName('label') as THREE.Sprite;
          label.visible = ch !== undefined && sim.state.phase === 'play';
          const cur = i === 0;
          if (ch !== undefined) setLabel(label, ch === ' ' ? '␣' : ch, H * (cur ? 0.95 : 0.75), cur ? '#1a1a1a' : '#ffffff', cur ? 'rgba(255,209,102,0.97)' : 'rgba(0,0,0,0.55)');
          g.scale.setScalar(cur ? 1.08 : 1);
        }
        const target = brickPos(s.popped, rowOffset);
        paddle.position.x += (target.x - paddle.position.x) * 0.15;
        if (s.lastHit !== lastHit) {
          lastHit = s.lastHit;
          popAt = now;
          popPos = brickPos(s.popped - 1, rowOffset);
          avatar.play('celebrate', now);
        }
        // Ball: flies up to the brick it just popped, then floats back above the paddle.
        const t = Math.min(1, (now - popAt) / 260);
        const from = new THREE.Vector3(paddle.position.x, -3.6, 0.2);
        const wobble = sim.state.frame - s.stumble < 20 ? Math.sin(now / 30) * 0.15 : 0;
        if (t < 1) ball.position.lerpVectors(popPos, from, t);
        else ball.position.set(from.x + wobble, from.y + Math.abs(Math.sin(now / 300)) * 0.25, 0.2);
        // Confetti burst at the popped brick.
        const age = (now - popAt) / 600;
        confetti.visible = age < 1;
        bits.forEach((b, i) => {
          const a = (i / bits.length) * Math.PI * 2;
          b.position.set(popPos.x + Math.cos(a) * age * 1.6, popPos.y + Math.sin(a) * age * 1.6 - age * age, 0.3);
          b.rotation.z = age * 6 + i;
        });
        avatar.update(now, 0);
      },
      dispose() {},
    };
  },
};
export default view;
