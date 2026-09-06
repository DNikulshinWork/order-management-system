import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts', '**/*.spec.ts'],
    exclude: ['node_modules', 'dist', 'build', '.turbo', 'coverage'],
  },
  resolve: {
    alias: {
      '@shared': '/src/shared',
      '@features': '/src/features',
      '@app': '/src/app',
      '@generated': '/src/generated',
    },
  },
});
