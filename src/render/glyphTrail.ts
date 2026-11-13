/**
 * Upcoming letters placed in the world in front of the character (on the road or standing on the
 * path). They slide toward the character as the player types, so each typed letter is "reached":
 * the current letter is larger and gold, typed letters pop and fade behind. Space shows as a
 * space-bar shape (labels.ts draws "␣" that way; the glyph itself looks too much like "u").
 * Purely visual: reads the simulation's prompt, never writes state.
 */
import * as THREE from 'three';
import { labelTexture } from './labels';

export interface GlyphTrailOptions {
  /** 'ground': lying flat on the floor (3D chase views); 'upright': standing, facing the camera (side views). */
  mode: 'ground' | 'upright';
  count?: number;
  /** distance from the character to the current letter (world units) */
  start: number;
  /** distance between letters */
  gap: number;
  /** letter height; the current letter is 1.25× */
  size: number;
}

const FONT = '700 80px ui-monospace, Menlo, Consolas, monospace';

export class GlyphTrail {
  readonly group = new THREE.Group();
  private meshes: THREE.Mesh[] = [];
  private shown = 0;
  private lastPos = -1;
  private popAt = -1e9;

  constructor(private readonly o: GlyphTrailOptions) {
    for (let i = 0; i < (o.count ?? 12); i++) {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        // Slightly below white so text stays under the bloom threshold of glowing styles.
        new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, color: 0xdddddd, polygonOffset: true, polygonOffsetFactor: -2 }),
      );
      if (o.mode === 'ground') m.rotation.x = -Math.PI / 2;
      m.renderOrder = 5;
      this.group.add(m);
      this.meshes.push(m);
    }
  }

  /**
   * @param text  stage text; @param pos  index of the next character to type
   * @param at    the character's position; letters are laid out from here along `forward`
   * @param forward unit direction in which "ahead" lies (e.g. +X for side views, -Z for the racer)
   */
  update(text: string, pos: number, at: THREE.Vector3, forward: THREE.Vector3, now: number, adjust?: (p: THREE.Vector3, mesh: THREE.Mesh, index: number) => void): void {
    if (Math.abs(pos - this.shown) > 6) this.shown = pos; // new stage text: jump
    if (pos !== this.lastPos) {
      if (pos > this.lastPos && this.lastPos >= 0) this.popAt = now;
      this.lastPos = pos;
    }
    this.shown += (pos - this.shown) * 0.25;
    const pop = Math.min(1, (now - this.popAt) / 250);
    for (let k = 0; k < this.meshes.length; k++) {
      const i = Math.floor(this.shown) - 1 + k;
      const m = this.meshes[k];
      const ch = text[i];
      if (ch === undefined || i < 0) {
        m.visible = false;
        continue;
      }
      const current = i === pos;
      const typed = i < pos;
      const tex = labelTexture(ch === ' ' ? '␣' : ch, current ? '#1a1a1a' : '#ffffff', current ? 'rgba(255,209,102,0.97)' : 'rgba(0,0,0,0.6)', FONT);
      const mat = m.material as THREE.MeshBasicMaterial;
      if (mat.map !== tex) {
        mat.map = tex;
        mat.needsUpdate = true;
      }
      const img = tex.image as HTMLCanvasElement;
      // The letter just typed pops (grows) and fades as the character reaches it.
      const just = typed && i === pos - 1;
      const size = this.o.size * (current ? 1.25 : 1) * (just ? 1 + pop * 0.6 : 1);
      m.scale.set((size * img.width) / img.height, size, 1);
      const ahead = this.o.start + (i - this.shown) * this.o.gap;
      mat.opacity = typed ? (just ? 1 - pop : 0) : Math.min(1, 1.2 - k * 0.05);
      m.visible = mat.opacity > 0.02;
      m.position.copy(at).addScaledVector(forward, ahead);
      adjust?.(m.position, m, i); // e.g. put each letter in its lane of the route
    }
  }

  /** Distance ahead of the character at which text index i is currently drawn. */
  aheadOf(i: number): number {
    return this.o.start + (i - this.shown) * this.o.gap;
  }

  dispose(): void {
    for (const m of this.meshes) {
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
    }
  }
}
