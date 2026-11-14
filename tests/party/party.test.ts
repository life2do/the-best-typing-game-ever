/** M2.9 hot seat: every mode completes with 2 bot players, credits each profile, and replays and verifies. */
import { describe, expect, it } from 'vitest';
import { newProfile, type Profile } from '@/storage/profile';
import { campaignFor } from '@/campaign/setup';
import { creditLevel } from '@/campaign/progress';
import { verifySegment } from '@/app/replay';
import { nextTurn, partyProblem, partyStarsKey, roundPlans, sharedLetters, swapsAfter, type Party, type PartyMode } from '@/party/party';
import { runPartyRound } from '../../tools/bot/party';

function players(): Profile[] {
  const a = newProfile('Mia', 'scale.animals', 3, 'seed-mia-0001');
  a.campaign.level = 3;
  const b = newProfile('Leo', 'scale.animals', 4, 'seed-leo-0002');
  b.campaign.level = 7;
  return [a, b];
}
const party = (mode: PartyMode, swap: Party['swap'] = 'stage', round = 1): Party => ({
  schemaVersion: 1, partyId: `party-${mode}`, mode, seed: `party-seed-${mode}`, language: 'en', players: [], round, swap, createdAt: 0,
});

describe('hot-seat party plans', () => {
  it('coop: everyone gets the letters all players have unlocked; side by side: their own letters, same game', () => {
    const ps = players();
    const camps = ps.map((p) => campaignFor(p.campaign.seed));
    const own = ps.map((p, i) => camps[i].levels[p.campaign.level - 1]);
    const coop = roundPlans(party('coop'), ps, camps, campaignFor('party-seed-coop'));
    expect(coop[0].plan.letters).toEqual(coop[1].plan.letters);
    expect(coop[0].plan.letters).toEqual(sharedLetters(own));
    expect(coop[0].plan.letters.every((c) => own[0].letters.includes(c) && own[1].letters.includes(c))).toBe(true);
    const side = roundPlans(party('side'), ps, camps, campaignFor('party-seed-side'));
    expect(side[0].plan.templateId).toBe(side[1].plan.templateId);
    expect(side[0].plan.letters).toEqual(own[0].letters);
    expect(side[1].plan.letters).toEqual(own[1].letters);
    expect(side.every((s) => s.campaignSeed === 'party-seed-side' && !s.advancesCampaign)).toBe(true);
    const comp = roundPlans(party('companions'), ps, camps, campaignFor('party-seed-companions'));
    expect(comp.map((c) => c.plan)).toEqual(own);
    expect(comp.map((c) => c.campaignSeed)).toEqual(ps.map((p) => p.campaign.seed));
  });

  it('rounds vary the game and keep it playable with the letters', () => {
    const ps = players();
    const camps = ps.map((p) => campaignFor(p.campaign.seed));
    const ids = [1, 2, 3, 4].map((r) => roundPlans(party('coop', 'stage', r), ps, camps, campaignFor('x'))[0].plan.templateId);
    expect(new Set(ids).size).toBeGreaterThan(1);
  });

  it('turn order skips finished players; swaps follow the mode', () => {
    expect(nextTurn(0, [false, false, false])).toBe(1);
    expect(nextTurn(2, [false, false, false])).toBe(0);
    expect(nextTurn(0, [false, true, false])).toBe(2);
    expect(nextTurn(1, [true, false])).toBe(1);
    expect(nextTurn(0, [true, true])).toBe(-1);
    expect(swapsAfter(party('coop'), 'stage')).toBe(true);
    expect(swapsAfter(party('coop', 'level'), 'stage')).toBe(false);
    expect(swapsAfter(party('companions'), 'stage')).toBe(false);
    expect(swapsAfter(party('companions'), 'done')).toBe(true);
  });

  it('coop and side by side need one language; 2–4 players', () => {
    const [a, b] = players();
    const ru = newProfile('Ваня', 'scale.animals', 3, 'seed-ru', 'ru');
    expect(partyProblem('coop', [a])).toMatch(/at least 2/);
    expect(partyProblem('coop', [a, b])).toBeNull();
    expect(partyProblem('side', [a, ru])).toMatch(/same language/);
    expect(partyProblem('companions', [a, ru])).toBeNull();
    expect(partyProblem('coop', [a, b, a, b, a])).toMatch(/At most 4/);
  });
});

describe('hot-seat rounds with 2 bot players', () => {
  for (const mode of ['coop', 'side', 'companions'] as PartyMode[])
    it(`${mode}: completes, takes turns, credits each profile, replays and verifies`, () => {
      const ps = players();
      const pt = party(mode);
      const round = runPartyRound(pt, ps, ['pass', 'pass']);
      expect(round.runs.every((r) => r.completed)).toBe(true);
      // Turns alternate: coop and side by side swap after every stage, companions after the level.
      if (mode === 'companions') expect(round.turns).toEqual([0, 1]);
      else {
        expect(round.turns.length).toBeGreaterThanOrEqual(5);
        expect(round.turns.slice(0, 4)).toEqual([0, 1, 0, 1]);
      }
      // Each player's own stream replays to the same snapshots and stars.
      for (const seg of round.segments) {
        const v = verifySegment(campaignFor(seg.campaignSeed, seg.language), seg, 'test');
        expect(v.ok, `${mode} player ${seg.player}`).toBe(true);
        expect(v.stars).toBeGreaterThanOrEqual(1);
      }
      // Results go to each player's own profile.
      ps.forEach((p, i) => {
        const before = p.campaign.level;
        const r = round.runs[i];
        const plan = round.plans[i];
        creditLevel(p, {
          level: plan.plan.index, starsKey: plan.advancesCampaign ? String(plan.plan.index) : partyStarsKey(pt.partyId, pt.round),
          tier: p.tier, letters: plan.plan.letters.length, lastStage: r.sim.setup.stageLengths.length - 1, state: r.sim.state,
          advanceTo: plan.advancesCampaign ? plan.plan.index + 1 : undefined,
        });
        expect(p.results).toHaveLength(1);
        expect(Object.values(p.starsByTier[String(r.sim.setup.tier)])[0]).toBeGreaterThanOrEqual(1);
        expect(p.campaign.level).toBe(mode === 'companions' ? before + 1 : before);
        expect(Object.keys(p.perKey).length).toBeGreaterThan(0);
      });
    });

  it('is deterministic: the same party round gives the same streams', () => {
    const a = runPartyRound(party('side'), players(), ['pass', 'star3']);
    const b = runPartyRound(party('side'), players(), ['pass', 'star3']);
    expect(a.turns).toEqual(b.turns);
    expect(a.segments.map((s) => s.snapshots)).toEqual(b.segments.map((s) => s.snapshots));
  });

  it('a struggling player does not block the round', () => {
    const round = runPartyRound(party('coop'), players(), ['pass', 'struggle']);
    expect(round.runs[0].completed).toBe(true);
    expect(round.runs[1].completed).toBe(false);
  });
});
