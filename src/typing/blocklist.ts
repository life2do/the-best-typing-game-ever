/**
 * Hashed blocklist (docs/04 Language packs). No readable words are kept in the repository or the shipped
 * game: each entry is a salted SHA-256 of a normalised word (NFC, lower case), so contributors and anyone
 * reading the bundle don't see them. It only hides — a short word can be found by hashing a dictionary —
 * which is the point: the words shouldn't be in plain sight in a children's game.
 *
 * File format (one entry per line, `#` starts a comment such as a harmless category label):
 *   w <hash>          the whole word is blocked
 *   s <len> <hash>    blocked anywhere inside a word (`len` = length of the blocked part)
 * Add entries with `npm run blocklist -- add <lang>` (the word is typed without being shown).
 */
import { base64url, sha256Bytes } from '@/core/hash';

export interface Blocklist {
  salt: string;
  /** whole-word hashes */
  words: Record<string, true>;
  /** substring hashes by substring length */
  subs: Record<number, Record<string, true>>;
  /** memo: lower-cased word → blocked? (words repeat a lot; plain object, docs/10 §1.5) */
  memo: Record<string, boolean>;
  memoSize: number;
}

/** Per-language salt (the language pack id, e.g. `lang.en`). */
export const blockSalt = (languageId: string) => `tbtge-blocklist/1:${languageId}`;

const norm = (w: string) => w.trim().normalize('NFC').toLowerCase();

export function blockHash(salt: string, word: string): string {
  return base64url(sha256Bytes(`${salt}\n${norm(word)}`));
}

export function emptyBlocklist(salt: string): Blocklist {
  return { salt, words: Object.create(null), subs: Object.create(null), memo: Object.create(null), memoSize: 0 };
}

const HASH = /^[A-Za-z0-9_-]{43}$/;

/** Parses a hashed blocklist file; throws on a malformed line (with its number). */
export function parseBlocklist(text: string, salt: string): Blocklist {
  const b = emptyBlocklist(salt);
  text.split('\n').forEach((raw, i) => {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) return;
    const [kind, a, c] = line.split(/\s+/);
    if (kind === 'w' && HASH.test(a ?? '') && c === undefined) b.words[a] = true;
    else if (kind === 's' && /^\d+$/.test(a ?? '') && Number(a) >= 1 && HASH.test(c ?? '')) {
      const len = Number(a);
      (b.subs[len] ??= Object.create(null))[c] = true;
    } else throw new Error(`blocklist line ${i + 1}: expected "w <hash>" or "s <length> <hash>"`);
  });
  return b;
}

/** Whether `w` is blocked: as a whole word, or because it contains a blocked part. */
export function isBlocked(w: string, b: Blocklist): boolean {
  const lw = norm(w);
  const known = b.memo[lw];
  if (known !== undefined) return known;
  let hit = b.words[blockHash(b.salt, lw)] === true;
  for (const key of Object.keys(b.subs)) {
    if (hit) break;
    const len = Number(key);
    const set = b.subs[len];
    for (let i = 0; i + len <= lw.length && !hit; i++) hit = set[blockHash(b.salt, lw.slice(i, i + len))] === true;
  }
  if (b.memoSize > 50_000) {
    b.memo = Object.create(null);
    b.memoSize = 0;
  }
  b.memo[lw] = hit;
  b.memoSize++;
  return hit;
}

/** One file line for a word (`sub`: blocked anywhere inside a word). */
export function blockEntry(salt: string, word: string, sub: boolean, category?: string): string {
  const w = norm(word);
  const label = category ? `  # ${category.replace(/[\r\n#]/g, ' ').trim()}` : '';
  return sub ? `s ${w.length} ${blockHash(salt, w)}${label}` : `w ${blockHash(salt, w)}${label}`;
}
