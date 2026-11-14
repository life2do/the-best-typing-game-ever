# 06 — Hot-seat multiplayer

Up to **4 players**, one keyboard, taking turns. Each player plays as their own **profile** (tier, avatar, stats, stars).
A party run has its own seed and campaign fingerprint, and records a separate input stream per player.

| Mode | Level & letters | Swap | Completion |
|---|---|---|---|
| **Coop** | Same level, **same letters**: the letters *all* players have unlocked. Optional "teach mode": everyone plays the least advanced player's set. | After every **stage** (or every level, a party setting) | Every player meets **their own tier's** target. Shared world state (e.g. a shared base). |
| **Side by side** | Same level template and world, but **letters and text adjusted to each player** (their own letters, tier, weak keys) | After every stage (or level) | Every player meets their own target |
| **Companions** | Each player progresses in **their own campaign** | After every **level** | Each player's own campaign rules |

## Handover

- On every swap, a 3–5 s overlay shows: *"🐉 Mia's turn. Hands on F and J"*, with that player's avatar, finger colours, keyboard overlay for their letters, and tempo reset to their own median.
- The world stays frozen until the next player presses F and J together.
- If a profile has a PIN, it's asked for at party start, not at each swap.

## Results

- Stats, stars and tier promotions go to each player's own profile.
- The party gets a shared result screen and a shared artifact image whose fingerprint covers all players' streams.
- A Companions run also advances each player's own campaign. Those segments are tagged with the party ID in their proof chain.

## Implemented (M2.9)

- **Party setup** (👥 Play together on the profile picker, shown with 2+ players): pick 2–4 players in turn order, a mode and when turns swap (after every stage or every level; Companions always swap per level). Coop and Side by side need everyone in the same language; Companions can mix languages. PINs are asked once, at party start.
- **Rounds**: each player plays one level per round, with **their own segment and input stream** (`party:<partyId>:<round>:<player>`, tagged with `partyId`, `profileId` and `player`) and their own local clock; a turn ending is a `pause` event in that player's stream and their next turn a `resume`, so the timeline and active time stay honest and replays are exact.
  - **Coop**: the letters all players have unlocked (in the least advanced player's order; this is also "teach mode"), the same game, world and text for everyone; each meets their own tier's target.
  - **Side by side**: the same game and world, each player's own letters (their own campaign level's set, new keys and key group).
  - Coop and Side by side rounds are levels of the party's own campaign (seed per party): the game rotates through the campaign's levels whose game works with the letters, and the round number seeds the text, so every round is fresh. They don't advance anyone's own campaign.
  - **Companions**: each player's own next campaign level (resumed if started earlier), which advances their campaign as in solo play.
- **Handover**: a player's first turn in a round shows the level intro titled with their name; later turns show the handover overlay (avatar, "Mia's turn", their letters with finger colours and the see-through hands). The world stays frozen until that player presses F and J together. A player who reaches their target moves on at the crossroads automatically.
- **Results**: after the round, a shared result screen (stars, WPM, accuracy, promotions) with Next round / End the party. Stars, results, per-key stats, collected abilities and tier promotions go to each player's own profile (`creditLevel`, shared with solo play); coop and side-by-side stars are kept under a party key in `starsByTier`, so they count for unlocks without overwriting campaign levels. Party levels appear in each player's stats screen and profile export.
- **Verify**: a party is one run on `/verify` ("Party … — 2 players"), one verdict per player and round.
- **Bots**: `tools/bot/party.ts` runs a whole round with bot players exactly like the game (turns at stage ends, own streams); tests check every mode completes with 2 bots, credits each profile, replays and verifies, and is deterministic.
- Not yet: the shared artifact image (M2.10) and a shared world object in coop (each player's world shows their own progress).

