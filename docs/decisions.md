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
| D31 | Simulation clock = input log only (integer ms → 60 Hz frames). Each frame: key events (tick + impulse) then a single decay/step. Frame stamps instead of counters; frames at rest are fast-forwarded. ([10 §1](10-simulation-and-test-harness.md)) |
| D32 | Simulation numerics are integer-only (Q16, permille, `floorDiv`, committed trig tables). |
| D33 | Canonical JSON = RFC 8785 (JCS) + NFC-only strings (reject, don't normalise) + integers-only in state/logs. Hash = `sha256-` + base64url. Text files LF. |
| D34 | WPM = (correct ÷ 5) ÷ active minutes (intervals capped at 2 s). Every wrong keystroke counts as an error; net = gross because errors are force-corrected. Accuracy is a separate star requirement. Final stage repeats until the target is met. |
| D35 | Bot typist = seeded integer-only log generator with 6 profiles (pass, star3, struggle, idle, robot, masher); logs generated in Node and replayed in every browser. |
| D36 | An ability's avatar animation resolves in this order: the scale's `ability:<id>` hook, then the ability's core `rigHook`, then `procedural:ability-pulse`. Only core and `ability:*` hook names are allowed. |
| D37 | Hosting is GitHub Pages as a static site: append-only `gh-pages` branch keeps old builds; real files for every route; per-build Vite base; no features needing custom headers; storage namespaced `tbtge`. |
| D38 | Active-time/rhythm interval cap = max(2 s, 3 × the level's target interval), so tier-1 beginners' normal gaps count fully. |
| D39 | `simT` changes only on logged events; snapshots are taken before the events that announce them. |
| D40 | Build id = first 16 characters of the build hash; the build hash covers engine sources + content (not bundle bytes). |
| D41 | M1 campaign covers all 26 English letter levels: levels 1–4 are pinned to the vertical-slice templates; later levels reuse them via seeded slot filling. Key-group levels come in M2. |
| D42 | Automatic quality scaling stops at native pixel density; supersampling beyond native is manual. FPS counter in the HUD (setting, default on). |
| D43 | During play the keyboard overlay highlights only the next key; the new-key outline is shown in the level intro only. |
| D44 | Platformer: gaps snap to the block grid and the hop is derived from the runner's position, so ground is always under it; notes hang over gaps and are collected when passed. |
| D45 | Builds use relative asset URLs (Vite `base: './'`) so they work on github.io and on a custom domain. Builds published before this (`DuWNSrtz…`, `vPN3mLJ8…`) contain absolute `/the-best-typing-game-ever/` asset paths and do not load on the custom domain (github.io now redirects there). |
| D46 | The start screen, in-game top bar and verify page show `commit <sha7> · build <id>`, linking to the commit on GitHub. |
| D47 | Targeting: Space confirms a target (chunk + trailing Space), matching dictated levels where Space ends each word. The aimed-at label is larger and gold; the others dim. |
| D48 | Camera near/far planes are fitted tightly to the scene and the renderer uses a logarithmic depth buffer, so flat surfaces close together don't z-fight in the narrow-FOV 2D/iso views. |
| D49 | Dictated levels show the upcoming letters big, in the world, in front of the character (`src/render/glyphTrail.ts`): standing on the path in side views, painted on the road in chase views. They slide toward the character as you type; the current letter is larger and gold; typed letters pop. The HUD prompt bar stays as a secondary aid. |
| D51 | Targeting: active targets always start with different letters, so the first letter unambiguously picks one; the suggested target (aimed-at, or the keyboard's next key) is highlighted. |
