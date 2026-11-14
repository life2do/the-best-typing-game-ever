# Prompt: Bubble-popper (level template, targeting)

Genre: underwater bubble-popper.

- Core loop: bubbles rise from the sea floor in four columns, each carrying a word (a target). Type a bubble's letters, then Space, to pop it into sparkles. Active targets start with different letters (engine rule), so the first letter picks the bubble.
- Ticks: `onTick` refills bubbles; `onTargetComplete` pops the bubble. Continuous motion: bubbles rise with `ctx.v × hazardP` (slow-mo halves it). A bubble that reaches the surface sinks back a little — nothing is lost.
- Stage: 2 bubbles in stage 1, then 3 and 4.
- Mistakes: bubbles wobble (stumble frame).
- Art: deep-blue water, light rays, translucent bubbles with a highlight, a little diver avatar on the floor.
- Havocs: gravity tilt (the water leans).
