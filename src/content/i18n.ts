/**
 * In-level strings from the language pack's `ui` map (docs/04 Language packs), falling back to English.
 * `{name}` placeholders are filled from `vars`.
 */
import type { LanguagePack } from './types';
import { FINGER_NAMES } from '@/ui/dom';

export function tr(lang: LanguagePack | undefined, key: string, en: string, vars: Record<string, string | number> = {}): string {
  const s = lang?.ui?.[key] ?? en;
  return s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
}

/** Finger name in the pack's language ("left pointer finger" / "левый указательный"). */
export const fingerName = (lang: LanguagePack | undefined, finger: string) => tr(lang, `finger.${finger}`, FINGER_NAMES[finger] ?? finger);

/** How a key is named when spoken: Space, Backspace, Enter, Tab, or the (upper-case) letter. */
export function keyName(lang: LanguagePack | undefined, ch: string): string {
  if (ch === ' ') return tr(lang, 'space', 'space bar');
  const names: Record<string, string> = { '\b': 'Backspace', '\n': 'Enter', '\t': 'Tab' };
  if (names[ch]) return tr(lang, `key.${ch}`, names[ch]);
  return ch.toUpperCase();
}

/** The two home keys under the index fingers (F and J on QWERTY, А and О on ЙЦУКЕН). */
export function homeKeys(lang: LanguagePack | undefined): [string, string] {
  const f = lang?.layout.KeyF?.char ?? 'f';
  const j = lang?.layout.KeyJ?.char ?? 'j';
  return [f.toUpperCase(), j.toUpperCase()];
}
