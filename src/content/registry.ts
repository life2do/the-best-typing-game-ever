/**
 * Content discovery (docs/04, AGENTS.md rule 1). Everything under content/ is found with
 * import.meta.glob at build time; adding a folder adds content without editing any registry.
 * This module is Node-safe (no Three.js); renderer modules are discovered in src/render/registry.ts.
 */
import type {
  Illustration, IllustrationManifest,
  AbilityManifest, CampaignRulesManifest, ComplexityScaleManifest, HavocManifest, LanguagePack, LanguagePackManifest,
  LevelTemplateManifest, PaletteManifest, PowerupManifest, RenderStyleManifest,
} from './types';

const json = <T>(g: Record<string, unknown>) => Object.values(g) as T[];

const languageManifests = json<LanguagePackManifest>(import.meta.glob('../../content/languages/*/manifest.json', { eager: true, import: 'default' }));
const languageFiles = import.meta.glob('../../content/languages/*/words/*.txt', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;

export const templates = json<LevelTemplateManifest>(import.meta.glob('../../content/templates/*/manifest.json', { eager: true, import: 'default' }));
export const styles = json<RenderStyleManifest>(import.meta.glob('../../content/styles/*/manifest.json', { eager: true, import: 'default' }));
export const palettes = json<PaletteManifest>(import.meta.glob('../../content/palettes/*.json', { eager: true, import: 'default' }));
export const havocs = json<HavocManifest>(import.meta.glob('../../content/havocs/*/manifest.json', { eager: true, import: 'default' }));
export const abilities = json<AbilityManifest>(import.meta.glob('../../content/abilities/*.json', { eager: true, import: 'default' }));
export const powerups = json<PowerupManifest>(import.meta.glob('../../content/powerups/*.json', { eager: true, import: 'default' }));
export const scales = json<ComplexityScaleManifest>(import.meta.glob('../../content/scales/*/manifest.json', { eager: true, import: 'default' }));
const illustrationManifests = import.meta.glob('../../content/illustrations/*/manifest.json', { eager: true, import: 'default' }) as Record<string, IllustrationManifest>;
const illustrationSvgs = import.meta.glob('../../content/illustrations/*/*.svg', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
export const illustrations: Illustration[] = Object.entries(illustrationManifests).map(([path, m]) => ({
  ...m,
  svg: illustrationSvgs[path.replace('manifest.json', m.entry)] ?? '',
}));

/** Illustration for a word in a language, if one is drawn. */
export function illustrationFor(word: string, lang: string): Illustration | undefined {
  return illustrations.find((i) => i.words[lang]?.includes(word));
}

export const campaignRules = json<CampaignRulesManifest>(import.meta.glob('../../content/campaign/*.json', { eager: true, import: 'default' }));

export function parseWordList(text: string): string[] {
  const seen: Record<string, true> = {};
  const out: string[] = [];
  for (const raw of text.split('\n')) {
    const w = raw.trim();
    if (!w || w.startsWith('#') || seen[w]) continue;
    seen[w] = true;
    out.push(w.normalize('NFC'));
  }
  return out;
}

export function loadLanguage(id: string): LanguagePack {
  const m = languageManifests.find((l) => l.id === id || l.id === `lang.${id}`);
  if (!m) throw new Error(`Unknown language ${id}`);
  const dir = Object.keys(languageFiles).find((p) => p.includes(`/languages/${m.id.replace(/^lang\./, '')}/`))?.split('/words/')[0];
  const file = (rel: string) => {
    const key = `${dir}/${rel}`;
    if (!(key in languageFiles)) throw new Error(`Missing language file ${key}`);
    return languageFiles[key];
  };
  const wordLists: Record<string, string[]> = {};
  for (const [tag, rel] of Object.entries(m.words)) wordLists[tag] = parseWordList(file(rel));
  const block = parseWordList(file(m.blocklist));
  const codeOf: Record<string, string> = {};
  const needsShift: Record<string, true> = {};
  for (const [code, k] of Object.entries(m.layout)) if (!(k.char in codeOf)) codeOf[k.char] = code;
  for (const [code, k] of Object.entries(m.layout))
    if (k.shift && !(k.shift in codeOf)) {
      codeOf[k.shift] = code;
      needsShift[k.shift] = true;
    }
  return {
    ...m,
    wordLists,
    blockWords: block.filter((w) => !w.startsWith('~')),
    blockSubstrings: block.filter((w) => w.startsWith('~')).map((w) => w.slice(1)),
    codeOf,
    needsShift,
  };
}

export const languages = languageManifests;

export function byId<T extends { id: string }>(list: T[], id: string): T {
  const bare = id.split('@')[0];
  const item = list.find((x) => x.id === bare);
  if (!item) throw new Error(`Unknown content item ${id}`);
  return item;
}
