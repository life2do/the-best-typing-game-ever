/** Racer view (3D chase cam): road, lanes, cones, upcoming letters painted on the road, speed lines, super-speed trails. */
import * as THREE from 'three';
import type { TemplateView } from '@/render/types';
import { presetPose } from '@/render/rig';
import { fromQ, Pool } from '@/render/util';
import { GlyphTrail } from '@/render/glyphTrail';
import { SUPER_SPEED_WPM_P } from '@/typing/tiers';
import type { RacerState } from './sim';

const LANE_W = 2.2;
const FORWARD = new THREE.Vector3(0, 0, -1);
/** A Space's cone stands this far past the Space tile, in the lane the route leaves. */
const CONE_AFTER_SPACE = 1.5;

const view: TemplateView = {
  id: 'template.racer',
  rules: [
    { icon: '🏎️', text: 'Type the letters painted on the road to drive over them.' },
    { icon: '🎵', text: 'A steady rhythm is faster than rushing.' },
    { icon: '↔️', text: 'Space turns into the next lane — just in time to pass the cone.' },
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
    // One cone per Space: it blocks the lane the route leaves, just after the turn.
    const conePool = new Pool<number, THREE.Mesh>(cones, () => new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.9, 12), style.material('hazard')));
    const board = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.15, 2.2), style.material('accent'));
    const rider = new THREE.Group();
    board.position.y = 0.3;
    avatar.root.position.y = 0.38;
    avatar.root.scale.setScalar(0.75);
    rider.add(board, avatar.root);
    root.add(rider);
    // Upcoming letters painted flat on the road in the rider's lane; you drive over each one you type.
    // Starts far enough ahead that the rider never covers the current letter.
    const trail = new GlyphTrail({ mode: 'ground', start: 5.6, gap: 2.4, size: 2.1 });
    root.add(trail.group);
    const lines = new THREE.Group();
    root.add(lines);
    const lineMat = style.material('glow');
    for (let i = 0; i < 40; i++) {
      const l = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 4), lineMat);
      l.position.set((i % 8) - 4 + (i % 3) * 0.3, 0.5 + (i % 5), -i * 2);
      lines.add(l);
    }
    let laneX = 0;
    let riderX = 0;
    let lastNow = 0;
    let renderZ = 0;
    let smoothSpeed = 0;
    return {
      pose: () => {
        // Chase camera locked to the rider's *drawn* position (not the last simulation step) so the
        // rider stays still on screen; speed only widens the view slowly via the smoothed speed.
        const p = presetPose('3d', 9, new THREE.Vector3(laneX * 0.5, 0.6, -renderZ - 0.5));
        p.pitch = 34; // steep enough that the letters on the road face the player and clear the rider
        p.fov = 60 + smoothSpeed * 10;
        p.follow = 1;
        return p;
      },
      update(sim, alpha, now) {
        const s = sim.state.tpl as RacerState;
        const z = fromQ(s.z + sim.state.motion.v * alpha);
        renderZ = z;
        // Per-keystroke speed bursts are smoothed over ~1 s before they affect the view.
        smoothSpeed += (Math.min(1, sim.state.motion.v / 9000) - smoothSpeed) * 0.03;
        const base = Math.floor(z / 10);
        segPool.sync(Array.from({ length: 16 }, (_, i) => base - 1 + i));
        laneX += (s.lane * LANE_W - laneX) * 0.12; // camera follows the lane gently
        const p = sim.state.prompt;
        // Lane of text index i: the word it belongs to (a Space still belongs to the word before it,
        // so the turn happens right after the Space tile).
        const wordOf: number[] = [];
        let w = 0;
        for (let i = 0; i < p.text.length; i++) {
          wordOf.push(w);
          if (p.text[i] === ' ') w++;
        }
        const laneOf = (i: number) => s.wordLanes[Math.min(wordOf[Math.max(0, Math.min(i, wordOf.length - 1))] ?? 0, s.wordLanes.length - 1)] ?? s.lane;
        // Blocky route: every letter sits in its word's lane, so the route steps 90° at each Space.
        trail.update(p.text, p.pos, new THREE.Vector3(0, 0.12, -z), FORWARD, now, (pt, mesh, i) => {
          pt.x = laneOf(i) * LANE_W;
          mesh.rotation.set(-Math.PI / 2, 0, 0);
        });
        // Cones: in the old lane, just past each upcoming (or just typed) Space.
        const spaces: number[] = [];
        for (let i = Math.max(0, p.pos - 2); i < Math.min(p.text.length, p.pos + 16); i++) if (p.text[i] === ' ') spaces.push(i);
        const cmap = conePool.sync(spaces);
        for (const i of spaces) {
          const ahead = trail.aheadOf(i) + CONE_AFTER_SPACE;
          const m = cmap.get(i)!;
          m.visible = ahead > -6;
          m.position.set(laneOf(i) * LANE_W, 0.45, -z - ahead);
        }
        // The rider moves to its lane with a quick, frame-rate-independent swerve when Space is typed.
        const dt = lastNow ? Math.min(0.25, (now - lastNow) / 1000) : 0;
        lastNow = now;
        const target = s.lane * LANE_W;
        riderX += (target - riderX) * (1 - Math.exp(-dt * 12));
        rider.position.set(riderX, 0, -z);
        rider.rotation.set(0, 0, (target - riderX) * -0.18);
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
      dispose() {
        trail.dispose();
      },
    };
  },
};
export default view;
