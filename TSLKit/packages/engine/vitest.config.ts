import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      'three/webgpu': resolve(rootDir, 'tests/stubs/threeWebgpu.ts'),
      'three/examples/jsm/renderers/webgpu/WebGPURenderer.js': resolve(
        rootDir,
        'tests/stubs/threeWebgpuLegacy.ts',
      ),
      '@tslstudio/tsl-kit/compute': resolve(rootDir, '../tsl-kit/src/compute/index.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'lcov', 'html'],
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 80,
        lines: 80,
      },
    },
  },
});
