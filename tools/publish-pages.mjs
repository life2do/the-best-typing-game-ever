// Usage: node tools/publish-pages.mjs <dist> <pagesDir> <buildId> <commit>
// Copies a build into <pagesDir>/v/<buildId>/ (never overwriting or deleting other builds), then updates
// the root redirect, /verify/ redirect, 404.html, versions.json and .nojekyll. Fails above the size budget.
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [dist, pages, id, commit] = process.argv.slice(2);
if (!dist || !pages || !id) throw new Error('usage: publish-pages.mjs <dist> <pagesDir> <buildId> <commit>');
const target = join(pages, 'v', id);
if (existsSync(target)) console.log(`build ${id} already published; leaving it untouched`);
else {
  mkdirSync(join(pages, 'v'), { recursive: true });
  cpSync(dist, target, { recursive: true });
}
const redirect = (to) => `<!doctype html><meta charset="utf-8"><title>The Best Typing Game Ever</title><meta http-equiv="refresh" content="0; url=${to}"><link rel="canonical" href="${to}"><script>location.replace(${JSON.stringify(to)} + location.search + location.hash)</script><a href="${to}">Continue</a>\n`;
writeFileSync(join(pages, 'index.html'), redirect(`./v/${id}/`));
mkdirSync(join(pages, 'verify'), { recursive: true });
writeFileSync(join(pages, 'verify', 'index.html'), redirect(`../v/${id}/verify/`));
// 404: send unknown paths to the site root, which is "/" on a custom domain and "/<repo>/" on <user>.github.io.
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
writeFileSync(
  join(pages, '404.html'),
  `<!doctype html><meta charset="utf-8"><title>Not found</title><script>var r=${JSON.stringify('/' + repo + '/')};location.replace(location.hostname.endsWith('github.io')&&location.pathname.indexOf(r)===0?r:'/')</script><a href="/">Home</a>\n`,
);
writeFileSync(join(pages, '.nojekyll'), '');
const vf = join(pages, 'versions.json');
const versions = existsSync(vf) ? JSON.parse(readFileSync(vf, 'utf8')) : { latest: '', builds: [] };
if (!versions.builds.some((b) => b.id === id)) versions.builds.push({ id, commit, publishedAt: new Date().toISOString() });
versions.latest = id;
writeFileSync(vf, JSON.stringify(versions, null, 2) + '\n');
const size = (p) => (statSync(p).isDirectory() ? readdirSync(p).filter((n) => n !== '.git').reduce((s, n) => s + size(join(p, n)), 0) : statSync(p).size);
const total = size(pages);
console.log(`published ${id}; site size ${(total / 1e6).toFixed(1)} MB; ${versions.builds.length} build(s)`);
if (total > 800e6) throw new Error('Site exceeds the 800 MB budget (docs/08 Hosting constraints)');
