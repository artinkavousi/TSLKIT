/**
 * Material Factory API
 *
 * Type-safe material creation with Zod validation.
 *
 * @module materials/api/makeMaterial
 */
import * as THREE from 'three/webgpu';
import { MaterialConfig } from './schemas';
/**
 * Create a material from a configuration object
 *
 * @param config - Material configuration (validated with Zod)
 * @returns Configured Three.js material
 *
 * @example
 * ```typescript
 * const glassMat = makeMaterial({
 *   type: 'glass',
 *   color: '#ffffff',
 *   transmission: 1.0,
 *   roughness: 0.0,
 *   ior: 1.5
 * });
 * ```
 */
export declare function makeMaterial(config: MaterialConfig): THREE.Material;
/**
 * Validate a material configuration without creating the material
 */
export declare function validateMaterialConfig(config: unknown): MaterialConfig;
//# sourceMappingURL=makeMaterial.d.ts.map