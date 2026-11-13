import * as THREE from 'three';
import { Q } from '@/core/fixed';

export const fromQ = (v: number) => v / Q;

/** Remove and dispose children of a group. */
export function clearGroup(g: THREE.Group): void {
  for (const c of [...g.children]) {
    g.remove(c);
    c.traverse((o) => {
      if (o instanceof THREE.Mesh) o.geometry.dispose();
    });
  }
}

/** Keep a pool of objects in sync with a list of keys. */
export class Pool<K, O extends THREE.Object3D> {
  private map = new Map<K, O>();
  constructor(private readonly parent: THREE.Object3D, private readonly make: (k: K) => O) {}
  sync(keys: K[]): Map<K, O> {
    const keep = new Set(keys);
    for (const [k, o] of this.map) if (!keep.has(k)) {
      this.parent.remove(o);
      this.map.delete(k);
    }
    for (const k of keys) if (!this.map.has(k)) {
      const o = this.make(k);
      this.parent.add(o);
      this.map.set(k, o);
    }
    return this.map;
  }
}

/** Glyphs of the upcoming dictated text as a row of labels. */
export function upcoming(text: string, pos: number, n: number): string {
  return text.slice(pos, pos + n).replace(/ /g, '␣');
}
