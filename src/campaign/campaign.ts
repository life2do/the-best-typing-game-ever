/**
 * Campaign = fixed key order + seeded slot filling (docs/03). Pure and deterministic.
 */
import { Rng } from '@/core/rng';
import { hashState, type Hash } from '@/core/hash';
import type { CampaignRulesManifest, LanguagePack, LevelTemplateManifest, PaletteManifest, RenderStyleManifest, HavocManifest, View } from '@/content/types';

export interface LevelPlan {
  index: number; // 1-based
  newKeys: string[];
  letters: string[]; // all known characters excluding space
  templateId: string;
  view: View;
  styleId: string;
  paletteId: string;
  havocIds: string[];
  havocMaxP: number; // permille
  boss: boolean;
}

export interface Campaign {
  seed: string;
  language: string;
  orderVariant: number;
  levels: LevelPlan[];
}

export interface CampaignContent {
  rules: CampaignRulesManifest;
  templates: LevelTemplateManifest[];
  styles: RenderStyleManifest[];
  palettes: PaletteManifest[];
  havocs: HavocManifest[];
}

const bare = (id: string) => id.split('@')[0];

export function createCampaign(seed: string, lang: LanguagePack, c: CampaignContent): Campaign {
  const rng = Rng.fromSeed(`${seed}:campaign`);
  const variants = [lang.order, ...(lang.orderVariants ?? [])];
  const orderVariant = rng.int(variants.length);
  const order = variants[orderVariant];
  const levels: LevelPlan[] = [];
  const known: string[] = [];
  const recentTemplates: string[] = [];
  const usedLook: string[] = [];
  const steps: string[][] = order.map((k) => k);
  for (let i = 0; i < steps.length; i++) {
    const newKeys = steps[i];
    for (const k of newKeys) if (k !== ' ' && !known.includes(k)) known.push(k);
    const slot = c.rules.slots.find((s) => s.level === i + 1) ?? { level: i + 1, viewBand: ['2d', 'iso', '3d'] as View[] };
    let templateId: string;
    if (slot.fixedTemplate) templateId = bare(slot.fixedTemplate);
    else {
      const ok = (t: LevelTemplateManifest, strict: boolean) =>
        t.minLetters <= known.length &&
        (t.maxLetters === undefined || t.maxLetters >= known.length) &&
        (!strict || (t.views.some((v) => slot.viewBand.includes(v)) && !recentTemplates.slice(-(c.rules.constraints?.noTemplateRepeatWithin ?? 1)).includes(t.id)));
      let pool = c.templates.filter((t) => ok(t, true));
      if (!pool.length) pool = c.templates.filter((t) => ok(t, false) && t.id !== recentTemplates[recentTemplates.length - 1]);
      if (!pool.length) pool = c.templates.filter((t) => ok(t, false));
      templateId = rng.pick(pool.sort((a, b) => (a.id < b.id ? -1 : 1))).id;
    }
    const tpl = c.templates.find((t) => t.id === templateId)!;
    recentTemplates.push(templateId);
    const view = tpl.views.find((v) => slot.viewBand.includes(v)) ?? tpl.views[0];
    const styles = c.styles.slice().sort((a, b) => (a.id < b.id ? -1 : 1));
    const palettes = c.palettes.slice().sort((a, b) => (a.id < b.id ? -1 : 1));
    let styleId = styles[0].id;
    let paletteId = palettes[0].id;
    for (let tries = 0; tries < 8; tries++) {
      styleId = rng.pick(styles).id;
      paletteId = rng.pick(palettes).id;
      if (!usedLook.slice(-2).includes(`${styleId}|${paletteId}`)) break;
    }
    usedLook.push(`${styleId}|${paletteId}`);
    const supported = (tpl.supportsHavocs ?? []).filter((h) => c.havocs.some((x) => x.id === h));
    const maxP = Math.min(1000, (slot.havocIntensity?.[1] ?? 0.5) * 1000) | 0;
    levels.push({
      index: i + 1,
      newKeys: [...newKeys],
      letters: [...known],
      templateId,
      view,
      styleId,
      paletteId,
      havocIds: i === 0 || maxP === 0 ? [] : supported,
      havocMaxP: maxP,
      boss: !!slot.boss,
    });
  }
  return { seed, language: lang.id, orderVariant, levels };
}

/** Campaign fingerprint (docs/10 §3.3). */
export function campaignHash(build: string, camp: Campaign, partyMode = '', players = 1): Hash {
  return hashState({ build, language: camp.language, orderVariant: camp.orderVariant, seed: camp.seed, partyMode, players });
}
