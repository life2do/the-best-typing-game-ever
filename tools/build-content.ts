/**
 * Computes the build fingerprint (docs/10 §3.3): content item hashes + engine source hashes.
 * Writes src/generated/build-info.json. With --print, prints only the short build id (used as /v/<id>/).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { ROOT, buildHash } from './content';

const { build, items } = buildHash();
const id = build.slice('sha256-'.length, 'sha256-'.length + 16);
if (process.argv.includes('--print')) {
  process.stdout.write(id);
} else {
  let commit = process.env.GITHUB_SHA ?? '';
  try {
    commit ||= execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim();
  } catch {
    commit ||= 'unknown';
  }
  mkdirSync(join(ROOT, 'src/generated'), { recursive: true });
  writeFileSync(join(ROOT, 'src/generated/build-info.json'), JSON.stringify({ build, id, commit, items, builtAt: new Date().toISOString() }, null, 2) + '\n');
  console.log(`build ${id} (${build}) commit ${commit.slice(0, 12)} · ${Object.keys(items).length} content items`);
}
