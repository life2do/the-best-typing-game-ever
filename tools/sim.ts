/**
 * npm run sim -- --level <n> | --template <id> [--letters fjdk] --tier <1-7> --profile <p> --seed <s> [--out run.json] [--snapshots]
 * Headless deterministic run with the bot typist (docs/10 §5.6).
 */
import { writeFileSync } from 'node:fs';
import { runBot, type BotProfile } from './bot/bot';
import { campaignFor, levelSetup, adHocSetup } from '../src/campaign/setup';
import { templateSim } from '../src/sim/templates';
import { chainLink, hashState } from '../src/core/hash';

const args: Record<string, string> = {};
const argv = process.argv.slice(2).filter((a) => a !== '--');
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a.startsWith('--')) {
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) args[a.slice(2)] = 'true';
    else {
      args[a.slice(2)] = next;
      i++;
    }
  }
}
const tier = Number(args.tier ?? 4);
const seed = args.seed ?? '1';
const profile = (args.profile ?? 'pass') as BotProfile;
const camp = campaignFor(seed, args.lang ?? 'en');
const setup = args.template
  ? adHocSetup(seed, args.template.startsWith('template.') ? args.template : `template.${args.template}`, (args.letters ?? 'fjdk').split(''), { tier })
  : levelSetup(camp, Number(args.level ?? 1), { tier });
const run = runBot(setup, templateSim(setup.templateId), { profile, botSeed: seed });
const s = run.sim.state;
let link = hashState({ seed, level: setup.levelIndex, template: setup.templateId });
for (const sn of run.sim.snapshots) link = chainLink(link, sn.hash);
const summary = {
  template: setup.templateId,
  level: setup.levelIndex,
  letters: setup.letters.join(''),
  tier,
  profile,
  completed: run.completed,
  stars: s.bestStars,
  targetWpm: run.sim.targetWpmP / 1000,
  stages: s.results.map((r) => ({ stage: r.stage, attempt: r.attempt, wpm: r.wpmP / 1000, acc: r.accP / 10, steady: r.steadyP, stars: r.stars })),
  simulatedMin: Math.round(run.simulatedMs / 600) / 100,
  keys: run.log.length,
  stuckAtMin: run.stuckAtMs < 0 ? null : Math.round(run.stuckAtMs / 600) / 100,
  minVisibility: run.minVisibility,
  collected: s.collected,
  snapshots: args.snapshots ? run.sim.snapshots.map((x) => [x.frame, x.kind, x.hash]) : run.sim.snapshots.length,
  run: link,
};
console.log(JSON.stringify(summary, null, 2));
if (args.out) writeFileSync(args.out, JSON.stringify({ setup: { seed, level: setup.levelIndex, tier }, log: run.log }) + '\n');
