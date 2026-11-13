/** Hashing (docs/10 §3.2–3.3). Synchronous pure-JS SHA-256 so results are identical in Node and every browser. */
import { sha256 } from '@noble/hashes/sha2.js';
import { canonicalize, type CanonicalOptions } from './canonical';

export type Hash = `sha256-${string}`;

const enc = new TextEncoder();
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

export function base64url(bytes: Uint8Array): string {
  let s = '';
  let i = 0;
  for (; i + 2 < bytes.length; i += 3) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    s += B64[(n >> 18) & 63] + B64[(n >> 12) & 63] + B64[(n >> 6) & 63] + B64[n & 63];
  }
  const rest = bytes.length - i;
  if (rest === 1) {
    const n = bytes[i] << 16;
    s += B64[(n >> 18) & 63] + B64[(n >> 12) & 63];
  } else if (rest === 2) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8);
    s += B64[(n >> 18) & 63] + B64[(n >> 12) & 63] + B64[(n >> 6) & 63];
  }
  return s;
}

export function sha256Bytes(data: Uint8Array | string): Uint8Array {
  return sha256(typeof data === 'string' ? enc.encode(data) : data);
}

/** Hash of raw file bytes. */
export function hashBytes(data: Uint8Array | string): Hash {
  return `sha256-${base64url(sha256Bytes(data))}`;
}

/** Hash of a JSON value via canonical JSON. */
export function hashValue(value: unknown, opts?: CanonicalOptions): Hash {
  return hashBytes(canonicalize(value, opts));
}

/** Hash of integer-only simulation data (snapshots, logs, campaigns). */
export function hashState(value: unknown): Hash {
  return hashValue(value, { integersOnly: true });
}

/** Run-chain link: link_n = hash({prev, snap}). */
export function chainLink(prev: Hash, snap: Hash): Hash {
  return hashValue({ prev, snap });
}
