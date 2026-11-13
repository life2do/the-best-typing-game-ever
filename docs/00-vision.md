# 00 — Vision

## Pitch

A typing tutor disguised as a genre-hopping adventure. You start in a frozen, dark 2D world that knows only `F`, `J` and `Space`.
Every correct keystroke moves the world one step. Every new key unlocks a new level, often a new genre, and a new
kind of *havoc*: gravity tilts, maps rotate, 2D extrudes into 3D, 3D flattens back.
Once you know enough letters, words appear in the world. Type them to get abilities, open doors or find easter eggs.
When an alphabet is complete, you unlock the **Artifact**: a 4D tesseract holding every letter you learned,
with your unique run fingerprint encoded in it. You can share it, replay it and verify it.

## Pillars

1. **Real touch typing.** Classic home-row-first order, correct finger mapping, accuracy before speed, and an on-screen keyboard that fades as the player improves.
2. **The world is driven by your typing.** Nothing moves unless you type. Accuracy reveals the world, steady rhythm speeds it up, mistakes slow it down and fog it. You can't fail, only go slower.
3. **Constant novelty.** Every level changes genre, view, art style, palette or havoc. Visual complexity grows with the number of letters unlocked.
4. **Smooth transitions.** A single Three.js renderer. 2D, isometric and 3D are camera configurations, so worlds *dive/extrude* and *flatten* without loading screens.
5. **Unique, verifiable runs.** Every campaign is seeded. Every state can be reconstructed. The final artifact carries a fingerprint you can replay and verify.
6. **Built to be extended by agents.** Everything is data or a small typed plugin, with a schema, a generation prompt, a license and a test.

## Audience

- Ages **7–99**. Difficulty follows **skill, not age**: proficiency tiers are picked visually on the start screen and promoted automatically.
- Desktop or laptop with a **physical keyboard**. Tablets and virtual keyboards are **out of scope**.
- Languages: **English QWERTY** (milestone 1), **Russian ЙЦУКЕН** (milestone 2). New languages are data packs.
- Tone works for every age: non-violent (zap crystals, freeze monsters, pop bubbles), mostly icons and voice, very little text.

## Non-goals

- No backend, accounts, telemetry or ads. Everything stays in the browser.
- No runtime AI calls. Agents are used **only during development**.
- No hard failure, game-over screens or shaming.
- No tablet or virtual keyboard support.

## Glossary

| Term | Meaning |
|---|---|
| **Level** | One per newly introduced key (or key group). Has a template, view, style, palette and havoc. |
| **Stage** | A sub-part of a level with increasing difficulty (target speed, accuracy, rhythm). |
| **Tick** | One advance of the world simulation, caused by a correct keystroke. |
| **Tier** | A proficiency band (7 tiers), shown through a themed *complexity scale*. |
| **Star** | A reward for meeting a tier's target in a level. Counted separately for each tier. |
| **Havoc** | A change to the game world only. It never changes input. |
| **Artifact** | The final tesseract holding all alphabets, revealed like a scratch card. |
| **Campaign** | One seeded playthrough of one language for one profile (or one party). |
| **Fingerprint** | A content hash identifying a build, an asset, a state or a whole run. |
