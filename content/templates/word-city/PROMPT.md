# Prompt: Word city (level template, targeting)

Genre: isometric city builder.

- Core loop: a 4×4 grid of plots. Plots waiting to be built carry a word (a target). Typing a word's letters raises scaffolding as each letter lands; Space completes the building (its height = word length). Each plot holds one house per district (only empty plots get words). When all 16 plots are built, the finished district gently floats away on balloons (about 3 s), a fresh empty district settles in, and a sign counts the districts built (state: `district`, `liftAt`, `lifted` heights).
- Ticks: `onTick` refills open plots; `onTargetComplete` finishes a building. Continuous motion: cranes swing with `ctx.v`; nothing is lost when you stop.
- Stage: 2 open plots, then 3 and 4.
- Mistakes: the crane wobbles (stumble frame).
- Art: pastel blocks with window stripes, roads between plots, a little builder avatar.
- Havocs: map rotate (the board turns 90°).
