/**
 * Procedural avatars (docs/07 Avatar, docs/04 rig hooks). Each complexity scale has a builder whose
 * detail grows with the tier. Hooks are implemented with squash, stretch, spin and glow so any
 * shape (robot, flower, galaxy) can jump, stumble or celebrate. Ability hooks resolve per D36:
 * scale's `ability:<id>` hook → ability's core rigHook → `procedural:ability-pulse`.
 */
import * as THREE from 'three';
import type { ComplexityScaleManifest } from '@/content/types';

export type CoreHook = 'idle' | 'move' | 'jump' | 'land' | 'stumble' | 'celebrate' | 'powerup';

/** Eight customisation slots, each a value 1..10 (docs/07 Avatar): 80 options per theme. */
export interface AvatarCustomization {
  primary: number; // hue wheel index
  secondary: number;
  size: number;
  pattern?: number; // 1 = none; dots, rings, stars, cubes in growing numbers
  accessory?: number; // 1 = none; cap, crown, bow, glasses, scarf, antenna, flower, halo, star
  trail?: number; // 1 = none; sparkles behind the avatar while it moves
  aura?: number; // 1 = none; glowing ring / bubble / double ring around the avatar
  idle?: number; // idle animation style
}

export type SlotKey = keyof AvatarCustomization;
/** Scale customisation slot ids (manifest) → customisation fields. */
export const SLOT_FIELD: Record<string, SlotKey> = {
  'primary-color': 'primary', 'secondary-color': 'secondary', pattern: 'pattern', size: 'size',
  accessory: 'accessory', trail: 'trail', aura: 'aura', 'idle-style': 'idle',
};

export const DEFAULT_CUSTOMIZATION: Required<AvatarCustomization> = { primary: 3, secondary: 7, size: 5, pattern: 1, accessory: 1, trail: 1, aura: 1, idle: 1 };

/** Fill missing slots (saves from before M2.5 only had colours and size) and clamp to 1..10. */
export function normalizeCustomization(c: Partial<AvatarCustomization> | undefined): Required<AvatarCustomization> {
  const out = { ...DEFAULT_CUSTOMIZATION };
  for (const k of Object.keys(out) as SlotKey[]) {
    const v = c?.[k];
    if (typeof v === 'number' && Number.isFinite(v)) out[k] = Math.min(10, Math.max(1, Math.round(v)));
  }
  return out;
}

/**
 * Stars needed for a slot value, from the scale's unlock ranges (0 if no range covers it). Each slot's
 * default value is always free, so a new avatar never wears a locked option.
 */
export function starsFor(scale: ComplexityScaleManifest, slot: string, value: number): number {
  const key = SLOT_FIELD[slot];
  if (key && DEFAULT_CUSTOMIZATION[key] === value) return 0;
  const s = scale.customization.find((x) => x.slot === slot);
  const u = s?.unlocks.find((r) => value >= r.range[0] && value <= r.range[1]);
  return u?.stars ?? 0;
}

