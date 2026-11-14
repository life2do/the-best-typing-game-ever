/**
 * Artifact traits from the run fingerprint (docs/05 Shareable artifact image): palette, the two 4D rotation
 * planes and their speeds, the glyph layout and the trail style. Same fingerprint, same artifact.
 */
export const PLANES = ['xy', 'xz', 'xw', 'yz', 'yw', 'zw'] as const;
export type Plane = (typeof PLANES)[number];

export interface ArtifactTraits {
  /** four hues in degrees: edges, glyphs, glow, ring */
  hues: [number, number, number, number];
  saturation: number;
  planes: [Plane, Plane];
  /** turns per minute for each plane */
  speeds: [number, number];
  /** slot order for glyphs (48 slots: 16 vertices then 32 edge midpoints) */
  layout: number[];
  trail: 'none' | 'comet' | 'sparkle' | 'ribbon';
}

export const GLYPH_SLOTS = 48;

export function traitsFrom(bytes: Uint8Array): ArtifactTraits {
  let i = 0;
  const next = () => bytes[i++ % bytes.length];
  const hue = () => Math.floor((next() * 360) / 256);
  const hues: [number, number, number, number] = [hue(), hue(), hue(), hue()];
  const saturation = 55 + (next() % 35);
  const p1 = next() % PLANES.length;
  let p2 = next() % (PLANES.length - 1);
  if (p2 >= p1) p2++;
  const speeds: [number, number] = [2 + (next() % 5), 1 + (next() % 4)];
  const layout = Array.from({ length: GLYPH_SLOTS }, (_, k) => k);
  for (let k = layout.length - 1; k > 0; k--) {
    const j = ((next() << 8) | next()) % (k + 1);
    [layout[k], layout[j]] = [layout[j], layout[k]];
  }
  const trail = (['none', 'comet', 'sparkle', 'ribbon'] as const)[next() % 4];
  return { hues, saturation, planes: [PLANES[p1], PLANES[p2]], speeds, layout, trail };
}
