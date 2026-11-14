# 01 — Pedagogy

## Method

1. **Home row first**, with the thumbs on Space. The `F`/`J` bumps are shown in the intro overlay.
2. **One new key per level.** Each level drills the new key mixed with the keys already learned (about 40% new key in stage 1, falling to about 15% in later stages).
3. **Accuracy before speed.** A wrong key **does not advance** the world. The correct key is required to continue, and there is no Backspace (it becomes a trainable key in a late key group).
4. **Don't look down.** The on-screen keyboard shows each key coloured by finger. It **fades as accuracy rises** and **brightens again when accuracy drops**.
5. **Steady rhythm.** Even keystrokes are rewarded more than bursts of speed (see Rhythm in [02](02-core-gameplay.md)).
6. **Spaced review.** Earlier keys keep appearing in later levels. Weak keys are weighted up in generated text.
7. **Fix-it training** (Duolingo style). The game tracks per-key error rate and latency. When a key is clearly weak, it offers: *"F is tricky. Train it for 1 minute?"*. The player can accept or decline.

## Finger map

Each key's finger is defined by **physical key code** (`KeyboardEvent.code`) in the language pack, so the map is the same whatever the OS layout. Finger colours (colour-blind safe, with patterns as a backup):

| Finger | L | R |
|---|---|---|
| Pinky | violet | violet |
| Ring | blue | blue |
| Middle | green | green |
| Index | orange | orange |
| Thumb | grey (Space) | grey |

## Key order

### English (QWERTY)

| Level | New | Words first possible (examples) |
|---|---|---|
| 1 | F J ␣ | — (patterns) |
| 2 | D | — |
| 3 | K | — |
| 4 | S | — |
| 5 | L | — |
| 6 | A | ask, sad, dad, fall, lass, flask, salad |
| 7 | ; | (home row complete) |
| 8 | E | see, feel, lake, sale, desk, else |
| 9 | I | like, side, file, kid, skill, ideal |
| 10 | R | red, ride, read, fire, like, dream (after M) |
| 11 | U | use, sure, sun (after N) |
| 12 | G | go (after O), egg, giraffe… |
| 13 | H | he, she, high, fish, hug |
| 14 | T | the, it, at, tree, light |
| 15 | O | go, too, hello, door, shoot |
| 16 | N | no, in, on, run, need, shield |
| 17 | W | we, wow, wind, slow |
| 18 | Y | yes, you, fly, key |
| 19 | P | up, jump, open, power, speed |
| 20 | M | me, more, magic, move |
| 21 | C | cat, ice, rocket |
| 22 | V | voice, wave, love |
| 23 | B | big, bubble, boost |
| 24 | X | box, fox, six |
| 25 | Q | quick, quest |
| 26 | Z | zoom, zap, freeze, zero |

Key groups after the letters (one level each): **Shift/capitals** · `. ,` · `' / ? !` · digits `1–5` · digits `6–0` · symbols `- = ( ) : "` · `Backspace Enter Tab`.

*Implemented (M2.2):* the campaign appends one level per key group (English levels 27–33) after the letter levels, so the seeded choices for letter levels don't change. Shift adds the capital of every letter; key names add their character (`\b` Backspace, `\n` Enter, `\t` Tab, drawn as ⌫ ⏎ ⇥). Group characters aren't mixed into pseudo-words; they **decorate** chunks — capitals capitalise a chunk, `. , ? ! :` follow it, quotes wrap it, `( )` enclose it, `- / =` join its halves, digits form numbers, and editing keys are chunks of their own — with the new-key share for the level's own group and 15% for earlier groups. Characters that need Shift are typed with Shift held (a capital without Shift is a mistake). From the first key-group level on, the keyboard overlay shows the full keyboard (number row, symbols, editing keys, both Shift keys) and lights the opposite hand's Shift key with the letter.

The language pack may define **order variants** (equivalent valid orders). The campaign seed picks one.

