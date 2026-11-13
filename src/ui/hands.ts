/**
 * Two see-through hands drawn over the intro keyboard (docs/01 Finger map): each fingertip rests on
 * its home-row key and is coloured like that finger's keys; thumbs rest on Space. The finger that
 * types the new key glows, with a dashed arrow from its home key to the new key.
 */
import type { Finger, LanguagePack } from '@/content/types';
import type { KeyboardOverlay } from './keyboard';

const NS = 'http://www.w3.org/2000/svg';
const HOME: Record<Finger, string> = {
  lp: 'KeyA', lr: 'KeyS', lm: 'KeyD', li: 'KeyF', lt: 'Space',
  rt: 'Space', ri: 'KeyJ', rm: 'KeyK', rr: 'KeyL', rp: 'Semicolon',
};
const LEFT: Finger[] = ['lp', 'lr', 'lm', 'li', 'lt'];
const RIGHT: Finger[] = ['rt', 'ri', 'rm', 'rr', 'rp'];

const el = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  return e;
};

/** Wraps the keyboard in a box that also holds the hands; redraws whenever the layout changes. */
export function keyboardWithHands(kb: KeyboardOverlay, lang: LanguagePack, newKeys: string[]): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'hands-wrap';
  const svg = el('svg', { class: 'hands', 'aria-hidden': 'true' });
  wrap.append(kb.el, svg);
  const newFingers = newKeys.map((k) => lang.codeOf[k]).filter(Boolean).map((code) => ({ code, finger: lang.layout[code].finger }));
  const draw = () => {
    const box = wrap.getBoundingClientRect();
    if (!box.width) return;
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    svg.setAttribute('width', String(box.width));
    svg.setAttribute('height', String(box.height));
    svg.replaceChildren();
    const center = (code: string) => {
      const k = kb.keyEl(code);
      if (!k) return null;
      const r = k.getBoundingClientRect();
      return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2, w: r.width, h: r.height };
    };
    const space = center('Space');
    const keyW = center('KeyF')?.w ?? 42;
    for (const [hand, fingers] of [['left', LEFT], ['right', RIGHT]] as const) {
      const tips = fingers.map((f) => {
        const c = center(HOME[f]);
        if (!c) return null;
        // Thumbs rest on the left/right part of the space bar.
        if (f === 'lt' && space) return { f, x: space.x - space.w * 0.18, y: space.y };
        if (f === 'rt' && space) return { f, x: space.x + space.w * 0.18, y: space.y };
        return { f, x: c.x, y: c.y - c.h * 0.05 };
      });
      if (tips.some((t) => !t)) continue;
      const pts = tips as { f: Finger; x: number; y: number }[];
      const fingerTips = pts.filter((p) => !p.f.endsWith('t'));
      const palmX = fingerTips.reduce((s, p) => s + p.x, 0) / fingerTips.length + (hand === 'left' ? keyW * 0.35 : -keyW * 0.35);
      const palmY = (space?.y ?? fingerTips[0].y + keyW * 2.4) + keyW * 0.9;
      const g = el('g', { class: `hand ${hand}` });
      // Palm.
      g.append(el('ellipse', { class: 'palm', cx: palmX, cy: palmY, rx: keyW * 2.15, ry: keyW * 1.05 }));
      // Fingers: from the palm's top edge to each fingertip, coloured like that finger's keys.
      for (const p of pts) {
        const thumbF = p.f.endsWith('t');
        const bx = thumbF ? palmX + (hand === 'left' ? keyW * 1.5 : -keyW * 1.5) : palmX + (p.x - palmX) * 0.55;
        const by = thumbF ? palmY - keyW * 0.2 : palmY - keyW * 0.75;
        const active = newFingers.some((n) => n.finger === p.f);
        const w = keyW * (thumbF ? 0.62 : p.f.endsWith('p') ? 0.5 : 0.58);
        g.append(el('line', { class: `finger-outline${active ? ' active' : ''}`, x1: bx, y1: by, x2: p.x, y2: p.y, 'stroke-width': w + 4 }));
        g.append(el('line', { class: `finger f-${p.f}${active ? ' active' : ''}`, x1: bx, y1: by, x2: p.x, y2: p.y, 'stroke-width': w, style: `stroke: var(--f-${p.f})` }));
        g.append(el('circle', { class: 'nail', cx: p.x, cy: p.y, r: w * 0.28 }));
      }
      svg.append(g);
    }
    // Reach arrows from the finger's home key to each new key that isn't on the home row.
    for (const n of newFingers) {
      const from = center(HOME[n.finger]);
      const to = center(n.code);
      if (!from || !to || n.code === HOME[n.finger]) continue;
      svg.append(el('line', { class: 'reach', x1: from.x, y1: from.y, x2: to.x, y2: to.y }));
      svg.append(el('circle', { class: 'reach-target', cx: to.x, cy: to.y, r: to.w * 0.45 }));
    }
  };
  new ResizeObserver(draw).observe(wrap);
  requestAnimationFrame(draw);
  return wrap;
}
