# Prompt: flat render style

Flat unlit shapes with soft vignette; cheapest style and the lite fallback for others.

Implement `build(api, palette)` returning materials for roles (ground, avatar, accent, text, hazard) and an optional post-processing chain. Provide a lite variant (fewer passes) for low-end machines.
