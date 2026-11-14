/** CI test plan (tools/affected.mjs): which checks run for which changed files. */
import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';

const plan = (files: string[]) =>
  JSON.parse(execFileSync('node', ['tools/affected.mjs', '--files', files.join(',')], { encoding: 'utf8', env: { ...process.env, GITHUB_OUTPUT: '' } }));

describe('affected plan', () => {
  it('docs only: nothing heavy runs', () => {
    const p = plan(['docs/09-roadmap.md', 'README.md']);
    expect(p).toMatchObject({ lint: 'none', typecheck: false, validate: false, unit: false, templates: [], e2e: false, build: false });
  });

  it('one template: only that game is tested, separately', () => {
    const p = plan(['content/templates/racer/view.ts']);
    expect(p.templates).toEqual(['racer']);
    expect(p.lint).toBe('changed');
    expect(p.lintFiles).toEqual(['content/templates/racer/view.ts']);
    expect(p.validate).toBe(true);
  });

  it('pinned template also reruns the level matrix and cross-browser replay', () => {
    const p = plan(['content/templates/pulse-runner/sim.ts']);
    expect(p.templates).toEqual(['pulse-runner']);
    expect(p.unit).toBe(true);
    expect(p.e2e).toBe(true);
  });

  it('engine change: everything', () => {
    const p = plan(['src/sim/level.ts']);
    expect(p).toMatchObject({ lint: 'all', typecheck: true, validate: true, unit: true, e2e: true, build: true });
    expect(p.templates.length).toBeGreaterThanOrEqual(4);
  });

  it('shared content (words): all games + unit + e2e, no full lint', () => {
    const p = plan(['content/languages/en/words/common.txt']);
    expect(p).toMatchObject({ lint: 'none', validate: true, unit: true, e2e: true });
    expect(p.templates.length).toBeGreaterThanOrEqual(4);
  });

  it('render-only content: every game smoke-tested, no unit/e2e suite', () => {
    const p = plan(['content/palettes/dusk.json']);
    expect(p).toMatchObject({ validate: true, unit: false, e2e: false, build: true });
    expect(p.templates.length).toBeGreaterThanOrEqual(4);
  });

  it('lockfile change triggers the dependency audit', () => {
    expect(plan(['package-lock.json']).audit).toBe(true);
  });

  it('unknown paths are treated as engine changes', () => {
    expect(plan(['weird/new-thing.bin']).e2e).toBe(true);
  });
});
