/** Build fingerprint written by tools/build-content.ts (absent in plain dev mode). */
const found = import.meta.glob('../generated/build-info.json', { eager: true, import: 'default' }) as Record<string, { build: string; commit: string; builtAt: string }>;
const info = Object.values(found)[0];
export const BUILD = info?.build ?? 'dev';
export const COMMIT = info?.commit ?? 'dev';
