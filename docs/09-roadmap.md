# 09 — Roadmap

## Milestone 0 — Specification (this commit)
Docs, schemas, `AGENTS.md`.

## Milestone 1 — Vertical slice (English)

Scope:
- Project scaffold (Vite + TS + Three.js), CI, versioned GitHub Pages deploy.
- **English language pack** (QWERTY finger map, full key order, curated word lists with blocklist).
- Typing core: input capture by physical code, layout mismatch hint, metrics (accuracy, net WPM, rhythm), weakness model.
- Deterministic simulation: seeded RNG, fixed-step ticks, serialisable state, snapshots, input log.
- **Intro overlay** (keyboard, hand position, rules, TTS) and **HUD** (rhythm frame, fading keyboard overlay).
- **Camera rig** with 2D → isometric → 3D dive/flatten transitions.
- **4 levels, 3 genres**: L1 pulse runner (2D), L2 side platformer (2D), L3 → dive into isometric tower defence, L4 third-person runner/racer (3D). Stages, stars, crossroads, slow-mo + shield power-ups, 1 word ability (`ask`/`flask` easter egg — its letters are all known from level 6, so it first appears there; see Status).
- 2 render styles + 3 palettes, 2 havocs.
- 1 complexity scale (random theme picker with at least 3 scale definitions; avatar for 1 theme with ≥ 8 slots).
- One profile (no PIN yet), seeded campaign, save/resume.
- **Basic replay**: a `/verify` page that re-plays a local run, with speed controls and a seek bar with letter marks.

