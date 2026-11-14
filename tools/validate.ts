/**
 * npm run validate — schemas, licenses, PROMPT.md, word lists vs blocklist, NFC, refs, rig hooks,
 * campaign slot feasibility (AGENTS.md). Exits non-zero on any error.
 */
import Ajv2020 from 'ajv/dist/2020.js';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { ROOT, scanContent } from './content';
import { canonicalize } from '../src/core/canonical';

const errors: string[] = [];
const warnings: string[] = [];
const err = (m: string) => errors.push(m);

const ajv = new (Ajv2020 as any)({ allErrors: true, strict: false });
const schemaDir = join(ROOT, 'schemas');
for (const f of readdirSync(schemaDir).filter((f) => f.endsWith('.schema.json'))) ajv.addSchema(JSON.parse(readFileSync(join(schemaDir, f), 'utf8')));
const schemaFor: Record<string, string> = {
  'language-pack': 'language-pack', 'level-template': 'level-template', 'render-style': 'render-style', palette: 'palette',
  havoc: 'havoc', ability: 'ability', powerup: 'powerup', 'complexity-scale': 'complexity-scale', 'voice-effect': 'voice-effect',
  'campaign-rules': 'campaign-rules', 'party-mode': 'party-mode', illustration: 'illustration',
};
const SPDX = ['CC0-1.0', 'MIT', 'OFL-1.1', 'CC-BY-4.0', 'CC-BY-SA-4.0', 'Apache-2.0'];
const CORE_HOOKS = ['idle', 'move', 'jump', 'land', 'stumble', 'celebrate', 'powerup'];

const items = scanContent();
const ids = new Map<string, any>();
for (const it of items) {
  const m = it.manifest;
  const where = it.manifestPath.replace(ROOT + '/', '');
  if (ids.has(`${m.id}@${m.version}`)) err(`${where}: duplicate id ${m.id}@${m.version}`);
  ids.set(`${m.id}@${m.version}`, m);
  const schema = schemaFor[m.kind];
  if (!schema) {
    err(`${where}: unknown kind ${m.kind}`);
    continue;
  }
  const validate = ajv.getSchema(`https://life2do.github.io/the-best-typing-game-ever/schemas/${schema}.schema.json`);
  if (!validate(m)) for (const e of validate.errors) err(`${where}: ${e.instancePath || '/'} ${e.message}`);
  if (m.hash) err(`${where}: hand-written hash field (computed by the build)`);
  if (!SPDX.includes(m.license)) err(`${where}: license ${m.license} is not an allowed SPDX id`);
  if (m.prompt === 'PROMPT.md' && !existsSync(join(dirname(it.manifestPath), 'PROMPT.md'))) err(`${where}: prompt points to missing PROMPT.md`);
  try {
    canonicalize(m);
  } catch (e) {
    err(`${where}: not canonicalisable: ${(e as Error).message}`);
  }
}

const byKind = (k: string) => items.filter((i) => i.manifest.kind === k).map((i) => i.manifest);
const resolves = (ref: string) => ref.startsWith('procedural:') || ref === 'calm-builtin' || ids.has(ref);

// refs
for (const it of items) {
  const m = it.manifest;
  const refs: string[] = [...Object.values(m.refs ?? {}) as string[]];
  if (m.kind === 'ability' && m.powerup) refs.push(m.powerup);
  if (m.kind === 'render-style' && m.lite) refs.push(m.lite);
  if (m.kind === 'campaign-rules') {
    for (const s of m.slots) if (s.fixedTemplate) refs.push(s.fixedTemplate);
    for (const d of m.dropTable ?? []) refs.push(d.item);
  }
  for (const r of refs) if (!resolves(r)) err(`${m.id}: unresolved ref ${r}`);
}

// rig hooks
const abilityIds = byKind('ability').map((a) => a.id);
for (const sc of byKind('complexity-scale')) {
  for (const h of Object.keys(sc.rigHooks)) {
    if (h.startsWith('ability:') && !abilityIds.includes(h.slice(8))) err(`${sc.id}: rig hook ${h} refers to unknown ability`);
  }
  for (const h of CORE_HOOKS) if (!(h in sc.rigHooks)) err(`${sc.id}: missing core rig hook ${h}`);
}

