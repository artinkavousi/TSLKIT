/**
 * Curl Noise 3D (fragments-boilerplate version)
 *
 * Alternative 3D curl noise implementation using gradient-based approach.
 * Creates divergence-free vector fields perfect for fluid simulations.
 *
 * @module noise/curlNoise3d_v2
 * @category Noise
 * @source fragments-boilerplate (Maxime Heckel)
 * @author Maxime Heckel, al-ro (original)
 * @license MIT
 * @version r175 → r181
 * @see https://al-ro.github.io/projects/embers/
 */
/**
 * 3D Curl Noise (Gradient-Based)
 *
 * Computes curl noise by taking the curl of a potential field.
 * Uses finite differences to approximate gradients of simplex noise.
 * Results in divergence-free flow fields ideal for particles and fluids.
 *
 * @param inputA - 3D input position (vec3)
 * @returns Curl noise vector (vec3)
 *
 * @example
 * ```typescript
 * import { curlNoise3dV2 } from '@tslstudio/tsl-kit/noise';
 * import { positionLocal, uniform } from 'three/tsl';
 *
 * const time = uniform(0);
 *
 * // Basic curl noise
 * const curl = curlNoise3dV2(positionLocal);
 *
 * // Animated curl field
 * const animatedCurl = curlNoise3dV2(
 *   positionLocal.add(vec3(0, 0, time.mul(0.5)))
 * );
 *
 * // Particle velocity from curl field
 * const velocity = curlNoise3dV2(
 *   particlePosition.mul(scale)
 * ).mul(strength);
 * ```
 */
export declare const curlNoise3dV2: any;
//# sourceMappingURL=curlNoise3d_v2.d.ts.map