/**
 * Parent area (docs/07 Accessibility): behind an adult check (type the shown word backwards), it holds the
 * break interval and length, a maximum session length, and player management (remove a PIN, delete).
 */
import type { Profile, Settings } from '@/storage/profile';
import { h } from './dom';

const ADULT_WORDS = ['garden', 'rocket', 'window', 'pencil', 'dragon', 'butter', 'planet', 'silver', 'candle', 'basket', 'castle', 'orange'];

/** Adult check: shows a word; typing it backwards (in a text field) passes. Any letter case. */
export function adultCheck(onPass: () => void, onCancel: () => void, word = ADULT_WORDS[Math.floor(Math.random() * ADULT_WORDS.length)]): HTMLElement {
  const input = h('input', { type: 'text', autocomplete: 'off', spellcheck: 'false', 'aria-label': 'The word backwards', maxlength: 20 }) as HTMLInputElement;
  const msg = h('p', { class: 'msg' }, '');
  const check = () => {
    if (input.value.trim().toLowerCase() === [...word].reverse().join('')) onPass();
    else {
      msg.textContent = 'Not quite — type the word from the last letter to the first.';
      msg.classList.add('bad');
    }
  };
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') check();
  });
  setTimeout(() => input.focus(), 50);
  return h(
    'div',
    { class: 'overlay adult-check' },
    h('div', { class: 'card' },
      h('h2', {}, '👪 For grown-ups'),
      h('p', {}, 'Type this word backwards:'),
      h('p', { class: 'adult-word', 'data-word': word }, word.toUpperCase()),
      input, msg,
      h('div', { class: 'row-btns' }, h('button', { onclick: check }, 'Continue'), h('button', { class: 'secondary', onclick: onCancel }, 'Cancel'))),
  );
}

export interface ParentActions {
  onSettings: (s: Settings) => void;
  onRemovePin: (p: Profile) => void;
  onDelete: (p: Profile) => void;
  onClose: () => void;
}

/** Parent area for one player (their limits) and every player on this device (PIN, delete). */
export function parentScreen(current: Profile | undefined, players: Profile[], a: ParentActions): HTMLElement {
  const limits: HTMLElement[] = [];
  if (current) {
    let s = { ...current.settings };
    const sel = (key: 'breakMinutes' | 'breakSeconds' | 'sessionMinutes', options: [number, string][]) => {
      const el = h('select', { 'data-parent': key }, ...options.map(([v, l]) => h('option', { value: v, selected: (s[key] ?? 0) === v }, l))) as HTMLSelectElement;
      el.addEventListener('change', () => {
        s = { ...s, [key]: Number(el.value) };
        a.onSettings(s);
      });
      return el;
    };
    limits.push(
      h('h3', {}, `Limits for ${current.name || 'this player'}`),
      h('label', {}, 'Stretch break every', sel('breakMinutes', [[10, '10 minutes'], [15, '15 minutes'], [20, '20 minutes'], [30, '30 minutes'], [45, '45 minutes'], [60, '60 minutes'], [100000, 'never']])),
      h('label', {}, 'Break length', sel('breakSeconds', [[60, '1 minute'], [120, '2 minutes'], [180, '3 minutes'], [300, '5 minutes']])),
      h('label', {}, 'Play time per session', sel('sessionMinutes', [[0, 'no limit'], [15, '15 minutes'], [30, '30 minutes'], [45, '45 minutes'], [60, '1 hour'], [90, '1½ hours']])),
    );
  }
  const list = h('div', { class: 'parent-players' },
    ...players.map((p) =>
      h('div', { class: 'parent-player' },
        h('span', { class: 'nm' }, `${p.name || 'Player'} · level ${p.campaign.level}${p.pinHash ? ' · 🔒' : ''}`),
        p.pinHash ? h('button', { class: 'secondary small', onclick: () => a.onRemovePin(p) }, 'Remove PIN') : '',
        h('button', { class: 'secondary small', onclick: () => a.onDelete(p) }, 'Delete'))),
  );
  return h(
    'div',
    { class: 'overlay parents' },
    h('div', { class: 'card settings' },
      h('h2', {}, '👪 Parent area'),
      ...limits,
      h('h3', {}, 'Players on this device'),
      list,
      h('p', { class: 'msg' }, 'Everything stays on this device. Export a player from their home screen to keep a copy.'),
      h('div', { class: 'row-btns' }, h('button', { onclick: a.onClose }, 'Done'))),
  );
}

/** Shown when the session limit is reached: no skipping; a grown-up can add 15 minutes. */
export function sessionOverScreen(onMenu: () => void, onExtend: () => void): HTMLElement {
  return h(
    'div',
    { class: 'overlay session-over' },
    h('div', { class: 'card' },
      h('h2', {}, '🌙 That\'s enough typing for now!'),
      h('p', {}, 'Great work today. Your progress is saved — come back later to keep going.'),
      h('div', { class: 'row-btns' }, h('button', { onclick: onMenu }, 'Main menu'), h('button', { class: 'secondary', onclick: onExtend }, '👪 15 more minutes'))),
  );
}
