/**
 * Vite plugin to load .wgsl files as strings
 * Allows importing WGSL shader code for use with TSL.wgslFn()
 */
export function wgslPlugin() {
  return {
    name: 'vite-plugin-wgsl',
    transform(code, id) {
      if (id.endsWith('.wgsl')) {
        // Return the WGSL code as an exported string
        return {
          code: `export default ${JSON.stringify(code)};`,
          map: null
        };
      }
    }
  };
}

