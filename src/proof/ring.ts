/**
 * Code ring (docs/05): a ring of dashes around the artifact carrying a version byte, the first 128 bits
 * of the run fingerprint and a CRC-16, readable back from the PNG or a screenshot of it.
 *
 * Layout: 160 cells clockwise from 12 o'clock. Cells 0–7 are a fixed start mark (11111110), then 152 data
 * bits (19 bytes, most significant bit first). A set bit is a bright dash, a clear bit a dim one, so the
 * reader can threshold between the two.
 */
export const RING_VERSION = 1;
export const RING_CELLS = 160;
const START = [1, 1, 1, 1, 1, 1, 1, 0];
/** Ring geometry relative to the image: centre in the middle, radius and dash width as a share of its size. */
export const RING_RADIUS = 0.455;
export const RING_WIDTH = 0.028;

export function crc16(bytes: Uint8Array): number {
  let crc = 0xffff;
  for (const b of bytes) {
    crc ^= b << 8;
    for (let k = 0; k < 8; k++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc;
}

/** The ring's 160 cells for a fingerprint (its first 16 bytes are encoded). */
export function ringBits(fingerprint: Uint8Array): number[] {
  const payload = new Uint8Array(19);
  payload[0] = RING_VERSION;
  payload.set(fingerprint.slice(0, 16), 1);
  const crc = crc16(payload.slice(0, 17));
  payload[17] = crc >> 8;
  payload[18] = crc & 255;
  const bits = [...START];
  for (const b of payload) for (let k = 7; k >= 0; k--) bits.push((b >> k) & 1);
  return bits;
}

/** Decodes cells back into the 16 fingerprint bytes; null if the start mark, version or CRC don't match. */
export function bitsToFingerprint(bits: readonly number[]): Uint8Array | null {
  if (bits.length !== RING_CELLS || START.some((b, k) => bits[k] !== b)) return null;
  const payload = new Uint8Array(19);
  for (let k = 0; k < 152; k++) payload[k >> 3] |= bits[8 + k] << (7 - (k & 7));
  if (payload[0] !== RING_VERSION) return null;
  const crc = crc16(payload.slice(0, 17));
  if (payload[17] !== crc >> 8 || payload[18] !== (crc & 255)) return null;
  return payload.slice(1, 17);
}

/** Angle (radians, clockwise from 12 o'clock) of the middle of cell k. */
export const cellAngle = (k: number) => ((k + 0.5) / RING_CELLS) * Math.PI * 2;

export interface Pixels {
  width: number;
  height: number;
  /** RGBA, row-major */
  data: Uint8ClampedArray | Uint8Array;
}

/**
 * Reads the ring from an image of the artifact (the PNG, or a screenshot showing the whole picture).
 * Samples each cell's middle; cells brighter than the midpoint between the dimmest and brightest are set.
 */
export function readRing(img: Pixels): Uint8Array | null {
  const size = Math.min(img.width, img.height);
  const cx = img.width / 2;
  const cy = img.height / 2;
  const r = size * RING_RADIUS;
  const lum = (x: number, y: number) => {
    let sum = 0;
    let n = 0;
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const px = Math.round(x) + dx;
        const py = Math.round(y) + dy;
        if (px < 0 || py < 0 || px >= img.width || py >= img.height) continue;
        const o = (py * img.width + px) * 4;
        sum += img.data[o] * 0.299 + img.data[o + 1] * 0.587 + img.data[o + 2] * 0.114;
        n++;
      }
    return n ? sum / n : 0;
  };
  const samples = Array.from({ length: RING_CELLS }, (_, k) => {
    const a = cellAngle(k);
    return lum(cx + Math.sin(a) * r, cy - Math.cos(a) * r);
  });
  const lo = Math.min(...samples);
  const hi = Math.max(...samples);
  if (hi - lo < 24) return null; // no ring here
  const mid = (lo + hi) / 2;
  return bitsToFingerprint(samples.map((v) => (v > mid ? 1 : 0)));
}

/** Draws the ring on a 2D canvas context of a square image of `size` pixels. */
export function drawRing(ctx: CanvasRenderingContext2D, size: number, bits: readonly number[], onColor: string, offColor: string): void {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * RING_RADIUS;
  const gap = 0.18 / RING_CELLS * Math.PI * 2;
  ctx.save();
  ctx.lineWidth = size * RING_WIDTH;
  ctx.lineCap = 'butt';
  for (let k = 0; k < RING_CELLS; k++) {
    const a0 = (k / RING_CELLS) * Math.PI * 2 + gap / 2 - Math.PI / 2;
    const a1 = ((k + 1) / RING_CELLS) * Math.PI * 2 - gap / 2 - Math.PI / 2;
    ctx.strokeStyle = bits[k] ? onColor : offColor;
    ctx.beginPath();
    ctx.arc(cx, cy, r, a0, a1);
    ctx.stroke();
  }
  ctx.restore();
}
