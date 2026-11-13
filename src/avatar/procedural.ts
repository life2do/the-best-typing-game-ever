/**
 * Procedural avatars (docs/07 Avatar, docs/04 rig hooks). Each complexity scale has a builder whose
 * detail grows with the tier. Hooks are implemented with squash, stretch, spin and glow so any
 * shape (robot, flower, galaxy) can jump, stumble or celebrate. Ability hooks resolve per D36:
 * scale's `ability:<id>` hook → ability's core rigHook → `procedural:ability-pulse`.
 */
import * as THREE from 'three';
import type { ComplexityScaleManifest } from '@/content/types';

export type CoreHook = 'idle' | 'move' | 'jump' | 'land' | 'stumble' | 'celebrate' | 'powerup';

export interface AvatarCustomization {
  primary: number; // 1..10 index into hue wheel
  secondary: number;
  size: number; // 1..10
}

export const DEFAULT_CUSTOMIZATION: AvatarCustomization = { primary: 3, secondary: 7, size: 5 };

const hue = (i: number) => new THREE.Color().setHSL(((i - 1) % 10) / 10, 0.7, 0.6);

type Builder = (tier: number, a: THREE.Color, b: THREE.Color) => THREE.Group;

const std = (c: THREE.Color, emissive = 0.15) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: emissive, roughness: 0.5 });

const builders: Record<string, Builder> = {
  robot(tier, a, b) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.5), std(a));
    body.position.y = 0.5;
    g.add(body);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.45), std(b));
    head.position.y = 1.15;
    g.add(head);
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.05), std(new THREE.Color('#ffffff'), 1));
    eye.position.set(0, 1.18, 0.24);
    g.add(eye);
    for (let i = 0; i < Math.min(tier, 6); i++) {
      const part = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15 + i * 0.05, 0.15), std(i % 2 ? a : b));
      const side = i % 2 ? 1 : -1;
      part.position.set(side * (0.45 + floor2(i) * 0.12), 0.5 + floor2(i) * 0.15, 0);
      g.add(part);
    }
    if (tier >= 7) {
      const wings = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 0.4), std(b, 0.5));
      wings.position.y = 0.8;
      g.add(wings);
    }
    return g;
  },
  human(tier, a, b) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.25, 0.5, 4, 12), std(a));
    body.position.y = 0.55;
    g.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22 + (7 - tier) * 0.02, 16, 12), std(new THREE.Color('#f1c27d'), 0.05));
    head.position.y = 1.2;
    g.add(head);
    if (tier >= 4) {
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 6, 16), std(b, 0.4));
      band.position.y = 1.28;
      band.rotation.x = Math.PI / 2;
      g.add(band);
    }
    if (tier >= 6) {
      const beard = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 8), std(new THREE.Color('#eeeeee'), 0.1));
      beard.position.set(0, 0.95, 0.15);
      beard.rotation.x = Math.PI;
      g.add(beard);
    }
    return g;
  },
  flowers(tier, a, b) {
    const g = new THREE.Group();
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.3 + tier * 0.12, 6), std(new THREE.Color('#4caf50')));
    stem.position.y = (0.3 + tier * 0.12) / 2;
    g.add(stem);
    const top = 0.3 + tier * 0.12;
    if (tier === 1) {
      const seed = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 8), std(new THREE.Color('#8d6e63')));
      seed.position.y = 0.15;
      g.add(seed);
      return g;
    }
    const heads = tier >= 6 ? 3 : 1;
    for (let h = 0; h < heads; h++) {
      const centre = new THREE.Group();
      centre.position.set((h - (heads - 1) / 2) * 0.35, top - Math.abs(h - 1) * 0.15 * (heads > 1 ? 1 : 0), 0);
      centre.add(new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), std(b, 0.4)));
      const petals = 3 + tier;
      for (let i = 0; i < petals; i++) {
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), std(a, 0.3));
        p.scale.set(1.6, 0.6, 0.6);
        const ang = (i / petals) * Math.PI * 2;
        p.position.set(Math.cos(ang) * 0.17, Math.sin(ang) * 0.17, 0);
        p.rotation.z = ang;
        centre.add(p);
      }
      g.add(centre);
    }
    return g;
  },
  dragon(tier, a, b) {
    const g = new THREE.Group();
    if (tier === 1) {
      const egg = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 12), std(a, 0.2));
      egg.scale.y = 1.3;
      egg.position.y = 0.45;
      g.add(egg);
      return g;
    }
    const s = 0.5 + tier * 0.08;
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.35 * s, 14, 10), std(a));
    body.scale.set(1.4, 1, 1);
    body.position.y = 0.5;
    g.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.2 * s, 12, 8), std(a));
    head.position.set(0.45 * s, 0.8, 0);
    g.add(head);
    if (tier >= 3) {
      for (const side of [-1, 1]) {
        const wing = new THREE.Mesh(new THREE.ConeGeometry(0.3 * s, 0.7 * s, 3), std(b, 0.3));
        wing.position.set(-0.05, 0.85, side * 0.3);
        wing.rotation.x = side * 1.1;
        g.add(wing);
      }
    }
    if (tier >= 7) {
      const halo = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.03, 6, 32), std(new THREE.Color('#fff176'), 1));
      halo.position.y = 0.6;
      g.add(halo);
    }
    return g;
  },
  cosmos(tier, a, b) {
    const g = new THREE.Group();
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.2 + tier * 0.05, tier >= 3 ? 2 : 0), std(a, tier >= 5 ? 0.9 : 0.2));
    core.position.y = 0.6;
    g.add(core);
    for (let i = 0; i < tier - 2; i++) {
      const moon = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), std(b, 0.6));
      const ang = (i / Math.max(1, tier - 2)) * Math.PI * 2;
      moon.position.set(Math.cos(ang) * 0.6, 0.6 + Math.sin(ang * 2) * 0.1, Math.sin(ang) * 0.6);
      g.add(moon);
    }
    if (tier >= 4) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.02, 6, 32), std(b, 0.6));
      ring.position.y = 0.6;
      ring.rotation.x = 1.2;
      g.add(ring);
    }
    return g;
  },
};
function floor2(i: number) {
  return Math.floor(i / 2);
}

