/**
 * 3D Perlin Noise
 *
 * @author Maxime Heckel (original), Ken Perlin (algorithm)
 * @source https://github.com/MaximeHeckel/fragments-boilerplate
 * @license MIT
 * @version Ported to Three.js r181+
 *
 * Classic Perlin noise implementation in 3D.
 * Provides smooth, continuous noise with good spectral characteristics.
 *
 * @param P - 3D input coordinate (vec3)
 * @returns Noise value in range [-1, 1] (float)
 *
 * @example
 * ```typescript
 * import { perlinNoise3d } from '@tslstudio/tsl-kit/noise'
 * import { vec3, uv } from 'three/tsl'
 *
 * const noise = perlinNoise3d(vec3(uv().mul(5.0), time))
 * material.roughnessNode = noise.add(1.0).mul(0.5) // Remap to [0,1]
 * ```
 */
export declare const perlinNoise3d: any;
//# sourceMappingURL=perlinNoise3d.d.ts.map