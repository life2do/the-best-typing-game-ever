# Prompt: Beat-wave surfing (level template)

Genre: 3D chase-camera surfing on a calm sea.

- Core loop: the surfer rides toward the horizon. The upcoming letters float on the water ahead (shared `GlyphTrail`, ground mode). Each correct key paddles forward (engine velocity) and adds wave energy; energy drains slowly, so a steady rhythm keeps a big rolling wave under the board.
- Ticks: `onTick` adds 120‰ wave energy (capped at 1000‰). Continuous: `z += ctx.v`; energy drains 4‰ per frame while not at rest (`isAtRest` = no energy left).
- Mistakes: a splash; the board wobbles (stumble frame).
- Art: rows of soft wave crests in the palette's sky/ice colours, a bright board, seagulls, a low sun.
- Havocs: gravity tilt (the sea leans).
