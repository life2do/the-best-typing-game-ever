# Prompt: Brick-breaker (level template)

Genre: friendly 2D brick-breaker.

- Core loop: a wall of soft coloured bricks; the upcoming letters are written on the next bricks in reading order. Each correct key sends the ball from the paddle to the brick with that letter and the brick pops into confetti (no damage, no lives).
- Ticks: `onTick` counts popped bricks and records the hit frame; the wall slides up one row each time a row is cleared (bricks read left to right, top to bottom, like text). Continuous motion `x += ctx.v` drives the ball's flight and paddle glide.
- Mistakes: the ball wobbles back to the paddle (stumble frame); nothing is lost.
- Text: letters on bricks (Space is a wide space-bar brick).
- Art: rounded bricks in palette colours, glowing ball, short confetti burst per pop.
- Havocs: gravity tilt (the wall leans gently).
