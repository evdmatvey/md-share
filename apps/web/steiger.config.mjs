import fsd from '@feature-sliced/steiger-plugin';
import { defineConfig } from 'steiger';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    ignores: ['**/__tests__/**', '**/*.test.ts'],
  },
  {
    rules: {
      'fsd/typo-in-layer-name': 'off',
      'fsd/no-public-api-sidestep': 'off',
    },
  },
  {
    files: ['./src/shared/**'],
    rules: {
      'fsd/public-api': 'off',
    },
  },
]);
