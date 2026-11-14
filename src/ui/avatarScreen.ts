/**
 * Avatar customisation (docs/07 Avatar): choose the theme (complexity scale) and 8 slots × 10 values.
 * Values unlock with stars per the scale's ranges; locked values show how many stars they need.
 * A small live 3D preview shows the avatar at the player's tier.
 */
import * as THREE from 'three';
import type { ComplexityScaleManifest } from '@/content/types';
import { AvatarRig, SLOT_FIELD, normalizeCustomization, starsFor, type AvatarCustomization } from '@/avatar/procedural';
import { h } from './dom';

const SLOT_LABEL: Record<string, string> = {
  'primary-color': 'Main colour', 'secondary-color': 'Second colour', pattern: 'Pattern', size: 'Size',
  accessory: 'Accessory', trail: 'Trail', aura: 'Aura', 'idle-style': 'Idle dance',
};
const OPTION_NAMES: Record<string, string[]> = {
  pattern: ['none', 'dots', 'rings', 'stars', 'cubes', 'more dots', 'more rings', 'more stars', 'more cubes', 'lots of dots'],
  accessory: ['none', 'cap', 'crown', 'bow', 'glasses', 'scarf', 'antenna', 'flower', 'halo', 'star'],
  trail: ['none', '1 sparkle', '2 sparkles', '3 sparkles', '4 sparkles', '5 sparkles', '6 sparkles', 'rainbow', 'comet', 'meteor'],
  aura: ['none', 'small ring', 'ring', 'big ring', 'bubble', 'big bubble', 'huge bubble', 'double ring', 'tilted rings', 'orbit'],
  'idle-style': ['bob', 'sway', 'spin', 'hop', 'wobble', 'pulse', 'float', 'rock', 'twirl', 'bounce'],
};
const hueCss = (i: number) => `hsl(${(((i - 1) % 10) / 10) * 360}, 70%, 60%)`;

export interface AvatarScreenOptions {
  scales: ComplexityScaleManifest[];
  scaleId: string;
  tier: number;
  custom: Partial<AvatarCustomization>;
  stars: number;
  onSave: (scaleId: string, custom: Required<AvatarCustomization>) => void;
  onClose: () => void;
}

export function avatarScreen(o: AvatarScreenOptions): { el: HTMLElement; dispose: () => void } {
  let scaleId = o.scaleId;
  let custom = normalizeCustomization(o.custom);
  const scaleOf = () => o.scales.find((s) => s.id === scaleId) ?? o.scales[0];

  // Live preview (skipped when WebGL is unavailable).
  const canvas = h('canvas', { class: 'avatar-preview', width: 240, height: 240, 'aria-hidden': 'true' }) as HTMLCanvasElement;
  let renderer: THREE.WebGLRenderer | null = null;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
    renderer.setSize(240, 240, false);
  } catch {
    renderer = null;
  }
  const scene = new THREE.Scene();
  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set(2, 3, 4);
  scene.add(new THREE.AmbientLight(0xffffff, 1.2), sun);
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(0, 1.1, 3.4);
  camera.lookAt(0, 0.6, 0);
  let rig: AvatarRig | null = null;
  const rebuild = () => {
    if (rig) {
      scene.remove(rig.root);
      rig.dispose();
    }
    rig = new AvatarRig(scaleOf(), o.tier, custom);
    scene.add(rig.root);
  };
  rebuild();
  let raf = 0;
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (!rig || !renderer) return;
    rig.root.rotation.y = Math.sin(now / 2000) * 0.5;
    rig.update(now, 0);
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(loop);

  const themes = h('div', { class: 'avatar-themes', role: 'radiogroup', 'aria-label': 'Theme' });
  const slots = h('div', { class: 'avatar-slots' });
  const paint = () => {
    themes.replaceChildren(
      ...o.scales.map((s) =>
        h('button', { class: `theme${s.id === scaleId ? ' sel' : ''}`, role: 'radio', 'aria-checked': s.id === scaleId ? 'true' : 'false', title: s.name?.en ?? s.id, 'data-scale': s.id, onclick: () => { scaleId = s.id; rebuild(); paint(); } },
          s.steps[Math.max(0, o.tier - 1)]?.icon ?? s.icon ?? '★'),
      ),
    );
    const scale = scaleOf();
    slots.replaceChildren(
      ...scale.customization.map((slot) => {
        const key = SLOT_FIELD[slot.slot];
        if (!key) return h('div', {});
        const opts = Array.from({ length: 10 }, (_, i) => {
          const v = i + 1;
          const need = starsFor(scale, slot.slot, v);
          const locked = need > o.stars;
          const isColor = slot.kind === 'color';
          const label = isColor ? '' : slot.slot === 'size' ? String(v) : (OPTION_NAMES[slot.slot]?.[i] ?? String(v));
          const b = h('button', {
            class: `opt${custom[key] === v ? ' sel' : ''}${locked ? ' locked' : ''}`,
            'data-slot': slot.slot, 'data-value': v, 'aria-pressed': custom[key] === v ? 'true' : 'false',
            title: locked ? `${need} ★ to unlock` : label || `colour ${v}`,
            style: isColor ? { background: hueCss(v) } : {},
            onclick: () => {
              if (locked) return;
              custom = { ...custom, [key]: v };
              rebuild();
              paint();
            },
          }, locked ? `🔒${need}★` : label);
          if (locked) b.setAttribute('aria-disabled', 'true');
          return b;
        });
        return h('div', { class: 'avatar-slot' }, h('div', { class: 'nm' }, SLOT_LABEL[slot.slot] ?? slot.slot), h('div', { class: 'opts' }, ...opts));
      }),
    );
  };
  paint();

  const dispose = () => {
    cancelAnimationFrame(raf);
    rig?.dispose();
    renderer?.dispose();
  };
  const el = h(
    'div',
    { class: 'overlay avatar-screen' },
    h(
      'div',
      { class: 'card' },
      h('h2', {}, '🎨 Your avatar'),
      h('p', { class: 'msg' }, `${o.stars} ★ collected — more stars unlock more options.`),
      h('div', { class: 'avatar-top' }, canvas, themes),
      slots,
      h('div', { class: 'row-btns' },
        h('button', { onclick: () => { dispose(); o.onSave(scaleId, custom); } }, '✔ Save'),
        h('button', { class: 'secondary', onclick: () => { dispose(); o.onClose(); } }, 'Cancel')),
    ),
  );
  return { el, dispose };
}
