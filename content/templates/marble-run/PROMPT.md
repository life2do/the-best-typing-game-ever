# Prompt: Marble run (level template)

Genre: isometric marble run.

- Core loop: a track zig-zags down a gentle staircase of tiles across the board (4 tiles one way, turn, 4 tiles the other way, one step lower each turn). The upcoming letters float above the next tiles. Each correct key lays one tile and the marble rolls onto it. Space places a little bell that rings when the marble passes.
- Ticks: `onTick` counts laid tiles (`laid`) and remembers bell tiles; continuous motion: the marble rolls from tile to tile at `max(ctx.v, base)` until it reaches the newest tile (`isAtRest` then).
- Mistakes: the marble wobbles in place (stumble frame).
- Art: wooden track tiles, a glossy marble in the accent colour, bells in the glow colour.
- Havocs: map rotate (the board turns 90°).
