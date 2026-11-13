# Prompt: Tower defence (level template)

Genre: isometric tower defence, targeting input, non-violent.

- Core loop: 2–4 blobs walk along a winding path toward the crystal tower. Each carries a chunk of the stage text (a pattern or word). Type a chunk to lock onto that blob; finishing it freezes the blob into a sparkling ice cube.
- Blobs move only while the world moves (`ctx.v`), scaled by `ctx.hazardP` (slow-mo halves it). Reaching the tower just bounces them back (cosmetic "bonk"), never a failure.
- Spawning: keep `2 + min(stage, 2)` active blobs via `ctx.spawnTarget()`.
- Render: isometric tiles, path, tower, blobs with letter labels; the locked blob is highlighted, typed letters dim.
- Havocs: map rotation (the board slowly turns).
