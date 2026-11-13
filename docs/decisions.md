# Decision log

Decisions agreed during spec discussion (2026-11-13).

| # | Decision |
|---|---|
| D1 | Havoc affects the game world only, never input. |
| D2 | One Three.js renderer for all views; 2D/iso/3D are camera configurations; dive/extrude and flatten transitions. |
| D3 | The world advances only on correct keystrokes; it eases to a stop when typing stops; a hint appears after 5 s. Accuracy reveals the world; rhythm steadiness drives speed; mistakes slow and fog it (with a minimum visibility). |
| D4 | No hard failure. A level ends only when the target stars are reached. A crossroads offers "more stars" or "advance". |
| D5 | Ages 7–99, tiers based on skill. The start-screen picker uses a complexity scale chosen at random each load (13 themes, extensible). |
| D6 | Physical keyboard only. Tablets and virtual keyboards are dropped. |
| D7 | Languages: English QWERTY (M1), Russian ЙЦУКЕН (M2). Extensible via data packs. Keys are mapped by physical code, with a layout hint. |
| D8 | All keys eventually: letters one per level; other keys in groups. |
| D9 | Classic key order, plus fix-it training offered when a weakness is detected. |
| D10 | Tiers: automatic promotion; no automatic demotion (a nag only); stars counted per tier. |
| D11 | Power-ups earned by words, accuracy streaks, rhythm streaks, and rare seeded drops. |
| D12 | Words: curated lists only. Abilities are language-independent, with per-language trigger words. |
| D13 | Avatar theme = complexity scale; ≥ 8 slots / ≥ 50 options; evolves with tier; abilities shown through rig hooks. |
| D14 | Profiles local only, several per device, optional colour/shape PIN, export/import. |
| D15 | TTS via speechSynthesis; voice effects are collectibles (pitch/speed/voice in v1). |
| D16 | Rhythm frame HUD: typing pulse + steadiness glow. |
| D17 | Hot seat: Coop, Side by side, Companions; up to 4 players. |
| D18 | Agents used only during development. Every item has a description, prompt, SPDX license and test. Default content license CC0-1.0; code MIT. |
| D19 | Everything is content-addressed. Any state = (build, seed, input log prefix). Snapshots are hashed. |
| D20 | Campaign seed is fixed per campaign; "New run" reshuffles. The level sequence is randomised within slot constraints; the key order stays fixed. |
| D21 | Builds are immutable under `/v/<hash>/`. Replay switches builds per segment. |
| D22 | Proof = replayable run plus a hash chain; optional device signature. The player chooses identity mode (none/hashed/plain). The limitation (bots) is documented. |
| D23 | Verify page: Verify + Re-play (speed controls, seek bar with letter marks). |
| D24 | Tesseract holds all alphabets with a scratch-card reveal. One language completes it; extra alphabets add traits. Fingerprint → visuals + code ring; proof embedded in the PNG. |
| D25 | Quality scaler with no upper limit; never affects the simulation. |
| D26 | Mistakes: the correct key is required to advance; no Backspace until a late key group. Leaving mid-level resumes exactly where the player left off. |
| D27 | Procedural Web Audio music following the player's tempo. |
| D28 | Local-only analytics screen for each player. |
| D29 | Docs split under `docs/`, with `AGENTS.md` and `schemas/`. |
| D30 | Milestone 1 = English vertical slice, including determinism and basic replay. |
