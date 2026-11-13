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
- **4 levels, 3 genres**: L1 pulse runner (2D), L2 side platformer (2D), L3 → dive into isometric tower defence, L4 third-person runner/racer (3D). Stages, stars, crossroads, slow-mo + shield power-ups, 1 word ability (`ask`/`flask` easter egg).
- 2 render styles + 3 palettes, 2 havocs.
- 1 complexity scale (random theme picker with at least 3 scale definitions; avatar for 1 theme with ≥ 8 slots).
- One profile (no PIN yet), seeded campaign, save/resume.
- **Basic replay**: a `/verify` page that re-plays a local run, with speed controls and a seek bar with letter marks.

Acceptance (full test matrix in [10 §6](10-simulation-and-test-harness.md#6-milestone-1-test-matrix)):
- Hash fixtures and Node-generated bot logs replay with identical snapshot hashes in Chromium, Firefox and WebKit.
- `pass` bot at tiers 1, 4 and 7 completes all 4 levels with 1★ or more within the simulated time budget; `struggle` never completes; fast-forward on/off gives identical hashes.
- 60 fps at "medium" quality on a mid-range laptop; the quality scaler steps up and down.
- The dive transition has no visible snap (Playwright visual check).

### Status (implemented on branch `claude/milestone-1-vertical-slice`)

| Item | Status |
|---|---|
| Scaffold, CI, append-only GitHub Pages deploy | ✅ (`.github/workflows/ci.yml`, `tools/publish-pages.mjs`) |
| English language pack, word lists, blocklist | ✅ |
| Typing core, layout-mismatch hint, metrics, weakness model | ✅ |
| Deterministic simulation, snapshots, input log, fast-forward | ✅ |
| Intro overlay, HUD (rhythm frame, fading keyboard), TTS | ✅ |
| Camera rig with dive/flatten transitions | ✅ (continuity unit test) |
| 4 levels / 3 genres: pulse runner, platformer, iso tower defence, 3D racer | ✅ (+ levels 5–26 reuse them via seeded slots) |
| Stages, stars, crossroads, slow-mo/shield/reveal power-ups, word abilities | ✅ (`ability.home-row-secret` appears from level 6; `jump`, `shield`, `slow` later) |
| 2 render styles, 3 palettes, 2 havocs | ✅ |
| 5 complexity scales, random picker, procedural avatars with 8 customisation slots in data | ✅ (customisation UI comes in M2) |
| One profile, seeded campaign, exact save/resume | ✅ |
| `/verify` page: verify + replay with speed controls and a letter-marked seek bar | ✅ |
| Cross-browser hash test | ✅ Chromium locally; Firefox and WebKit run in CI |
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

## Milestone 3 — Depth
- Fix-it training drills tuned with real play data (local only).
- More havocs, styles and palettes; remix and boss-rush levels; projection shuffle.
- Optional built-in TTS engine (WebAssembly).
- Additional language packs as data.
