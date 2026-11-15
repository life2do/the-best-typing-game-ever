/**
 * Level progress bar model: how long the level will last. One section per stage, sized by its length in
 * characters, with a 🏁 goal flag where the star target is reached. The bar behaves like a target
 * indicator: while the target isn't met it never reaches the flag — a missed last stage adds a repeat
 * section before the flag and the bar re-scales. "Stay for more stars" adds bonus sections after the flag,
 * each ending in a shiny star; a bonus round that misses its goal (beating the best stars) adds another.
 */
import type { SimState, StageResult } from '@/sim/types';

export interface BarSection {
  /** length in characters (sets its width) */
  len: number;
  /** 0..1 */
  fill: number;
  kind: 'stage' | 'repeat' | 'bonus';
  /** stars earned in this section, once finished */
  stars?: number;
  /** bonus sections end in a shiny star: earned (beat the best stars), missed, or still to play */
  star?: 'earned' | 'missed' | 'pending';
}

export interface BarModel {
  sections: BarSection[];
  /** index of the section after which the goal flag stands */
  flagAfter: number;
  /** goal reached (the flag turns gold) */
  reached: boolean;
  /** avatar position 0..1 */
  pos: number;
}

export interface BarInput {
  stageLengths: readonly number[];
  targetStars: number;
  results: readonly StageResult[];
  stage: number;
  phase: SimState['phase'];
  /** progress through the stage being typed now, 0..1 */
  current: number;
}

export function barModel(b: BarInput): BarModel {
  const last = b.stageLengths.length - 1;
  const sections: BarSection[] = b.stageLengths.slice(0, last).map((len, i) => {
    const r = b.results.find((x) => x.stage === i);
    return { len, fill: r ? 1 : i < b.stage ? 1 : i === b.stage && b.phase === 'play' ? b.current : 0, kind: 'stage', stars: r?.stars };
  });
  const finalLen = b.stageLengths[last];
  const finals = b.results.filter((r) => r.stage === last);
  // Final-stage attempts: until the target is met each one sits before the flag; after it, bonus rounds.
  let best = 0;
  let flagAfter = -1;
  finals.forEach((r, k) => {
    const bonus = flagAfter >= 0;
    const beat = r.stars > best;
    best = Math.max(best, r.stars);
    sections.push({ len: finalLen, fill: 1, kind: bonus ? 'bonus' : k === 0 ? 'stage' : 'repeat', stars: r.stars, star: bonus ? (beat ? 'earned' : 'missed') : undefined });
    if (!bonus && best >= b.targetStars) flagAfter = sections.length - 1;
  });
  const reached = flagAfter >= 0;
  if (b.stage < last) {
    // The last stage is still to come.
    sections.push({ len: finalLen, fill: 0, kind: 'stage' });
  } else if (b.phase === 'play') {
    // A final-stage attempt in progress: the first one, a repeat (target not met yet) or a bonus round.
    const kind = reached ? 'bonus' : finals.length ? 'repeat' : 'stage';
    sections.push({ len: finalLen, fill: b.current, kind, star: kind === 'bonus' ? 'pending' : undefined });
  }
  const flag = reached ? flagAfter : sections.length - 1;
  const total = sections.reduce((a, s) => a + s.len, 0);
  const done = sections.reduce((a, s) => a + s.len * Math.min(1, Math.max(0, s.fill)), 0);
  return { sections, flagAfter: flag, reached, pos: total ? done / total : 0 };
}

/** Progress through the stage being typed, from the prompt (dictated) or the remaining targets. */
export function stageFraction(s: SimState, dictated: boolean): number {
  const p = s.prompt;
  if (dictated) return p.text.length ? Math.min(1, p.pos / p.text.length) : 0;
  const total = p.chunks.reduce((a, c) => a + c.length, 0);
  if (!total) return 0;
  const pending = p.chunks.slice(p.nextChunk).reduce((a, c) => a + c.length, 0) + s.targets.reduce((a, t) => a + Math.max(0, t.text.trimEnd().length - t.progress), 0);
  return Math.min(1, Math.max(0, 1 - pending / total));
}
