/**
 * 3D Simplex Noise
 *
 * @author Maxime Heckel (original), Stefan Gustavson (algorithm)
 * @source https://github.com/MaximeHeckel/portfolio
 * @license MIT
 * @version Ported to Three.js r181+
 *
 * Generates coherent noise values in 3D space using the Simplex algorithm.
 * Faster and has fewer directional artifacts than Perlin noise.
 *
 * @param v - 3D input coordinate (vec3)
 * @returns Noise value in range [-1, 1] (float)
 *
 * @example
 * ```typescript
 * import { simplexNoise3d } from '@tslstudio/tsl-kit/noise'
 * import { vec3, uv } from 'three/tsl'
 *
 * const noiseValue = simplexNoise3d(vec3(uv(), time))
 * material.colorNode = color(noiseValue, noiseValue, noiseValue)
 * ```
 */
export declare const simplexNoise3d: any;
//# sourceMappingURL=simplexNoise3d.d.ts.map