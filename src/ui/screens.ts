/** Overlay screens: start (random complexity scale picker), level intro, crossroads, pause/settings, nag. */
import type { ComplexityScaleManifest, LanguagePack } from '@/content/types';
import type { LevelPlan } from '@/campaign/campaign';
import { h } from './dom';
import { KeyboardOverlay } from './keyboard';
import { displayGlyph } from '@/content/glyphs';
import { fingerName, homeKeys, tr } from '@/content/i18n';
import { keyboardWithHands } from './hands';
import { TIER_WPM } from '@/typing/tiers';
import type { Profile, Settings } from '@/storage/profile';
import { versionBadge } from '@/app/build-info';
import { languages } from '@/content/registry';

export interface StartChoice {
  action: 'new' | 'continue';
  name: string;
  tier: number;
  scale: string;
  /** Campaign language for a new player or a new run ('en', 'ru'…). */
  language: string;
}

/** Start screen. The complexity-scale theme is random on every page load (docs/03). */
export interface StartExtras {
  onBack?: () => void;
  onExport?: () => void;
  onPin?: () => void;
  onSwitch?: () => void;
  onDelete?: () => void;
  onImport?: (file: File) => void;
  onAvatar?: () => void;
}

export function startScreen(scale: ComplexityScaleManifest, profile: Profile | undefined, onChoose: (c: StartChoice) => void, onWordBook?: () => void, extras: StartExtras = {}): HTMLElement {
  // Language: a flag + name button per language pack (a keyboard layout hint shows in game if the OS layout differs).
  let langId = profile?.campaign.language ?? 'en';
  const FLAGS: Record<string, string> = { en: '🇬🇧', ru: '🇷🇺' };
  const langRow = h('div', { class: 'langs', role: 'radiogroup', 'aria-label': 'Language' });
  const paintLangs = () =>
    langRow.replaceChildren(
      ...languages
        .map((l) => ({ id: l.id.replace(/^lang\./, ''), name: l.name[l.id.replace(/^lang\./, '')] ?? l.name.en }))
        .sort((a, b) => (a.id < b.id ? -1 : 1))
        .map((l) =>
          h('button', { class: `secondary small${l.id === langId ? ' sel' : ''}`, role: 'radio', 'aria-checked': l.id === langId ? 'true' : 'false', 'data-lang': l.id, onclick: () => { langId = l.id; paintLangs(); } }, `${FLAGS[l.id] ?? '⌨️'} ${l.name}`),
        ),
    );
  paintLangs();
  let tier = profile?.tier ?? 2;
  const name = h('input', { type: 'text', placeholder: 'Your name (optional)', maxlength: 24, value: profile?.name ?? '', 'aria-label': 'Your name' });
  const steps = h('div', { class: 'scale', role: 'radiogroup', 'aria-label': 'Choose how fast you type' });
  const paint = () => {
    steps.replaceChildren(
      ...scale.steps.map((s) =>
        h(
          'button',
          {
            class: s.tier === tier ? 'sel' : '', role: 'radio', 'aria-checked': s.tier === tier ? 'true' : 'false',
            style: { '--i': String(s.tier) }, onclick: () => { tier = s.tier; paint(); },
          },
          h('span', { class: 'art' }, s.icon ?? scale.icon ?? '★'),
          h('span', { class: 'nm' }, s.name.en),
          h('span', { class: 'st' }, `${TIER_WPM[s.tier - 1]} wpm`),
        ),
      ),
    );
  };
  paint();
  const btns = h('div', { class: 'row-btns' });
  if (profile) {
    btns.append(
      h('button', { onclick: () => onChoose({ action: 'continue', name: name.value.trim(), tier, scale: profile.avatar.scale, language: profile.campaign.language }) }, `▶ Continue — level ${profile.campaign.level}`),
      h('button', { class: 'secondary', onclick: () => onChoose({ action: 'new', name: name.value.trim(), tier, scale: scale.id, language: langId }) }, '✨ New run'),
    );
  } else btns.append(h('button', { onclick: () => onChoose({ action: 'new', name: name.value.trim(), tier, scale: scale.id, language: langId }) }, '▶ Start'));
  if (profile && onWordBook) btns.append(h('button', { class: 'secondary', onclick: onWordBook }, `📖 Word book (${Object.keys(profile.wordBook ?? {}).length})`));
  btns.append(h('a', { href: './verify/', style: { color: 'white', alignSelf: 'center' } }, 'Replays'));
  const small = (label: string, fn?: () => void) => (fn ? h('button', { class: 'secondary small', onclick: fn }, label) : null);
  const more = h(
    'div',
    { class: 'row-btns more' },
    small('← Back', extras.onBack),
    small('🎨 Avatar', extras.onAvatar),
    small('👥 Switch player', extras.onSwitch),
    small('⬇ Export player', extras.onExport),
    small(profile?.pinHash ? '🔓 Remove PIN' : '🔒 Set PIN', extras.onPin),
    small('🗑 Delete player', extras.onDelete),
  );
  if (extras.onImport) {
    const onImport = extras.onImport;
    const file = h('input', { type: 'file', accept: '.json,application/json', style: { display: 'none' } }) as HTMLInputElement;
    file.addEventListener('change', () => file.files?.[0] && onImport(file.files[0]));
    more.append(small('⬆ Import a player', () => file.click())!, file);
  }
  return h(
    'div',
    { class: 'overlay start' },
    h(
      'div',
      { class: 'card' },
      h('h1', {}, 'The Best Typing Game Ever'),
      versionBadge(),
      h('p', {}, 'Learn to type without looking. Every new key opens a new world.'),
      h('h2', {}, `How fast do you type? ${scale.icon ?? ''}`),
      steps,
      h('p', { style: { opacity: '0.7', fontSize: '0.9em' } }, 'Not sure? Pick a small one — the game moves you up when you are ready.'),
      name,
      langRow,
      btns,
      more.childElementCount ? more : '',
    ),
  );
}

