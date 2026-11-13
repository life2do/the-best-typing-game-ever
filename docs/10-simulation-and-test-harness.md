# 10 — Simulation clock, numerics, hashing, metrics and the bot typist

This document is **normative**. Where other docs are vaguer, this one wins. Everything in `src/sim/`, `src/core/hash*`,
`src/typing/metrics*` and `tools/bot/` must follow it exactly, because content hashes, snapshot equality across
browsers, and the milestone 1 acceptance tests all depend on it.

---

## 1. Simulation clock and tick model

### 1.1 Time base

- The **only** time source for the simulation is the **input log**. Each event carries `t`: an integer number of milliseconds since the segment started.
- Live play: the input layer stamps `keydown` with `Math.round(performance.now() - segmentStart)`, **appends the event to the log first**, and then the simulation consumes it from the log. Live play and replay are therefore the same code path.
- `state.simT` changes **only when a logged event is fed**, never in `advanceTo`, so the state does not depend on how often the live loop advanced time between keys.
- When the simulation takes a stage/level snapshot and emits an event at the same moment, it **snapshots first**, so listeners that save on that event see the complete chain.
- Simulation time is counted in **frames** at a fixed 60 Hz: `frameOf(t) = floor(t * 3 / 50)` (exact integer maths, as 60/1000 = 3/50).
- Rendering runs at any rate. It reads the simulation state at frames `f` and `f+1`, interpolates by wall-clock time, and **never writes** simulation state.

### 1.2 Event types in the log

| Type | Fields | Meaning |
|---|---|---|
| `key` | `t, code, player` | A `keydown` that passed the input filter (§4.1) |
| `pause` / `resume` | `t` | Tab hidden, menu opened, handover screen. Frames don't advance while paused. |
| `segment-end` | `t` | Level left or finished |

`keyup` isn't recorded (no M1 mechanic uses it).

### 1.3 Frame loop (one definition, used everywhere)

For each frame `f` from the current frame to the target frame:

```
1. For every event e with frameOf(e.t) == f, in log order:
     result = typing.judge(e)            // correct | error | ignored (§4.1)
     metrics.record(e, result)           // integer metrics (§4)
     if result == correct:
         level.onTick(e)                 // DISCRETE step: move one cell, fire, place a letter...
         motion.impulse(speedMul)        // set velocity for continuous motion
     if result == error:
         level.onError(e)                // stumble, fog bump; NO tick
2. motion.decay()                        // continuous part, exactly once per frame
3. level.step(f)                         // template's continuous update, integer maths only
4. if f % 600 == 0 or at stage/level boundary: snapshot()
```

- **Tick** = the discrete step for a correct key (`onTick`). Turn-based templates (the dungeon crawler) use only this.
- **Continuous motion** (runner, racer) uses a single velocity `v`, in Q16 fixed point (§2):
  - `impulse`: `v = max(v, vBase * speedMulPermille / 1000)`
  - `decay` (once per frame): `v = v - floorDiv(v * 15, 128)`, then `if v < V_EPS: v = 0`
  - Each frame multiplies `v` by 113/128 ≈ 0.883, so after 24 frames (400 ms) `v` is about 5% of its starting value. This is the "eases to a stop in ~400 ms" from doc 02.
- `speedMulPermille` is recomputed at each correct key from rhythm steadiness (§4.4): `600 + 1400 * steadinessPermille / 1000`, giving 600–2000 (0.6×–2.0×).

### 1.4 Rest and fast-forward

- The world is **at rest** when `v == 0` and `level.isAtRest()` returns true (no pending animations in the simulation).
- **No per-frame counters.** All "since" values are stored as frame stamps (`restSince = f`, `powerupEnds = f + 900`). This makes a frame at rest a no-op, so the loop may **jump straight to the next event's frame** when at rest. The result is identical by construction, and a 10-minute idle replays in O(1).
- Time-based effects must be scheduled as frame stamps. A frame where one fires counts as an event frame and is never skipped.
- The idle hint (doc 02, after 5 s) is **derived**: `atRest && f - restSince >= 300`. It's rendered, never stored.

### 1.5 Serialisable state

State = plain data: `{ frame, rng: {name: [u32,u32,u32,u32]}, motion: {v}, metrics, level: <template state>, powerups, stage, ... }`.
No class instances, `Map`/`Set`, floats, `undefined` or functions (see §2 and §3).

---

## 2. Numeric rules for simulation code