// languages: word lists, blocklist, NFC, layout coverage
const languages = byKind('language-pack');
for (const it of items.filter((i) => i.manifest.kind === 'language-pack')) {
  const m = it.manifest;
  const dir = dirname(it.manifestPath);
  const read = (rel: string) => {
    const p = join(dir, rel);
    if (!existsSync(p)) {
      err(`${m.id}: missing file ${rel}`);
      return [];
    }
    const text = readFileSync(p, 'utf8');
    if (text !== text.normalize('NFC')) err(`${m.id}: ${rel} is not NFC`);
    if (text.includes('\r')) err(`${m.id}: ${rel} has CR line endings`);
    return text.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  };
  const block = read(m.blocklist);
  const blockWords = block.filter((b) => !b.startsWith('~'));
  const blockSub = block.filter((b) => b.startsWith('~')).map((b) => b.slice(1));
  const chars = new Set(Object.values(m.layout).map((k: any) => k.char));
  for (const [tag, rel] of Object.entries(m.words) as [string, string][]) {
    for (const w of read(rel)) {
      if (blockWords.includes(w) || blockSub.some((s) => w.includes(s))) err(`${m.id}: word "${w}" in ${tag} is blocklisted`);
      for (const ch of w) if (!chars.has(ch)) err(`${m.id}: word "${w}" in ${tag} uses a character not on the layout`);
    }
  }
  const ordered = (m.order as string[][]).flat();
  for (const a of m.alphabet) if (!ordered.includes(a)) err(`${m.id}: letter ${a} missing from order`);
  for (const ch of ordered) if (!chars.has(ch)) err(`${m.id}: order key ${JSON.stringify(ch)} not on layout`);
  // abilities: every trigger word for this language must be typeable with the full order and not blocklisted
  const lang = m.id.replace(/^lang\./, '');
  for (const ab of byKind('ability')) {
    const words: string[] = ab.triggerWords[lang] ?? [];
    if (!words.length) warnings.push(`${ab.id}: no trigger words for ${lang}`);
    for (const w of words) {
      const levels = [...w].map((ch) => (m.order as string[][]).findIndex((keys) => keys.includes(ch)));
      if (levels.some((l) => l < 0)) err(`${ab.id}: trigger word "${w}" not typeable in ${m.id}`);
      if (blockWords.includes(w) || blockSub.some((s) => w.includes(s))) err(`${ab.id}: trigger word "${w}" is blocklisted`);
    }
  }
}

// campaign feasibility
const templates = byKind('level-template');
for (const c of byKind('campaign-rules')) {
  const lang = languages.find((l) => l.id === c.language);
  if (!lang) {
    err(`${c.id}: unknown language ${c.language}`);
    continue;
  }
  const levels = lang.order.length + lang.keyGroups.length;
  // Every key-group key must be on the keyboard: "Shift", a layout key code, or a character (plain or with Shift).
  const chars = new Set(Object.values(lang.layout as Record<string, { char: string; shift?: string }>).flatMap((k) => [k.char, k.shift ?? '']).filter(Boolean));
  for (const g of lang.keyGroups)
    for (const k of g.keys)
      if (k !== 'Shift' && !(k in lang.layout) && !chars.has(k)) err(`${lang.id}: key group ${g.id} key ${JSON.stringify(k)} is not on the keyboard layout`);
  if (c.slots.length < levels) warnings.push(`${c.id}: ${c.slots.length} slots for ${levels} levels (extra levels use defaults)`);
  for (const s of c.slots) {
    const known = (lang.order as string[][]).slice(0, Math.min(s.level, lang.order.length)).flat().filter((k) => k !== ' ').length;
    const fits = templates.filter((t) => t.minLetters <= known);
    if (!fits.length) err(`${c.id}: slot ${s.level} has no template with minLetters <= ${known}`);
    if (s.fixedTemplate) {
      const t = ids.get(s.fixedTemplate);
      if (t && t.minLetters > known) err(`${c.id}: slot ${s.level} fixed template ${t.id} needs ${t.minLetters} letters, only ${known} known`);
    }
  }
}

// templates: required files
for (const it of items.filter((i) => i.manifest.kind === 'level-template')) {
  const dir = dirname(it.manifestPath);
  for (const f of ['sim.ts', 'view.ts', 'PROMPT.md', 'template.test.ts']) if (!existsSync(join(dir, f))) err(`${it.manifest.id}: missing ${f}`);
}
// illustrations: SVG present, plain (no inline styles/scripts), words exist in the language word lists
for (const it of items.filter((i) => i.manifest.kind === 'illustration')) {
  const m = it.manifest;
  const file = join(dirname(it.manifestPath), m.entry);
  if (!existsSync(file)) {
    err(`${m.id}: missing ${m.entry}`);
    continue;
  }
  const svg = readFileSync(file, 'utf8');
  if (!/viewBox="0 0 100 100"/.test(svg)) err(`${m.id}: SVG must use viewBox="0 0 100 100"`);
  if (/style=|<script|on[a-z]+=|href=/i.test(svg)) err(`${m.id}: SVG must not contain inline styles, scripts, event handlers or links`);
  for (const [lang, words] of Object.entries(m.words) as [string, string[]][]) {
    const pack = items.find((i) => i.manifest.kind === 'language-pack' && i.manifest.id === `lang.${lang}`);
    if (!pack) continue;
    const dir = dirname(pack.manifestPath);
    const all = Object.values(pack.manifest.words as Record<string, string>).flatMap((rel) => readFileSync(join(dir, rel), 'utf8').split('\n').map((l) => l.trim()));
    for (const w of words) if (!all.includes(w)) err(`${m.id}: word "${w}" is not in the ${lang} word lists`);
  }
}
for (const it of items.filter((i) => ['render-style', 'havoc'].includes(i.manifest.kind))) {
  const dir = dirname(it.manifestPath);
  if (!existsSync(join(dir, it.manifest.entry))) err(`${it.manifest.id}: missing entry ${it.manifest.entry}`);
}

for (const w of warnings) console.warn(`warn: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  console.error(`\n${errors.length} error(s) in ${items.length} items`);
  process.exit(1);
}
console.log(`validate: ${items.length} content items OK`);