interface Anim {
  hook: string;
  start: number;
  dur: number;
}

export class AvatarRig {
  readonly root = new THREE.Group();
  private body: THREE.Group;
  private anims: Anim[] = [];
  private glow: THREE.PointLight;
  readonly scaleId: string;

  constructor(readonly scale: ComplexityScaleManifest, readonly tier: number, readonly custom: AvatarCustomization = DEFAULT_CUSTOMIZATION) {
    this.scaleId = scale.id.replace(/^scale\./, '');
    const build = builders[this.scaleId] ?? builders.robot;
    this.body = build(Math.max(1, Math.min(7, tier)), hue(custom.primary), hue(custom.secondary));
    const k = 0.7 + custom.size * 0.06;
    this.body.scale.setScalar(k);
    this.root.add(this.body);
    this.glow = new THREE.PointLight(hue(custom.primary), 0, 3);
    this.glow.position.y = 0.8;
    this.root.add(this.glow);
  }

  /** Resolve which hook implementation plays (D36). */
  resolveHook(hook: string, abilityCoreHook?: string): string {
    if (hook.startsWith('ability:')) {
      if (this.scale.rigHooks[hook]) return hook;
      if (abilityCoreHook && this.scale.rigHooks[abilityCoreHook]) return abilityCoreHook;
      return 'ability-pulse';
    }
    return hook;
  }

  play(hook: string, now: number, abilityCoreHook?: string): void {
    const h = this.resolveHook(hook, abilityCoreHook);
    const dur = h === 'celebrate' ? 900 : h === 'jump' || h.startsWith('ability:') ? 600 : h === 'powerup' || h === 'ability-pulse' ? 700 : 260;
    this.anims = this.anims.filter((a) => a.hook !== h);
    this.anims.push({ hook: h, start: now, dur });
  }

  /** Per-frame pose. moving 0..1 = normalised world speed. */
  update(now: number, moving: number, reducedMotion = false): void {
    const b = this.body;
    let y = 0, sx = 1, sy = 1, rotY = 0, rotZ = 0, glow = 0;
    // idle bob / move lean
    const bob = reducedMotion ? 0 : Math.sin(now / 400) * 0.04;
    y += bob * (1 - moving);
    rotZ -= moving * 0.15;
    if (this.scaleId === 'flowers' && !reducedMotion) rotZ += Math.sin(now / 700) * 0.05;
    this.anims = this.anims.filter((a) => now - a.start < a.dur);
    for (const a of this.anims) {
      const t = (now - a.start) / a.dur;
      switch (a.hook) {
        case 'jump':
        case 'ability:ability.jump':
          y += Math.sin(t * Math.PI) * (a.hook === 'jump' ? 1.2 : 1.6);
          sy *= 1 + Math.sin(t * Math.PI) * 0.15;
          if (a.hook !== 'jump') sx *= 1 - Math.sin(t * Math.PI) * 0.2;
          break;
        case 'land':
        case 'stumble':
          sy *= 1 - Math.sin(t * Math.PI) * 0.25;
          sx *= 1 + Math.sin(t * Math.PI) * 0.2;
          if (a.hook === 'stumble' && !reducedMotion) rotZ += Math.sin(t * Math.PI * 4) * 0.15;
          break;
        case 'celebrate':
          rotY += t * Math.PI * 2;
          y += Math.sin(t * Math.PI) * 0.5;
          glow = Math.max(glow, Math.sin(t * Math.PI) * 2);
          break;
        case 'powerup':
        case 'ability-pulse':
          glow = Math.max(glow, Math.sin(t * Math.PI) * 3);
          sx *= 1 + Math.sin(t * Math.PI) * 0.1;
          sy *= 1 + Math.sin(t * Math.PI) * 0.1;
          break;
        default:
          break;
      }
    }
    b.position.y = y;
    b.rotation.set(0, rotY, rotZ);
    const k = 0.7 + this.custom.size * 0.06;
    b.scale.set(k * sx, k * sy, k * sx);
    this.glow.intensity = glow;
  }

  dispose(): void {
    this.root.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      }
    });
  }
}
