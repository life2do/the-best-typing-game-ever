/**
 * Keyboard capture by physical key code (docs/10 §4.1). Drops auto-repeat, IME composition, dead keys
 * and lone modifiers; Escape is reported separately (pause). Also detects an OS layout that does not
 * match the selected language and reports it for a friendly hint (mapping stays physical).
 */
import type { LanguagePack } from '@/content/types';

export interface KeyInput {
  code: string;
  shift: boolean;
}

const MODIFIER = /^(Shift|Control|Alt|Meta|CapsLock|Fn|OS|ContextMenu)/;

export class KeyboardInput {
  private handlers: ((k: KeyInput) => void)[] = [];
  private escHandlers: (() => void)[] = [];
  private mismatchHandlers: ((typed: string, expected: string) => void)[] = [];
  private mismatchVotes = 0;
  enabled = true;

  constructor(private lang: LanguagePack) {
    addEventListener('keydown', (e) => this.onKey(e), { capture: true });
  }

  setLanguage(lang: LanguagePack): void {
    this.lang = lang;
  }

  onKey(e: KeyboardEvent): void {
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
    if (e.code === 'Escape') {
      e.preventDefault();
      for (const h of this.escHandlers) h();
      return;
    }
    if (!this.enabled) return;
    if (e.repeat || e.isComposing || e.key === 'Dead' || e.key === 'Process' || MODIFIER.test(e.code) || /^F\d+$/.test(e.code)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return; // browser shortcuts are never game input
    if (e.code === 'Space' || e.code === 'Tab' || e.code === 'Backspace' || e.code === 'Quote' || e.code === 'Slash') e.preventDefault();
    this.checkLayout(e);
    for (const h of this.handlers) h({ code: e.code, shift: e.shiftKey });
  }

  private checkLayout(e: KeyboardEvent): void {
    const info = this.lang.layout[e.code];
    if (!info || e.key.length !== 1 || !/\p{L}/u.test(e.key)) return;
    const expected = e.shiftKey ? info.shift ?? info.char : info.char;
    if (e.key.toLowerCase() !== expected.toLowerCase()) {
      if (++this.mismatchVotes === 3) for (const h of this.mismatchHandlers) h(e.key, expected);
    } else this.mismatchVotes = 0;
  }

  onPress(h: (k: KeyInput) => void): void {
    this.handlers.push(h);
  }
  onEscape(h: () => void): void {
    this.escHandlers.push(h);
  }
  onLayoutMismatch(h: (typed: string, expected: string) => void): void {
    this.mismatchHandlers.push(h);
  }
}
