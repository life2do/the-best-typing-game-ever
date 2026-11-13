# The Best Typing Game Ever

A browser game (GitHub Pages, no backend) that teaches **touch typing** to players aged 7 to 99.
Every new key unlocks a new level, a new genre and a new kind of havoc. The world moves only when you type.
Collect every alphabet to unlock a **multidimensional artifact** (a tesseract) with your run's verifiable fingerprint encoded in it.

> Status: **milestone 1 (vertical slice, English)** — playable levels, deterministic simulation, replay & verify page. See [docs/09-roadmap.md](docs/09-roadmap.md).

## Run it

```bash
npm install
```

```bash
npm run dev
```

Open the printed URL. Other useful commands:

| Command | What it does |
|---|---|
| `npm run check` | lint, typecheck, content validation, unit + simulation tests |
| `npm run e2e -- --project=chromium --trace off` | browser tests (cross-browser hashes, full game flow) |
| `npm run sim -- --level 3 --tier 4 --profile pass --seed 1` | headless run with the bot typist |
| `npm run build` | production build with build fingerprint |

Dev preview of any template: `/dev/preview/?template=racer&letters=fjdks&bot=pass`. Replays: `/verify/`.

## Specification

| Doc | Contents |
|---|---|
| [docs/00-vision.md](docs/00-vision.md) | Pitch, pillars, audience, glossary |
| [docs/01-pedagogy.md](docs/01-pedagogy.md) | Teaching method, key order (EN/RU), tiers & benchmarks, metrics, fix-it training |
| [docs/02-core-gameplay.md](docs/02-core-gameplay.md) | Keystroke-driven world, rhythm, mistakes, stages, stars, power-ups, words & abilities |
| [docs/03-campaign-and-levels.md](docs/03-campaign-and-levels.md) | Campaign slots, seeded randomisation, the 26-level arc, key groups, transitions, the artifact |
| [docs/04-content-model.md](docs/04-content-model.md) | Content types, asset manifests, content addressing, licenses |
| [docs/05-determinism-replay-proofs.md](docs/05-determinism-replay-proofs.md) | Determinism rules, input log, snapshots, fingerprints, replay & verify page |
| [docs/06-multiplayer.md](docs/06-multiplayer.md) | Hot seat: Coop, Side-by-side, Companions |
| [docs/07-ux-profiles-accessibility.md](docs/07-ux-profiles-accessibility.md) | Start screen, complexity scales, avatar, profiles/PIN, overlays, HUD, TTS, accessibility, analytics |
| [docs/08-architecture.md](docs/08-architecture.md) | Tech stack, modules, interfaces, rendering & camera, audio, storage, builds |
| [docs/09-roadmap.md](docs/09-roadmap.md) | Milestones and acceptance criteria |
| [docs/10-simulation-and-test-harness.md](docs/10-simulation-and-test-harness.md) | **Normative**: clock/tick model, integer numerics, canonical JSON & hashing, metrics, bot typist, M1 test matrix |
| [docs/decisions.md](docs/decisions.md) | Decision log from the spec discussion |
| [AGENTS.md](AGENTS.md) | How AI agents (and humans) extend the game |
| [schemas/](schemas/) | JSON Schemas for all content and save data |

## License

Code: MIT (see [LICENSE](LICENSE)). Original content: CC0-1.0 unless the asset manifest says otherwise.
