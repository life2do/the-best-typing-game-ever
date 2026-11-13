# Prompt: Pulse runner (level template)

Genre: calm 2D side-scrolling runner, the very first level of the game.

- Core loop: the world is dark and frozen. Each correct key is a *heartbeat*: the runner moves forward (engine velocity impulse) and a soft light pulse expands from it. Lanterns every 3 world units light up as the runner reaches them and stay lit.
- Ticks: `onTick` records the beat frame and lights the next reached lantern. Continuous motion: `x += ctx.v`.
- Reveal: the engine's visibility value controls the light radius and saturation. Mistakes: a short stumble (squash) and a fog puff.
- Text: dictated stream shown as glowing glyphs on the path ahead.
- Art: silhouettes, one accent colour from the palette, parallax hills. No hazards.
- Havocs: gravity tilt (the path tilts gently).
