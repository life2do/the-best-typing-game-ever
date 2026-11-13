/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Builds use relative asset URLs so the same build works wherever it is served:
// <user>.github.io/<repo>/v/<id>/, a custom domain's /v/<id>/, or a local folder (docs/08 Hosting constraints).
export default defineConfig(({ command }) => ({
  base: process.env.TBTGE_BASE ?? (command === 'build' ? './' : '/'),
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
      '@content': resolve(import.meta.dirname, 'content'),
    },
  },
  build: {
    outDir: 'dist',
    target: 'es2022',
    chunkSizeWarningLimit: 900,
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
    exclude: ['e2e/**', 'node_modules/**'],
    environment: 'node',
    testTimeout: 120_000,
  },
}));
