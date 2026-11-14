# Prompt: Maze snake (level template)

Genre: calm top-down snake in a hedge maze.

- Core loop: the path winds through hedges in a fixed serpentine pattern (8 cells across, 2 down, back again). The upcoming letters lie on the next cells of the path. Each correct key moves the snake's head one cell; the snake grows by one segment every 8 steps (up to 14) and eats a berry every 5 cells.
- Ticks: `onTick` advances `steps` and grows the snake; no continuous motion is needed (`isAtRest` is always true).
- Mistakes: the head wiggles (stumble frame); the snake never dies and never crashes.
- Text: letters on path cells; Space is a space-bar tile.
- Art: soft green hedges, light stone path, round snake segments in the palette accent, berries in the glow colour.
- Havocs: map rotate (the board turns in 90° steps; input is unchanged).
