/** On-screen keyboard overlay with finger colours (docs/01 Finger map). Fades as accuracy rises. */
import type { LanguagePack } from '@/content/types';
import { h } from './dom';
import { displayGlyph } from '@/content/glyphs';

const ROWS = ['number', 'top', 'home', 'bottom', 'space'] as const;

/** Keys left out of the compact (letter levels) keyboard; key-group levels show the full one. */
const COMPACT_HIDDEN = ['Backspace', 'Enter', 'Tab', 'Backquote', 'Backslash', 'BracketLeft', 'BracketRight', 'Equal', 'Minus', 'Quote'];
const WIDE: Record<string, string> = { Backspace: 'wide', Enter: 'wide', Tab: 'wide', ShiftLeft: 'shift', ShiftRight: 'shift' };

export class KeyboardOverlay {
  readonly el: HTMLDivElement;
  private keys: Record<string, HTMLDivElement> = {};
  private nextCodes: string[] = [];
  private full = false;

  constructor(private lang: LanguagePack, private opts: { showNumbers?: boolean; fingers?: boolean; full?: boolean } = {}) {
    this.el = h('div', { class: 'kbd', 'aria-hidden': 'true' });
    this.build(!!opts.full);
  }

  /** Compact keyboard (letters, home-row punctuation) or the full one (number row, symbols, editing keys, Shift). */
  private build(full: boolean): void {
    this.full = full;
    this.keys = {};
    this.nextCodes = [];
    this.el.replaceChildren();
    this.el.classList.toggle('full', full);
    const { lang, opts } = this;
    for (const row of ROWS) {
      if (row === 'number' && !opts.showNumbers && !full) continue;
      const r = h('div', { class: `row ${row}` });
      const codes = Object.entries(lang.layout)
        .filter(([code, k]) => k.row === row && (full || !COMPACT_HIDDEN.includes(code)))
        .sort((a, b) => a[1].col - b[1].col);
      const keyEl = (code: string, finger: string, label: Node | string, extra = '') => {
        const el = h('div', { class: `key f-${finger} ${WIDE[code] ?? ''} ${extra}`.trim() }, label);
        this.keys[code] = el;
        return el;
      };
      if (full && row === 'bottom') r.append(keyEl('ShiftLeft', 'lp', '⇧'));
      for (const [code, k] of codes) {
        // Space shows the same space-bar sign used for Space in the game world and prompt.
        const label = code === 'Space' ? h('span', { class: 'spacebar' }) : displayGlyph(k.char).toUpperCase();
        const el = keyEl(code, k.finger, label, `${k.homeBump ? 'bump' : ''}${code === 'Space' ? ' space' : ''}`);
        if (opts.fingers && row === 'home' && ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'].includes(code)) {
          el.append(h('div', { class: 'finger', style: { background: `var(--f-${k.finger})` } }));
        }
        r.append(el);
      }
      if (full && row === 'bottom') r.append(keyEl('ShiftRight', 'rp', '⇧'));
      this.el.append(r);
    }
  }

  /** The element for a physical key code (for overlays such as the intro hands). */
  keyEl(code: string): HTMLDivElement | undefined {
    return this.keys[code];
  }

  setKnown(chars: string[], newKeys: string[] = []): void {
    // Any known character beyond the compact keyboard (digits, symbols, editing keys, capitals) → full keyboard.
    const full = !!this.opts.full || chars.some((c) => {
      const code = this.lang.codeOf[c];
      return !!this.lang.needsShift[c] || (!!code && (COMPACT_HIDDEN.includes(code) || this.lang.layout[code].row === 'number'));
    });
    if (full !== this.full) this.build(full);
    const shiftKnown = chars.some((c) => this.lang.needsShift[c]);
    const shiftNew = newKeys.some((c) => this.lang.needsShift[c]);
    for (const [code, el] of Object.entries(this.keys)) {
      if (code === 'ShiftLeft' || code === 'ShiftRight') {
        el.classList.toggle('known', shiftKnown);
        el.classList.toggle('new', shiftNew);
        continue;
      }
      const ch = this.lang.layout[code].char;
      el.classList.toggle('known', chars.includes(ch) || code === 'Space');
      el.classList.toggle('new', newKeys.includes(ch) && ch !== ' ');
    }
  }

  /** Highlight the key for `ch`, plus the opposite hand's Shift key when `ch` needs Shift. */
  setNext(ch: string | undefined, hint = false): void {
    const code = ch === undefined ? '' : this.lang.codeOf[ch] ?? '';
    const codes = code ? [code] : [];
    if (code && ch !== undefined && this.lang.needsShift[ch]) codes.push(this.lang.layout[code].finger.startsWith('l') ? 'ShiftRight' : 'ShiftLeft');
    if (codes.join() !== this.nextCodes.join()) {
      for (const c of this.nextCodes) this.keys[c]?.classList.remove('next', 'hint');
      this.nextCodes = codes;
      for (const c of codes) this.keys[c]?.classList.add('next');
    }
    for (const c of codes) this.keys[c]?.classList.toggle('hint', hint);
  }

  setOpacity(p: number): void {
    this.el.style.opacity = String(p);
  }
}
