/** Build a LevelSetup for a campaign level (shared by game, bot, tests, replay). */
import { abilities, powerups, loadLanguage, templates, campaignRules, styles, palettes, havocs } from '@/content/registry';
import { createCampaign, type Campaign, type LevelPlan } from './campaign';
import type { LevelSetup } from '@/sim/types';
import type { LanguagePack } from '@/content/types';

export const STAGE_LENGTHS = [40, 60, 80];

const langCache: Record<string, LanguagePack> = {};
export function language(id: string): LanguagePack {
  return (langCache[id] ??= loadLanguage(id));
}

export function campaignFor(seed: string, languageId = 'en'): Campaign {
  const lang = language(languageId);
  const rules = campaignRules.find((r) => r.language === lang.id);
  if (!rules) throw new Error(`No campaign rules for ${lang.id}`);
  return createCampaign(seed, lang, { rules, templates, styles, palettes, havocs });
}

export interface SetupOptions {
  tier: number;
  targetStars?: number;
  collected?: string[];
  weakKeys?: string[];
}

export function levelSetup(camp: Campaign, levelIndex: number, o: SetupOptions): LevelSetup {
  const plan = camp.levels[levelIndex - 1];
  if (!plan) throw new Error(`No level ${levelIndex}`);
  return planSetup(camp.seed, camp.language, plan, o);
}

/**
 * Setup for a stored level plan. Segments keep the plan their level started with, so resuming and
 * replaying use the same template, letters and look even after new content changes the campaign's
 * seeded choices for that level.
 */
export function planSetup(seed: string, languageId: string, plan: LevelPlan, o: SetupOptions): LevelSetup {
  const lang = language(languageId);
  const levelIndex = plan.index;
  const tpl = templates.find((t) => t.id === plan.templateId)!;
  return {
    seed,
    levelIndex,
    language: lang,
    letters: plan.letters,
    newKeys: plan.newKeys,
    tier: o.tier,
    targetStars: o.targetStars ?? 1,
    templateId: plan.templateId,
    inputMode: tpl.inputMode,
    stageLengths: STAGE_LENGTHS,
    abilities: abilities.slice().sort((a, b) => (a.id < b.id ? -1 : 1)),
    powerups: powerups.slice().sort((a, b) => (a.id < b.id ? -1 : 1)),
    collected: o.collected ?? [],
    weakKeys: o.weakKeys ?? [],
    groupChars: plan.groupChars,
  };
}

/** Key-group characters among ad-hoc letters: everything that isn't a lowercase letter or `;`. */
export const adHocGroupChars = (letters: string[]) => letters.filter((c) => c !== ' ' && c !== ';' && !/\p{Ll}/u.test(c));

/** Setup for an arbitrary letter set (dev preview, fix-it drills). */
export function adHocSetup(seed: string, templateId: string, letters: string[], o: SetupOptions, languageId = 'en'): LevelSetup {
  const lang = language(languageId);
  const tpl = templates.find((t) => t.id === templateId);
  if (!tpl) throw new Error(`Unknown template ${templateId}`);
  return {
    seed, levelIndex: 1, language: lang, letters, newKeys: letters.slice(-1), tier: o.tier, targetStars: o.targetStars ?? 1,
    templateId, inputMode: tpl.inputMode, stageLengths: STAGE_LENGTHS,
    abilities: abilities.slice().sort((a, b) => (a.id < b.id ? -1 : 1)),
    powerups: powerups.slice().sort((a, b) => (a.id < b.id ? -1 : 1)),
    collected: o.collected ?? [], weakKeys: o.weakKeys ?? [], groupChars: adHocGroupChars(letters),
  };
}
