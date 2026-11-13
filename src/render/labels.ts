/** Text labels as canvas-texture sprites (kid-readable, high contrast). */
import * as THREE from 'three';

const cache = new Map<string, THREE.CanvasTexture>();
const SPACE = '␣';

export function labelTexture(text: string, color = '#ffffff', bg = 'rgba(0,0,0,0.55)', font = '600 64px "Atkinson Hyperlegible", system-ui, sans-serif'): THREE.CanvasTexture {
  const key = `${text}|${color}|${bg}|${font}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d')!;
  ctx.font = font;
  // Size the bubble from the font and pad generously, then centre the glyphs on their *measured*
  // ink bounds (not the font baseline), so letters like "j", "f" or "␣" sit visually centred.
  const px = Number(/(\d+)px/.exec(font)?.[1] ?? 64);
  const pad = Math.round(px * 0.42);
  // "␣" (Space) is drawn as a little space-bar shape: a wide flat bar can't be mistaken for "u".
  const parts = text.split(/(␣)/).filter(Boolean);
  const barW = px * 1.5;
  let textW = 0;
  for (const part of parts) textW += part === SPACE ? barW + px * 0.15 : ctx.measureText(part).width;
  const plain = parts.filter((p) => p !== SPACE).join('') || 'x';
  const m = ctx.measureText(plain);
  const ascent = m.actualBoundingBoxAscent || px * 0.72;
  const descent = m.actualBoundingBoxDescent || px * 0.2;
  const inkH = Math.max(ascent + descent, px * 0.72);
  const h = Math.ceil(inkH + pad * 2);
  const w = Math.max(h, Math.ceil(textW + pad * 2));
  c.width = w;
  c.height = h;
  ctx.font = font;
  if (bg !== 'transparent') {
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, Math.min(h / 2, px * 0.45));
    ctx.fill();
  }
  ctx.fillStyle = color;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  const baseline = h / 2 + (ascent - descent) / 2;
  let x = (w - textW) / 2;
  for (const part of parts) {
    if (part === SPACE) {
      // Space bar: a wide rounded outline with a small gap below, centred vertically.
      const bh = px * 0.34;
      ctx.lineWidth = Math.max(3, px * 0.09);
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.roundRect(x + px * 0.075, h / 2 - bh / 2, barW, bh, bh / 2);
      ctx.stroke();
      x += barW + px * 0.15;
    } else {
      ctx.fillText(part, x, baseline);
      x += ctx.measureText(part).width;
    }
  }
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

export function makeLabel(text: string, height = 0.6, color?: string, bg?: string, onTop = false): THREE.Sprite {
  const tex = labelTexture(text, color, bg);
  // Slightly below white so text stays under the bloom threshold and never smears.
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, color: 0xd9d9d9 });
  if (onTop) mat.depthTest = false;
  const s = new THREE.Sprite(mat);
  if (onTop) s.renderOrder = 10;
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
