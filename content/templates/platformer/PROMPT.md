# Prompt: Platformer (level template)

Genre: 2D side platformer, jump on the beat.

- Core loop: correct keys move the avatar forward. Every typed Space makes the avatar jump, and a gap opens in the ground just ahead so the jump always clears it (no failure).
- Ticks: `onTick` records jump frames on Space and adds a gap 2 units ahead; occasional collectible notes are placed ahead (seeded rng).
- Continuous motion: `x += ctx.v`.
- Render: ground blocks with gaps, hop arc derived from position, notes that pop when passed; the upcoming letters stand on the ground in front of the runner (shared `GlyphTrail`), Space shown as ␣.
- Havocs: gravity tilt.
