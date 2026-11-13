import { runBot, replayLog, type BotProfile } from '../../tools/bot/bot';
import { campaignFor, levelSetup, adHocSetup } from '@/campaign/setup';
import { templateSim } from '@/sim/templates';

export const SEED = 'm1-test';

export function runLevel(level: number, tier: number, profile: BotProfile, opts: { seed?: string; fastForward?: boolean } = {}) {
  const seed = opts.seed ?? SEED;
  const camp = campaignFor(seed);
  const setup = levelSetup(camp, level, { tier });
  return { setup, run: runBot(setup, templateSim(setup.templateId), { profile, botSeed: seed, fastForward: opts.fastForward }) };
}

export function runTemplate(templateId: string, letters: string, tier: number, profile: BotProfile, opts: { seed?: string; fastForward?: boolean } = {}) {
  const seed = opts.seed ?? SEED;
  const setup = adHocSetup(seed, templateId, letters.split(''), { tier });
  return { setup, run: runBot(setup, templateSim(templateId), { profile, botSeed: seed, fastForward: opts.fastForward }) };
}

export { replayLog };
