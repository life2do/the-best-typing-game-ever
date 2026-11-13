/**
 * Word art (docs/07): while a real word is typed, its illustration is revealed in the page background,
 * behind the (transparent-sky) game world. Each word uses a random reveal effect — line drawing, fog,
 * puzzle tiles or an iris — driven by how many of its letters are typed. On the last letter it fills
 * with colour and animates; typed quickly with no mistakes it turns golden. Purely visual: it reads the
 * simulation's prompt and never writes state.
 */
import type { LevelSim } from '@/sim/level';
import type { Illustration, LanguagePack, PaletteManifest } from '@/content/types';
import { illustrationFor } from '@/content/registry';

export type RevealEffect = 'draw' | 'fog' | 'puzzle' | 'iris';
export const REVEAL_EFFECTS: RevealEffect[] = ['draw', 'fog', 'puzzle', 'iris'];
const LINGER_MS = 2600;

interface Active {
  key: string;
  word: string;
  el: HTMLElement;
  art: HTMLElement;
  effect: RevealEffect;
  strokes: { el: SVGGeometryElement; len: number }[];
  tiles: HTMLElement[];
  order: number[];
  errors: number;
  startedAt: number;
  completeAt: number;
}

export interface WordCompletion {
  word: string;
  golden: boolean;
}

export class WordArt {
  readonly el: HTMLDivElement;
  private active: Active | null = null;
  onComplete: (c: WordCompletion) => void = () => {};

  constructor(private lang: LanguagePack, private readonly reducedMotion: () => boolean = () => false) {
    this.el = document.createElement('div');
    this.el.className = 'word-art-layer';
    this.el.setAttribute('aria-hidden', 'true');
  }

  setLanguage(lang: LanguagePack): void {
    this.lang = lang;
  }

  /** Map the level palette onto the art colours. */
  setPalette(p: PaletteManifest): void {
    const c = p.colors;
    const s = this.el.style;
    s.setProperty('--art-ink', c.fg);
    s.setProperty('--art-1', c.accent);
    s.setProperty('--art-2', c.positive);
    s.setProperty('--art-3', c.negative);
    s.setProperty('--art-4', '#ffd166');
  }

  /** Count a mistake against the word being typed (for the golden version). */
  noteError(): void {
    if (this.active && !this.active.completeAt) this.active.errors++;
  }

  clear(): void {
    this.el.replaceChildren();
    this.active = null;
  }

  update(sim: LevelSim, now: number): void {
    const cur = sim.state.phase === 'play' ? currentWord(sim) : null;
    const a = this.active;
    if (a && a.completeAt && now - a.completeAt > LINGER_MS) this.dismiss(a);
    if (!cur) return;
    if (!a || a.key !== cur.key) {
      if (a && !a.completeAt) this.dismiss(a); // abandoned word (stage ended)
      else if (a) this.dismiss(a);
      this.start(cur.key, cur.word, now);
    }
    const act = this.active;
    if (!act || act.completeAt) return;
    const frac = cur.word.length ? cur.typed / cur.word.length : 0;
    this.reveal(act, frac);
    if (cur.typed >= cur.word.length) this.complete(act, sim, now);
  }

  private start(key: string, word: string, now: number): void {
    const ill = illustrationFor(word, this.lang.id.replace(/^lang\./, ''));
    const emoji = ill ? undefined : this.lang.wordEmoji?.[word];
    if (!ill && !emoji) {
      this.active = null;
      return;
    }
    const effect = this.pickEffect(ill);
    const art = document.createElement('div');
    art.className = 'word-art';
    if (ill) art.innerHTML = ill.svg;
    else {
      art.classList.add('emoji');
      art.textContent = emoji!;
    }
    const label = document.createElement('div');
    label.className = 'word-art-label';
    label.textContent = word;
    const el = document.createElement('div');
    el.className = `word-art-card effect-${effect} anim-${ill?.animation ?? 'bounce'}`;
    el.append(label, art);
    const tiles: HTMLElement[] = [];
    if (effect === 'puzzle') {
      const n = Math.max(4, word.length);
      const cols = Math.ceil(Math.sqrt(n));
      const rows = Math.ceil(n / cols);
      const grid = document.createElement('div');
      grid.className = 'word-art-tiles';
      grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
      for (let i = 0; i < cols * rows; i++) {
        const t = document.createElement('div');
        grid.append(t);
        tiles.push(t);
      }
      el.append(grid);
    }
    this.el.append(el);
    const strokes: Active['strokes'] = [];
    if (effect === 'draw') {
      for (const s of Array.from(art.querySelectorAll<SVGGeometryElement>('path,circle,ellipse,line,polyline,polygon,rect'))) {
        let len = 100;
        try {
          len = Math.max(1, s.getTotalLength());
        } catch {
          /* not rendered yet in some engines: keep the estimate */
        }
        s.style.strokeDasharray = `${len}`;
        s.style.strokeDashoffset = `${len}`;
        strokes.push({ el: s, len });
      }
    }
    const order = tiles.map((_, i) => i).sort(() => Math.random() - 0.5);
    this.active = { key, word, el, art, effect, strokes, tiles, order, errors: 0, startedAt: now, completeAt: 0 };
    this.reveal(this.active, 0);
  }