/** A customisation with every locked value replaced by its default. */
export function clampToUnlocked(scale: ComplexityScaleManifest, c: Required<AvatarCustomization>, stars: number): Required<AvatarCustomization> {
  const out = { ...c };
  for (const [slot, key] of Object.entries(SLOT_FIELD)) if (starsFor(scale, slot, out[key]) > stars) out[key] = DEFAULT_CUSTOMIZATION[key];
  return out;
}

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
  vehicles(tier, a, b) {
    const g = new THREE.Group();
    const wheels = tier <= 1 ? 3 : tier <= 3 ? 2 : 4;
    const len = 0.5 + tier * 0.12;
    const body = new THREE.Mesh(tier >= 6 ? new THREE.ConeGeometry(0.25, len, 12) : new THREE.BoxGeometry(len, 0.25 + tier * 0.03, 0.4), std(a));
    if (tier >= 6) body.rotation.z = -Math.PI / 2;
    body.position.y = tier >= 6 ? 0.7 : 0.45;
    g.add(body);
    if (tier < 6)
      for (let i = 0; i < wheels; i++) {
        const w = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.05, 6, 14), std(b, 0.2));
        w.position.set((i % 2 ? 1 : -1) * len * 0.35, 0.18, wheels > 2 ? (i < 2 ? 0.22 : -0.22) : 0);
        g.add(w);
      }
    else
      for (const side of [-1, 1]) {
        const wing = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 0.6), std(b, 0.3));
        wing.position.set(-0.05, 0.7, side * 0.3);
        g.add(wing);
      }
    if (tier >= 7) {
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 8), std(new THREE.Color('#ffb703'), 1));
      flame.rotation.z = Math.PI / 2;
      flame.position.set(-len * 0.6, 0.7, 0);
      g.add(flame);
    }
    return g;
  },
  ocean(tier, a, b) {
    const g = new THREE.Group();
    const s = 0.2 + tier * 0.09;
    const body = new THREE.Mesh(new THREE.SphereGeometry(s, 14, 10), std(a, 0.25));
    body.scale.set(tier <= 1 ? 1 : 1.8, 1, 1);
    body.position.y = 0.6;
    g.add(body);
    if (tier >= 2) {
      const tail = new THREE.Mesh(new THREE.ConeGeometry(s * 0.6, s * 0.9, 4), std(b, 0.3));
      tail.rotation.z = Math.PI / 2;
      tail.position.set(-s * 2, 0.6, 0);
      g.add(tail);
    }
    if (tier >= 4) {
      const fin = new THREE.Mesh(new THREE.ConeGeometry(s * 0.3, s * 0.8, 4), std(b, 0.3));
      fin.position.set(0, 0.6 + s, 0);
      g.add(fin);
    }
    if (tier >= 7)
      for (let i = 0; i < 6; i++) {
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.06, 0.7, 6), std(b, 0.3));
        const ang = (i / 6) * Math.PI * 2;
        arm.position.set(Math.cos(ang) * 0.3, 0.25, Math.sin(ang) * 0.3);
        arm.rotation.z = Math.cos(ang) * 0.6;
        g.add(arm);
      }
    const eye = new THREE.Mesh(new THREE.SphereGeometry(Math.max(0.03, s * 0.15), 8, 6), std(new THREE.Color('#ffffff'), 1));
    eye.position.set(s * 1.2, 0.65, s * 0.5);
    g.add(eye);
    return g;
  },
  light(tier, a, b) {
    const g = new THREE.Group();
    if (tier >= 2 && tier <= 4) {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.12 + tier * 0.05, 0.15 + tier * 0.05, 0.3 + tier * 0.1, 10), std(b));
      base.position.y = 0.2 + tier * 0.05;
      g.add(base);
    }
    const flame = new THREE.Mesh(tier >= 6 ? new THREE.IcosahedronGeometry(0.25 + tier * 0.06, 1) : new THREE.ConeGeometry(0.1 + tier * 0.04, 0.25 + tier * 0.08, 10), std(a, 1));
    flame.position.y = 0.55 + tier * 0.08;
    g.add(flame);
    for (let i = 0; i < Math.max(0, tier - 3) * 2; i++) {
      const ray = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.25, 0.03), std(b, 1));
      const ang = (i / ((tier - 3) * 2)) * Math.PI * 2;
      ray.position.set(Math.cos(ang) * 0.5, flame.position.y + Math.sin(ang) * 0.5, 0);
      ray.rotation.z = ang - Math.PI / 2;
      g.add(ray);
    }
    return g;
  },
  buildings(tier, a, b) {
    const g = new THREE.Group();
    const floors = [1, 1, 2, 3, 5, 4, 3][tier - 1];
    if (tier === 1) {
      const tent = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.7, 4), std(a));
      tent.position.y = 0.35;
      g.add(tent);
      return g;
    }
    for (let f = 0; f < floors; f++) {
      const w = tier >= 5 ? 0.45 : 0.65;
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.32, w), std(f % 2 ? b : a));
      m.position.y = 0.16 + f * 0.33 + (tier >= 6 ? 0.3 : 0);
      g.add(m);
    }
    const roof = new THREE.Mesh(tier === 4 ? new THREE.CylinderGeometry(0.1, 0.1, 0.4, 8) : new THREE.ConeGeometry(0.45, 0.35, 4), std(b, 0.2));
    roof.position.y = floors * 0.33 + 0.18 + (tier >= 6 ? 0.3 : 0);
    g.add(roof);
    if (tier >= 6) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.04, 6, 24), std(b, 0.6));
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.2;
      g.add(ring);
    }
    return g;
  },
  cats(tier, a, b) {
    const g = new THREE.Group();
    const s = 0.55 + tier * 0.07;
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.3 * s, 14, 10), std(a));
    body.scale.set(1.5, 1, 1);
    body.position.y = 0.38 * s;
    g.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.2 * s, 12, 10), std(a));
    head.position.set(0.42 * s, 0.6 * s, 0);
    g.add(head);
    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.06 * s, 0.14 * s, 4), std(b));
      ear.position.set(0.42 * s, 0.82 * s, side * 0.1 * s);
      g.add(ear);
    }
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.03 * s, 0.03 * s, 0.5 * s, 6), std(b));
    tail.position.set(-0.5 * s, 0.6 * s, 0);
    tail.rotation.z = 0.6;
    g.add(tail);
    if (tier >= 5) {
      const mane = new THREE.Mesh(new THREE.TorusGeometry(0.2 * s, 0.07 * s, 8, 16), std(b, 0.2));
      mane.position.set(0.4 * s, 0.6 * s, 0);
      mane.rotation.y = Math.PI / 2;
      g.add(mane);
    }
    if (tier >= 7) {
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * s, 0.15 * s, 0.12 * s, 6), std(new THREE.Color('#ffd166'), 0.8));
      crown.position.set(0.42 * s, 0.86 * s, 0);
      g.add(crown);
    }
    return g;
  },
  music(tier, a, b) {
    const g = new THREE.Group();
    const n = [1, 1, 1, 3, 5, 7, 9][tier - 1];
    for (let i = 0; i < n; i++) {
      const note = new THREE.Group();
      const head = new THREE.Mesh(tier === 2 ? new THREE.CylinderGeometry(0.2, 0.2, 0.22, 14) : new THREE.SphereGeometry(0.12, 10, 8), std(i % 2 ? b : a, 0.3));
      head.scale.set(1.2, tier === 2 ? 1 : 0.85, 1);
      note.add(head);
      if (tier !== 2) {
        const stem = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.4, 0.03), std(b));
        stem.position.set(0.12, 0.2, 0);
        note.add(stem);
      }
      const ang = (i / n) * Math.PI * 2;
      note.position.set(n > 1 ? Math.cos(ang) * 0.4 : 0, 0.55 + (n > 1 ? Math.sin(ang) * 0.25 : 0), n > 1 ? Math.sin(ang) * 0.2 : 0);
      g.add(note);
    }
    if (tier >= 6) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.02, 6, 32), std(b, 0.8));
      ring.position.y = 0.55;
      g.add(ring);
    }
    return g;
  },
  ships(tier, a, b) {
    const g = new THREE.Group();
    const len = 0.5 + tier * 0.1;
    const hull = new THREE.Mesh(new THREE.BoxGeometry(len, 0.18, 0.35), std(tier === 1 ? new THREE.Color('#a1887f') : a));
    hull.position.y = tier >= 7 ? 0.6 : 0.15;
    g.add(hull);
    const masts = tier >= 5 ? 3 : tier >= 3 ? 1 : 0;
    for (let i = 0; i < masts; i++) {
      const x = (i - (masts - 1) / 2) * len * 0.3;
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 6), std(new THREE.Color('#8d6e63')));
      mast.position.set(x, hull.position.y + 0.35, 0);
      const sail = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.4), std(b, 0.2));
      sail.position.set(x + 0.02, hull.position.y + 0.38, 0.02);
      g.add(mast, sail);
    }
    if (tier >= 7) {
      const balloon = new THREE.Mesh(new THREE.SphereGeometry(0.35, 14, 10), std(b, 0.3));
      balloon.scale.set(1.6, 0.9, 0.9);
      balloon.position.y = 1.2;
      g.add(balloon);
    }
    return g;
  },
  weather(tier, a, b) {
    const g = new THREE.Group();
    if (tier <= 2) {
      const drop = new THREE.Mesh(new THREE.SphereGeometry(0.18 + tier * 0.04, 12, 10), std(a, 0.4));
      drop.scale.y = 1.3;
      drop.position.y = 0.4;
      g.add(drop);
      return g;
    }
    const puffs = 3 + tier;
    for (let i = 0; i < puffs; i++) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(0.18 + (i % 3) * 0.05, 10, 8), std(tier >= 5 ? b : a, 0.25));
      puff.position.set((i - puffs / 2) * 0.13, 0.8 + Math.sin(i) * 0.08, Math.cos(i * 2) * 0.1);
      g.add(puff);
    }
    if (tier >= 4)
      for (let i = 0; i < tier; i++) {
        const drop = new THREE.Mesh(tier >= 5 && i === 0 ? new THREE.BoxGeometry(0.06, 0.35, 0.02) : new THREE.SphereGeometry(0.04, 6, 4), std(tier >= 5 && i === 0 ? new THREE.Color('#ffd166') : a, 0.8));
        drop.position.set((i - tier / 2) * 0.12, 0.45 - (i % 2) * 0.12, 0);
        g.add(drop);
      }
    if (tier >= 7) {
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.04, 6, 32, Math.PI), std(b, 1));
      band.position.y = 0.9;
      g.add(band);
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
  private trail: THREE.Group;
  private aura: THREE.Object3D | null = null;
  readonly scaleId: string;
  readonly custom: Required<AvatarCustomization>;

  constructor(readonly scale: ComplexityScaleManifest, readonly tier: number, custom?: Partial<AvatarCustomization>) {
    this.custom = normalizeCustomization(custom);
    const c = this.custom;
    this.scaleId = scale.id.replace(/^scale\./, '');
    const build = builders[this.scaleId] ?? builders.robot;
    this.body = build(Math.max(1, Math.min(7, tier)), hue(c.primary), hue(c.secondary));
    decorate(this.body, c);
    const k = 0.7 + c.size * 0.06;
    this.body.scale.setScalar(k);
    this.root.add(this.body);
    this.glow = new THREE.PointLight(hue(c.primary), 0, 3);
    this.glow.position.y = 0.8;
    this.root.add(this.glow);
    this.aura = makeAura(c.aura, hue(c.secondary));
    if (this.aura) this.root.add(this.aura);
    this.trail = makeTrail(c.trail);
    this.root.add(this.trail);
  }

  /** Whether this theme has its own procedural builder (every shipped scale should). */
  static hasBuilder(scaleId: string): boolean {
    return scaleId.replace(/^scale\./, '') in builders;
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
    // idle style (customisation) / move lean
    const still = 1 - moving;
    if (!reducedMotion) {
      const t = now / 1000;
      switch (this.custom.idle) {
        case 2: rotZ += Math.sin(t * 1.6) * 0.08 * still; break; // sway
        case 3: rotY += t * 0.8 * still; break; // slow spin
        case 4: y += Math.abs(Math.sin(t * 3)) * 0.12 * still; break; // hop
        case 5: rotZ += Math.sin(t * 6) * 0.05 * still; break; // wobble
        case 6: sx *= 1 + Math.sin(t * 3) * 0.05 * still; sy = sx; break; // pulse
        case 7: y += (0.15 + Math.sin(t * 1.5) * 0.06) * still; break; // float
        case 8: rotZ += Math.sin(t * 1.2) * 0.15 * still; break; // rock
        case 9: rotY += Math.sin(t * 1.4) * 0.9 * still; break; // twirl
        case 10: y += Math.abs(Math.sin(t * 5)) * 0.08 * still; sy *= 1 + Math.abs(Math.sin(t * 5)) * 0.06 * still; break; // bounce
        default: y += Math.sin(now / 400) * 0.04 * still; // bob
      }
    }
    rotZ -= moving * 0.15;
    // Trail sparkles behind the avatar while it moves; aura breathes gently.
    this.trail.visible = moving > 0.05;
    this.trail.children.forEach((m, i) => {
      m.position.set(-0.35 - i * 0.22, 0.4 + Math.sin(now / 150 + i) * 0.08, 0);
      m.scale.setScalar(Math.max(0.2, 1 - i * 0.15) * Math.min(1, moving * 2));
    });
    if (this.aura && !reducedMotion) this.aura.rotation.y = now / 1500;
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

/** Pattern and accessory meshes on the avatar body (customisation slots; value 1 = none). */
function decorate(body: THREE.Group, c: Required<AvatarCustomization>): void {
  const box = new THREE.Box3().setFromObject(body);
  const size = box.getSize(new THREE.Vector3());
  const centre = box.getCenter(new THREE.Vector3());
  const top = box.max.y;
  const col2 = hue(c.secondary);
  if (c.pattern > 1) {
    const kind = (c.pattern - 2) % 4; // dots, rings, stars, cubes
    const n = 3 + (c.pattern - 2) * 2;
    for (let i = 0; i < n; i++) {
      const geo = kind === 0 ? new THREE.SphereGeometry(0.05, 6, 4) : kind === 1 ? new THREE.TorusGeometry(0.06, 0.015, 4, 10) : kind === 2 ? new THREE.OctahedronGeometry(0.06) : new THREE.BoxGeometry(0.07, 0.07, 0.07);
      const m = new THREE.Mesh(geo, std(col2, 0.5));
      const a = (i / n) * Math.PI * 2;
      m.position.set(centre.x + Math.cos(a) * size.x * 0.45, centre.y + Math.sin(a * 1.7) * size.y * 0.3, centre.z + Math.sin(a) * Math.max(0.12, size.z * 0.5));
      body.add(m);
    }
  }
  if (c.accessory > 1) {
    const g = new THREE.Group();
    const gold = new THREE.Color('#ffd166');
    switch (c.accessory) {
      case 2: { const cap = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.3, 12), std(col2, 0.3)); cap.position.y = 0.15; g.add(cap); break; }
      case 3: for (let i = 0; i < 5; i++) { const p = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.12, 4), std(gold, 0.6)); const a = (i / 5) * Math.PI * 2; p.position.set(Math.cos(a) * 0.12, 0.06, Math.sin(a) * 0.12); g.add(p); } break;
      case 4: for (const side of [-1, 1]) { const w = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.16, 4), std(col2, 0.3)); w.rotation.z = (side * Math.PI) / 2; w.position.x = side * 0.09; g.add(w); } break;
      case 5: for (const side of [-1, 1]) { const l = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 4, 14), std(new THREE.Color('#222222'), 0.1)); l.position.set(side * 0.08, -0.12, 0.2); g.add(l); } break;
      case 6: { const sc = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.04, 6, 18), std(col2, 0.3)); sc.rotation.x = Math.PI / 2; sc.position.y = -0.25; g.add(sc); break; }
      case 7: { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.25, 4), std(col2)); st.position.y = 0.12; const ball = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), std(gold, 0.8)); ball.position.y = 0.26; g.add(st, ball); break; }
      case 8: for (let i = 0; i < 5; i++) { const p = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 4), std(col2, 0.4)); const a = (i / 5) * Math.PI * 2; p.position.set(Math.cos(a) * 0.07, 0.05, Math.sin(a) * 0.07); g.add(p); } break;
      case 9: { const halo = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.02, 6, 24), std(gold, 1)); halo.rotation.x = Math.PI / 2; halo.position.y = 0.12; g.add(halo); break; }
      default: { const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.1), std(gold, 1)); star.position.y = 0.12; g.add(star); }
    }
    g.position.set(centre.x, top, centre.z);
    g.name = 'accessory';
    body.add(g);
  }
}

