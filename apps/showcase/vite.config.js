import { defineConfig } from 'vite';
import { resolve } from 'path';
import { wgslPlugin } from './vite-plugin-wgsl.js';

export default defineConfig({
  plugins: [wgslPlugin()],
  server: {
    port: 5173,
    open: false,
    host: '127.0.0.1'
  },
  resolve: {
    alias: {
      '@tsl-kit': resolve(__dirname, '../../packages/tsl-kit/src')
    }
  },
  optimizeDeps: {
    exclude: ['@tsl-kit']
  },
  assetsInclude: ['**/*.wgsl']
});

