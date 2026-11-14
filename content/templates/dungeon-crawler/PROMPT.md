# Prompt: Dungeon crawler (level template)

Genre: friendly isometric dungeon crawl (no monsters, no damage).

- Core loop: rooms are chained in a staircase pattern (each room 6 steps long, alternating between going right and going back). The upcoming letters are written on the next floor tiles. Each correct key is one step. Every room has a gem halfway through; stepping on it collects it and lights the room's torches.
- Ticks: `onTick` counts steps and gems (`steps`, `gems`, `lastGem`). No continuous motion is needed; the view eases the hero between tiles.
- Mistakes: the hero bumps on the spot (stumble frame).
- Text: letters on tiles; Space is a space-bar tile.
- Art: stone floor tiles, corner pillars with torches that light up when the room's gem is collected, faceted gems in the glow colour.
- Havocs: map rotate (the board turns 90°).
