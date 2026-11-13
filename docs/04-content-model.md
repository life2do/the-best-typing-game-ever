# 04 — Content model

Everything that isn't engine code is **content**: data or a small plugin, with a manifest, a JSON Schema, a
generation prompt, a license and a test. Content is **content-addressed**: an item's identity is the hash of its
bytes plus its manifest.

## Content types

| Type | Folder | Schema | Code? |
|---|---|---|---|
| Language pack | `content/languages/<id>/` | `language-pack.schema.json` | no |
| Level template | `content/templates/<id>/` | `level-template.schema.json` | yes (`index.ts`) |
| Render style | `content/styles/<id>/` | `render-style.schema.json` | yes (shaders/materials) |
| Palette | `content/palettes/<id>.json` | `palette.schema.json` | no |
| Havoc | `content/havocs/<id>/` | `havoc.schema.json` | yes |
| Ability | `content/abilities/<id>.json` | `ability.schema.json` | optional hook |
| Power-up | `content/powerups/<id>.json` | `powerup.schema.json` | optional hook |
| Complexity scale | `content/scales/<id>/` | `complexity-scale.schema.json` | no |
| Voice effect | `content/voices/<id>.json` | `voice-effect.schema.json` | no |
| Campaign rules | `content/campaign/<lang>.json` | `campaign-rules.schema.json` | no |
| Party mode | `content/party/<id>.json` | `party-mode.schema.json` | no |
| Asset | anywhere, referenced by hash | `asset-manifest.schema.json` | — |

## Common manifest fields (every content item and asset)

```jsonc
{
  "id": "template.pulse-runner",          // stable, human-readable
  "kind": "level-template",
  "version": 3,
  "description": "Side-scrolling runner in darkness; each correct key is a heartbeat lighting the path.",
  "prompt": "PROMPT.md",                   // or inline string: how to (re)generate/improve this item
  "license": "CC0-1.0",                    // SPDX id, required
  "authors": ["agent:claude", "human:life2do"],
  "generator": { "tool": "claude-code", "notes": "..." },
  "tags": ["2d", "dictated", "calm"],
  "refs": { "music": "asset:sha256-…" },   // dependencies, by content hash
  "hash": "sha256-…"                       // computed at build time, never hand-written
}
```

`hash` is computed by the build as `hash({ manifest: <manifest without hash>, files: { <path>: <file hash> } })`, using RFC 8785 canonical JSON with NFC-only strings and LF line endings. The byte-exact definition is in [10 §3](10-simulation-and-test-harness.md#3-canonical-json-and-hashing).
Changing any byte changes the hash. Old hashes stay resolvable in old builds (see [05](05-determinism-replay-proofs.md)).

## Asset manifests

```jsonc
{
  "id": "style.ink-outline.pass",
  "kind": "static-image | vector | video | procedural | shader | audio | font | mesh",
  "description": "Hand-inked outline post-pass, 2 px, slight wobble",
  "prompt": "Write a GLSL post-processing fragment shader that ...",
  "license": "CC0-1.0",
  "source": "./ink-outline.glsl",
  "fallback": "procedural:flat-outline",   // must always resolve; used if source fails or is removed
  "metadata": { "width": null, "durationMs": null, "params": { "thickness": [1, 4] } },
  "hash": "sha256-…"
}
```

- **Static**: PNG/WebP/SVG. **Dynamic**: video (WebM). **Programmatic**: procedural generators (TS), shaders (GLSL), vector paths.
- Every asset **must declare a procedural fallback** so that removing or replacing art never breaks a level.
- Replacing an asset = adding a new manifest with the same `id` and a higher `version`. Content refers by `id@version` in source; the build resolves to hashes.

## Licenses

| Content | License |
|---|---|
| Engine code | MIT (repo `LICENSE`) |
| Original and AI-generated assets, word lists, data | **CC0-1.0** (default) |
| Fonts | SIL OFL-1.1 (e.g. Atkinson Hyperlegible, OpenDyslexic) |
| Third-party assets | their own SPDX id, plus `attribution` field when required |

CI **rejects** any item without a valid SPDX `license`, and lists attributions in a generated `CREDITS.md`.

## Complexity scales (start screen + avatar themes)

Each scale has 7 steps (one per tier). Shipped set:

| Theme | 1 → 7 |
|---|---|
| 🤖 Robot | simple robot → … → complex transformer |
| 🧒 Human | toddler → kid → teen → athlete → ninja → master → old wise kung-fu master |
| 🌸 Flowers | seed → sprout → bud → flower → bush → garden → bouquet |
| 🐉 Dragon | egg → hatchling → whelp → drake → wyvern → elder → cosmic dragon |
| 🚲 Vehicles | tricycle → bicycle → scooter → car → race car → jet → starship |
| 🪐 Cosmos | pebble → asteroid → moon → planet → star → nebula → galaxy |
| 🐟 Ocean | plankton → shrimp → fish → dolphin → shark → whale → kraken |
| 🔥 Light | spark → candle → lantern → bonfire → lightning → sun → supernova |
| 🏠 Buildings | tent → hut → house → castle → skyscraper → space station → floating city |
| 🐱 Cats | kitten → house cat → lynx → leopard → lion → tiger → sphinx |
| 🎵 Music | note → drum → guitar → band → orchestra → stadium → cosmic choir |
| ⛵ Ships | raft → canoe → sailboat → brigantine → galleon → flagship → sky airship |
| ⛅ Weather | dewdrop → raindrop → cloud → shower → storm → tornado → aurora |

Each step: localized name, TTS line, avatar model reference, rig hooks. Each scale defines **customisation slots**
(≥ 8 slots; value ranges unlocked by stars). This gives ≥ 50 options per theme. See `complexity-scale.schema.json`.

## Avatar rig hooks (required for every scale)

`idle`, `move`, `jump`, `land`, `stumble`, `celebrate`, `powerup`, `ability:<id>`. Abstract avatars (clouds, galaxies)
implement them with procedural squash, stretch, spin and particles. Abilities depend only on hooks, never on a specific model.
