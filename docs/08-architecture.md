# 08 — Architecture

## Stack

- **TypeScript** (strict) + **Vite**. Static output for **GitHub Pages**. No backend.
- **Three.js** for all rendering (2D, isometric, 3D, FPV), plus `postprocessing`-style effect chains for render styles.
- **Web Audio** for procedural music (stems that add instruments as rhythm steadiness rises; tempo follows the player).
- **speechSynthesis** for TTS.
- **IndexedDB** (via a thin wrapper) for profiles, stats, logs and proofs.
- **Vitest** for unit and simulation tests; **Playwright** for end-to-end tests and screenshots.
- Content is discovered at build time with `import.meta.glob`, so adding a folder adds content without touching any registry.

## Modules

```
src/
  core/        rng, hashing (sha256, canonical JSON), clock, event bus, serialisation
  input/       keyboard capture (KeyboardEvent.code), layout mapping, IME/repeat/dead-key filtering, input log
  typing/      text generator (letters → patterns/words), metrics (accuracy, WPM, rhythm), weakness model
  sim/         deterministic level runtime, tick scheduler, snapshots, power-ups, abilities, havoc host
  campaign/    seeded slot filling, progression, tiers & stars, segments
  render/      Three.js host, camera rig (2D/iso/3D/FPV + transitions), style/palette chains, quality scaler
  audio/       music engine, sfx, TTS + voice effects
  ui/          overlays (intro, crossroads, handover), HUD (rhythm frame, keyboard), menus, PIN pad, stats
  avatar/      scale loader, rig hooks, customisation
  artifact/    tesseract renderer, scratch reveal, fingerprint → visual traits, code ring encode/decode
  proof/       proof bundle, PNG iTXt embed/extract, device key (WebCrypto), verifier
  party/       hot-seat modes, turn policies
  storage/     IndexedDB, profile export/import, migrations
  app/         routes: / (game), /verify, /dev/preview
content/       (see 04-content-model.md)
schemas/       JSON Schemas
tools/         validate, hash/build manifest, sim runner, credits generator
```

## Key interfaces (sketch)

```ts
interface LevelTemplate {
  manifest: TemplateManifest;               // minLetters, maxLetters?, inputMode, views, stages, tags
  create(ctx: LevelContext): LevelInstance;
}
interface LevelContext {
  rng: Rng; letters: Glyph[]; newKey: Glyph; words: WordPool; tier: TierTarget;
  style: RenderStyleHandle; palette: Palette; havocs: HavocHandle[]; scene: SceneApi; audio: AudioApi;
}
interface LevelInstance {
  nextPrompt(): Prompt;                      // dictated text or targeting labels
  onKey(e: KeyResult): void;                 // correct / wrong / word-complete
  step(dt: number, world: WorldSignals): void; // deterministic; WorldSignals = speedMul, reveal, fog
  stage(): StageInfo;
  serialize(): unknown; restore(state: unknown): void;
  dispose(): void;
}
interface Havoc   { manifest: HavocManifest; apply(world: WorldApi, intensity: number, rng: Rng): void; reducedMotion?: Havoc; }
interface RenderStyle { manifest: StyleManifest; build(r: RenderApi, palette: Palette): StyleChain; lite?: RenderStyle; }
interface Ability { manifest: AbilityManifest; grant(avatar: AvatarApi, sim: SimApi): void; }
interface PartyMode { manifest: PartyManifest; turnPolicy: "stage" | "level"; lettersFor(players: Player[]): Glyph[][]; }
```

Rendering reads simulation state through a read-only view. Templates register scene objects through `SceneApi`, which
keeps every object tagged with its layer depth so dive/flatten transitions can extrude or collapse it.

## Camera rig

A single perspective camera. Settings: `{ fov, distance, yaw, pitch, target, roll }`.
- 2D: fov ≈ 1.5°, distance chosen so the frustum height equals the design height.
- Isometric: 2D settings plus yaw 45°, pitch 35.26°.
- 3D third-person / FPV: normal field of view (50–75°).
- Transitions interpolate the settings with the dolly-zoom constraint (keep the frame height at the target constant). Easing and duration come from the transition manifest.

## Quality scaler

Automatic quality level: render resolution scale, MSAA, effect intensity, particle budget, shadow
resolution and draw distance. It steps down on slow frames and back up toward the display's **native**
pixel density. On a vsync-locked screen frame time can't reveal spare GPU capacity, so automatic
scaling never supersamples beyond native; going higher (no upper limit) is a manual setting. An
optional FPS counter (fps · frame ms · pixel ratio) is shown in-game. It never affects the simulation.

## Storage

IndexedDB database `tbtge` (namespaced, because every GitHub Pages site under `life2do.github.io` shares one origin and one storage space) stores: `profiles`, `campaigns`, `segments` (logs + snapshot hashes), `snapshots` (serialised state, pruned to level boundaries after completion), `stats`, `proofs`, `settings`. Schema-versioned, with migrations.

## Builds & deploy

