/** PNG text chunks (docs/05): the proof bundle travels inside the artifact PNG as an iTXt chunk. */
const SIG = [137, 80, 78, 71, 13, 10, 26, 10];
const enc = new TextEncoder();
const dec = new TextDecoder();

let table: Uint32Array | null = null;
export function crc32(bytes: Uint8Array): number {
  if (!table) {
    table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c >>> 0;
    }
  }
  let c = 0xffffffff;
  for (const b of bytes) c = table[(c ^ b) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export const isPng = (b: Uint8Array) => b.length > 8 && SIG.every((v, i) => b[i] === v);

interface Chunk {
  type: string;
  data: Uint8Array;
  start: number;
  end: number;
}

function* chunks(png: Uint8Array): Generator<Chunk> {
  if (!isPng(png)) throw new Error('Not a PNG image.');
  const view = new DataView(png.buffer, png.byteOffset, png.byteLength);
  let o = 8;
  while (o + 12 <= png.length) {
    const len = view.getUint32(o);
    const type = String.fromCharCode(...png.slice(o + 4, o + 8));
    yield { type, data: png.slice(o + 8, o + 8 + len), start: o, end: o + 12 + len };
    o += 12 + len;
  }
}

function chunk(type: string, data: Uint8Array): Uint8Array {
  const out = new Uint8Array(12 + data.length);
  const view = new DataView(out.buffer);
  view.setUint32(0, data.length);
  out.set(enc.encode(type), 4);
  out.set(data, 8);
  view.setUint32(8 + data.length, crc32(out.slice(4, 8 + data.length)));
  return out;
}

/** Returns a copy of `png` with an uncompressed iTXt chunk (keyword → UTF-8 text) before IEND. */
export function addITXt(png: Uint8Array, keyword: string, text: string): Uint8Array {
  const kw = enc.encode(keyword);
  const body = enc.encode(text);
  const data = new Uint8Array(kw.length + 5 + body.length);
  data.set(kw, 0); // keyword, NUL, compression flag 0, method 0, empty language tag NUL, empty translated keyword NUL
  data.set(body, kw.length + 5);
  const iend = [...chunks(png)].find((c) => c.type === 'IEND');
  if (!iend) throw new Error('PNG has no IEND chunk.');
  const add = chunk('iTXt', data);
  const out = new Uint8Array(png.length + add.length);
  out.set(png.slice(0, iend.start), 0);
  out.set(add, iend.start);
  out.set(png.slice(iend.start), iend.start + add.length);
  return out;
}

/** The text of the iTXt chunk with this keyword (uncompressed only), or null. */
export function readITXt(png: Uint8Array, keyword: string): string | null {
  for (const c of chunks(png)) {
    if (c.type !== 'iTXt') continue;
    const z = c.data.indexOf(0);
    if (dec.decode(c.data.slice(0, z)) !== keyword) continue;
    if (c.data[z + 1] !== 0) return null; // compressed text is not used by this game
    let o = z + 3;
    o = c.data.indexOf(0, o) + 1; // language tag
    o = c.data.indexOf(0, o) + 1; // translated keyword
    return dec.decode(c.data.slice(o));
  }
  return null;
}
