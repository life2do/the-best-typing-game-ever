# 03 — Campaign and levels

## Campaign = fixed key order + seeded slot filling

- A **campaign** is one language for one profile (or one party). It is created with a **seed**, which is stored and fixed for that campaign. A reload continues the same campaign.
- The **key order** is fixed by the language pack (or one of its order variants, chosen by the seed).
- Each level is a **slot** with constraints. The seed fills each slot with a `LevelTemplate`, `RenderStyle`, `Palette`, `Havoc` set and drop table, all subject to:
  - `template.minLetters ≤ lettersKnown(slot)` (and `maxLetters` if set)
  - the slot's **view band** (see the arc below)
  - no template repeated within 3 slots; no style+palette combination repeated in a campaign
  - input-style mix of about 60/40 dictated/targeting
- **A new campaign or "New run"** = a new seed = a different sequence, styles and prizes.
- The start-screen complexity theme is picked at random **every page load** (cosmetic only).

## View arc (slot constraints for the 26 English letter levels)

| Slots | View band | Notes |
|---|---|---|
| 1–6 | 2D (orthographic) | Calm start; havoc begins in slot 2 |
| 7 | 2D → 2.5D | **First dive** at home-row completion; mini-boss |
| 8–11 | Isometric | |
| 12–15 | 3D third-person / FPV | |
| 16 | Split view (2D + 3D of the same action) | |
| 17–20 | 3D / FPV | |
| 21–25 | Mixed: views change every stage | Remixes, boss rush |
| 26 | 4D: Artifact chamber | Finale, always fixed |

For longer alphabets (Russian), bands stretch proportionally.

## Reference arc (one possible seed, English)

| Lvl | Key | Template | View | Havoc |
|---|---|---|---|---|
| 1 | F J ␣ | Pulse runner: each key is a heartbeat that lights the dark | 2D | none |
| 2 | D | Side platformer, jump on the beat | 2D | gravity tilt |
| 3 | K | Brick-breaker, paddle moves as you type | 2D | ball split |
| 4 | S | Top-down maze snake | 2D | walls shift |
| 5 | L | Vertical bubble-popper (targeting) | 2D | scroll flip |
| 6 | A | Garden grower | 2D | day/night |
| 7 | ; | First dive: layered world extrudes | 2.5D | layers separate |
| 8 | E | Isometric tower defence (targeting) | Iso | map rotates 90° |
| 9 | I | Word city: words become buildings | Iso | buildings walk |
| 10 | R | Marble run | Iso | board tilt |
| 11 | U | Step-based dungeon crawler | Iso | rooms swap |
| 12 | G | Third-person racer (crossroads star choice) | 3D | track loops |
| 13 | H | Beat-wave surfing | 3D | wave surges |
| 14 | T | Crystal-zapper gallery | FPV | targets teleport |
| 15 | O | Space-tunnel flight | FPV | tunnel inverts |
| 16 | N | Split view: same action, 2D top, 3D bottom | Split | halves swap |
| 17 | W | Lite RTS: type unit names to command them | 3D | fog of war |
| 18 | Y | Turret defence | FPV | turret rotates |
| 19 | P | Climbing tower | 3D | tower spins |
| 20 | M | Music arena (the world is the visualiser) | 3D | tempo shifts |
| 21 | C | Projection shuffle | Mixed | random flattening |
| 22 | V | Remix of earlier templates | Mixed | stacked havocs |
| 23 | B | Boss rush, one mini-boss per genre | Mixed | genre swaps |
| 24 | X | Mirror world | Mixed | world mirrored |
| 25 | Q | Zero gravity | 3D | everything floats |
| 26 | Z | Artifact chamber: tesseract unfolds through every past style | 4D | all |

*Implemented (M2.3):* 15 level templates — pulse runner, platformer, brick-breaker, maze snake, bubble-popper (targeting) and garden grower in 2D; tower defence (targeting), word city (targeting), marble run and dungeon crawler in isometric; racer, beat-wave surfing and climbing tower in 3D; crystal gallery (targeting) and space tunnel in first person. The seed fills every slot from the templates that fit its view band and letter count, never repeating a template within 3 levels. Each level's plan is stored in its run segment, so a level keeps its template when later content changes the campaign's choices (resume and replay use the stored plan).

Then the key-group levels (Shift = "giant mode", punctuation, digits = racing gear shifts, symbols, editing keys). Each adds an outer shell to the artifact.

## Level structure

1. **Intro overlay** (skippable after the first viewing, always available via `?`):
   - the keyboard with available keys coloured by finger, and the new key highlighted and animated
   - a hand-position illustration (resting on F/J bumps; for a new key, the finger's path from home)
   - 2–3 icon-based rules for the template, read by TTS
   - a "press F and J together to start" prompt (confirms home position)
2. **Frozen start**, revealed through accuracy.
3. **Stages 1..N.**
4. **Crossroads** (more stars / advance).
5. **Transition** to the next level (below).

## Transitions

All rendering goes through one Three.js scene graph and one camera rig:
- **2D** = a perspective camera with a very narrow field of view (~1–2°) placed far away, which looks orthographic.
- **Dive / extrude**: animate the field of view and distance together (dolly zoom) while 2D layers get depth, so flat sprites become extruded meshes.
- **Flatten**: the reverse. Depth collapses, then the field of view narrows.
- **Isometric**: the camera rotates to about 35.26° / 45° in the narrow-field-of-view state.
- **Style/palette cross-fade**: both post-processing chains render, then are mixed over about 1.5 s.
- A transition element (portal, crack, page turn) can be supplied by the outgoing template. A narrative element is used only when the transition would otherwise feel arbitrary.

## The Artifact (tesseract)

- One tesseract holds **all alphabets** supported by the build. Each letter is a glyph on a cell or face.
- Glyphs start **scratch-covered** (scratch-card style). They are scratched away gradually with level progress (1★ = partial reveal, max stars = full shine).
- **Completing one language** unlocks the full artifact view, with other alphabets still covered.
- **Each further alphabet** unlocks extra artifact traits: rotation modes, shaders, particle trails, sound.
- The artifact's appearance (palette, rotation axes, glyph arrangement, trails) is **generated from the run fingerprint**, and it is surrounded by a **code ring** encoding that fingerprint (see [05](05-determinism-replay-proofs.md)).
