/**
 * The artifact (docs/03 The Artifact): a tesseract (4D hypercube) turning in the two planes chosen by the
 * run fingerprint, projected 4D → 3D → 2D, with a glyph for every learned letter on its vertices and edge
 * midpoints. Drawn with Canvas 2D, so it works without WebGL and renders the same picture everywhere.
 */
import { GLYPH_SLOTS, type ArtifactTraits, type Plane } from '@/proof/traits';

export type V4 = [number, number, number, number];

/** 16 vertices (±1)^4 and the 32 edges joining vertices that differ in one coordinate. */
export const VERTICES: V4[] = Array.from({ length: 16 }, (_, i) => [i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1, i & 8 ? 1 : -1]);
export const EDGES: [number, number][] = [];
for (let a = 0; a < 16; a++) for (let bit = 1; bit < 16; bit <<= 1) if (!(a & bit)) EDGES.push([a, a | bit]);

const AXIS: Record<string, number> = { x: 0, y: 1, z: 2, w: 3 };

export function rotate(v: V4, plane: Plane, angle: number): V4 {
  const i = AXIS[plane[0]];
  const j = AXIS[plane[1]];
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const out = v.slice() as V4;
  out[i] = v[i] * c - v[j] * s;
  out[j] = v[i] * s + v[j] * c;
  return out;
}

/** Perspective 4D → 3D (viewer on the w axis), then 3D → 2D; returns screen x, y (unit scale) and depth. */
export function project(v: V4): { x: number; y: number; depth: number; scale: number } {
  const w = 1 / (3 - v[3]);
  const x3 = v[0] * w * 2;
  const y3 = v[1] * w * 2;
  const z3 = v[2] * w * 2;
  const z = 1 / (4 - z3);
  return { x: x3 * z * 3, y: y3 * z * 3, depth: z3 + v[3], scale: w * z * 6 };
}

/** Positions of the 16 vertices at time t (ms) for these traits. */
export function frame(traits: ArtifactTraits, t: number): ReturnType<typeof project>[] {
  const a1 = (t / 60000) * traits.speeds[0] * Math.PI * 2 + 0.5;
  const a2 = (t / 60000) * traits.speeds[1] * Math.PI * 2 + 0.3;
  return VERTICES.map((v) => project(rotate(rotate(rotate(v, traits.planes[0], a1), traits.planes[1], a2), 'xz', 0.35)));
}

/** Screen position (unit scale) of glyph slot `slot` (0–15 vertices, 16–47 edge midpoints). */
export function slotPosition(pts: ReturnType<typeof project>[], slot: number): { x: number; y: number; depth: number; scale: number } {
  if (slot < 16) return pts[slot];
  const [a, b] = EDGES[slot - 16];
  return { x: (pts[a].x + pts[b].x) / 2, y: (pts[a].y + pts[b].y) / 2, depth: (pts[a].depth + pts[b].depth) / 2, scale: (pts[a].scale + pts[b].scale) / 2 };
}

/** Which slot each glyph takes: the fingerprint's layout order (more glyphs than slots share them round-robin). */
export const glyphSlots = (traits: ArtifactTraits, count: number) => Array.from({ length: count }, (_, k) => traits.layout[k % GLYPH_SLOTS]);

export interface Glyph {
  char: string;
  revealed: boolean;
}

export interface DrawOptions {
  size: number;
  t: number;
  traits: ArtifactTraits;
  glyphs: Glyph[];
  /** wipe progress 0..1 of the glyph being scratched, by index */
  scratching?: Record<number, number>;
}

