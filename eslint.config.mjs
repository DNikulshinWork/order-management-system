import config from '@repo/eslint-config';

export default [
  {
    ignores: [
      '.dependency-cruiser.cjs',
      'apps/order-service/src/generated/**',
      'apps/order-service/tests/**/*.test.ts',
      'apps/order-service/tests/**/*.test.js',
      '**/dist/**',
      '**/build/**',
      '**/.turbo/**',
      '**/node_modules/**',
      '**/pnpm-lock.yaml',
    ],
  },
  ...config,
];
