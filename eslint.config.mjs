// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/.next/**',
      '**/node_modules/**',
      '**/cdk.out/**',
      '**/*.d.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "Literal[value=/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]",
          message:
            'Hard-coded hex colors are banned. Use design tokens from packages/tokens instead.',
        },
        {
          selector:
            "CallExpression[callee.object.name='it'][callee.property.name='skip']",
          message: 'Disabled tests (it.skip) are not allowed.',
        },
        {
          selector:
            "CallExpression[callee.object.name='test'][callee.property.name='skip']",
          message: 'Disabled tests (test.skip) are not allowed.',
        },
        {
          selector:
            "CallExpression[callee.object.name='describe'][callee.property.name='skip']",
          message: 'Disabled tests (describe.skip) are not allowed.',
        },
      ],
    },
  },
);
