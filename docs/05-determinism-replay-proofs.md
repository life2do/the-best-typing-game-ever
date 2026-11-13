# 05 — Determinism, replay and proofs

## Determinism rules (enforced by lint and tests)

1. **The simulation is separate from rendering.** The simulation runs on logical ticks (one per correct key) plus a fixed-step ease substep (60 Hz logical time from recorded key timestamps). Rendering only interpolates and never writes simulation state.
2. **All randomness** comes from `ctx.rng` (a seeded PRNG such as `sfc32`), split per subsystem (`rng.fork("drops")`). `Math.random`, `Date.now` and `performance.now` are **forbidden** in simulation code (lint rule).
3. **Floating point**: simulation maths avoids platform-dependent functions in branching logic, or uses fixed-point helpers for anything that affects outcomes (scores, stars, unlocks).
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
| `snapshot` | sha256(canonical simulation state), taken every 10 s of play and at every stage/level boundary |
| `run` | hash chain: `H(campaign) → H(snapshot₁) → … → H(final)` |

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
