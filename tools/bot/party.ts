/**
 * Bot hot-seat runner (docs/06, M2.9): several bot players take turns in one party round exactly like the
 * game does — each player's sim keeps its own input stream and clock, turns swap at stage ends (or level
 * ends), and a player at the crossroads moves on at once. Produces the same segments the game saves.
 */
import { planSetup, campaignFor } from '../../src/campaign/setup';
import { templateSim } from '../../src/sim/templates';
import { weakKeys, type Profile, type Segment } from '../../src/storage/profile';
import { nextTurn, roundPlans, swapsAfter, type Party, type PartyPlayerPlan } from '../../src/party/party';
import { createBot, type BotProfile, type BotRun } from './bot';

export interface PartyRoundRun {
  plans: PartyPlayerPlan[];
  runs: BotRun[];
  /** player index of every turn, in order */
  turns: number[];
  segments: Segment[];
}

export function runPartyRound(party: Party, profiles: Profile[], bots: BotProfile[], build = 'test'): PartyRoundRun {
  const camps = profiles.map((p) => campaignFor(p.campaign.seed, p.campaign.language));
  const plans = roundPlans(party, profiles, camps, campaignFor(party.seed, party.language));
  const typists = plans.map((pp, i) => {
    const p = profiles[i];
    const lang = party.mode === 'companions' ? p.campaign.language : party.language;
    const setup = planSetup(pp.campaignSeed, lang, pp.plan, { tier: p.tier, targetStars: 1, collected: [...p.collected], weakKeys: weakKeys(p.perKey) });
    return createBot(setup, templateSim(setup.templateId), { profile: bots[i], botSeed: `${party.seed}:${party.round}:${i}` });
  });
  const done = typists.map(() => false);
  const turns: number[] = [];
  let turn = 0;
  let guard = 0;
  while (turn >= 0 && guard++ < 200) {
    turns.push(turn);
    const bot = typists[turn];
    const stagesBefore = bot.sim.state.results.length;
    for (;;) {
      if (!bot.step()) {
        done[turn] = true; // done, or out of time (a struggling player stops for this round)
        break;
      }
      const s = bot.sim.state;
      if (s.phase === 'done') {
        done[turn] = true;
        break;
      }
      // A stage just ended mid-level: swap (at the crossroads the player moves on first).
      if (s.results.length > stagesBefore && s.phase === 'play' && swapsAfter(party, 'stage')) break;
    }
    turn = nextTurn(turn, done);
  }
  const runs = typists.map((b) => b.finish());
  const segments = runs.map((r, i): Segment => ({
    key: plans[i].segKey, build, campaignSeed: plans[i].campaignSeed,
    language: party.mode === 'companions' ? profiles[i].campaign.language : party.language,
    level: plans[i].plan.index, tier: profiles[i].tier, targetStars: 1, collected: [...profiles[i].collected],
    weakKeys: weakKeys(profiles[i].perKey), log: r.log, snapshots: r.sim.snapshots.map((s) => s.hash),
    complete: r.sim.state.phase === 'done', stars: r.sim.state.bestStars, startedAt: 0, plan: plans[i].plan,
    partyId: party.partyId, profileId: profiles[i].profileId, player: i,
  }));
  return { plans, runs, turns, segments };
}
