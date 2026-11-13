/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Each deploy is served from its own immutable folder: /<repo>/v/<buildHash>/ (docs/08 Hosting constraints).
// CI sets TBTGE_BASE; local dev and tests use '/'.
const base = process.env.TBTGE_BASE ?? '/';

export default defineConfig({
  base,
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
      '@content': resolve(import.meta.dirname, 'content'),
    },
  },
  build: {
    outDir: 'dist',
    target: 'es2022',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        verify: resolve(import.meta.dirname, 'verify/index.html'),
        preview: resolve(import.meta.dirname, 'dev/preview/index.html'),
      },
    },
  },
  test: {
    include: ['tests/**/*.test.ts', 'content/**/*.test.ts', 'src/**/*.test.ts'],
    environment: 'node',
    testTimeout: 120_000,
  },
});
