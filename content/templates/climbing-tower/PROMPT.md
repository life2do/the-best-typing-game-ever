# Prompt: Climbing tower (level template)

Genre: 3D tower climbing (third-person orbit camera).

- Core loop: handholds spiral up around a tall tower. The upcoming letters are written on the next holds. Each correct key moves the climber to the next hold, a little higher and further round. Each Space plants a small flag on the hold just reached. The camera orbits with the climber.
- Ticks: `onTick` counts holds and flags. No continuous motion is needed (`isAtRest` always true); the view eases the climber between holds.
- Mistakes: the climber hugs the wall for a moment (stumble frame); there is no falling.
- Art: stone tower with rings of windows, colourful holds, flags in palette colours, clouds below as you climb.
- Havocs: gravity tilt (the tower sways gently).
