/** Complexity scales and avatar customisation (M2.5). */
import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { scales } from '@/content/registry';
import { AvatarRig, DEFAULT_CUSTOMIZATION, SLOT_FIELD, clampToUnlocked, normalizeCustomization, starsFor } from '@/avatar/procedural';
import { newProfile, totalStars } from '@/storage/profile';

const meshes = (rig: AvatarRig) => {
  let n = 0;
  rig.root.traverse((o) => {
    if (o instanceof THREE.Mesh) n++;
  });
  return n;
};

describe('complexity scales', () => {
  it('ships the 13 themes, each with its own procedural avatar, 7 steps and ≥ 8 slots of ≥ 50 options', () => {
    expect(scales.length).toBe(13);
    for (const s of scales) {
      expect(AvatarRig.hasBuilder(s.id), s.id).toBe(true);
      expect(s.steps).toHaveLength(7);
      expect(s.customization.length).toBeGreaterThanOrEqual(8);
      const options = s.customization.reduce((n, slot) => n + (slot.unlocks.at(-1)?.range[1] ?? 0), 0);
      expect(options).toBeGreaterThanOrEqual(50);
      for (const slot of s.customization) expect(SLOT_FIELD[slot.slot], `${s.id} ${slot.slot}`).toBeTruthy();
      for (const st of s.steps) expect(st.name.ru, `${s.id} tier ${st.tier}`).toBeTruthy();
    }
  });
  it('avatars grow more detailed with the tier', () => {
    for (const s of scales) expect(meshes(new AvatarRig(s, 7)), s.id).toBeGreaterThanOrEqual(meshes(new AvatarRig(s, 1)));
  });
});

describe('customisation', () => {
  const flowers = scales.find((s) => s.id === 'scale.flowers')!;
  it('fills slots missing from old saves and clamps values', () => {
    expect(normalizeCustomization({ primary: 2, secondary: 9, size: 4 })).toEqual({ ...DEFAULT_CUSTOMIZATION, primary: 2, secondary: 9, size: 4 });
    expect(normalizeCustomization({ primary: 42, size: -3 } as never).primary).toBe(10);
  });
  it('every slot changes the avatar', () => {
    const base = meshes(new AvatarRig(flowers, 4));
    expect(meshes(new AvatarRig(flowers, 4, { ...DEFAULT_CUSTOMIZATION, accessory: 3 }))).toBeGreaterThan(base);
    expect(meshes(new AvatarRig(flowers, 4, { ...DEFAULT_CUSTOMIZATION, pattern: 5 }))).toBeGreaterThan(base);
    expect(meshes(new AvatarRig(flowers, 4, { ...DEFAULT_CUSTOMIZATION, aura: 5 }))).toBeGreaterThan(base);
    expect(meshes(new AvatarRig(flowers, 4, { ...DEFAULT_CUSTOMIZATION, trail: 4 }))).toBeGreaterThan(base);
  });
  it('unlocks value ranges with stars and clamps locked values to defaults', () => {
    expect(starsFor(flowers, 'accessory', 2)).toBe(0);
    expect(starsFor(flowers, 'accessory', 5)).toBe(20);
    expect(starsFor(flowers, 'accessory', 9)).toBe(60);
    // Defaults are always free (secondary colour 7 and size 5 sit in the 20★ range otherwise).
    expect(starsFor(flowers, 'secondary-color', 7)).toBe(0);
    expect(starsFor(flowers, 'size', 5)).toBe(0);
    expect(starsFor(flowers, 'size', 6)).toBe(20);
    const wanted = { ...DEFAULT_CUSTOMIZATION, accessory: 9, aura: 5, pattern: 2 };
    expect(clampToUnlocked(flowers, wanted, 0)).toEqual({ ...wanted, accessory: 1, aura: 1 });
    expect(clampToUnlocked(flowers, wanted, 25)).toEqual({ ...wanted, accessory: 1 });
    expect(clampToUnlocked(flowers, wanted, 60)).toEqual(wanted);
  });
  it('counts stars across tiers and levels', () => {
    const p = newProfile('Mia', 'scale.flowers', 2, 'seed');
    p.starsByTier = { '2': { '1': 3, '2': 2 }, '3': { '3': 1 } };
    expect(totalStars(p)).toBe(6);
  });
});