/** Pushes overlapping glyph discs apart a little (a few deterministic passes), so letters stay readable. */
export function separate(discs: { x: number; y: number; r: number }[]): void {
  for (let pass = 0; pass < 8; pass++)
    for (let i = 0; i < discs.length; i++)
      for (let j = i + 1; j < discs.length; j++) {
        const a = discs[i];
        const b = discs[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let d = Math.hypot(dx, dy);
        const want = (a.r + b.r) * 0.98;
        if (d >= want) continue;
        if (d < 1e-6) {
          dx = 1;
          dy = 0;
          d = 1e-6;
        }
        const push = (want - d) / 2;
        a.x -= (dx / d) * push;
        a.y -= (dy / d) * push;
        b.x += (dx / d) * push;
        b.y += (dy / d) * push;
      }
}

const hsl = (h: number, s: number, l: number, a = 1) => `hsla(${h}, ${s}%, ${l}%, ${a})`;

/** Draws the tesseract and its glyphs into a square area of `size` pixels (the ring is drawn separately). */
export function drawTesseract(ctx: CanvasRenderingContext2D, o: DrawOptions): { x: number; y: number; r: number }[] {
  const { size, traits } = o;
  const [hEdge, hGlyph, hGlow] = traits.hues;
  const sat = traits.saturation;
  const cx = size / 2;
  const cy = size / 2;
  const unit = size * 0.19;
  const pts = frame(traits, o.t);
  const sx = (p: { x: number }) => cx + p.x * unit;
  const sy = (p: { y: number }) => cy + p.y * unit;
  // Glow behind.
  const g = ctx.createRadialGradient(cx, cy, size * 0.02, cx, cy, size * 0.42);
  g.addColorStop(0, hsl(hGlow, sat, 55, 0.45));
  g.addColorStop(1, hsl(hGlow, sat, 20, 0));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  // Trails: echoes of the edges a moment earlier.
  if (traits.trail !== 'none') {
    const echoes = traits.trail === 'ribbon' ? 4 : 2;
    for (let e = echoes; e >= 1; e--) {
      const past = frame(traits, o.t - e * 140);
      ctx.strokeStyle = hsl(hEdge, sat, 60, 0.07 * (echoes - e + 1));
      ctx.lineWidth = size * 0.004;
      for (const [a, b] of EDGES) {
        ctx.beginPath();
        ctx.moveTo(sx(past[a]), sy(past[a]));
        ctx.lineTo(sx(past[b]), sy(past[b]));
        ctx.stroke();
      }
    }
  }
  // Edges, far ones first and dimmer.
  const order = EDGES.map((e, i) => ({ i, d: (pts[e[0]].depth + pts[e[1]].depth) / 2 })).sort((p, q) => p.d - q.d);
  for (const { i } of order) {
    const [a, b] = EDGES[i];
    const near = (pts[a].depth + pts[b].depth + 4) / 8;
    ctx.strokeStyle = hsl(hEdge, sat, 45 + near * 25, 0.45 + near * 0.5);
    ctx.lineWidth = size * (0.003 + near * 0.004);
    ctx.beginPath();
    ctx.moveTo(sx(pts[a]), sy(pts[a]));
    ctx.lineTo(sx(pts[b]), sy(pts[b]));
    ctx.stroke();
  }
  if (traits.trail === 'sparkle' || traits.trail === 'comet')
    for (const p of pts) {
      ctx.fillStyle = hsl(hGlow, sat, 80, 0.8);
      ctx.beginPath();
      ctx.arc(sx(p), sy(p), size * 0.004 * (traits.trail === 'comet' ? 2 : 1), 0, Math.PI * 2);
      ctx.fill();
    }
  // Glyphs: revealed letters glow; covered ones are scratch-off foil discs.
  const slots = glyphSlots(traits, o.glyphs.length);
  const placed = o.glyphs.map((_, k) => {
    const p = slotPosition(pts, slots[k]);
    return { x: sx(p), y: sy(p), r: size * (0.022 + p.scale * 0.006) };
  });
  separate(placed);
  o.glyphs.forEach((gl, k) => {
    const { x, y, r } = placed[k];
    const wipe = o.scratching?.[k] ?? 0;
    if (gl.revealed || wipe > 0) {
      ctx.fillStyle = hsl(hGlyph, sat, 18, 0.85);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = hsl(hGlyph, sat + 10, 78);
      ctx.font = `700 ${Math.round(r * 1.25)}px "Atkinson Hyperlegible", system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(gl.char.toUpperCase(), x, y + r * 0.05);
    }
    if (!gl.revealed) {
      // Foil: a silver disc with stripes; while scratching it shrinks away.
      const left = 1 - wipe;
      if (left > 0) {
        ctx.fillStyle = '#b9bcc8';
        ctx.beginPath();
        ctx.arc(x, y, r * left, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.55)';
        ctx.lineWidth = Math.max(1, r * 0.12);
        ctx.beginPath();
        ctx.moveTo(x - r * 0.45 * left, y + r * 0.2 * left);
        ctx.lineTo(x + r * 0.2 * left, y - r * 0.45 * left);
        ctx.stroke();
      }
    }
  });
  return placed;
}
