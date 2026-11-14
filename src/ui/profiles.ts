/**
 * Profile picker and PIN pad (docs/07 Start screen, Profiles). The PIN pad shows each digit with a unique
 * colour and shape, so children who can't read numbers yet can use it. It is a lock against siblings,
 * not security.
 */
import type { ComplexityScaleManifest } from '@/content/types';
import type { Profile } from '@/storage/profile';
import { PIN_DIGITS, PIN_LENGTH } from '@/storage/profileIO';
import { h } from './dom';

export interface PickerActions {
  onPick: (p: Profile) => void;
  onNew: () => void;
  onImport: (file: File) => void;
}

/** "Who's playing?": one tile per profile (avatar theme icon, name, level), plus New player and Import. */
export function profilePicker(profiles: Profile[], scales: ComplexityScaleManifest[], a: PickerActions, message?: string): HTMLElement {
  const file = h('input', { type: 'file', accept: '.json,application/json', style: { display: 'none' } }) as HTMLInputElement;
  file.addEventListener('change', () => {
    if (file.files?.[0]) a.onImport(file.files[0]);
  });
  const tile = (p: Profile) => {
    const sc = scales.find((s) => s.id === p.avatar.scale);
    const icon = sc?.steps[Math.max(0, p.tier - 1)]?.icon ?? sc?.icon ?? '🙂';
    return h(
      'button',
      { class: 'profile-tile', onclick: () => a.onPick(p), 'aria-label': `${p.name || 'Player'}, level ${p.campaign.level}${p.pinHash ? ', locked' : ''}` },
      h('span', { class: 'art' }, icon),
      h('span', { class: 'nm' }, p.name || 'Player'),
      h('span', { class: 'st' }, `Level ${p.campaign.level}${p.pinHash ? ' · 🔒' : ''}`),
    );
  };
  return h(
    'div',
    { class: 'overlay start profiles' },
    h(
      'div',
      { class: 'card' },
      h('h1', {}, 'Who is playing?'),
      message ? h('p', { class: 'msg' }, message) : '',
      h('div', { class: 'profile-tiles' }, ...profiles.map(tile), h('button', { class: 'profile-tile new', onclick: a.onNew }, h('span', { class: 'art' }, '＋'), h('span', { class: 'nm' }, 'New player'))),
      h('div', { class: 'row-btns' }, h('button', { class: 'secondary', onclick: () => file.click() }, '⬆ Import a player'), file, h('a', { href: './verify/', style: { color: 'white', alignSelf: 'center' } }, 'Replays')),
    ),
  );
}

export interface PinPadOptions {
  title: string;
  onDone: (pin: string) => void;
  onCancel: () => void;
  error?: string;
}

/** Four-digit PIN pad; digits can be clicked or typed (top-row or numpad digits). */
export function pinPad(o: PinPadOptions): HTMLElement {
  let pin = '';
  const slots = h('div', { class: 'pin-slots', 'aria-live': 'polite' });
  const paint = () =>
    slots.replaceChildren(
      ...Array.from({ length: PIN_LENGTH }, (_, i) => {
        const d = i < pin.length ? PIN_DIGITS[Number(pin[i])] : null;
        return h('span', { class: `pin-slot${d ? ' on' : ''}`, style: d ? { color: d.color } : {}, 'aria-label': d ? d.name : 'empty' }, d ? d.shape : '');
      }),
    );
  const add = (digit: number) => {
    if (pin.length >= PIN_LENGTH) return;
    pin += String(digit);
    paint();
    if (pin.length === PIN_LENGTH) {
      const done = pin;
      setTimeout(() => {
        root.remove();
        document.removeEventListener('keydown', onKey, true);
        o.onDone(done);
      }, 150);
    }
  };
  const back = () => {
    pin = pin.slice(0, -1);
    paint();
  };
  const cancel = () => {
    root.remove();
    document.removeEventListener('keydown', onKey, true);
    o.onCancel();
  };
  const onKey = (e: KeyboardEvent) => {
    const m = /^(?:Digit|Numpad)(\d)$/.exec(e.code);
    if (m) add(Number(m[1]));
    else if (e.code === 'Backspace') back();
    else if (e.code === 'Escape') cancel();
    else return;
    e.preventDefault();
    e.stopPropagation();
  };
  document.addEventListener('keydown', onKey, true);
  const keys = PIN_DIGITS.map((d) =>
    h('button', { class: 'pin-key', onclick: () => add(d.digit), 'aria-label': `${d.digit}, ${d.name}` }, h('span', { class: 'shape', style: { color: d.color } }, d.shape), h('span', { class: 'digit' }, String(d.digit))),
  );
  paint();
  const root = h(
    'div',
    { class: 'overlay pin' },
    h(
      'div',
      { class: 'card' },
      h('h2', {}, o.title),
      o.error ? h('p', { class: 'msg bad' }, o.error) : '',
      slots,
      h('div', { class: 'pin-keys' }, ...keys.slice(1), h('button', { class: 'pin-key secondary', onclick: back, 'aria-label': 'Delete' }, '⌫'), keys[0], h('button', { class: 'pin-key secondary', onclick: cancel, 'aria-label': 'Cancel' }, '✕')),
    ),
  );
  return root;
}
