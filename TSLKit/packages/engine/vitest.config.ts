import { defineConfig } from 'vitest/config';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts']
  },
  resolve: {
    alias: {
      '@tslstudio/tsl-kit/materials': resolve(
        __dirname,
        '../tsl-kit/src/materials/index.ts'
      )
    }
  }
});
