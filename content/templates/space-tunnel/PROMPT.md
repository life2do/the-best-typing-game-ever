# Prompt: Space tunnel (level template)

Genre: first-person flight through a space tunnel.

- Core loop: the camera flies down a tunnel of glowing rings among stars. The upcoming letters float in the middle of the tunnel ahead (shared `GlyphTrail`, upright). Each correct key pushes the ship forward (engine velocity); every passed ring counts.
- Ticks: `onTick` records the beat; continuous `z += ctx.v`; rings passed = z / ring gap. A steady rhythm makes the rings pulse brighter.
- Mistakes: a soft shake of the starfield (stumble frame); nothing is lost.
- Art: black-blue space, rings in glow/accent colours, tiny stars streaking past at speed.
- Havocs: none (first-person views stay calm).