Acceptance (full test matrix in [10 §6](10-simulation-and-test-harness.md#6-milestone-1-test-matrix)):
- Hash fixtures and Node-generated bot logs replay with identical snapshot hashes in Chromium, Firefox and WebKit.
- `pass` bot at tiers 1, 4 and 7 completes all 4 levels with 1★ or more within the simulated time budget; `struggle` never completes; fast-forward on/off gives identical hashes.
- 60 fps at "medium" quality on a mid-range laptop; the quality scaler steps up and down.
- The dive transition has no visible snap (Playwright visual check).

### Status (on `main`)

| Item | Status |
|---|---|
| Scaffold, CI, append-only GitHub Pages deploy | ✅ (`.github/workflows/ci.yml`, `tools/publish-pages.mjs`) |
| English language pack, word lists, blocklist | ✅ |
| Typing core, layout-mismatch hint, metrics, weakness model | ✅ |
| Deterministic simulation, snapshots, input log, fast-forward | ✅ |
| Intro overlay, HUD (rhythm frame, fading keyboard), TTS | ✅ |
| Camera rig with dive/flatten transitions | ✅ (continuity unit test + Playwright frame-by-frame visual check; the world swap is hidden by a short fade) |
| 4 levels / 3 genres: pulse runner, platformer, iso tower defence, 3D racer | ✅ (+ levels 5–26 reuse them via seeded slots) |
| Stages, stars, crossroads, slow-mo/shield/reveal power-ups, word abilities | ✅ — deviation: the `ask`/`flask` easter egg (`ability.home-row-secret`) needs S and L, so it can't appear in levels 1–4 (F J D K); it appears from level 6. `jump`, `shield`, `slow` come later |
| 2 render styles, 3 palettes, 2 havocs | ✅ |
| 5 complexity scales, random picker, procedural avatars with 8 customisation slots in data | ✅ (customisation UI comes in M2) |
| One profile, seeded campaign, exact save/resume | ✅ |
| Weakness model + fix-it drill (D9) | ✅ weak keys weighted up in text; one-minute drill offered at most once per level ([01](01-pedagogy.md#weakness-detection)) |
| `/verify` page: verify + replay with speed controls and a letter-marked seek bar | ✅ |
| Cross-browser hash test | ✅ Chromium, Firefox and WebKit in CI |
| Dive transition: no visible snap | ✅ `e2e/diveTransition.spec.ts` (Chromium and WebKit in CI; skipped in Firefox, which has no WebGL on the CI runners) |
| "60 fps at medium on a mid-range laptop" | ⏳ needs a check on real hardware (CI only has software WebGL) |

## Milestone 2 — Breadth & proofs
- Remaining English letters (26 levels) and key groups; template library to ~15 genres.
- **Russian language pack**.
- Multiple profiles, PIN pad, export/import.
- Hot seat: Coop, Side by side, Companions.
- Artifact (tesseract) with scratch reveal, fingerprint visuals, code ring, PNG proof embed, full verifier with per-segment builds.
- Local analytics screen.
- All 13 complexity scales, avatar customisation ≥ 50 options per theme.
- Accessibility settings complete; break reminder; parent area.
- Voice effects as collectibles.

### Plan (one pull request per step, in this order)

Each step ends with `npm run check`, the e2e suite and an update of this table. Every new game is its own
commit with its own `template (<id>)` CI job (D64). Steps are ordered by dependency: profiles before hot seat,
key groups before the full campaign, all games and languages before the artifact.

| Step | Scope | Acceptance |
|---|---|---|
| **M2.0 Per-change CI** | `plan` job runs only what a change affects; one CI job per game; changed-file lint; dependency audit (D64) | Docs-only PR runs no tests; a one-template PR runs only that template's job; main runs everything |
| **M2.1 Profiles** | Several profiles per device, profile picker, colour + shape PIN pad (lock, not security), export/import (JSON with run segments), storage schema v2 + migration from M1 saves | Two profiles keep separate campaigns, stats and settings; a PIN-locked profile asks for its PIN; export → import on a fresh browser restores profile + runs, and the runs verify; M1 saves load unchanged |
| **M2.2 Key groups** | Shift/capitals ("giant mode"), `. ,`, `' / ? !`, digits 1–5, 6–0, symbols `- = ( ) : "`, `Backspace Enter Tab` as levels 27–33; input capture for Shift and editing keys; campaign slots for all 33 English levels | `pass` bot completes levels 27–33 at tiers 1/4/7; `validate` checks every key group is typeable; Backspace only becomes trainable in its own level |
| **M2.3 Genre library** | 11 new templates to reach 15 genres, following the reference arc ([03](03-campaign-and-levels.md)): brick-breaker, maze snake, bubble-popper (targeting), garden grower, word city (iso), marble run (iso), dungeon crawler (iso), beat-wave surfing (3D), crystal-zapper gallery (FPV, targeting), space-tunnel flight (FPV), climbing tower (3D) | Each template passes its own suite (`pass` 1/4/7 ≥ 1★, `struggle`, `masher`, determinism) and its browser smoke test in every view; campaign fills levels 5–26 without repeating a template within 3 slots |
| **M2.4 Russian** | ЙЦУКЕН language pack (layout by physical code, key order + variants, words, blocklist, UI and TTS strings), Russian campaign with the view arc stretched to 33 letters, language picker with layout-mismatch hint | `validate` passes for `ru`; `pass` bot completes Russian levels 1–4; the same physical keys work under an English OS layout |
| **M2.5 Scales and avatars** | All 13 complexity scales; avatar customisation screen with ≥ 8 slots and ≥ 50 options per theme, value ranges unlocked by stars | Every scale validates; customisation changes the in-game avatar and persists; locked options show their star requirement |
| **M2.6 Analytics** | Local stats screen: WPM/accuracy over time, steadiness trend, keyboard heatmap (error rate + latency per key), stars per tier, tier history, time played, words and abilities | Numbers match the stored segments; included in profile export |
| **M2.7 Accessibility + parent area** | Reduced motion everywhere, colour-blind patterns, dyslexia / high-legibility fonts, text size, high contrast, volume sliders; parent area behind an adult check (break interval, session limit, profile management) | Each setting has a visible effect and persists; the adult check gates the parent area |
| **M2.8 Voice effects** | Collectible voice effects (voice, pitch, speed presets such as chipmunk and giant) unlocked by the `voice` word and similar | Collected effects appear in settings and change TTS; fallback text + icon when no voice exists |
| **M2.9 Hot seat** | Party setup (2–4 profiles, PINs asked at start), Coop, Side by side and Companions modes, handover overlay, per-player input streams, shared result screen | Each mode completes with 2 bot players; stats go to each profile; party runs replay and verify |
| **M2.10 Artifact and proofs** | Tesseract renderer with scratch reveal per letter, fingerprint → visual traits, code ring encode/decode, proof bundle embedded in the PNG (iTXt), full verifier that loads each segment on its own build | A finished run renders its artifact; the PNG re-verifies on `/verify`; the code ring decodes to the fingerprint; old segments replay on their recorded build |

### M2 status

| Step | Status |
|---|---|
| M2.0 Per-change CI | ✅ |
| M2.1 Profiles | ✅ |
| M2.2 Key groups | ✅ |
| M2.3 – M2.10 | planned |

## Milestone 3 — Depth
- Fix-it training drills tuned with real play data (local only).
- More havocs, styles and palettes; remix and boss-rush levels; projection shuffle.
- Optional built-in TTS engine (WebAssembly).
- Additional language packs as data.
