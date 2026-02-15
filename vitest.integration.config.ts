import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    include: ['tests/integration/**/*.test.{ts,tsx}'],
    testTimeout: 30000,
    hookTimeout: 30000,
    setupFiles: ['./tests/integration/setup.ts'],
  },
});
