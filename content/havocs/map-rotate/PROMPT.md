# Prompt: map-rotate havoc

Map rotation: the board turns gently around the point the camera is looking at (not the world origin, so travelling tracks stay in view), up to a quarter turn as stages advance.

Havoc changes the world only, never input. Implement `apply(world, intensityPermille, timeSeconds)` on the render side, deterministic from stage and intensity. Reduced motion: hold a fixed small offset instead of animating.