### Russian (ЙЦУКЕН), provisional

Home row: `Ф Ы В А | О Л Д Ж Э`. One letter per level after level 1:
`А О ␣` → `В` → `Л` → `Ы` → `Д` → `Ф` → `Ж` → `Э` → `П` → `Р` → `Е` → `Н` → `К` → `Г` → `М` → `Ь` → `И` → `Т` → `С` → `Б` → `У` → `Ш` → `Ц` → `Щ` → `Ч` → `Ю` → `Я` → `Х` → `Й` → `З` → `Ъ` → `Ё` (32 levels covering 33 letters). Key groups follow the same pattern as English. To be checked against Russian touch-typing curricula in milestone 2.

## Proficiency tiers and benchmarks

Speed is **WPM** = (correct characters / 5) / active minutes. Accuracy = correct keystrokes / all judged keystrokes. A wrong key never advances and must be followed by the correct one, so there are no *uncorrected* errors: net WPM equals gross WPM, and errors cost time plus accuracy. The exact counting rules (what counts as an error, active-time capping, windows) are in [10 §4](10-simulation-and-test-harness.md#4-typing-metrics).

Reference data: US district keyboarding guidelines cluster around grade 3 ≈ 15 WPM, grade 4 ≈ 20, grade 5 ≈ 25 at 85–90% accuracy (about +5 WPM per grade). Average adults type about 40–50 WPM. Professional typists type about 43–80+ WPM at ≥97% accuracy.

| Tier | 1★ target | 2★ | 3★ | Typical |
|---|---|---|---|---|
| 1 | 5 WPM · 85% | +20% speed | +40% speed & steadiness ≥ 700‰ | 7 y.o. beginner |
| 2 | 10 · 88% | | | grade 2–3 |
| 3 | 18 · 90% | | | grade 3–4 |
| 4 | 28 · 92% | | | grade 5–6 |
| 5 | 40 · 95% | | | average adult |
| 6 | 60 · 96% | | | skilled adult |
| 7 | 75 · 97% | | | professional |

**Super-speed** visuals (light streaks, motion blur) trigger at ≥ 70 WPM in any tier.

### Per-level scaling

Raw WPM isn't comparable when only 3 keys are known. Target speed for level *n*:
`target(n) = tierTarget × clamp(0.5 + 0.5 × lettersKnown/12, 0.5, 1) × reachFactor(newKey)`,
where `reachFactor` is 0.9 for keys outside the home row and 1.0 on it. Real WPM becomes the headline number once words are available (around level 8).

### Tier changes

- The start screen lets the player pick a starting tier.
- **Automatic promotion** happens when the player earns ≥ 2★ at the next tier's 1★ target for 2 levels in a row. It takes effect at the next level boundary, with a celebration.
- **No automatic demotion.** After sustained results below target (3 stages), a gentle nag offers a lower tier. The player decides.
- Stars are stored **per tier**.

## Weakness detection

For each key, the game keeps an exponentially weighted error rate and median latency. A key is *weak* if its error rate is > 2× the player's mean or its latency is > 1.5× the median, over ≥ 20 samples. Weak keys are weighted up in generated text, and the game offers a 60-second fix-it drill (a small dedicated level template) no more than once per level.

**Fix-it drill (implemented, `src/campaign/drill.ts`).** Offered for the weakest key (highest error rate among the weak keys) at the start of a fresh level — among keys learned in earlier levels — or when the player is stuck (docs/02), at most once per level. F accepts, J declines. The drill is a single pulse-runner stage of about one minute at the tier's target speed (tier WPM × 5 characters, 20–200), with the weak key taking the new-key share (40%) of the text. It has no star target, so it always ends after its stage and the player returns to the level exactly where they left it. Drills are practice: they don't change campaign progress and aren't saved as run segments; their per-key stats are added to the profile, so a key that improved stops being weak.
