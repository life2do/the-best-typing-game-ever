import js from '@eslint/js';
import tseslint from 'typescript-eslint';

// Determinism rules (docs/10 §2): simulation, typing and bot code must not use
// wall clocks, Math.random or engine-dependent transcendental functions.
const forbiddenMath = ['random', 'sin', 'cos', 'tan', 'atan', 'atan2', 'exp', 'log', 'log2', 'log10', 'sqrt', 'pow', 'round', 'trunc', 'hypot', 'cbrt'].map(
  (property) => ({ object: 'Math', property, message: 'Forbidden in simulation code (docs/10 §2). Use src/core/fixed.ts or ctx.rng.' }),
);

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'src/generated/**', 'playwright-report/**', 'test-results/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['src/sim/**/*.ts', 'src/typing/**/*.ts', 'src/core/**/*.ts', 'content/templates/**/sim.ts', 'tools/bot/**/*.ts'],
    ignores: ['src/core/tables/generate.ts'],
    rules: {
      'no-restricted-properties': ['error', ...forbiddenMath,
        { object: 'Date', property: 'now', message: 'No wall clock in simulation code.' },
        { object: 'performance', property: 'now', message: 'No wall clock in simulation code.' }],
      'no-restricted-globals': ['error', { name: 'performance', message: 'No wall clock in simulation code.' }],
      'no-restricted-syntax': ['error', { selector: "NewExpression[callee.name='Date']", message: 'No wall clock in simulation code.' },
        { selector: "NewExpression[callee.name='Map']", message: 'Simulation state must be plain data (docs/10 §1.5).' },
        { selector: "NewExpression[callee.name='Set']", message: 'Simulation state must be plain data (docs/10 §1.5).' }],
    },
  },
);
