/** Renderer-side content discovery (browser only). */
import type { HavocVisual, RenderStyle, TemplateView } from './types';

const pick = <T extends { id: string }>(g: Record<string, unknown>) => {
  const out: Record<string, T> = {};
  for (const m of Object.values(g) as T[]) out[m.id] = m;
  return out;
};
export const templateViews = pick<TemplateView>(import.meta.glob('../../content/templates/*/view.ts', { eager: true, import: 'default' }));
export const renderStyles = pick<RenderStyle>(import.meta.glob('../../content/styles/*/style.ts', { eager: true, import: 'default' }));
export const havocVisuals = pick<HavocVisual>(import.meta.glob('../../content/havocs/*/havoc.ts', { eager: true, import: 'default' }));
