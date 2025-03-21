import vue from 'eslint-plugin-vue';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export default [
  // Базовая конфигурация
  {
    files: ['**/*.js', '**/*.ts', '**/*.vue'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        extraFileExtensions: ['.vue'],
      },
      globals: {
        browser: true,
        node: true,
      },
    },
    plugins: {
      vue,
      '@typescript-eslint': typescriptEslint,
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'vue/multi-word-component-names': 'off',
    },
  },

  // Конфигурация для Vue 3
  {
    ...vue.configs['vue3-recommended'],
  },

  // Конфигурация для TypeScript
  {
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      ...typescriptEslint.configs.recommended.rules,
    },
  },
];
