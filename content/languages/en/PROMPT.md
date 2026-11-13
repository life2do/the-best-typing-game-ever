# Prompt: English language pack

Create a language pack for US English on a QWERTY keyboard for a touch-typing game for ages 7–99.

- `layout`: every physical key by `KeyboardEvent.code` → character, shifted character, finger (lp lr lm li lt rt ri rm rr rp), row, column; mark F and J with `homeBump`.
- `order`: classic home-row-first touch-typing order. Level 1 introduces F, J and Space together; then one letter per level. Bring E forward so real words appear around level 8.
- `keyGroups`: Shift/capitals, punctuation, digits (two groups), symbols, editing keys (Backspace/Enter/Tab), in that order.
- `words/common.txt`: curated, kid-friendly, non-violent words, grouped by the first level at which they become typeable. Prefer concrete, playful nouns and verbs.
- `words/easter-egg.txt`: a few words that are fun to discover early (home-row words).
- `words/blocklist.txt`: words and substrings (prefixed `~`) that must never appear in generated text, including random letter combinations.
