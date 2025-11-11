import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const projectRoot = path.resolve(new URL('.', import.meta.url).pathname);

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@tslstudio/engine': path.resolve(projectRoot, '../..', 'packages/engine/src/index.ts'),
      '@tslstudio/engine/renderer': path.resolve(projectRoot, '../..', 'packages/engine/src/renderer/index.ts'),
      '@tslstudio/engine/post': path.resolve(projectRoot, '../..', 'packages/engine/src/post/index.ts'),
      '@tslstudio/tsl-kit': path.resolve(projectRoot, '../..', 'packages/tsl-kit/src'),
      '@tslstudio/tsl-kit/noise': path.resolve(projectRoot, '../..', 'packages/tsl-kit/src/noise/index.ts'),
      '@tslstudio/tsl-kit/schemas': path.resolve(projectRoot, '../..', 'packages/tsl-kit/src/schemas/index.ts'),
      '@tslstudio/tsl-kit/post': path.resolve(projectRoot, '../..', 'packages/tsl-kit/src/post/index.ts'),
      'three/examples/jsm/renderers/webgpu/WebGPURenderer.js': path.resolve(projectRoot, 'test-stubs/WebGPURenderer.ts')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: false,
    exclude: ['tests/**/*.spec.ts']
  },
  server: {
    port: 5174
  }
});
