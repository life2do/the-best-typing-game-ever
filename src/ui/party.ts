/**
 * Hot-seat screens (docs/06): party setup (2–4 players, mode, when turns swap), the handover between turns,
 * and the shared result screen after each round.
 */
import type { ComplexityScaleManifest, LanguagePack } from '@/content/types';
import type { Profile } from '@/storage/profile';
import { MAX_PLAYERS, partyProblem, type Party, type PartyMode } from '@/party/party';
import { h } from './dom';
import { KeyboardOverlay } from './keyboard';
import { keyboardWithHands } from './hands';
import { homeKeys } from '@/content/i18n';

const MODE_INFO: Record<PartyMode, { icon: string; name: string; text: string }> = {
  coop: { icon: '🤝', name: 'Together', text: 'Same level, same letters: the ones everybody knows. Each of you aims for your own stars.' },
  side: { icon: '👯', name: 'Side by side', text: 'Same game and world, but each of you types your own letters.' },
  companions: { icon: '🧭', name: 'Companions', text: 'Each of you plays the next level of your own adventure. Turns swap after every level.' },
};

export const iconOf = (p: Profile, scales: ComplexityScaleManifest[]) => {
  const sc = scales.find((s) => s.id === p.avatar.scale);
  return sc?.steps[Math.max(0, p.tier - 1)]?.icon ?? sc?.icon ?? '🙂';
};

export interface PartySetupResult {
  players: Profile[];
  mode: PartyMode;
  swap: Party['swap'];
}

/** "Play together": choose 2–4 players (in turn order), a mode and when turns swap. */
export function partySetupScreen(profiles: Profile[], scales: ComplexityScaleManifest[], onStart: (r: PartySetupResult) => void, onCancel: () => void): HTMLElement {
  const chosen: Profile[] = [];
  let mode: PartyMode = 'coop';
  let swap: Party['swap'] = 'stage';
  const tiles = h('div', { class: 'profile-tiles' });
  const modes = h('div', { class: 'party-modes', role: 'radiogroup', 'aria-label': 'Mode' });
  const swapSel = h('select', { 'data-party': 'swap' }, h('option', { value: 'stage' }, 'after every stage'), h('option', { value: 'level' }, 'after every level')) as HTMLSelectElement;
  swapSel.addEventListener('change', () => (swap = swapSel.value as Party['swap']));
  const swapRow = h('label', { class: 'party-swap' }, 'Swap turns ', swapSel);
  const msg = h('p', { class: 'msg' });
  const start = h('button', { 'data-party': 'start', onclick: () => !partyProblem(mode, chosen) && onStart({ players: [...chosen], mode, swap }) }, '▶ Start the party') as HTMLButtonElement;
  const paint = () => {
    tiles.replaceChildren(
      ...profiles.map((p) => {
        const at = chosen.indexOf(p);
        return h('button', {
          class: `profile-tile${at >= 0 ? ' sel' : ''}`, 'data-party-player': p.profileId, 'aria-pressed': at >= 0 ? 'true' : 'false',
          onclick: () => {
            if (at >= 0) chosen.splice(at, 1);
            else if (chosen.length < MAX_PLAYERS) chosen.push(p);
            paint();
          },
        }, h('span', { class: 'art' }, iconOf(p, scales)), h('span', { class: 'nm' }, p.name || 'Player'), h('span', { class: 'st' }, at >= 0 ? `Player ${at + 1}${p.pinHash ? ' · 🔒' : ''}` : `Level ${p.campaign.level}`));
      }),
    );
    modes.replaceChildren(
      ...(Object.keys(MODE_INFO) as PartyMode[]).map((m) =>
        h('button', { class: `party-mode${m === mode ? ' sel' : ''}`, role: 'radio', 'aria-checked': m === mode ? 'true' : 'false', 'data-party-mode': m, onclick: () => { mode = m; paint(); } },
          h('b', {}, `${MODE_INFO[m].icon} ${MODE_INFO[m].name}`), h('span', {}, MODE_INFO[m].text)),
      ),
    );
    swapRow.style.display = mode === 'companions' ? 'none' : '';
    const problem = partyProblem(mode, chosen);
    msg.textContent = problem ?? `${chosen.map((p) => p.name || 'Player').join(', ')} — ready!`;
    msg.classList.toggle('bad', !!problem && chosen.length > 1);
    start.disabled = !!problem;
  };
  paint();
  return h(
    'div',
    { class: 'overlay start party-setup' },
    h('div', { class: 'card' },
      h('h1', {}, '👥 Play together'),
      h('p', {}, `Pick 2 to ${MAX_PLAYERS} players in the order they take turns. One keyboard — pass it on!`),
      tiles, modes, swapRow, msg,
      h('div', { class: 'row-btns' }, start, h('button', { class: 'secondary', onclick: onCancel }, 'Back'))),
  );
}

/** Between turns: whose turn it is, with their avatar, letters and finger colours. The world waits for F + J. */
export function handoverScreen(p: Profile, icon: string, lang: LanguagePack, letters: string[], newKeys: string[], round: number): HTMLElement {
  const kb = new KeyboardOverlay(lang);
  kb.setKnown(letters, newKeys);
  kb.el.style.position = 'static';
  kb.el.style.transform = 'none';
  kb.el.style.margin = '0';
  kb.el.style.display = 'inline-flex';
  const [f, j] = homeKeys(lang);
  return h(
    'div',
    { class: 'overlay handover' },
    h('div', { class: 'card' },
      h('div', { class: 'handover-avatar' }, icon),
      h('h1', {}, `${p.name || 'Player'}'s turn`),
      h('p', { class: 'msg' }, `Round ${round}. Hands on ${f} and ${j}, then press them together.`),
      keyboardWithHands(kb, lang, newKeys)),
  );
}

export interface PartyResultRow {
  profile: Profile;
  icon: string;
  stars: number;
  wpmP: number;
  accP: number;
  complete: boolean;
  grewTo?: string;
}

/** Shared result screen after a round; each player's stars also went to their own profile. */
export function partyResultsScreen(party: Party, rows: PartyResultRow[], onNext: () => void, onEnd: () => void, onPicture?: () => void): HTMLElement {
  const total = rows.reduce((a, r) => a + r.stars, 0);
  return h(
    'div',
    { class: 'overlay party-results' },
    h('div', { class: 'card' },
      h('h1', {}, `🎉 Round ${party.round} done!`),
      h('p', { class: 'msg' }, `Together you collected ${total} ★`),
      h('div', { class: 'party-rows' },
        ...rows.map((r) =>
          h('div', { class: 'party-row', 'data-party-result': r.profile.profileId },
            h('span', { class: 'art' }, r.icon),
            h('b', {}, r.profile.name || 'Player'),
            h('span', { class: 'stars' }, r.complete ? '★'.repeat(r.stars) || '—' : 'keep practising'),
            h('span', {}, `${(r.wpmP / 1000).toFixed(0)} WPM · ${(r.accP / 10).toFixed(0)}%`),
            r.grewTo ? h('span', { class: 'grew' }, `grew into a ${r.grewTo}!`) : ''),
        )),
      h('p', {}, 'Stars and progress went to each player.'),
      h('div', { class: 'row-btns' }, h('button', { 'data-party': 'next', onclick: onNext }, '▶ Next round'), onPicture ? h('button', { class: 'secondary', 'data-party': 'picture', onclick: onPicture }, '🖼 Party picture') : '', h('button', { class: 'secondary', 'data-party': 'end', onclick: onEnd }, 'End the party'))),
  );
}
