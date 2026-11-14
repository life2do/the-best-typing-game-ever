/**
 * Local analytics screen (docs/07): headline tiles, one single-series line chart per measure (WPM,
 * accuracy, steadiness — never two scales on one chart), a table view of the same numbers, a keyboard
 * heatmap of error rate (with latency in the tooltip), stars per tier, tier history, words and abilities.
 * Colours: the data-viz reference palette's dark steps (line #3987e5; one-hue blue ramp for the heatmap,
 * darkest = fewest errors so near-zero recedes into the dark card), validated against the card surface.
 */
import type { LanguagePack } from '@/content/types';
import type { PlayerStats, LevelStat } from '@/stats/analytics';
import { h } from './dom';
import { displayGlyph } from '@/content/glyphs';

const NS = 'http://www.w3.org/2000/svg';
const LINE = '#3987e5';
const RAMP = ['#184f95', '#256abf', '#3987e5', '#6da7ec', '#9ec5f4']; // few errors → many errors
const svgEl = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>, ...kids: (SVGElement | string)[]) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  for (const k of kids) e.append(k);
  return e;
};

const fmtTime = (ms: number) => {
  const m = Math.round(ms / 60000);
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`;
};

/** One measure over the levels played: a 2px line, ≥ 8px markers, a hover tooltip per point. */
function lineChart(title: string, unit: string, pts: { x: string; y: number; tip: string }[], yMax: number): HTMLElement {
  const W = 420, H = 160, L = 44, R = 12, T = 14, B = 28;
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'chart', role: 'img', 'aria-label': `${title} by level` });
  const top = Math.max(1, yMax);
  const y = (v: number) => T + (1 - v / top) * (H - T - B);
  const x = (i: number) => L + (pts.length <= 1 ? (W - L - R) / 2 : (i / (pts.length - 1)) * (W - L - R));
  // Recessive grid: three lines with values.
  for (const f of [0, 0.5, 1]) {
    const v = top * f;
    svg.append(svgEl('line', { x1: L, x2: W - R, y1: y(v), y2: y(v), class: 'grid' }), svgEl('text', { x: L - 6, y: y(v) + 5, class: 'tick', 'text-anchor': 'end' }, String(Math.round(v))));
  }
  if (pts.length) {
    svg.append(svgEl('polyline', { points: pts.map((p, i) => `${x(i)},${y(p.y)}`).join(' '), class: 'line', stroke: LINE }));
    pts.forEach((p, i) => {
      const g = svgEl('g', { class: 'pt', tabindex: 0 });
      g.append(svgEl('circle', { cx: x(i), cy: y(p.y), r: 12, class: 'hit' }), svgEl('circle', { cx: x(i), cy: y(p.y), r: 4.5, fill: LINE, class: 'dot' }), svgEl('title', {}, p.tip));
      svg.append(g);
      if (pts.length <= 12 || i % Math.ceil(pts.length / 12) === 0) svg.append(svgEl('text', { x: x(i), y: H - 6, class: 'tick', 'text-anchor': 'middle' }, p.x));
    });
  } else svg.append(svgEl('text', { x: W / 2, y: H / 2, class: 'tick', 'text-anchor': 'middle' }, 'Finish a level to see this'));
  return h('figure', { class: 'stat-chart' }, h('figcaption', {}, `${title} (${unit})`), svg as unknown as HTMLElement);
}

/** Keyboard heatmap: each known key coloured by error rate (5 steps), tooltip with errors and latency. */
function heatmap(lang: LanguagePack, keys: PlayerStats['keys']): HTMLElement {
  const byChar = new Map(keys.map((k) => [k.key, k]));
  const maxErr = Math.max(50, ...keys.map((k) => k.errP));
  const rows = ['number', 'top', 'home', 'bottom'] as const;
  const wrap = h('div', { class: 'heat', role: 'table', 'aria-label': 'Error rate per key' });
  for (const row of rows) {
    const r = h('div', { class: `heat-row ${row}` });
    const codes = Object.entries(lang.layout).filter(([, k]) => k.row === row).sort((a, b) => a[1].col - b[1].col);
    for (const [, k] of codes) {
      const s = byChar.get(k.char);
      const step = s ? Math.min(RAMP.length - 1, Math.floor((s.errP / maxErr) * RAMP.length)) : -1;
      const tip = s ? `${displayGlyph(k.char).toUpperCase()}: ${(s.errP / 10).toFixed(1)}% mistakes · ${s.latencyMs} ms per key · ${s.n} typed` : `${k.char.toUpperCase()}: not typed yet`;
      r.append(h('div', { class: `heat-key${s ? '' : ' none'}`, title: tip, role: 'cell', 'aria-label': tip, style: s ? { background: RAMP[step], color: step >= 3 ? '#0b0b0b' : '#f0efec' } : {} }, displayGlyph(k.char).toUpperCase()));
    }
    wrap.append(r);
  }
  const legend = h('div', { class: 'heat-legend' }, h('span', {}, 'fewer mistakes'), ...RAMP.map((c) => h('i', { style: { background: c } })), h('span', {}, 'more mistakes'), h('span', { class: 'none-swatch' }), h('span', {}, 'not typed yet'));
  return h('div', { class: 'heat-wrap' }, wrap, legend);
}

function levelTable(levels: LevelStat[]): HTMLElement {
  const head = h('tr', {}, ...['Level', 'Keys', 'Tier', 'Stars', 'WPM', 'Accuracy', 'Steadiness', 'Time'].map((t) => h('th', {}, t)));
  const rows = levels.map((l) =>
    h('tr', {}, h('td', {}, String(l.level)), h('td', {}, l.newKeys), h('td', {}, String(l.tier)), h('td', {}, l.complete ? '★'.repeat(l.stars) || '—' : '…'),
      h('td', {}, (l.wpmP / 1000).toFixed(1)), h('td', {}, `${(l.accP / 10).toFixed(1)}%`), h('td', {}, `${Math.round(l.steadyP / 10)}%`), h('td', {}, fmtTime(l.activeMs))),
  );
  return h('details', { class: 'stat-table' }, h('summary', {}, 'Show as a table'), h('table', {}, h('thead', {}, head), h('tbody', {}, ...rows)));
}

export function statsScreen(name: string, lang: LanguagePack, s: PlayerStats, scaleStepName: (tier: number) => string, onClose: () => void): HTMLElement {
  const done = s.levels.filter((l) => l.complete);
  const tile = (value: string, label: string) => h('div', { class: 'stat-tile' }, h('b', {}, value), h('span', {}, label));
  const pts = (f: (l: LevelStat) => number, tip: (l: LevelStat) => string) => done.map((l) => ({ x: `L${l.level}`, y: f(l), tip: `Level ${l.level} (${l.newKeys}): ${tip(l)}` }));
  return h(
    'div',
    { class: 'overlay stats' },
    h(
      'div',
      { class: 'card' },
      h('h2', {}, `📊 ${name || 'Player'} — your progress`),
      h('div', { class: 'stat-tiles' },
        tile(String(done.length), 'levels finished'),
        tile(`${s.totalStars} ★`, 'stars'),
        tile((s.bestWpmP / 1000).toFixed(0), 'best WPM'),
        tile(fmtTime(s.timeMs), 'typing time'),
        tile(String(s.words), `words found${s.goldenWords ? ` (${s.goldenWords} golden)` : ''}`),
        tile(String(s.abilities.length), 'abilities')),
      h('div', { class: 'stat-charts' },
        lineChart('Speed', 'WPM', pts((l) => l.wpmP / 1000, (l) => `${(l.wpmP / 1000).toFixed(1)} WPM`), Math.max(10, ...done.map((l) => l.wpmP / 1000))),
        lineChart('Accuracy', '%', pts((l) => l.accP / 10, (l) => `${(l.accP / 10).toFixed(1)}%`), 100),
        lineChart('Steady rhythm', '%', pts((l) => l.steadyP / 10, (l) => `${Math.round(l.steadyP / 10)}%`), 100)),
      levelTable(s.levels),
      h('h3', {}, 'Your keyboard'),
      heatmap(lang, s.keys),
      h('div', { class: 'stat-cols' },
        h('div', {}, h('h3', {}, 'Stars per level of play'), s.starsByTier.length ? h('ul', {}, ...s.starsByTier.map((t) => h('li', {}, `${scaleStepName(t.tier)}: ${t.stars} ★`))) : h('p', {}, '—')),
        h('div', {}, h('h3', {}, 'Growing up'), s.tierHistory.length ? h('ul', {}, ...s.tierHistory.map((t) => h('li', {}, `Level ${t.level}: ${scaleStepName(t.from)} → ${scaleStepName(t.to)}`))) : h('p', {}, 'Not yet — keep going!')),
        h('div', {}, h('h3', {}, 'Abilities'), s.abilities.length ? h('ul', {}, ...s.abilities.map((a) => h('li', {}, a.replace(/^ability\./, '')))) : h('p', {}, 'Find special words to collect abilities.'))),
      h('p', { class: 'msg' }, 'Everything here stays on this device. It is included when you export this player.'),
      h('div', { class: 'row-btns' }, h('button', { onclick: onClose }, 'Back')),
    ),
  );
}
