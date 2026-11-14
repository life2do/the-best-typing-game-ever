/**
 * Stage text generation (docs/01 Method, docs/02 Words). Deterministic: all randomness from the given Rng.
 * Produces pattern "pseudo-words" from the known letters (new keys weighted up, weak keys weighted up),
 * curated real words once enough are typeable, and at most one special (ability) word per stage.
 */
import type { Rng } from '@/core/rng';
import { floorDiv } from '@/core/fixed';

export interface WordSpan {
  start: number;
  end: number; // exclusive
  word: string;
  ability: string; // ability id
}

export interface StageText {
  text: string;
  spans: WordSpan[];
}

export interface TextParams {
  letters: string[]; // known characters excluding space
  newKeys: string[];
  weakKeys: string[];
  stageIndex: number;
  stageCount: number;
  length: number;
  words: string[]; // typeable common words
  specials: { word: string; ability: string }[]; // typeable, not yet collected
  blockWords: string[];
  blockSubstrings: string[];
  /** Key-group characters known so far (capitals, punctuation, digits, editing keys): added by decoration. */
  groupChars?: string[];
}

export function typeable(word: string, letters: readonly string[]): boolean {
  for (const ch of word) if (!letters.includes(ch)) return false;
  return true;
}

export function isBlocked(w: string, blockWords: readonly string[], blockSubstrings: readonly string[]): boolean {
  const lw = w.toLowerCase();
  if (blockWords.includes(lw)) return true;
  for (const s of blockSubstrings) if (lw.includes(s)) return true;
  return false;
}

export function generateStageText(rng: Rng, p: TextParams): StageText {
  const all = p.letters.filter((c) => c !== ' ');
  // Key-group characters aren't mixed into pseudo-words; they decorate chunks instead (capitalise, punctuate,
  // wrap, number, editing-key tokens). With none known, this is exactly the letter-level generator.
  const extras = (p.groupChars ?? []).filter((c) => all.includes(c));
  const letters = extras.length ? all.filter((c) => !extras.includes(c)) : all;
  const newExtras = p.newKeys.filter((c) => extras.includes(c));
  const oldExtras = extras.filter((c) => !newExtras.includes(c));
  // New-key share falls from 40% (first stage) to 15% (last stage).
  const last = Math.max(1, p.stageCount - 1);
  const newShare = 400 - floorDiv(250 * Math.min(p.stageIndex, last), last);
  const words = p.words.filter((w) => !isBlocked(w, p.blockWords, p.blockSubstrings));
  const wordShare = words.length >= 3 ? Math.min(700, 200 + words.length * 20) : 0;
  const weights = letters.map((c) => (p.weakKeys.includes(c) ? 2 : 1));
  const newKeys = p.newKeys.filter((c) => c !== ' ' && letters.includes(c));

  const chunks: string[] = [];
  const spans: WordSpan[] = [];
  let len = 0;
  let specialUsed = p.specials.length === 0 || !rng.chance(700);
  let guard = 0;
  while (len < p.length && guard++ < 10_000) {
    let chunk: string;
    let ability = '';
    if (!specialUsed && len >= floorDiv(p.length, 3)) {
      const sp = rng.pick(p.specials);
      chunk = sp.word;
      ability = sp.ability;
      specialUsed = true;
    } else if (wordShare && rng.chance(wordShare)) {
      chunk = rng.pick(words);
    } else {
      const n = rng.range(2, letters.length >= 4 ? 5 : 4);
      chunk = '';
      for (let i = 0; i < n; i++) {
        chunk += newKeys.length && rng.chance(newShare) ? rng.pick(newKeys) : rng.weighted(letters, weights);
      }
      if (isBlocked(chunk, p.blockWords, p.blockSubstrings)) continue;
    }
    const pieces = extras.length && !ability ? decorate(rng, chunk, newExtras, oldExtras, extras, newShare) : [chunk];
    for (const piece of pieces) {
      const start = len + (chunks.length ? 1 : 0);
      chunks.push(piece);
      len = start + piece.length;
      if (ability) spans.push({ start, end: len, word: piece, ability });
    }
  }
  return { text: chunks.join(' '), spans };
}

const APPEND = ['.', ',', '?', '!', ':', ';', '…'];
const WRAP = ["'", '"', '«', '»'];
const INFIX = ['-', '/', '=', '+', '_', '*', '&', '%', '@', '#'];

/**
 * Decorate one chunk with a key-group character: new-group characters with the new-key share, earlier
 * ones 15% of the time. Capitals capitalise the chunk; `. , ? ! :` follow it; quotes wrap it; `( )`
 * enclose it; `- / =` join its halves; digits make a number; editing keys (Backspace, Enter, Tab) and
 * anything else become a chunk of their own.
 */
function decorate(rng: Rng, chunk: string, fresh: string[], old: string[], known: string[], freshShare: number): string[] {
  let c = '';
  if (fresh.length && rng.chance(freshShare)) c = rng.pick(fresh);
  else if (old.length && rng.chance(150)) c = rng.pick(old);
  if (!c) return [chunk];
  if (/\p{Lu}/u.test(c)) {
    const up = chunk[0].toUpperCase();
    return [known.includes(up) && up !== chunk[0] ? up + chunk.slice(1) : c + chunk.slice(1)];
  }
  if (/\p{Nd}/u.test(c)) {
    const digits = known.filter((d) => /\p{Nd}/u.test(d));
    let n = c;
    for (let i = rng.int(3); i > 0; i--) n += rng.pick(digits);
    return [n];
  }
  if (APPEND.includes(c)) return [chunk + c];
  if (WRAP.includes(c)) return [c + chunk + c];
  if (c === '(' || c === ')') return [known.includes('(') && known.includes(')') ? `(${chunk})` : c === '(' ? c + chunk : chunk + c];
  if (INFIX.includes(c)) {
    const k = floorDiv(chunk.length, 2);
    return [k > 0 ? chunk.slice(0, k) + c + chunk.slice(k) : chunk + c];
  }
  return [chunk, c];
}
