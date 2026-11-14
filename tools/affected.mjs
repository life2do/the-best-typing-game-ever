#!/usr/bin/env node
/**
 * CI test plan from the files a change touches (docs/08 Builds & deploy, D64).
 *
 *   node tools/affected.mjs --base <sha>   plan for the diff base...HEAD
 *   node tools/affected.mjs --all          everything (pushes to main, manual runs)
 *   node tools/affected.mjs --files a,b    plan for an explicit file list (tests)
 *
 * Prints the plan as JSON and, on GitHub Actions, writes each field to $GITHUB_OUTPUT.
 * Unknown paths count as engine changes, so a new kind of file is tested fully until classified here.
 *
 * Plan fields:
 *   lint       "all" | "changed" | "none"   (lintFiles: the changed lintable files)
 *   typecheck  any TypeScript changed
 *   validate   content or schemas changed
 *   unit       engine unit tests (tests/**, src/**)
 *   templates  template ids whose own tests + browser smoke test run, one CI job each
 *   e2e        full cross-browser e2e suite
 *   audit      dependency audit (lockfile changed)
 *   build      production build
 */
import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new globalThis.URL('..', import.meta.url));
const args = process.argv.slice(2);
const all = args.includes('--all');
const base = args[args.indexOf('--base') + 1];

const allTemplates = readdirSync(join(ROOT, 'content/templates'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^[a-z0-9][a-z0-9-]*$/.test(d.name)) // ids are used in CI job names and paths
  .map((d) => d.name)
  .sort();

/** Templates pinned to campaign levels: the e2e fixtures and the level matrix test replay them. */
function pinnedTemplates() {
  const ids = new Set();
  const dir = join(ROOT, 'content/campaign');
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    for (const s of JSON.parse(readFileSync(join(dir, f), 'utf8')).slots ?? []) {
      if (s.fixedTemplate) ids.add(s.fixedTemplate.replace(/^template\./, '').replace(/@.*$/, ''));
    }
  }
  return ids;
}

function changedFiles() {
  if (all) return null;
  const fi = args.indexOf('--files');
  if (fi >= 0) return (args[fi + 1] ?? '').split(',').filter(Boolean);
  if (!base) throw new Error('usage: affected.mjs --base <sha> | --all');
  return execFileSync('git', ['diff', '--name-only', `${base}...HEAD`], { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean);
}

const files = changedFiles();
const plan = { lint: 'none', lintFiles: [], typecheck: false, validate: false, unit: false, templates: [], e2e: false, audit: false, build: false, reasons: [] };

function full(reason) {
  Object.assign(plan, { lint: 'all', typecheck: true, validate: true, unit: true, templates: allTemplates, e2e: true, build: true });
  plan.reasons.push(reason);
}

if (!files) full('--all');
else {
  const templates = new Set();
  const ownChanges = new Set(); // templates whose own folder changed
  const lintable = /\.(ts|tsx|js|mjs|cjs)$/;
  const docOnly = (f) => /^docs\//.test(f) || /^(README|AGENTS|CHANGELOG|LICENSE)/.test(f) || (/\.md$/.test(f) && !f.startsWith('content/'));
  // Engine: anything that can change how every level runs or renders.
  const engine = (f) =>
    /^(src|tools|tests|schemas|\.github)\//.test(f) ||
    /^(package(-lock)?\.json|vite\.config\.ts|tsconfig[^/]*\.json|eslint\.config\.[a-z]+|playwright\.config\.ts|index\.html)$/.test(f) ||
    /^(verify|dev)\//.test(f);
  // Content every level depends on (words, campaign slots, abilities, power-ups).
  const sharedSim = (f) => /^content\/(languages|campaign|abilities|powerups)\//.test(f);
  // Render-only content: styles, palettes, havocs, scales, illustrations.
  const renderOnly = (f) => /^content\/(styles|palettes|havocs|scales|illustrations)\//.test(f);

  for (const f of files) {
    if (lintable.test(f) && /^[\w./@-]+$/.test(f) && existsSync(join(ROOT, f))) plan.lintFiles.push(f);
    if (/\.(ts|tsx)$/.test(f)) plan.typecheck = true;
    if (f === 'package-lock.json') plan.audit = true;
    const tpl = /^content\/templates\/([^/]+)\//.exec(f);
    if (docOnly(f)) continue;
    if (tpl) {
      templates.add(tpl[1]);
      ownChanges.add(tpl[1]);
      plan.validate = plan.build = true;
    } else if (/^e2e\//.test(f)) {
      plan.e2e = plan.build = true;
      plan.reasons.push(`e2e: ${f}`);
    } else if (sharedSim(f)) {
      plan.validate = plan.unit = plan.e2e = plan.build = true;
      allTemplates.forEach((t) => templates.add(t));
      plan.reasons.push(`shared content: ${f}`);
    } else if (renderOnly(f)) {
      plan.validate = plan.build = true;
      allTemplates.forEach((t) => templates.add(t)); // every game's browser smoke test renders them
      plan.reasons.push(`render content: ${f}`);
    } else if (engine(f)) {
      full(`engine: ${f}`);
      break;
    } else {
      full(`unclassified: ${f}`);
      break;
    }
  }
  if (plan.lint !== 'all') {
    plan.lint = plan.lintFiles.length ? 'changed' : 'none';
    // A changed pinned template changes campaign levels 1–4: rerun their matrix test and the cross-browser replay.
    const pinned = pinnedTemplates();
    for (const t of ownChanges) {
      if (pinned.has(t)) {
        plan.unit = plan.e2e = true;
        plan.reasons.push(`pinned template: ${t}`);
      }
    }
    plan.templates = [...templates].filter((t) => allTemplates.includes(t)).sort();
    if (plan.e2e) plan.build = true;
  }
}

console.log(JSON.stringify(plan, null, 2));
if (process.env.GITHUB_OUTPUT) {
  const out = [];
  for (const [k, v] of Object.entries(plan)) out.push(`${k}=${typeof v === 'string' ? v : JSON.stringify(v)}`);
  appendFileSync(process.env.GITHUB_OUTPUT, out.join('\n') + '\n');
}
