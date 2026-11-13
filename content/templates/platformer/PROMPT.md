# Prompt: Platformer (level template)

Genre: 2D side platformer, jump on the beat.

- Core loop: correct keys move the avatar forward. Every typed Space makes the avatar jump, and a gap opens in the ground just ahead so the jump always clears it (no failure).
- Ticks: `onTick` records jump frames on Space and adds a gap 2 units ahead; occasional collectible notes are placed ahead (seeded rng).
- Continuous motion: `x += ctx.v`.
- Render: ground blocks with gaps, avatar arc derived from the jump frame, notes that pop when passed.
- Havocs: gravity tilt.
