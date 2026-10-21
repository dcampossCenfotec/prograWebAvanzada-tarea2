import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['css/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        bootstrap: 'readonly',
      },
    },
    rules: {
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
];
