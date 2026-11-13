# Prompt: Racer (level template)

Genre: third-person 3D racer on an endless track.

- Core loop: correct keys accelerate the car (engine impulse); steady rhythm raises the speed multiplier. The route is planned per stage from the seed: every Space moves it one lane over (edge ↔ middle; from the middle left or right) and a cone blocks the old lane right after the Space tile, so typing Space is what steers the rider past the obstacle.
- Continuous motion: `z += ctx.v`.
- Render: chase camera high enough to see over the rider; road with lane markings; the upcoming letters painted flat on the road in the rider's lane, sliding toward the rider as they are typed (current letter larger, gold); speed lines when WPM is high; light-trail super-speed effect at ≥ 70 WPM.
- Havocs: gravity tilt (the road banks).