1. **Integers only** in simulation state and in any computation that affects state. Each value must stay within `±2^53`.
2. Fixed point: positions and velocities in **Q16** (1.0 = 65536). Ratios in **permille** (1000 = 1.0).
3. Division only through `floorDiv(a, b)` (floor toward −∞). Never `/` without it, and never `Math.round` (rounding of .5 differs between helpers). `Math.trunc` is forbidden in simulation code.
4. Trigonometry and other transcendental functions come from **committed integer lookup tables** (`src/core/tables/sin4096.json`, generated once and committed). `Math.sin`, `Math.exp`, `Math.log`, `Math.sqrt` and `Math.pow` are **forbidden in simulation code** (results may differ between JS engines). They're allowed in rendering.
5. Integer square root, if needed, comes from `isqrt` (Newton's method on integers).
6. RNG: `sfc32`, with state as 4 × uint32. `rng.int(n)` uses rejection sampling for an unbiased result. Subsystems call `rng.fork(name)`, seeded from `sha256(parentSeed + ":" + name)` (first 16 bytes).
7. A lint rule (`no-restricted-globals` / `no-restricted-properties`) enforces 3–6 in `src/sim/**`, `src/typing/**`, `content/templates/**/sim*.ts` and `tools/bot/**`.

---

## 3. Canonical JSON and hashing

### 3.1 Canonical JSON = RFC 8785 (JCS) plus restrictions

Serialisation follows **RFC 8785 JSON Canonicalization Scheme**:
- object keys sorted by **UTF-16 code units**, applied recursively
- no whitespace
- numbers serialised as ECMAScript `Number.prototype.toString` (the shortest representation that converts back to the same value; identical in every engine)
- strings: minimal JSON escaping as in RFC 8785 §3.2.2.2

**Restrictions, enforced by `canonicalize()`, which throws on violation:**

| Rule | Applies to |
|---|---|
| No `NaN`, `Infinity`, `-0` | everything |
| No `undefined`, functions, symbols, `BigInt`; no sparse arrays | everything |
| **Integers only** (safe range) | simulation state, snapshots, input logs |
| Strings must already be **Unicode NFC**. `canonicalize` checks `s === s.normalize("NFC")` and throws if not, rather than normalising silently. `npm run validate` reports the offending file. | everything |
| Floats allowed (shortest form converting back to the same value) | content manifests only (e.g. `"pitch": 0.3`) |

### 3.2 Hash encoding

`hash(x) = "sha256-" + base64url_nopad(SHA-256(utf8(canonicalJSON(x))))`, which is 43 characters after the prefix and matches `schemas/common.schema.json#/$defs/hash`.
SHA-256 uses WebCrypto in browsers and `node:crypto` in Node. Both are tested against the same fixtures.

### 3.3 What gets hashed

| Fingerprint | Input to `hash()` |
|---|---|
| File | Not JSON: `"sha256-" + base64url(SHA-256(raw bytes))`. Text files are committed with **LF** line endings (`.gitattributes: * text=auto eol=lf`), so the bytes are the same on every OS. |
| Content item | `{ manifest: <manifest without "hash">, files: { "<posix relative path, NFC>": <file hash>, ... } }` |
| Build | `{ engine: <hash of each bundle file, by path>, items: { "<id>@<version>": <item hash>, ... } }` |
| Snapshot | the serialisable state (§1.5) |
| Campaign | `{ build, language, orderVariant, seed, partyMode, players }` |
| Run chain | `link_0 = campaign hash`, then for each snapshot in order `link_n = hash({ prev: link_{n-1}, snap: snapshot hash })`; `run = last link` |

Test fixtures in `tests/fixtures/hash/*.json` include inputs with Cyrillic, emoji, escapes, nested key ordering and floats, each with its expected hash. Node, Chromium, Firefox and WebKit must all produce them.

---

## 4. Typing metrics

### 4.1 Judging a keystroke

Each `keydown` goes through a filter, then a judge:

| Input | Result |
|---|---|
| `event.repeat == true` (key held down), IME composition, dead key | **dropped** (not logged) |
| Modifier or system key on its own: Shift, Ctrl, Alt, Meta, CapsLock, Fn, F1–F12, Escape (Escape opens the pause menu and logs a `pause` event) | **dropped** (Escape → `pause` event) |
| Shift in key-group levels where capitals are taught | Shift state is recorded as part of the key event (`code` + `shift` flag) |
| Expected key (physical `code` maps to the expected character for the current prompt position) | **correct**: advances the prompt by one character |
| Any other logged key (wrong letter, a not-yet-learned letter, Space when not expected, Backspace before it's taught) | **error**: the prompt does **not** advance |

There is no Backspace and an error never advances, so **every error is effectively corrected immediately**: the player must still type the expected key.

### 4.2 Counts

- `correct` = keystrokes judged correct (each one advances exactly one character; Space counts as a character)
- `errors` = keystrokes judged error. **Each wrong keystroke counts**: three wrong presses before the right key = 3 errors.
- `missedPositions` = prompt positions with ≥ 1 error before the correct key. Used for per-key weakness and the stage report, **not** for accuracy.
- Targeting mode: a keystroke is correct if it extends the prefix of any active target (choosing a target counts as its first correct character). Otherwise it's an error.

### 4.3 Speed and accuracy

- **Active time** `T` (ms) = the sum of intervals between consecutive logged keys within the measured window, **each capped at `cap = max(2000 ms, 3 × the level's target interval)`** (target interval = 12000 ÷ target WPM), plus 0 for the first key. A fixed 2 s cap would inflate speed for tier-1 beginners, whose normal gap (≈ 2.4–4 s) is longer than 2 s. Pauses and handovers aren't included. Long reading or idle gaps therefore don't reduce speed, and steady typing is measured accurately.
- **Gross speed** `WPM = floorDiv(correct * 12000, T)`. That is (correct ÷ 5) ÷ (T ÷ 60000), and it's the same as net WPM in this game.
- **Net WPM = gross WPM.** The classic formula subtracts *uncorrected* errors, and with forced correction there are none. Errors already cost speed, because the time spent on wrong keys is in `T`. Doc 01's "net WPM" refers to this definition.
- **Accuracy** `accPermille = floorDiv(correct * 1000, correct + errors)`. Accuracy is a **separate** star requirement, so errors are penalised twice: through time (speed) and directly (accuracy).
- Windows: the HUD uses the last 30 logged keys. Stage results use the whole stage.

### 4.4 Rhythm steadiness

Over the last 12 intervals between **correct** keys (intervals capped with the same `cap` as §4.3; fewer than 4 intervals → steadiness 500):

```
m   = median(intervals)                                        // integer; lower median for even counts
mad = floorDiv(sum(|i - m|), count)                            // mean absolute deviation from the median
steadinessPermille = clamp(1000 - floorDiv(1000 * mad, m), 0, 1000)
```

This uses no square roots and depends only on the player's own tempo, so a slow, steady 7-year-old and a fast adult both score high.
The doc 02 phrase "1 − coefficient of variation" is implemented with this formula.

### 4.5 Stage and level results

- A stage has a fixed **prompt length** (template manifest: e.g. 60/80/100/120 characters for stages 1–4).
- Stage stars: `1★` if `WPM ≥ target(level, tier)` **and** `accPermille ≥ tierAcc`; `2★` if `WPM ≥ 1.2 × target`; `3★` if `WPM ≥ 1.4 × target` **and** median steadiness ≥ 700. Accuracy is required for every star.
- Stages 1..N−1 always advance when their prompt is finished (difficulty ramps up whatever the result).
- **The final stage repeats** with fresh text until it meets the player's target stars. **Level stars = best result of the final stage.** The crossroads appears once the target is met.

---

## 5. Bot typist

The bot generates **input logs**. It never calls the simulation directly. Its output goes through exactly the same path as a recorded human run.

### 5.1 Determinism and portability

- Pure function: `bot(profile, tier, level, prompts, seed) → log`. It uses only the seeded `sfc32` and integer maths (§2). Its output is the same in Node and in every browser.
- Prompts come from the simulation: the bot runs alongside a headless simulation and asks it for the next expected character and the active targets. Text generation therefore stays in the simulation, not in the bot.
- CI generates logs in Node and replays **the same log bytes** in Chromium, Firefox and WebKit through Playwright. It then compares the snapshot hash lists with the Node result.

### 5.2 Timing model

Mean interval between keys for target speed `W` (WPM): `mu = floorDiv(12000, W)` ms (5 characters per word).
Gaussian-like jitter without floats, using a sum of 4 uniform values (Irwin–Hall, n = 4):

```
s        = rng.int(65536) + rng.int(65536) + rng.int(65536) + rng.int(65536) - 131070   // mean 0, sd ≈ 37837
interval = mu + floorDiv(mu * cvPermille * s, 1000 * 37837)
interval = clamp(interval, floorDiv(mu, 4), mu * 4)
```

Adjustments, applied in this order:
- **New-key hesitation**: during the first 20 times the level's new key appears, `interval = floorDiv(interval * 3, 2)`.
- **Reach penalty**: keys outside the home row, `interval = floorDiv(interval * 11, 10)`.
- **Error recovery**: the correct key after an error comes `floorDiv(mu * 13, 10)` ms after the error.
- **Pauses**: with probability `pausePermille`, add `1000 + rng.int(2000)` ms before the key. This exercises rest fast-forward (§1.4).

### 5.3 Error model

With probability `errPermille` per expected key, the bot presses a wrong key first. It picks that key using the language layout:
60% a neighbour in the same row, 25% the same finger in another row, 15% the mirror finger on the other hand. Only keys in the current layout are used. Repeated errors are possible: after each error, roll again with `errPermille / 2`.

### 5.4 Profiles

Tier targets come from doc 01: WPM `5, 10, 18, 28, 40, 60, 75`; accuracy `85, 88, 90, 92, 95, 96, 97`%.
`W` = `target(level, tier)` (per-level scaling in doc 01) × the profile's speed factor.

| Profile | Speed factor | errPermille | cvPermille | pausePermille | Purpose and expected outcome |
|---|---|---|---|---|---|
| `pass` | 1.40 | `(1000 − tierAcc) / 2` | tier 1: 450 → tier 7: 150 (linear) | 5 | Completes every level at ≥ 1★ |
| `star3` | 1.70 | `(1000 − tierAcc) / 4` | 120 | 0 | Reaches 3★; checks the star ceiling |
| `struggle` | 0.60 | `(1000 − tierAcc) + 60` | 600 | 20 | Must **not** complete. The stuck flow (doc 02) fires within 3–4 simulated minutes, and visibility never drops below the minimum. |
| `idle` | 1.40 | as `pass` | as `pass` | 1 pause of 10 s every 40 keys | The idle hint appears; replay fast-forwards; results match `pass` apart from timing |
| `robot` | fixed 120 WPM | 0 | 0 | 0 | Completes; the proof verifier flags it as **suspicious** |
| `masher` | 300 WPM | random key from layout | 300 | 0 | No crash; accuracy near chance level; minimum visibility respected |

The `pass` speed factor of 1.40 leaves margin over the 1★ target after the overheads from errors, hesitation, reaches and pauses (together about 25% at tier 7). The test checks that each `pass` run's measured WPM is ≥ 1.0 × target and its accuracy is ≥ tierAcc. If a run doesn't, the profile is retuned; the targets are never lowered.

### 5.5 Simulated time budgets

A level must be completed within a **simulated** time budget: `20 min` for tiers 1–3, `12 min` for tiers 4–7. Simulated time is free in CI because of fast-forward and the absence of rendering.

### 5.6 CLI

```
npm run sim -- --template <id> | --level <n> --tier <1-7> --profile <pass|star3|struggle|idle|robot|masher> --seed <s> [--out run.log] [--snapshots]
```

Output: a JSON summary (stars, WPM, accuracy, steadiness, simulated duration, snapshot hashes, run hash).

---

## 6. Milestone 1 test matrix

| Test | Where | Pass condition |
|---|---|---|
| Hash fixtures | Node + 3 browsers | All fixture hashes are equal |
| Determinism | Node | Same seed + profile, run twice: identical snapshot hash lists |
| Fast-forward equivalence | Node | `idle` run with fast-forward on vs. off: identical hash lists |
| Cross-browser | Playwright (Chromium, Firefox, WebKit) | Node-generated `pass` logs (tiers 1, 4, 7 × levels 1–4) replay with identical snapshot hash lists |
| Completion | Node | `pass` at tiers 1, 4, 7 completes levels 1–4 at ≥ 1★ within budget |
| Star ceiling | Node | `star3` at tier 4 gets 3★ on at least one level |
| No false completion | Node | `struggle` at tiers 1, 4, 7 never completes; stuck flow fires |
| Robustness | Node | `masher` at all 4 levels: no exceptions; minimum visibility respected |
| Lint | CI | No forbidden globals in simulation paths |

---

## 7. Implementation notes (milestone 1)

- **Replay seeking** re-simulates the current level from its start up to the target time (a whole level simulates in milliseconds). Snapshot-based seeking (restore the nearest stored state) is kept for longer runs.
- **Timing plausibility** uses the *median absolute deviation* of intervals between keys (robust against intro/crossroads pauses): suspicious if it is under 2% of the median interval over ≥ 50 keys, or if the median interval is under 35 ms.
- **Cross-browser**: `npm run e2e` generates `pass` bot logs in Node (`tools/gen-e2e-fixtures.ts`) and replays them in each Playwright browser. CI runs Chromium, Firefox and WebKit.

