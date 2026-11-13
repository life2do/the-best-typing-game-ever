# Prompt: map-rotate havoc

Map rotation: the board turns around its centre in quarter turns as stages advance.

Havoc changes the world only, never input. Implement `apply(world, intensityPermille, timeSeconds)` on the render side, deterministic from stage and intensity. Reduced motion: hold a fixed small offset instead of animating.
