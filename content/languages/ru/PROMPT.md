# Prompt: Russian language pack

Create a language pack for Russian on a ЙЦУКЕН keyboard for a touch-typing game for ages 7–99.

- `layout`: every physical key by `KeyboardEvent.code` (the same codes as the English pack) → Russian character, shifted character, finger (lp lr lm li lt rt ri rm rr rp), row, column; F and J (А and О) carry `homeBump`. Shifted digits follow the Russian layout (`!` `"` `№` `;` `%` `:` `?` `*` `(` `)`); the Slash key types `.` and `,` with Shift.
- `order`: home-row-first. Level 1 introduces А, О and Space; then one letter per level: В Л Ы Д Ф Ж Э П Р Е Н К Г М Ь И Т С Б У Ш Ц Щ Ч Ю Я Х Й З Ъ Ё (32 levels, 33 letters).
- `keyGroups`: Shift/capitals, `. ,`, `! ? " :`, digits 1–5, digits 6–0, symbols `- = ( ) ; %`, editing keys (Backspace/Enter/Tab).
- `ui`: in-level strings in Russian (intro, crossroads, spoken lines, finger names, break screen).
- `words/common.txt`: curated, kid-friendly, non-violent Russian words; the generator uses only words whose letters are unlocked.
- `words/easter-egg.txt`: home-row words that are fun to discover early (вода, лава, водопад).
- `words/blocklist.txt`: profanity substrings (prefixed `~`) and unsafe whole words; generated pseudo-words are checked against it.
- `tts`: `ru-RU` with preferred system voices.
