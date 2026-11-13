# 02 — Core gameplay

## The typing-driven world (inspired by rhythm-step games)

- **The world only advances on correct keystrokes.** Each correct key = one **tick** of the simulation for the current level template.
- Between keys the world **eases to a stop** instead of freezing instantly (velocity decays over about 400 ms), so racing and flying still feel fluid.
- The exact clock, tick/substep composition, decay formula and rest fast-forward are defined in [10 §1](10-simulation-and-test-harness.md#1-simulation-clock-and-tick-model).
- After **5 s of full stop**, a gentle hint appears: the next key pulses on the keyboard overlay and TTS says *"Find the J with your right pointer finger"*. There's no penalty for stopping.
- **Every level starts frozen and dim.** As accuracy rises, the world is *revealed* (desaturated → full colour, fog lifts, details fade in).

## Input styles

Every level template declares its input style:

| Style | How it works | Trains |
|---|---|---|
| **Dictated** | The game shows a stream of text (on the road, on clouds, on bricks). Type it in order. | Rhythm, flow |
| **Targeting** | Things in the world carry letters or words. Type one to aim at it, then press **Space** to act (zap, build, freeze, command). Space confirms every target, the same way it ends every word in dictated levels. The first letter picks the target, so **targets on screen always start with different letters**. Before any letter is typed, the target the keyboard points at is highlighted; once one is aimed at, its label is bigger and gold and the others dim. | Finding keys, reading ahead |

Campaign mix target: about 60% dictated, 40% targeting.

## Feedback model

| Signal | Measured as | Effect on the world |
|---|---|---|
| **Accuracy** | rolling accuracy over the last 30 keys | Reveal: colour saturation, fog distance, light radius. There is a **minimum visibility** (never below 35%). |
| **Rhythm steadiness** | 1 − (mean absolute deviation ÷ median) of the last 12 intervals between correct keys, using the player's *own* tempo (integer formula in [10 §4.4](10-simulation-and-test-harness.md#44-rhythm-steadiness)) | **World speed multiplier** 0.6×–2.0×. Music layers are added as steadiness rises. |
| **Mistake** | wrong key | No tick, a short "stumble" (momentum loss), a small temporary fog increase, and the correct key is highlighted on the keyboard overlay. **The keyboard overlay brightens** as accuracy falls. |
| **Speed** | net WPM | Stars, super-speed visuals at ≥ 70 WPM |

### Rhythm frame (HUD)

A frame around the whole screen with two layers:
1. **Typing pulse.** A thin inner line flashes on every keypress: white for correct, a soft red shake for a mistake.
2. **Steadiness glow.** An outer band whose **thickness and brightness grow** as rhythm steadiness rises, pulsing at the player's tempo. When it's at maximum, it gets a rainbow shimmer.

### Getting stuck

If a stage stays below its 1★ target for about 3 minutes:
1. The keyboard overlay is fully opaque. Visibility stays at its minimum, never lower.
2. A fix-it drill is offered for the weakest key.
3. A lower tier is suggested (a nag, not forced).
4. The player can always go back to the level map. The next level stays locked until the target is met.

## Stages and stars

- A level has **3–5 stages**. Each stage raises one or more of: target speed, required accuracy, text complexity (more of the new key, more reaches, words), and havoc intensity.
- Stages 1..N−1 always advance when their prompt is finished. **The final stage repeats with fresh text until the target stars are met**; level stars = the best final-stage result ([10 §4.5](10-simulation-and-test-harness.md#45-stage-and-level-results)).
- The **level ends only when the player's target star count is met** (default: 1★ at the current tier; the player can set a higher personal target in settings).
- At the end, a **crossroads** (shown in the level's own style: a road fork, two doors, two portals): *continue for more stars* or *advance to the next level*.
- Stars unlock avatar customisation ranges, harder bonus stages and cosmetic extras.

## Power-ups

| Power-up | Effect | Duration |
|---|---|---|
| **Slow-mo** | World speed ×0.5, music pitch-down, but steadiness still counts | 15 s |
| **Shield** | The next 3 mistakes don't fog or stumble | until used up, or 30 s |
| **Reveal** | Full visibility | 20 s |
| **Magnet** | Collectibles fly to the avatar | 20 s |

**How power-ups are earned** (combined; weights in the campaign rules):
- Typing a power-up word shown in the world (`slow`, `shield`, …, when its letters are unlocked).
- An accuracy streak (e.g. 25 correct keys in a row).
- A rhythm streak (steadiness ≥ 0.8 for 20 keys).
- Rare random drops from the seeded drop table, with a pity timer so drops can't be too rare.

## Words, abilities, collectibles

When a word's letters are all unlocked, it can appear in levels:

| Kind | Example | Effect |
|---|---|---|
| **Permanent ability** | `jump`, `dash`, `fly` | The avatar gains an animation or ability that works in all later templates that support it |
| **Level mechanic** | `door`, `key`, `bridge` | Opens or builds something in the current level |
| **Temporary boost** | `shield`, `slow` | Triggers a power-up |
| **Collectible** | `voice` → a TTS voice effect; `star`, `gem` | Goes into the collection book |
| **Easter egg** | rare words | Reveals hidden scenery or jokes |

Abilities are **independent of language**. Each language pack lists one or more trigger words per ability (`jump` ↔ `прыжок`, `скок`). An ability becomes available once *any* of its words can be typed. Typing a word *quickly* (within a time budget scaled by tier) grants the upgrade. Typing it slowly still reveals it but gives a smaller reward.

All words come from **curated lists** checked against a blocklist at build time. Words are never generated freely from the unlocked letters.

## Havoc

Changes to the game world only. **Input is never remapped or hidden.** Each havoc is a plugin with an intensity (0–1) that rises with each stage, plus a reduced-motion fallback. Havocs collected in earlier levels can recur as a "remix" in later levels. Examples: gravity tilt, map rotation, scroll flip, layer separation, walls shifting each beat, world mirrored, floating everything, projection shuffle.
