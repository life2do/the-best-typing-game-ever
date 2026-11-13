// One-off generator for committed lookup tables (docs/10 §2 rule 4).
// Run: npx vite-node src/core/tables/generate.ts — the output is committed and never regenerated at runtime.
import { writeFileSync } from 'node:fs';
const sin = Array.from({ length: 4096 }, (_, i) => Math.round(Math.sin((i / 4096) * 2 * Math.PI) * 65536));
writeFileSync(new URL('./sin4096.json', import.meta.url), JSON.stringify(sin) + '\n');
