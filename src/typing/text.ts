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
  const letters = p.letters.filter((c) => c !== ' ');
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
    const start = len + (chunks.length ? 1 : 0);
    chunks.push(chunk);
    len = start + chunk.length;
    if (ability) spans.push({ start, end: len, word: chunk, ability });
  }
  return { text: chunks.join(' '), spans };
}
