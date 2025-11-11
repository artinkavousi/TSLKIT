// TSL Wrapper for Vite - exposes Three.js TSL as named exports
// Simply re-export everything from three/tsl
export * from 'three/tsl';

// Re-export THREE for convenience
import * as THREE from 'three/webgpu';
export { THREE };

