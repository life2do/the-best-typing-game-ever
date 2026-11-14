/**
 * Hot-seat parties (docs/06): 2–4 profiles on one keyboard, taking turns. Pure functions shared by the game,
 * the bot party runner and tests: each player's level plan for a round, the turn order, and how a finished
 * level is credited to that player's own profile.
 *
 * Modes:
 * - coop: everyone plays the same level with the letters *all* players have unlocked;
 * - side: the same game and world, but each player's own letters (their own campaign level);
 * - companions: each player plays the next level of their own campaign.
 * In coop and side-by-side, turns swap after every stage (or every level, a party setting); companions
 * swap after every level. Every player keeps their own input stream (one segment per player and round).
 */
import type { Campaign, LevelPlan } from '@/campaign/campaign';
import { templates } from '@/content/registry';
import { segmentKey, type Profile } from '@/storage/profile';

export type PartyMode = 'coop' | 'side' | 'companions';
export const PARTY_MODES: PartyMode[] = ['coop', 'side', 'companions'];
export const MAX_PLAYERS = 4;

export interface Party {
  schemaVersion: 1;
  partyId: string;
  mode: PartyMode;
  /** seed of the party's own campaign (coop and side-by-side levels come from it) */
  seed: string;
  language: string;
  /** profile ids in turn order */
  players: string[];
  /** party round, 1-based: each player plays one level per round */
  round: number;
  /** when turns swap in coop and side-by-side (companions always swap per level) */
  swap: 'stage' | 'level';
  createdAt: number;
}

export interface PartyPlayerPlan {
  player: number;
  profileId: string;
  plan: LevelPlan;
  /** campaign seed the level is played with (replay builds the setup from it and the stored plan) */
  campaignSeed: string;
  segKey: string;
  /** coop and side-by-side levels don't advance the player's own campaign */
  advancesCampaign: boolean;
}

export const partySegKey = (partyId: string, round: number, player: number) => `party:${partyId}:${String(round).padStart(3, '0')}:${player}`;

/** Key under which a party level's stars are kept in the player's starsByTier (they still count for unlocks). */
export const partyStarsKey = (partyId: string, round: number) => `party:${partyId}:${round}`;

/** The plan a player is up to in their own campaign. */
export function ownPlan(p: Profile, camp: Campaign): LevelPlan {
  return camp.levels[Math.min(Math.max(1, p.campaign.level), camp.levels.length) - 1];
}

/** Letters every player has unlocked, in the order of the least advanced player's set. */
export function sharedLetters(plans: LevelPlan[]): string[] {
  const least = plans.slice().sort((a, b) => a.letters.length - b.letters.length)[0];
  return least.letters.filter((c) => plans.every((p) => p.letters.includes(c)));
}

/**
 * Game and look for a coop / side-by-side round: a level of the party campaign whose game works with
 * `letterCount` letters, rotating through the campaign so rounds vary.
 */
export function roundLook(partyCamp: Campaign, round: number, letterCount: number): LevelPlan {
  const fits = partyCamp.levels.filter((l) => !l.keyGroup && (templates.find((t) => t.id === l.templateId)?.minLetters ?? 99) <= letterCount);
  const pool = fits.length ? fits : partyCamp.levels.slice(0, 1);
  return pool[(round - 1) % pool.length];
}

/**
 * Each player's plan for a round. `camps[i]` is player i's own campaign; `partyCamp` is the party's.
 * Coop and side-by-side plans use the round number as their index, so every round has fresh text.
 */
export function roundPlans(party: Party, profiles: Profile[], camps: Campaign[], partyCamp: Campaign): PartyPlayerPlan[] {
  const own = profiles.map((p, i) => ownPlan(p, camps[i]));
  if (party.mode === 'companions')
    return profiles.map((p, i) => ({
      player: i, profileId: p.profileId, plan: own[i], campaignSeed: p.campaign.seed,
      segKey: segmentKey(p.campaign.seed, own[i].index), advancesCampaign: true,
    }));
  const shared = sharedLetters(own);
  const least = own.slice().sort((a, b) => a.letters.length - b.letters.length)[0];
  const look = roundLook(partyCamp, party.round, party.mode === 'coop' ? shared.length : least.letters.length);
  const lookOf = (letters: string[], newKeys: string[], groupChars: string[], keyGroup?: LevelPlan['keyGroup']): LevelPlan => ({
    index: party.round, letters, newKeys: newKeys.length ? newKeys : letters.slice(-1), groupChars, keyGroup,
    templateId: look.templateId, view: look.view, styleId: look.styleId, paletteId: look.paletteId,
    havocIds: look.havocIds, havocMaxP: look.havocMaxP, boss: false,
  });
  return profiles.map((p, i) => {
    const plan =
      party.mode === 'coop'
        ? lookOf(shared, least.newKeys.filter((k) => k === ' ' || shared.includes(k)), least.groupChars.filter((c) => shared.includes(c)))
        : lookOf(own[i].letters, own[i].newKeys, own[i].groupChars, own[i].keyGroup);
    return { player: i, profileId: p.profileId, plan, campaignSeed: party.seed, segKey: partySegKey(party.partyId, party.round, i), advancesCampaign: false };
  });
}

/** Coop and side-by-side need one language (the same keys); companions can mix languages. */
export function partyProblem(mode: PartyMode, profiles: Profile[]): string | null {
  if (profiles.length < 2) return 'Choose at least 2 players.';
  if (profiles.length > MAX_PLAYERS) return `At most ${MAX_PLAYERS} players.`;
  if (mode !== 'companions' && new Set(profiles.map((p) => p.campaign.language)).size > 1) return 'Together and side by side need everyone in the same language. Try Companions.';
  return null;
}

/** The next player to type after `current`, skipping players who finished the round; -1 when all are done. */
export function nextTurn(current: number, done: readonly boolean[]): number {
  const n = done.length;
  for (let k = 1; k <= n; k++) {
    const i = (current + k) % n;
    if (!done[i]) return i;
  }
  return -1;
}

/** Whether a sim event ends this player's turn. */
export function swapsAfter(party: Party, event: 'stage' | 'done'): boolean {
  if (event === 'done') return true;
  return party.mode !== 'companions' && party.swap === 'stage';
}
