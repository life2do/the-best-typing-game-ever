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
