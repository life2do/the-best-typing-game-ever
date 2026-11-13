/** TypeScript views of the content manifests (schemas/*.schema.json are the source of truth). */
export type Finger = 'lp' | 'lr' | 'lm' | 'li' | 'lt' | 'rt' | 'ri' | 'rm' | 'rr' | 'rp';
export type Row = 'number' | 'top' | 'home' | 'bottom' | 'space';
export type View = '2d' | '2.5d' | 'iso' | '3d' | 'fpv' | 'split' | '4d';
export type InputMode = 'dictated' | 'targeting';

export interface ItemBase {
  id: string;
  kind: string;
  version: number;
  description: string;
  prompt: string;
  license: string;
  tags?: string[];
  refs?: Record<string, string>;
}

export interface KeyInfo {
  char: string;
  shift?: string;
  finger: Finger;
  row: Row;
  col: number;
  homeBump?: boolean;
}

export interface LanguagePackManifest extends ItemBase {
  kind: 'language-pack';
  name: Record<string, string>;
  alphabet: string[];
  layout: Record<string, KeyInfo>;
  order: string[][];
  orderVariants?: string[][][];
  keyGroups: { id: string; keys: string[]; name?: Record<string, string> }[];
  words: Record<string, string>;
  blocklist: string;
  ui?: Record<string, string>;
  tts?: { lang: string; preferredVoices?: string[] };
}

/** Language pack with word lists loaded. */
export interface LanguagePack extends LanguagePackManifest {
  wordLists: Record<string, string[]>;
  blockWords: string[];
  blockSubstrings: string[];
  /** char -> physical code */
  codeOf: Record<string, string>;
}

export interface LevelTemplateManifest extends ItemBase {
  kind: 'level-template';
  genre: string;
  minLetters: number;
  maxLetters?: number;
  inputMode: InputMode;
  views: View[];
  stages?: { min?: number; max?: number };
  supportsHavocs?: string[];
  supportsAbilities?: string[];
  entry: string;
}

export interface RenderStyleManifest extends ItemBase {
  kind: 'render-style';
  family: string;
  views?: View[];
  entry: string;
  costTier?: number;
}

export interface PaletteManifest extends ItemBase {
  kind: 'palette';
  colors: Record<string, string> & { bg: string; fg: string; accent: string; positive: string; negative: string };
  colorBlindSafe?: boolean;
  mood?: string;
}

export interface HavocManifest extends ItemBase {
  kind: 'havoc';
  entry: string;
  intensity?: [number, number];
  compatibleViews?: View[];
  reducedMotion: string;
  affectsInput: false;
}

export interface AbilityManifest extends ItemBase {
  kind: 'ability';
  type: 'permanent' | 'level-mechanic' | 'boost' | 'collectible' | 'easter-egg';
  triggerWords: Record<string, string[]>;
  quickTypeBudgetMs?: Record<string, number>;
  rigHook?: string;
  powerup?: string;
}

export interface PowerupManifest extends ItemBase {
  kind: 'powerup';
  effect: 'slow-mo' | 'shield' | 'reveal' | 'magnet' | 'custom';
  durationMs?: number;
  charges?: number;
  earnedBy: { source: 'word' | 'accuracy-streak' | 'rhythm-streak' | 'random-drop'; threshold?: number; weight?: number }[];
}

export interface ComplexityScaleManifest extends ItemBase {
  kind: 'complexity-scale';
  icon?: string;
  steps: { tier: number; name: Record<string, string>; tts?: Record<string, string>; model: string }[];
  rigHooks: Record<string, string>;
  customization: { slot: string; kind: string; unlocks: { range: [number, number]; values?: string[]; stars: number }[] }[];
}

export interface CampaignSlot {
  level: number;
  viewBand: View[];
  fixedTemplate?: string;
  inputMode?: InputMode;
  havocIntensity?: [number, number];
  boss?: boolean;
}

export interface CampaignRulesManifest extends ItemBase {
  kind: 'campaign-rules';
  language: string;
  slots: CampaignSlot[];
  constraints?: { noTemplateRepeatWithin?: number; noStyleTwice?: boolean; dictatedShare?: number };
  dropTable?: { item: string; weight: number }[];
  pityAfterTicks?: number;
}