/** Aura around the avatar's feet or body (value 1 = none). */
function makeAura(v: number, col: THREE.Color): THREE.Object3D | null {
  if (v <= 1) return null;
  const g = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.45, depthWrite: false });
  if (v <= 4) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.45 + (v - 2) * 0.1, 0.03, 6, 32), mat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.05;
    g.add(ring);
  } else if (v <= 7) {
    const bubble = new THREE.Mesh(new THREE.SphereGeometry(0.6 + (v - 5) * 0.08, 16, 12), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.15, depthWrite: false }));
    bubble.position.y = 0.6;
    g.add(bubble);
  } else
    for (let i = 0; i < 2; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5 + i * 0.15, 0.025, 6, 32), mat);
      ring.position.y = 0.5 + i * 0.25;
      ring.rotation.x = Math.PI / 2 + (i ? 0.4 : -0.4) * (v - 7) * 0.3;
      g.add(ring);
    }
  g.name = 'aura';
  return g;
}

/** Sparkles that follow the avatar while it moves (value 1 = none; more sparkles for higher values). */
function makeTrail(v: number): THREE.Group {
  const g = new THREE.Group();
  g.name = 'trail';
  for (let i = 0; i < (v <= 1 ? 0 : Math.min(6, v - 1)); i++) g.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.06), std(hue(v + i), 0.9)));
  return g;
}

