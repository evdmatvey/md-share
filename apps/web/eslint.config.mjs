// @ts-check
import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const layerRestrictedPaths = [
  {
    target: './src/shared/**',
    from: ['./src/pages/**', './src/app/**'],
    message: 'shared layer cannot import from upper layers',
  },
  {
    target: './src/pages/**',
    from: ['./src/app/**'],
    message: 'pages layer cannot import from app layer',
  },
];

export default defineConfig(
  {
    ignores: [
      'eslint.config.mjs',
      '.prettierrc.cjs',
      'steiger.config.mjs',
      'vite.config.ts',
      'node_modules',
      'dist',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { import: importPlugin, 'react-hooks': reactHooks },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
      'import/no-duplicates': ['error', { 'prefer-inline': false }],
      'import/no-restricted-paths': ['error', { zones: layerRestrictedPaths }],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@shared/api',
              message:
                'shared segment barrels are forbidden — import from submodule or file (e.g. @shared/api/client)',
            },
            {
              name: '@shared/config',
              message:
                'shared segment barrels are forbidden — import from submodule or file (e.g. @shared/config/env)',
            },
            {
              name: '@shared/lib',
              message:
                'shared segment barrels are forbidden — import from submodule or file',
            },
            {
              name: '@shared/ui',
              message:
                'shared segment barrels are forbidden — import from submodule or file (e.g. @shared/ui/theme-toggle)',
            },
          ],
        },
      ],
      'no-console': 'warn',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['error', 'all'],
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
);
