/**
 * Curl Noise 4D
 *
 * 4D curl noise for time-varying divergence-free vector fields.
 * Perfect for animated particle systems and fluid simulations.
 *
 * @module noise/curlNoise4d
 * @category Noise
 * @source fragments-boilerplate (Maxime Heckel)
 * @author Maxime Heckel, al-ro (original)
 * @license MIT
 * @version r175 → r181
 * @see https://al-ro.github.io/projects/embers/
 */
/**
 * 4D Curl Noise
 *
 * Extends curl noise to 4D for smooth temporal animation.
 * Use the 4th dimension as time for evolving flow fields.
 * Returns 3D curl vectors from 4D potential field.
 *
 * @param inputA - 4D input position (vec4: xyz = position, w = time)
 * @returns Curl noise vector (vec3)
 *
 * @example
 * ```typescript
 * import { curlNoise4d } from '@tslstudio/tsl-kit/noise';
 * import { positionLocal, uniform, vec4 } from 'three/tsl';
 *
 * const time = uniform(0);
 *
 * // Time-varying curl field
 * const curl = curlNoise4d(
 *   vec4(positionLocal, time.mul(0.5))
 * );
 *
 * // Particle system with evolving flow
 * const particleVelocity = curlNoise4d(
 *   vec4(particlePosition.mul(2.0), time)
 * ).mul(flowStrength);
 *
 * // Multiple time scales
 * const slowCurl = curlNoise4d(vec4(positionLocal, time.mul(0.1)));
 * const fastCurl = curlNoise4d(vec4(positionLocal, time.mul(2.0)));
 * const combined = slowCurl.add(fastCurl.mul(0.5));
 * ```
 */
export declare const curlNoise4d: any;
//# sourceMappingURL=curlNoise4d.d.ts.map