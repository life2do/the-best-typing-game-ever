/**
 * Artifact screen (docs/03 The Artifact, docs/05 Shareable artifact image): the tesseract with every learned
 * letter under scratch-off foil — type a letter (or tap it) to scratch it free — inside the code ring that
 * carries the run fingerprint. Saves the picture as a PNG with the proof bundle inside, or a `.proof` file.
 */
import { drawTesseract, type Glyph } from '@/artifact/tesseract';
import { drawRing, ringBits } from '@/proof/ring';
import { fingerprintBytes, shortFingerprint } from '@/proof/fingerprint';
import { traitsFrom, type ArtifactTraits } from '@/proof/traits';
import { h } from './dom';

export type IdentityChoice = 'none' | 'hashed' | 'plain';

export interface ArtifactScreenOptions {
  title: string;
  subtitle: string;
  letters: string[];
  fingerprint: string;
  reducedMotion: boolean;
  /** the player's name, for the "name on the proof" choice (omitted: the choice isn't offered) */
  name?: string;
  onSavePng: (identity: IdentityChoice) => Promise<void> | void;
  onSaveProof: (identity: IdentityChoice) => Promise<void> | void;
  onClose: () => void;
}

const ringColors = (t: ArtifactTraits) => [`hsl(${t.hues[3]}, 90%, 72%)`, `hsl(${t.hues[3]}, 25%, 26%)`] as const;
const BG = '#0b1020';

