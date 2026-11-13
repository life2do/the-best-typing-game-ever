/** Template simulation discovery (Node-safe). */
import type { TemplateSim } from './types';

const mods = import.meta.glob('../../content/templates/*/sim.ts', { eager: true, import: 'default' }) as Record<string, TemplateSim>;
export const templateSims: Record<string, TemplateSim> = {};
for (const m of Object.values(mods)) templateSims[m.id] = m;

export function templateSim(id: string): TemplateSim {
  const t = templateSims[id.split('@')[0]];
  if (!t) throw new Error(`No simulation for template ${id}`);
  return t;
}