- CI (`.github/workflows/ci.yml`): runs on pull requests and on pushes to `main` (no feature-branch push trigger, so a PR's commits aren't tested twice; a newer push cancels a PR's outdated run, runs on `main` are never cancelled).
  - `plan` (`tools/affected.mjs`): on a pull request, classifies the changed files and decides what runs; pushes to `main` run everything. Docs-only changes run nothing heavy; a change inside one template's folder tests only that game; render-only content (styles, palettes, havocs, scales, illustrations) smoke-tests every game; shared content (languages, campaign, abilities, power-ups) and engine files (`src/`, `tools/`, `tests/`, configs, workflows, schemas) run everything; unknown paths count as engine. A changed template that is pinned to a campaign level also reruns the level matrix and the cross-browser replay.
  - `check`: lint (all files, or only the changed ones) → typecheck → validate content → engine unit + simulation tests (`tests/`, `src/`) → dependency audit when `package-lock.json` changes → production build, uploaded as an artifact.
  - `template (<id>)`: **one job per game** — its own simulation tests (`content/templates/<id>/template.test.ts`: `pass` bot at tiers 1/4/7, `struggle`, `masher`, determinism) and its browser smoke test (`e2e/templates.spec.ts`, every supported view: no page errors, the bot's typing advances the level, the world is drawn). A new template folder gets its own job automatically.
  - `e2e`: the full suite in Chromium, Firefox and WebKit as parallel jobs with cached Playwright browsers (per-game smoke tests excluded; they run in `template`).
  - `deploy` (main only): downloads the tested build and **appends** it to the `gh-pages` branch under `/v/<buildId>/`, then updates `/` and `/versions.json` (see Hosting constraints).
  - Changed file names and template ids reach CI commands only as data (environment variables / argv), never interpolated into the shell.
- `build-info.json` (generated, `src/generated/`): build hash, git commit, content item hashes.
- **Build id** = the first 16 base64url characters of the build hash; builds are served from `/v/<buildId>/`.
- The build hash covers **engine sources** (`src/**`, HTML entry points, `package-lock.json`, `vite.config.ts`) plus content item hashes — not the bundle bytes, because the bundle embeds its own `/v/<buildId>/` base path.
- Milestone 1 copies each build whole into `/v/<buildId>/` (about 0.7 MB per build). Sharing unchanged assets under `/a/<hash>` is deferred until asset files grow.
- Deploy script: `tools/publish-pages.mjs` (never overwrites or deletes an existing `/v/` folder; updates `/`, `/verify/`, `404.html`, `versions.json`, `.nojekyll`; fails above 800 MB).

## Hosting constraints (GitHub Pages)

The game is a **static site** (an `index.html` plus JS bundles and assets; not a single HTML file) with no backend.
All features run client-side: IndexedDB, WebCrypto, `speechSynthesis`, Web Audio, Three.js.

| Constraint | Consequence / rule |
|---|---|
| **Immutable old builds** (`/v/<hash>/` must stay online for replays) | Don't use the stock "upload artifact + deploy-pages" Action on its own: it replaces the whole site every deploy. Deploy by **pushing to a `gh-pages` branch that only grows** (new build folder + new `/a/<hash>` assets + updated `/index.html` and `/versions.json`). Never delete old `/v/` folders. |
| **Size**: published site ≤ ~1 GB; soft bandwidth ~100 GB/month; soft limit ~10 builds/hour | Assets are content-addressed under `/a/<hash>` and shared across builds; only engine bundles and changed assets grow. CI reports total site size and fails above 800 MB. Large optional assets (e.g. a WASM TTS engine, 2–20 MB) are added once and shared. |
| **No server-side routing / rewrites** | Every route is a real file: `/index.html` (redirect to latest build), `/verify/index.html`, `/v/<hash>/index.html`, `/v/<hash>/dev/preview/index.html`. In-app navigation uses query strings or `#` fragments. `404.html` redirects unknown paths to `/`. |
| **Base path differs by host** (`/<repo>/` on `<user>.github.io`, `/` on a custom domain such as the one set in `CNAME`) | Builds use a **relative** Vite `base` (`./`), so the same build works under `/<repo>/v/<id>/`, a custom domain's `/v/<id>/` or a local folder. Never bake an absolute site path into a build. `404.html` picks the root at runtime. The `CNAME` file on `gh-pages` belongs to the repository settings and is never touched by deploys. |
| **No custom HTTP headers** (no COOP/COEP, no custom CSP or cache headers) | No feature may require cross-origin isolation (`SharedArrayBuffer`, multi-threaded WASM). Future WASM TTS uses a single-threaded build. Caching relies on immutable, hash-named files. |
| **Shared origin** `life2do.github.io` | Namespace all storage: IndexedDB database `tbtge`, `localStorage` keys `tbtge:*`, service worker scope limited to `/<repo>/`. Builds within the repo intentionally share saves. |
| **HTTPS** | Provided by Pages. Required for WebCrypto (device keys, hashing) and camera access (ring scan on `/verify`). |
| **Offline** (optional, milestone 2+) | A service worker scoped to `/<repo>/` may precache the current build and its `/a/` assets. |
