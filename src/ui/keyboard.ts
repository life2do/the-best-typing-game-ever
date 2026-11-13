/** On-screen keyboard overlay with finger colours (docs/01 Finger map). Fades as accuracy rises. */
import type { LanguagePack } from '@/content/types';
import { h } from './dom';

const ROWS = ['number', 'top', 'home', 'bottom', 'space'] as const;

export class KeyboardOverlay {
  readonly el: HTMLDivElement;
  private keys: Record<string, HTMLDivElement> = {};
  private nextCode = '';

  constructor(private lang: LanguagePack, opts: { showNumbers?: boolean; fingers?: boolean } = {}) {
    this.el = h('div', { class: 'kbd', 'aria-hidden': 'true' });
    for (const row of ROWS) {
      if (row === 'number' && !opts.showNumbers) continue;
      const r = h('div', { class: `row ${row}` });
      const codes = Object.entries(lang.layout)
        .filter(([code, k]) => k.row === row && !['Backspace', 'Enter', 'Tab', 'Backquote', 'Backslash', 'BracketLeft', 'BracketRight', 'Equal', 'Minus', 'Quote'].includes(code))
        .sort((a, b) => a[1].col - b[1].col);
      for (const [code, k] of codes) {
        const el = h('div', { class: `key f-${k.finger}${k.homeBump ? ' bump' : ''}${code === 'Space' ? ' space' : ''}` }, code === 'Space' ? '' : k.char.toUpperCase());
        if (opts.fingers && row === 'home' && ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'].includes(code)) {
          el.append(h('div', { class: 'finger', style: { background: `var(--f-${k.finger})` } }));
        }
        this.keys[code] = el;
        r.append(el);
      }
      this.el.append(r);
    }
  }

  setKnown(chars: string[], newKeys: string[] = []): void {
    for (const [code, el] of Object.entries(this.keys)) {
      const ch = this.lang.layout[code].char;
      el.classList.toggle('known', chars.includes(ch) || code === 'Space');
      el.classList.toggle('new', newKeys.includes(ch) && ch !== ' ');
    }
  }

  setNext(ch: string | undefined, hint = false): void {
    const code = ch === undefined ? '' : this.lang.codeOf[ch] ?? '';
    if (code !== this.nextCode) {
      this.keys[this.nextCode]?.classList.remove('next', 'hint');
      this.nextCode = code;
      this.keys[code]?.classList.add('next');
    }
    this.keys[code]?.classList.toggle('hint', hint);
  }

  setOpacity(p: number): void {
    this.el.style.opacity = String(p);
  }
}
