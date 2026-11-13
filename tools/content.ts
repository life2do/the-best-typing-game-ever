/** Node-side content scanning and hashing (docs/04, docs/10 §3.3). */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep, dirname } from 'node:path';
import { hashBytes, hashValue, type Hash } from '../src/core/hash';

export const ROOT = join(import.meta.dirname, '..');
export const CONTENT = join(ROOT, 'content');

const posix = (p: string) => p.split(sep).join('/').normalize('NFC');

export function walk(dir: string, filter: (p: string) => boolean = () => true): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p, filter));
    else if (filter(p)) out.push(p);
  }
  return out;
}

export interface ContentItem {
  /** absolute path of manifest.json or the single-file item */
  manifestPath: string;
  /** directory items: all files in the folder; single-file items: just the file */
  files: string[];
  manifest: any;
}

/** Items are folders with manifest.json, or single .json files directly under a type folder. */
export function scanContent(): ContentItem[] {
  const items: ContentItem[] = [];
  for (const type of readdirSync(CONTENT).sort()) {
    const tdir = join(CONTENT, type);
    if (!statSync(tdir).isDirectory()) continue;
    for (const name of readdirSync(tdir).sort()) {
      const p = join(tdir, name);
      if (statSync(p).isDirectory()) {
        const mp = join(p, 'manifest.json');
        if (!existsSync(mp)) continue;
        items.push({ manifestPath: mp, files: walk(p), manifest: JSON.parse(readFileSync(mp, 'utf8')) });
      } else if (name.endsWith('.json')) {
        items.push({ manifestPath: p, files: [p], manifest: JSON.parse(readFileSync(p, 'utf8')) });
      }
    }
  }
  return items;
}

/** Item hash = hash({ manifest without hash, files: { relPath: fileHash } }) — the manifest file itself is excluded from files. */
export function itemHash(item: ContentItem): Hash {
  const { hash: _h, ...manifest } = item.manifest;
  const files: Record<string, Hash> = {};
  const base = item.files.length === 1 && item.files[0] === item.manifestPath ? dirname(item.manifestPath) : dirname(item.manifestPath);
  for (const f of item.files) if (f !== item.manifestPath) files[posix(relative(base, f))] = hashBytes(readFileSync(f));
  return hashValue({ manifest, files });
}

export function contentHashes(): Record<string, Hash> {
  const out: Record<string, Hash> = {};
  for (const it of scanContent()) out[`${it.manifest.id}@${it.manifest.version}`] = itemHash(it);
  return out;
}

/** Engine fingerprint over sources that affect the shipped game. */
export function engineHashes(): Record<string, Hash> {
  const out: Record<string, Hash> = {};
  const files = [
    ...walk(join(ROOT, 'src'), (p) => !p.includes(`${sep}generated${sep}`) && !p.endsWith('.test.ts')),
    ...['index.html', 'verify/index.html', 'dev/preview/index.html', 'package-lock.json', 'vite.config.ts'].map((f) => join(ROOT, f)).filter(existsSync),
  ];
  for (const f of files) out[posix(relative(ROOT, f))] = hashBytes(readFileSync(f));
  return out;
}

export function buildHash(): { build: Hash; engine: Record<string, Hash>; items: Record<string, Hash> } {
  const engine = engineHashes();
  const items = contentHashes();
  return { build: hashValue({ engine, items }), engine, items };
}
