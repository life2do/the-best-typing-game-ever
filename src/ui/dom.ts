/** Minimal DOM helpers (no framework). */
export function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, any> = {}, ...children: (Node | string | null | undefined | false)[]): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'html') el.innerHTML = v;
    else el.setAttribute(k, String(v));
  }
  for (const c of children) if (c !== null && c !== undefined && c !== false) el.append(c);
  return el;
}

export function toast(parent: HTMLElement, text: string): void {
  const t = h('div', { class: 'toast', role: 'status' }, text);
  parent.append(t);
  setTimeout(() => t.remove(), 2500);
}

export const FINGER_NAMES: Record<string, string> = {
  lp: 'left little finger', lr: 'left ring finger', lm: 'left middle finger', li: 'left pointer finger', lt: 'left thumb',
  rt: 'right thumb', ri: 'right pointer finger', rm: 'right middle finger', rr: 'right ring finger', rp: 'right little finger',
};