/** Level intro: keyboard with finger colours, new key, hand position, rules (docs/03 Level structure). */
export function introScreen(lang: LanguagePack, plan: LevelPlan, rules: { icon: string; text: string }[], tierName: string, title?: string): HTMLElement {
  const kb = new KeyboardOverlay(lang);
  kb.setKnown(plan.letters, plan.newKeys);
  kb.el.style.position = 'static';
  kb.el.style.transform = 'none';
  kb.el.style.margin = '0';
  kb.el.style.display = 'inline-flex';
  // Key-group levels introduce Shift (all capitals at once) or a few symbols / editing keys.
  const shiftGroup = !!plan.keyGroup?.keys.includes('Shift');
  const newKeys = shiftGroup ? [] : plan.newKeys.filter((k) => k !== ' ');
  const badge = (label: string, finger: string) => h('span', { class: 'newkey', style: { background: `var(--f-${finger})` } }, label);
  const keyBadges = shiftGroup
    ? [badge('⇧ Shift', 'lp')]
    : newKeys.map((k) => {
        const code = lang.codeOf[k];
        return badge(displayGlyph(k).toUpperCase(), code ? lang.layout[code].finger : 'li');
      });
  const fingerText = shiftGroup
    ? tr(lang, 'introShift', 'Shift — the little finger of the other hand, while the letter finger types (A → right Shift, J → left Shift)')
    : newKeys
        .map((k) => {
          const code = lang.codeOf[k];
          return code ? `${displayGlyph(k).toUpperCase()} — ${fingerName(lang, lang.layout[code].finger)}${lang.needsShift[k] ? ' + Shift' : ''}` : '';
        })
        .join(' · ');
  const heading = plan.keyGroup
    ? tr(lang, 'introGroup', 'Level {n}: {group}', { n: plan.index, group: plan.keyGroup.name })
    : newKeys.length > 1
      ? tr(lang, 'introNewKeys', 'Level {n}: new keys', { n: plan.index })
      : tr(lang, 'introNewKey', 'Level {n}: new key', { n: plan.index });
  const [hf, hj] = homeKeys(lang);
  return h(
    'div',
    { class: 'overlay intro' },
    h(
      'div',
      { class: 'card' },
      h('h2', {}, title ?? heading, ...keyBadges),
      h('p', {}, fingerText, plan.newKeys.includes(' ') ? ` · ${tr(lang, 'introSpace', 'Space — thumbs')}` : ''),
      keyboardWithHands(kb, lang, shiftGroup ? ['ShiftLeft', 'ShiftRight'] : plan.newKeys),
      h('p', {}, tr(lang, 'introRest', `Rest your fingers on the home row. Feel the little bumps on ${hf} and ${hj}. Keep your eyes on the screen.`)),
      h('div', { class: 'rules' }, ...rules.map((r) => h('div', {}, h('span', { class: 'ic' }, r.icon), r.text))),
      h('div', { class: 'press' }, tr(lang, 'pressFJ', `Put your fingers on ${hf} and ${hj} — then press them together`)),
      h('p', { style: { opacity: '0.6', fontSize: '0.85em' } }, tr(lang, 'introGoal', 'Goal: {tier}. Esc = pause.', { tier: tierName })),
    ),
  );
}

export function crossroadsScreen(stars: number, lang?: LanguagePack): HTMLElement {
  const [hf, hj] = homeKeys(lang);
  return h(
    'div',
    { class: 'overlay crossroads' },
    h(
      'div',
      { class: 'card' },
      h('div', { class: 'big-stars' }, '★'.repeat(stars) + '☆'.repeat(3 - stars)),
      h('h2', {}, tr(lang, 'crossTitle', 'You did it! Which way now?')),
      h(
        'div',
        { class: 'choices' },
        h('div', { class: 'choice' }, h('b', {}, hf), h('div', {}, tr(lang, 'crossMore', '⬅ Stay and collect more stars'))),
        h('div', { class: 'choice' }, h('b', {}, hj), h('div', {}, tr(lang, 'crossNext', 'Go to the next world ➡'))),
      ),
    ),
  );
}

