# AGENTS.md — extending the game

This repo is designed to be extended by AI agents (and humans). Read [docs/04-content-model.md](docs/04-content-model.md)
and [docs/05-determinism-replay-proofs.md](docs/05-determinism-replay-proofs.md) first.

## Golden rules

1. **Everything is content.** Add a folder under `content/<type>/<id>/`. Don't edit engine registries; discovery is automatic.
2. **Every item has**: a manifest valid against `schemas/<type>.schema.json`, a `description`, a `PROMPT.md` (or inline `prompt`) good enough to **regenerate or improve** the item from scratch, an SPDX `license`, and a test.
3. **Never hand-write `hash` fields.** The build computes them. Never reference assets by path across items; use `id@version` (resolved to content hashes).
4. **Determinism** (normative rules in [docs/10](docs/10-simulation-and-test-harness.md)): in simulation code use `ctx.rng` only; integers only (Q16 / permille / `floorDiv`); no `Math.random`, `Date.now`, `performance.now`, `Math.sin/exp/log/sqrt/pow/round/trunc`; no per-frame counters (use frame stamps); no reading render state. State must be serialisable, canonical JSON.
5. **Havoc changes the world, never input.** Don't remap, hide or delay keys.
6. **Kid-safe**: non-violent wording and visuals; words come only from curated lists and must pass the blocklist.
7. **Always provide fallbacks**: assets declare a `fallback`; havocs and styles provide reduced-motion / lite variants.
8. **Default license** for generated content is `CC0-1.0`.

## Recipes

### Add a level template
1. `content/templates/<id>/manifest.json` (schema: `level-template.schema.json`): `minLetters`, `inputMode`, `views`, `stages`, tags, `entry: "sim.ts"`.
2. `sim.ts` — default export `TemplateSim` (`src/sim/types.ts`): deterministic, integer-only, Node-safe (no Three.js). `step()` must be a no-op when `isAtRest()` and `ctx.v === 0`.
   `view.ts` — default export `TemplateView` (`src/render/types.ts`): Three.js scene built from the sim state, plus intro `rules`. Views never write simulation state.
3. `PROMPT.md`: genre, core loop, how ticks/reveal/speed map to the world, art notes, havocs it supports.
4. `template.test.ts`: run `sim` with the `pass` bot at tiers 1, 4 and 7 (must complete with ≥ 1★ within budget), with `struggle` (must not complete) and `masher` (no crash), and twice with the same seed (identical snapshot hashes).
5. CI tests every template in its own job (simulation tests + `e2e/templates.spec.ts` browser smoke test in each view); a new folder is picked up automatically, and a PR that only touches your template runs only its job (`node tools/affected.mjs --files <paths>` shows the plan).
6. Preview: `npm run dev`, then `/dev/preview/?template=<id>&letters=fjdk&style=<id>&palette=<id>&seed=1&tier=4` (add `&bot=pass` to let the bot type).

### Add a render style / palette / havoc
Same pattern: manifest + code (`style.ts` default-exporting `RenderStyle`, `havoc.ts` default-exporting `HavocVisual`, see `src/render/types.ts`) + `PROMPT.md`. Palettes are a single JSON file in `content/palettes/`. Tests: screenshot test for styles; intensity 0/0.5/1 test for havocs (planned).

### Add a language
1. `content/languages/<id>/manifest.json`: alphabet, `layout` (physical `code` → char, finger, row), `order` (+ variants), `keyGroups`, UI and TTS strings.
2. `words/*.txt` per tag (`ability:jump`, `common`, `easter-egg`) and `blocklist.txt`.
3. `content/campaign/<id>.json`: slot constraints for that alphabet length.
4. Run `npm run validate` (checks every ability has ≥ 1 trigger word typeable by its target slot).

### Add a complexity scale (start-screen theme + avatar)
`content/scales/<id>/manifest.json`: 7 steps (localised names, TTS line, model asset ref, rig hooks), ≥ 8 customisation slots with ranges and star unlocks.

### Add a word illustration
`content/illustrations/<word>/manifest.json` (schema: `illustration.schema.json`: `words` per language, `entry`, `animation`, `fallbackEmoji`) + `art.svg`: viewBox `0 0 100 100`, plain shapes only (no inline styles, scripts or links), fillable shapes get class `f1`–`f4` (palette colours, filled when the word completes). The word must be in the language's word lists. Words without a drawing can map to an emoji in the language pack's `wordEmoji`.

### Add an asset
Add the file next to its item plus `<name>.asset.json` (schema: `asset-manifest.schema.json`) with `kind`, `description`, `prompt`, `license`, `fallback`.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | dev server |
| `npm run validate` | schemas, licenses, word blocklist, slot feasibility |
| `npm run sim -- --template X --tier 4 --profile pass --seed 1` | headless deterministic run with bot typist (profiles: see docs/10 §5) |
| `npm test` | unit + simulation tests |
| `npm run e2e` | Playwright: cross-browser determinism + game flow (`npm run e2e -- --project=chromium --trace off` locally) |
| `npm run check` | lint + typecheck + validate + tests |
| `npm run build` | build + content hashes + `build-info.json` |
