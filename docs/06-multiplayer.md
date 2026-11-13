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
