# 05 — Determinism, replay and proofs

## Determinism rules (enforced by lint and tests)

> The normative definitions (clock, frame loop, numeric rules, canonical JSON, hashing, metrics, bot typist) are in [10](10-simulation-and-test-harness.md). This section summarises them.

1. **The simulation is separate from rendering.** Time comes only from the input log (integer ms), mapped to 60 Hz frames. In each frame, key events are processed first: a correct key gives a discrete tick plus a velocity impulse. Then one continuous decay/step runs. Frames at rest are skipped. Rendering only interpolates and never writes simulation state.
2. **All randomness** comes from `ctx.rng` (a seeded PRNG such as `sfc32`), split per subsystem (`rng.fork("drops")`). `Math.random`, `Date.now` and `performance.now` are **forbidden** in simulation code (lint rule).
3. **Integers only** in the simulation: Q16 fixed point, permille ratios, `floorDiv`, committed trig lookup tables. No `Math.sin/exp/log/sqrt/pow/round/trunc` in simulation code.
4. **Quality settings never affect the simulation.**
5. Simulation state must be **serialisable** (plain data), so snapshots are possible.

## Input log

Recorded for each campaign segment:

```
{ t: ms since segment start (delta-encoded varint), code: KeyboardEvent.code (dictionary index), down/up, player: index }
```

Compressed with deflate. A full campaign (100–200k keys) is about 0.3–0.6 MB.

## Fingerprints (content addressing everywhere)

| Fingerprint | Definition |
|---|---|
| `asset` / `item` | sha256 of manifest + files ([04](04-content-model.md)) |
| `build` | Merkle root of engine bundle hash + all content item hashes. Mapped to a git commit in `build-info.json` |
| `campaign` | sha256(build, language, orderVariant, seed, partyMode, playerSlots) |
| `snapshot` | hash of the canonical simulation state, taken every 600 frames (10 s) and at every stage/level boundary |
| `run` | hash chain: `link₀ = H(campaign)`, `linkₙ = H({prev: linkₙ₋₁, snap: H(snapshotₙ)})` |

Any state can be reconstructed from **(build, campaign seed, input log prefix)**. Snapshots make it fast.

## Builds across a campaign

- Every deploy is **immutable** under `/v/<buildHash>/`. `/` redirects to the latest build. Old builds are never deleted.
- Content-addressed assets are stored once under `/a/<hash>` and shared across builds, so storage grows only with changed files.
- A campaign is split into **segments**, one per level (or per session if the build changes mid-level). Each segment records the build hash it was played on.
- When a newer build is available, the campaign continues on the new build at the next level boundary. **Replay switches builds per segment**: the replay page loads each segment's engine from `/v/<hash>/`.

## Proof bundle

```jsonc
{
  "format": "tbtge-proof/1",
  "campaign": { "language": "en", "seed": "…", "orderVariant": 0, "partyMode": null },
  "segments": [ { "build": "sha256-…", "level": 1, "log": "<base64 deflate>", "snapshots": ["sha256-…", …] } ],
  "summary": { "tiers": [...], "stars": [...], "wpm": ..., "accuracy": ..., "durationMs": ... },
  "identity": { "mode": "none | hashed | plain", "salt": "…", "nameHash": "sha256-…", "name": "only if plain" },
  "devicePublicKey": "…",           // optional, WebCrypto ECDSA P-256 per device
  "signature": "…",                 // device signature over the run fingerprint
  "run": "sha256-…"                 // final chain hash = the fingerprint
}
```

- **Identity**: the player chooses at export: *no name*, *hidden name* (salted hash; the verifier types the name to check), or *name shown*.
- **Device signature**: proves several proofs came from the same device. It does **not** prove legitimacy.

## Shareable artifact image

- PNG of the tesseract. Its visual traits (palette, rotation axes, glyph layout, trails) are **derived from `run`**.
- A **code ring** around it encodes `run` (truncated to 128 bits) plus a format/version marker. It can be read from screenshots.
- The full proof bundle is embedded in the PNG's metadata (`iTXt` chunk `tbtge-proof`). A downloadable `.proof` file is also offered.
- A screenshot (ring only) supports **fingerprint lookup / weak check**. The original PNG or `.proof` supports **full verification**.

## Verify & Replay page (`/verify`)

Input: drop a PNG or `.proof` file, or scan the ring with the camera.

1. **Verify**: re-simulates every segment headlessly on its build. It checks each snapshot hash, the final chain hash, the summary (stars, tiers, WPM), the optional name, and the device signature. Results are shown per segment, with a green or red mark.
2. **Re-play**: shows the run visually, rendered by each segment's build:
   - play / pause, **speed controls** (0.25×–16×)
   - a **seek bar with letter marks** (one mark per level, labelled with the letter; stage ticks; star events)
   - seeking jumps to the nearest snapshot, then fast-forwards

## Known limitation (documented in the UI)

There's no server, so the proof shows **the run is internally consistent and can be replayed**. It can't show who typed it.
An auto-typing bot can produce a valid run. A timing check (distribution of gaps between keys) flags obviously robotic runs as "suspicious", but this is only a hint.

## Implemented (M2.10)

- **Fingerprint** (`src/proof/fingerprint.ts`): `link₀ = H({campaign: {language, seed}})` (language without the `lang.` prefix), then `linkₙ = H({prev, snap})` over every snapshot of every segment, levels in order and, in a hot-seat party, players in turn order.
- **Traits** (`src/proof/traits.ts`): four hues and a saturation, two distinct 4D rotation planes with speeds, the order of the 48 glyph slots (16 vertices, 32 edge midpoints) and a trail style, all read from the fingerprint bytes.
- **Code ring** (`src/proof/ring.ts`): 160 dashes clockwise from 12 o'clock — an 8-cell start mark, then version (1 byte), the first 128 bits of the fingerprint and a CRC-16 — bright for 1, dim for 0. It is read back from the PNG or from a screenshot showing the whole picture (sizes tested down to 360 px); the CRC rejects misreads.
- **Proof bundle** `tbtge-proof/1` (`src/proof/bundle.ts`): per segment the build, level, player, plan, settings for the level and the log as base64url of deflate-raw of its canonical JSON, plus snapshots; a summary (stars and tiers per level, mean best final-stage WPM and accuracy, active time) computed by re-simulation; the identity chosen at export (*no name*, *hidden name* — salted hash, checked by typing it on `/verify` —, *name shown*); and the fingerprint. The device signature is not implemented yet.
- **Artifact picture**: Canvas 2D, so it looks the same everywhere and needs no WebGL. Saved as a 1024 px PNG with the bundle in an uncompressed `iTXt` chunk `tbtge-proof` (`src/proof/png.ts`); a `.proof` file can be saved too.
- **`/verify`** opens run files, `.proof` files and PNGs. A PNG with its proof gets the full check: every segment re-simulated, the fingerprint chain, the summary, the picture's code ring against the proof, and the hidden name. A picture without a proof (a screenshot) gives the fingerprint from its ring and looks it up among this device's runs (weak check). Camera scanning is not implemented.
- **Per-build verification**: on the published site, segments recorded on another build are sent to that build's verify page running as an engine (`/v/<id>/verify/?engine=1` in a hidden frame, same-origin `postMessage`), which re-simulates them on the engine that recorded them; the page says so. Builds from before M2.10 have no engine mode, so their segments fall back to the current build with a note, as before.

