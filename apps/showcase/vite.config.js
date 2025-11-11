import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
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
  }
});

