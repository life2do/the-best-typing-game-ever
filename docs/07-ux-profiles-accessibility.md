# 07 — UX, profiles, accessibility

## Start screen

1. A **profile picker**: avatar tiles, plus "New player", plus "Party (hot seat)".
2. For a new profile: name (optional; TTS reads it), avatar theme, starting **tier** chosen on a **complexity scale picked at random each load** (e.g. 🌸 seed → bouquet), each step showing its target as stars or WPM in icon form.
3. Language choice (a flag plus keyboard picture). Shows a hint if the OS keyboard layout doesn't match.
4. Continue campaign / New run / Collection / Artifact / Stats / Settings.

## Profiles

- Stored locally (IndexedDB). There can be several per device.
- **Optional PIN** (4 digits). The number pad shows each digit with a **unique colour + shape** (0 ⚪●, 1 🔴■, 2 🟠▲, 3 🟡◆, 4 🟢★, 5 🔵⬟, 6 🟣♥, 7 🟤☾, 8 ⚫✚, 9 🩷⬢), so children who can't read numbers yet can use it. This is a lock against siblings, **not security**.
- **Export / import** profile (JSON + proofs) as a file.

## Avatar

- The theme comes from a complexity scale. Its model **evolves with the tier** (seed → bouquet).
- **≥ 8 customisation slots** per theme (primary colour, secondary colour, pattern, size, accessory, trail, aura, idle style). Value ranges unlock with stars (e.g. size 1–3 free, 4–7 at 20★, 8–10 at 60★). That gives ≥ 50 options.
- Abilities change the avatar visibly (collecting `jump` adds the jump animation; `fly` adds wings/jets/updraft, interpreted per theme).

## HUD

- **Rhythm frame** around the screen (typing pulse + steadiness glow), see [02](02-core-gameplay.md).
- **Keyboard overlay** at the bottom: finger colours, next key highlighted, opacity linked to accuracy. A setting allows "always on" / "auto" / "off (expert)".
- Minimal corner info: stage dots, stars for this level, active power-up timers.

## Word art and word book

- While a **real word** (from the curated lists) is typed, its picture is revealed **behind the game world**: the world's sky is transparent and the page paints the background colour, so the picture sits between them.
- Each word uses a **random reveal effect**: line drawing (strokes draw as letters are typed), fog (blur clears), puzzle (one tile per letter) or iris (a growing circle). On the last letter it fills with the level palette's colours, the word appears and the picture animates (bounce, wiggle, swim, fly…).
- **Golden version**: typed with no mistakes and at least at the level's target speed → golden glow and sparkles.
- Pictures are hand-drawn CC0 SVG line art (`content/illustrations/`, one item per word, with a regeneration prompt). Words without a drawing fall back to an emoji (`wordEmoji` in the language pack); abstract words show nothing.
- Every revealed word goes into the **word book** (start screen): found pictures in colour, golden ones framed, not-yet-found ones as dotted outlines.

## Voice (TTS)

- The browser's built-in speech synthesis (`speechSynthesis`). Used for intro rules, hints, the player's name, and words when they're collected.
- **Collectible voice effects** (v1): choice of voice, pitch and speed, e.g. "chipmunk" (pitch 2, speed 1.3) or "giant" (pitch 0.3). Unlocked by the `voice` word and similar collectibles.
- If a language has no system voice, fall back to on-screen text plus an icon, and show a one-time tip on installing voices.
- Later: an optional built-in speech engine (WebAssembly) for consistent voices and real audio effects.

## Accessibility (settings → Accessibility)

- **Reduced motion**: havocs use their calm fallbacks; no camera shake; slower transitions; no flashing rhythm frame.
- **Colour-blind safe** finger colours plus pattern overlays on keys.
- **Dyslexia-friendly font** (OpenDyslexic) / high-legibility font (Atkinson Hyperlegible).
- **Text size** scale; **high contrast** mode.
- **Volume** sliders (music / effects / voice); voice on or off.
- **Break reminder** (default every 20 min): a 2-minute stretch break (setting `breakSeconds`) with a countdown number and a ring filling around the player's avatar, which demonstrates a stretch for each part (shake hands, roll shoulders, reach up, look far away, wiggle fingers, breathe). It can't be skipped: early clicks, keys or Escape show one of the language pack's supportive `breakNudges` phrases. Parent settings sit behind an adult check (e.g. "type the word shown backwards"). The parent area holds the break interval, maximum session length and profile management.

## Local analytics screen (per player)

- WPM and accuracy over time (per session, per level)
- Rhythm steadiness trend
- **Keyboard heatmap**: error rate and latency per key
- Stars per tier, tier history, time played, words and abilities collected
- Everything stays local and is included in profile export