  private pickEffect(ill: Illustration | undefined): RevealEffect {
    const pool = ill ? REVEAL_EFFECTS : REVEAL_EFFECTS.filter((e) => e !== 'draw'); // emoji can't be line-drawn
    return pool[Math.floor(Math.random() * pool.length)];
  }

  private reveal(a: Active, frac: number): void {
    const f = Math.max(0, Math.min(1, frac));
    a.el.style.setProperty('--reveal', f.toFixed(3));
    switch (a.effect) {
      case 'draw': {
        // Strokes draw one after another; the share of total length drawn follows the letters typed.
        const total = a.strokes.reduce((s, x) => s + x.len, 0);
        let budget = total * f;
        for (const s of a.strokes) {
          const d = Math.min(s.len, Math.max(0, budget));
          s.el.style.strokeDashoffset = `${s.len - d}`;
          budget -= s.len;
        }
        break;
      }
      case 'puzzle': {
        const shown = Math.round(f * a.tiles.length);
        a.order.forEach((tile, i) => a.tiles[tile].classList.toggle('open', i < shown));
        break;
      }
      default:
        break; // fog and iris are pure CSS driven by --reveal
    }
  }

  private complete(a: Active, sim: LevelSim, now: number): void {
    a.completeAt = now;
    this.reveal(a, 1);
    for (const s of a.strokes) s.el.style.strokeDasharray = 'none';
    // Golden: no mistakes and at least the level's target speed for this word.
    const msPerChar = 12_000_000 / Math.max(1, sim.targetWpmP);
    const golden = a.errors === 0 && now - a.startedAt <= Math.max(1, a.word.length - 1) * msPerChar * 1.15;
    a.el.classList.add('complete');
    if (golden) {
      a.el.classList.add('golden');
      for (let i = 0; i < 8; i++) {
        const sp = document.createElement('i');
        sp.className = 'sparkle';
        sp.style.setProperty('--a', `${i * 45}deg`);
        a.el.append(sp);
      }
    }
    if (this.reducedMotion()) a.el.classList.add('calm');
    this.onComplete({ word: a.word, golden });
  }

  private dismiss(a: Active): void {
    a.el.classList.add('leaving');
    setTimeout(() => a.el.remove(), 700);
    if (this.active === a) this.active = null;
  }
}

/** The real word currently being typed, with how many of its letters are typed. */
export function currentWord(sim: LevelSim): { key: string; word: string; typed: number } | null {
  const s = sim.state;
  if (sim.setup.inputMode === 'targeting') {
    const id = sim.suggestedTargetId();
    const t = s.targets.find((x) => x.id === id);
    if (!t) return null;
    const word = t.text.trimEnd();
    if (!isRealWord(sim, word)) return null;
    return { key: `t${t.id}`, word, typed: Math.min(t.progress, word.length) };
  }
  const text = s.prompt.text;
  const pos = s.prompt.pos;
  if (!text.length) return null;
  // The word containing the cursor; if the cursor sits on the Space after a word, that word is fully typed.
  const i = pos >= text.length || text[pos] === ' ' ? pos - 1 : pos;
  if (i < 0 || text[i] === ' ') return null;
  let start = i;
  while (start > 0 && text[start - 1] !== ' ') start--;
  let end = i;
  while (end < text.length && text[end] !== ' ') end++;
  const word = text.slice(start, end);
  if (!isRealWord(sim, word)) return null;
  return { key: `${s.stage}:${s.attempt}:${start}`, word, typed: Math.max(0, Math.min(pos, end) - start) };
}

function isRealWord(sim: LevelSim, word: string): boolean {
  const lists = sim.setup.language.wordLists;
  for (const l of Object.values(lists)) if (l.includes(word)) return true;
  return sim.setup.abilities.some((a) => Object.values(a.triggerWords).some((ws) => ws.includes(word)));
}
