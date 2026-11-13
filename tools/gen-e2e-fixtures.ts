/** Generates bot logs + expected snapshot hashes in Node for the cross-browser replay test (docs/10 §6). */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './content';
import { runBot } from './bot/bot';
import { campaignFor, levelSetup } from '../src/campaign/setup';
import { templateSim } from '../src/sim/templates';

const SEED = 'e2e-cross-browser';
const camp = campaignFor(SEED);
const runs = [];
for (const tier of [1, 4, 7])
  for (const level of [1, 2, 3, 4]) {
    const setup = levelSetup(camp, level, { tier });
    const r = runBot(setup, templateSim(setup.templateId), { profile: 'pass', botSeed: SEED });
    runs.push({ seed: SEED, level, tier, log: r.log, hashes: r.sim.snapshots.map((s) => s.hash) });
  }
mkdirSync(join(ROOT, 'e2e/fixtures'), { recursive: true });
writeFileSync(join(ROOT, 'e2e/fixtures/bot-runs.json'), JSON.stringify(runs));
console.log(`e2e fixtures: ${runs.length} bot runs`);
