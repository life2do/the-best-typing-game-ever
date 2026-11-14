# Prompt: Crystal gallery (level template, targeting)

Genre: first-person gallery in a crystal cave (non-violent: crystals chime, nothing is shot).

- Core loop: crystals carrying words drift slowly toward the player in five slots across the view. Type a crystal's word, then Space, and it chimes: it spins, flares and floats up in sparkles. Crystals that come close simply hover in front until they are sung.
- Ticks: `onTick` refills crystals; `onTargetComplete` sings one. Continuous motion: crystals approach with `ctx.v × hazardP` and stop at arm's length.
- Stage: 2 crystals, then 3 and 4.
- Mistakes: the cave light flickers (stumble frame).
- Art: dark cave, stalactites, faceted crystals in palette colours with a glow core, floating dust motes.
- Havocs: none (first-person views stay calm).