/** Stretch-break demonstration poses for any avatar (procedural, theme-agnostic). t in seconds. */
export function stretchPose(rig: AvatarRig, move: import('@/content/types').StretchMove, t: number, reducedMotion = false): void {
  const b = rig.root.children[0] as THREE.Group;
  const k = 0.7 + rig.custom.size * 0.06;
  const slow = reducedMotion ? 0.35 : 1;
  let y = 0, sx = 1, sy = 1, rotY = 0, rotZ = 0;
  switch (move) {
    case 'shake':
      rotZ = Math.sin(t * 18 * slow) * 0.1;
      y = Math.abs(Math.sin(t * 9 * slow)) * 0.08;
      break;
    case 'roll':
      rotY = Math.sin(t * 2) * 0.7 * slow;
      rotZ = Math.cos(t * 2) * 0.12 * slow;
      break;
    case 'reach':
      sy = 1 + 0.28 * (0.5 + 0.5 * Math.sin(t * 1.6));
      sx = 1 - 0.1 * (0.5 + 0.5 * Math.sin(t * 1.6));
      y = 0.15 * (0.5 + 0.5 * Math.sin(t * 1.6));
      break;
    case 'look':
      rotY = Math.sin(t * 0.7) * 1.1 * slow;
      break;
    case 'wiggle':
      sx = 1 + Math.sin(t * 14 * slow) * 0.07;
      sy = 1 - Math.sin(t * 14 * slow) * 0.07;
      break;
    case 'breathe':
      sx = sy = 1 + 0.12 * Math.sin(t * 1.1);
      break;
  }
  b.position.y = y;
  b.rotation.set(0, rotY, rotZ);
  b.scale.set(k * sx, k * sy, k * sx);
}
