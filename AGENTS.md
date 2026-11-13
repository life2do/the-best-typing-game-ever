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
1. `content/templates/<id>/manifest.json` (schema: `level-template.schema.json`): `minLetters`, `inputMode`, `views`, `stages`, tags.
2. `index.ts` exporting a `LevelTemplate` (see `docs/08-architecture.md`).
3. `PROMPT.md`: genre, core loop, how ticks/reveal/speed map to the world, art notes, havocs it supports.
4. `template.test.ts`: run `sim` with the `pass` bot at tiers 1, 4 and 7 (must complete with ≥ 1★ within budget), with `struggle` (must not complete) and `masher` (no crash), and twice with the same seed (identical snapshot hashes).
5. Preview: `/dev/preview?template=<id>&letters=fjdk&style=<id>&palette=<id>&seed=1`.

### Add a render style / palette / havoc
Same pattern: manifest + code/shader + `PROMPT.md` + test (screenshot test for styles; intensity 0/0.5/1 test for havocs).

### Add a language
1. `content/languages/<id>/manifest.json`: alphabet, `layout` (physical `code` → char, finger, row), `order` (+ variants), `keyGroups`, UI and TTS strings.
2. `words/*.txt` per tag (`ability:jump`, `common`, `easter-egg`) and `blocklist.txt`.
3. `content/campaign/<id>.json`: slot constraints for that alphabet length.
4. Run `npm run validate` (checks every ability has ≥ 1 trigger word typeable by its target slot).

### Add a complexity scale (start-screen theme + avatar)
`content/scales/<id>/manifest.json`: 7 steps (localised names, TTS line, model asset ref, rig hooks), ≥ 8 customisation slots with ranges and star unlocks.

### Add an asset
Add the file next to its item plus `<name>.asset.json` (schema: `asset-manifest.schema.json`) with `kind`, `description`, `prompt`, `license`, `fallback`.

## Commands (planned, milestone 1)

| Command | Purpose |
|---|---|
| `npm run dev` | dev server |
| `npm run validate` | schemas, licenses, word blocklist, slot feasibility |
| `npm run sim -- --template X --tier 4 --profile pass --seed 1` | headless deterministic run with bot typist (profiles: see docs/10 §5) |
| `npm test` | unit + simulation tests |
| `npm run e2e` | Playwright (use `--trace off`) |
| `npm run build` | build + content hashes + `build-info.json` |
