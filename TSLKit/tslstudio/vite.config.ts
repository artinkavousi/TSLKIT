import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'tsl/index': resolve(__dirname, 'src/tsl/index.ts'),
        'tsl/noise/index': resolve(__dirname, 'src/tsl/noise/index.ts'),
        'tsl/sdf/index': resolve(__dirname, 'src/tsl/sdf/index.ts'),
        'tsl/lighting/index': resolve(__dirname, 'src/tsl/lighting/index.ts'),
        'tsl/math/index': resolve(__dirname, 'src/tsl/math/index.ts'),
        'tsl/color/index': resolve(__dirname, 'src/tsl/color/index.ts'),
        'materials/index': resolve(__dirname, 'src/materials/index.ts'),
        'postprocessing/index': resolve(__dirname, 'src/postprocessing/index.ts'),
        'compute/index': resolve(__dirname, 'src/compute/index.ts'),
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    
    rollupOptions: {
      external: ['three', 'three/tsl', 'three/webgpu', /^three\//],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        exports: 'named',
      },
    },
    
    minify: 'terser',
    sourcemap: true,
    
    target: 'es2022',
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@tslstudio': resolve(__dirname, 'src'),
    },
  },
  
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.spec.ts',
        '**/*.test.ts',
      ],
    },
  },
})

