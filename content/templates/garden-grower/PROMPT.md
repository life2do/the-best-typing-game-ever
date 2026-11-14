# Prompt: Garden grower (level template)

Genre: gentle 2D garden.

- Core loop: a long garden bed with one seed per letter of the text; the gardener walks along it. Each correct key waters the next seed, which sprouts and then blooms over the following beats. A completed real word grows a tall sunflower. Day turns into dusk across the stages.
- Ticks: `onTick` counts planted seeds (`planted`) and the frame; `onWord`-like effect: a Space after a run of letters marks a sunflower (the engine's word spans are read by the view). Continuous motion `x += ctx.v` walks the gardener.
- Mistakes: a little puff of dry soil (stumble frame); nothing withers.
- Text: the letters stand on the seed markers ahead of the gardener.
- Art: brown soil bed, green stems, round petals in palette colours, butterflies.
- Havocs: gravity tilt (the hill tilts).
