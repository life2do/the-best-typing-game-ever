/**
 * npm run blocklist -- <command> <lang> [options]   (hashed blocklists, src/typing/blocklist.ts)
 *
 *   add <lang> [--sub] [--category <label>]   ask for a word without showing it, append its salted hash;
 *                                             piped input: one word per line, "~word" = blocked inside words
 *   check <lang>                              ask for a word (hidden) and say whether it is blocked
 *   import <lang> <file>                      hash a plain-text list (old format: "~" = inside words,
 *                                             "#" comments); you delete the plain file afterwards
 *
 * The words never appear in the terminal, the repository or the game; only their hashes are stored.
 * <lang> is the folder name under content/languages (en, ru, …).
 */
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import { blockEntry, blockSalt, isBlocked, parseBlocklist } from '../src/typing/blocklist';

const [cmd, lang, ...rest] = process.argv.slice(2);
const usage = () => {
  console.error('usage: npm run blocklist -- add|check|import <lang> [--sub] [--category <label>] [file]');
  process.exit(2);
};
if (!cmd || !lang || !/^[a-z]{2,8}$/.test(lang)) usage();
const dir = join(import.meta.dirname, '..', 'content', 'languages', lang);
const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
const file = join(dir, manifest.blocklist);
const salt = blockSalt(manifest.id);
const load = () => parseBlocklist(existsSync(file) ? readFileSync(file, 'utf8') : '', salt);
const opt = (name: string) => {
  const i = rest.indexOf(name);
  return i >= 0 ? rest[i + 1] : undefined;
};

/** Reads one line from a terminal without echoing it. */
function hiddenLine(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    process.stderr.write(prompt);
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    let buf = '';
    const onData = (ch: string) => {
      if (ch === '\r' || ch === '\n') {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.off('data', onData);
        process.stderr.write('\n');
        resolve(buf);
      } else if (ch === '\u0003') process.exit(130);
      else if (ch === '\u007f') buf = buf.slice(0, -1);
      else buf += ch;
    };
    stdin.on('data', onData);
  });
}

async function words(): Promise<string[]> {
  if (process.stdin.isTTY) return [await hiddenLine('Word (not shown): ')];
  const out: string[] = [];
  for await (const line of createInterface({ input: process.stdin })) if (line.trim()) out.push(line.trim());
  return out;
}

function append(list: string[], defaultSub: boolean, category: string | undefined): void {
  const b = load();
  const lines: string[] = [];
  let skipped = 0;
  for (const raw of list) {
    const sub = defaultSub || raw.startsWith('~');
    const w = raw.replace(/^~/, '').trim();
    if (!w) continue;
    const entry = blockEntry(salt, w, sub, category);
    const hash = entry.split(/\s+/)[sub ? 2 : 1];
    const have = sub ? b.subs[w.length]?.[hash] === true : b.words[hash] === true;
    if (have || lines.some((l) => l.startsWith(entry.split('  #')[0]))) {
      skipped++;
      continue;
    }
    lines.push(entry);
  }
  if (!existsSync(file)) writeFileSync(file, '# Hashed blocklist (src/typing/blocklist.ts). Add words with: npm run blocklist -- add <lang>\n');
  if (lines.length) appendFileSync(file, lines.join('\n') + '\n');
  console.log(`${lines.length} entr${lines.length === 1 ? 'y' : 'ies'} added to ${manifest.blocklist}${skipped ? `, ${skipped} already there` : ''}.`);
}

if (cmd === 'add') append(await words(), rest.includes('--sub'), opt('--category'));
else if (cmd === 'check') {
  const b = load();
  for (const w of await words()) console.log(isBlocked(w, b) ? 'blocked' : 'not blocked');
} else if (cmd === 'import') {
  const src = rest.find((r) => !r.startsWith('--'));
  if (!src || !existsSync(src)) usage();
  const plain = readFileSync(src!, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  append(plain, false, opt('--category') ?? 'imported');
} else usage();