export function pauseScreen(settings: Settings, onChange: (s: Settings) => void, onResume: () => void, onQuit: () => void, onExport: () => void): HTMLElement {
  const row = (label: string, input: HTMLElement) => h('label', {}, label, input);
  const check = (key: keyof Settings) => {
    const i = h('input', { type: 'checkbox' });
    i.checked = settings[key] as boolean;
    i.addEventListener('change', () => onChange({ ...settings, [key]: i.checked }));
    return i;
  };
  const range = (key: 'musicVolume' | 'sfxVolume') => {
    const i = h('input', { type: 'range', min: 0, max: 1, step: 0.05, value: settings[key] });
    i.addEventListener('input', () => onChange({ ...settings, [key]: Number(i.value) }));
    return i;
  };
  const kb = h('select', {}, ...(['auto', 'always', 'off'] as const).map((v) => h('option', { value: v, selected: settings.keyboard === v }, v)));
  kb.addEventListener('change', () => onChange({ ...settings, keyboard: kb.value as Settings['keyboard'] }));
  const text = h('input', { type: 'range', min: 0.8, max: 1.6, step: 0.1, value: settings.textScale });
  text.addEventListener('input', () => onChange({ ...settings, textScale: Number(text.value) }));
  return h(
    'div',
    { class: 'overlay pause' },
    h(
      'div',
      { class: 'card settings' },
      h('h2', {}, '⏸ Paused'),
      row('Reduced motion', check('reducedMotion')),
      row('Voice', check('voice')),
      row('Music volume', range('musicVolume')),
      row('Effects volume', range('sfxVolume')),
      row('Keyboard helper', kb),
      row('Text size', text),
      row('Dyslexia-friendly font', check('dyslexicFont')),
      row('High contrast', check('highContrast')),
      row('Colour-blind key patterns', check('colorBlindPatterns')),
      row('Show FPS counter', check('showFps')),
      h('div', { class: 'row-btns' }, h('button', { onclick: onResume }, 'Resume (Esc)'), h('button', { class: 'secondary', onclick: onExport }, 'Save my run'), h('button', { class: 'secondary', onclick: onQuit }, 'Main menu')),
    ),
  );
}

/** Fix-it drill offer (docs/01 Weakness detection): F = train the weak key for a minute, J = not now. */
export function drillOfferScreen(key: string, onYes: () => void, onNo: () => void): HTMLElement {
  const K = key.toUpperCase();
  return h(
    'div',
    { class: 'overlay drill-offer' },
    h(
      'div',
      { class: 'card' },
      h('h2', {}, `🛠️ ${K} is tricky`),
      h('p', {}, `Train ${K} for one minute? A little practice helps your fingers remember.`),
      h(
        'div',
        { class: 'choices' },
        h('div', { class: 'choice', onclick: onYes }, h('b', {}, 'F'), h('div', {}, `Yes, train ${K}`)),
        h('div', { class: 'choice', onclick: onNo }, h('b', {}, 'J'), h('div', {}, 'Not now')),
      ),
    ),
  );
}

export function nagScreen(text: string, actionLabel: string, onAction: () => void, onClose: () => void): HTMLElement {
  return h('div', { class: 'card nag' }, h('p', {}, text), h('div', { class: 'row-btns' }, h('button', { onclick: onAction }, actionLabel), h('button', { class: 'secondary', onclick: onClose }, 'Keep going')));
}

/** Word book: every illustrated word, revealed ones in colour (golden frame if typed golden), others locked. */
export function wordBookScreen(
  book: Record<string, { golden: boolean; count: number }>,
  all: { word: string; svg: string }[],
  emoji: Record<string, string>,
  onClose: () => void,
): HTMLElement {
  const drawn = new Set(all.map((a) => a.word));
  const found = all.filter((a) => book[a.word]).length;
  const golden = Object.values(book).filter((b) => b.golden).length;
  const entry = (word: string, art: Node | string, cls: string) => {
    const e = h('div', { class: `entry ${cls}` });
    const box = h('div', {});
    if (typeof art === 'string') box.innerHTML = art;
    else box.append(art);
    e.append(box, h('div', {}, cls.includes('locked') ? '?' : word));
    return e;
  };
  const cells = all
    .slice()
    .sort((a, b) => (a.word < b.word ? -1 : 1))
    .map((a) => entry(a.word, a.svg, book[a.word] ? (book[a.word].golden ? 'golden' : '') : 'locked'));
  const extra = Object.keys(book)
    .filter((w) => !drawn.has(w) && emoji[w])
    .sort()
    .map((w) => entry(w, h('div', { class: 'em' }, emoji[w]), book[w].golden ? 'golden' : ''));
  return h(
    'div',
    { class: 'overlay word-book' },
    h(
      'div',
      { class: 'card' },
      h('h2', {}, '📖 Word book'),
      h('p', {}, `Pictures found: ${found} / ${all.length} · golden: ${golden}. Type a word quickly with no mistakes to make it golden!`),
      h('div', { class: 'grid' }, ...cells, ...extra),
      h('div', { class: 'row-btns' }, h('button', { onclick: onClose }, 'Back')),
    ),
  );
}