/** Paints the whole picture (background, tesseract, ring, caption) into a square canvas of `size` pixels. */
export function paintArtifact(ctx: CanvasRenderingContext2D, size: number, fingerprint: string, glyphs: Glyph[], t: number, caption?: string, scratching?: Record<number, number>): { x: number; y: number; r: number }[] {
  const bytes = fingerprintBytes(fingerprint);
  const traits = traitsFrom(bytes);
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, size, size);
  const placed = drawTesseract(ctx, { size, t, traits, glyphs, scratching });
  const [on, off] = ringColors(traits);
  drawRing(ctx, size, ringBits(bytes), on, off);
  if (caption) {
    ctx.fillStyle = 'rgba(240, 239, 236, 0.85)';
    ctx.font = `600 ${Math.round(size * 0.024)}px "Atkinson Hyperlegible", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(caption, size / 2, size * 0.86);
    ctx.font = `400 ${Math.round(size * 0.017)}px ui-monospace, monospace`;
    ctx.fillStyle = 'rgba(240, 239, 236, 0.6)';
    ctx.fillText(shortFingerprint(bytes), size / 2, size * 0.89);
  }
  return placed;
}

/** The finished picture (all letters free) as PNG bytes. */
export async function artifactPng(fingerprint: string, letters: string[], caption: string, size = 1024): Promise<Uint8Array> {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  paintArtifact(c.getContext('2d')!, size, fingerprint, letters.map((char) => ({ char, revealed: true })), 0, caption);
  const blob = await new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('Could not draw the picture.'))), 'image/png'));
  return new Uint8Array(await blob.arrayBuffer());
}

export function artifactScreen(o: ArtifactScreenOptions): { el: HTMLElement; dispose: () => void; scratch: (char: string) => boolean } {
  const glyphs: Glyph[] = o.letters.map((char) => ({ char, revealed: false }));
  const scratching: Record<number, number> = {};
  const canvas = h('canvas', { class: 'artifact-canvas', 'aria-label': `The artifact: a turning tesseract with ${glyphs.length} letters` }) as HTMLCanvasElement;
  const css = 520;
  const dpr = Math.min(2, devicePixelRatio || 1);
  canvas.width = css * dpr;
  canvas.height = css * dpr;
  const ctx = canvas.getContext('2d');
  const progress = h('p', { class: 'msg artifact-progress', 'aria-live': 'polite' });
  const paintProgress = () => {
    const n = glyphs.filter((g) => g.revealed).length;
    progress.textContent = n === glyphs.length ? `✨ Every letter is free! (${n})` : `Type each letter to scratch it free: ${n} / ${glyphs.length}`;
  };
  let placed: { x: number; y: number; r: number }[] = [];
  const timers: ReturnType<typeof setTimeout>[] = [];
  const start = performance.now();
  let raf = 0;
  /** When each glyph's scratch started (ms); the wipe takes SCRATCH_MS whatever the frame rate. */
  const scratchStart: Record<number, number> = {};
  const SCRATCH_MS = 350;
  const finish = (i: number) => {
    if (glyphs[i].revealed) return;
    glyphs[i].revealed = true;
    delete scratching[i];
    delete scratchStart[i];
    paintProgress();
  };
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    for (const k of Object.keys(scratchStart)) {
      const i = Number(k);
      scratching[i] = Math.min(1, Math.max(0.01, (performance.now() - scratchStart[i]) / SCRATCH_MS));
    }
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    placed = paintArtifact(ctx, css, o.fingerprint, glyphs, o.reducedMotion ? 0 : now - start, undefined, scratching);
  };
  raf = requestAnimationFrame(loop);
  const reveal = (i: number) => {
    if (i < 0 || glyphs[i].revealed || i in scratchStart) return false;
    if (o.reducedMotion) {
      finish(i);
      return true;
    }
    // The letter counts as free after SCRATCH_MS by the clock, not after a number of frames: a slow page
    // (software rendering) can draw only a few frames a second. Frames only animate the wipe.
    scratching[i] = 0.01;
    scratchStart[i] = performance.now();
    timers.push(setTimeout(() => finish(i), SCRATCH_MS));
    return true;
  };
  canvas.addEventListener('pointerdown', (e) => {
    const r = canvas.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * css;
    const y = ((e.clientY - r.top) / r.height) * css;
    reveal(placed.findIndex((p, i) => !glyphs[i].revealed && Math.hypot(p.x - x, p.y - y) <= p.r * 1.3));
  });
  paintProgress();
  const ident = h('select', { 'data-artifact': 'identity' }, h('option', { value: 'none' }, 'no name'), h('option', { value: 'hashed' }, 'hidden name (checked by typing it)'), h('option', { value: 'plain' }, 'name shown')) as HTMLSelectElement;
  const busy = (b: HTMLButtonElement, fn: () => Promise<void> | void) => async () => {
    b.disabled = true;
    try {
      await fn();
    } finally {
      b.disabled = false;
    }
  };
  const png = h('button', { 'data-artifact': 'png' }, '🖼 Save the picture (with proof)') as HTMLButtonElement;
  png.onclick = busy(png, () => o.onSavePng(ident.value as IdentityChoice));
  const proof = h('button', { class: 'secondary', 'data-artifact': 'proof' }, '📜 Save the .proof file') as HTMLButtonElement;
  proof.onclick = busy(proof, () => o.onSaveProof(ident.value as IdentityChoice));
  const dispose = () => {
    cancelAnimationFrame(raf);
    for (const t of timers) clearTimeout(t);
  };
  const el = h(
    'div',
    { class: 'overlay artifact' },
    h('div', { class: 'card' },
      h('h1', {}, o.title),
      h('p', {}, o.subtitle),
      canvas,
      progress,
      h('p', { class: 'fingerprint', title: o.fingerprint }, `Fingerprint ${shortFingerprint(fingerprintBytes(o.fingerprint))}`),
      o.name ? h('label', { class: 'artifact-identity' }, 'Name on the proof: ', ident) : '',
      h('div', { class: 'row-btns' }, png, proof, h('a', { href: './verify/' }, h('button', { class: 'secondary' }, '🔍 Verify')), h('button', { class: 'secondary', onclick: () => { dispose(); o.onClose(); } }, 'Back'))),
  );
  return { el, dispose, scratch: (char: string) => reveal(glyphs.findIndex((g, i) => !g.revealed && !(i in scratchStart) && g.char === char)) };
}
