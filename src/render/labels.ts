/** Text labels as canvas-texture sprites (kid-readable, high contrast). */
import * as THREE from 'three';

const cache = new Map<string, THREE.CanvasTexture>();

export function labelTexture(text: string, color = '#ffffff', bg = 'rgba(0,0,0,0.55)', font = '600 64px "Atkinson Hyperlegible", system-ui, sans-serif'): THREE.CanvasTexture {
  const key = `${text}|${color}|${bg}|${font}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d')!;
  ctx.font = font;
  const w = Math.max(64, Math.ceil(ctx.measureText(text).width) + 40);
  c.width = w;
  c.height = 96;
  ctx.font = font;
  if (bg !== 'transparent') {
    ctx.fillStyle = bg;
    const r = 28;
    ctx.beginPath();
    ctx.roundRect(0, 0, w, 96, r);
    ctx.fill();
  }
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, 52);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  cache.set(key, tex);
  if (cache.size > 400) {
    const first = cache.keys().next().value!;
    cache.get(first)!.dispose();
    cache.delete(first);
  }
  return tex;
}

export function makeLabel(text: string, height = 0.6, color?: string, bg?: string): THREE.Sprite {
  const tex = labelTexture(text, color, bg);
  // Slightly below white so text stays under the bloom threshold and never smears.
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, color: 0xd9d9d9 });
  const s = new THREE.Sprite(mat);
  const img = tex.image as HTMLCanvasElement;
  s.scale.set((height * img.width) / img.height, height, 1);
  return s;
}

export function setLabel(s: THREE.Sprite, text: string, height = 0.6, color?: string, bg?: string): void {
  const tex = labelTexture(text, color, bg);
  const mat = s.material as THREE.SpriteMaterial;
  if (mat.map !== tex) {
    mat.map = tex;
    mat.needsUpdate = true;
    const img = tex.image as HTMLCanvasElement;
    s.scale.set((height * img.width) / img.height, height, 1);
  }
}
