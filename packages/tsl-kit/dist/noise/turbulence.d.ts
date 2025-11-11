/**
 * Turbulence
 *
 * Domain-warped turbulence effect that creates flowing, swirling patterns.
 * Originally created by @XorDev - useful for fluid-like distortions and organic motion.
 *
 * @module noise/turbulence
 * @category Noise
 * @source fragments-boilerplate (Maxime Heckel)
 * @author Maxime Heckel (port), XorDev (original)
 * @license MIT
 * @version r175 → r181
 * @see https://www.shadertoy.com/view/WclSWn
 */
/**
 * Turbulence (Domain Warping)
 *
 * Creates flowing, turbulent patterns by progressively warping the input coordinates
 * through multiple octaves of sine waves with rotation. Produces organic, fluid-like motion.
 *
 * @param p - Input 2D position (vec2)
 * @param _time - Animation time parameter (float)
 * @param _num - Number of octaves (default: 10.0). More octaves = more detail
 * @param _amp - Amplitude multiplier (default: 0.7). Controls displacement strength
 * @param _speed - Animation speed (default: 0.3)
 * @param _freq - Base frequency (default: 2.0). Higher = smaller patterns
 * @param _exp - Frequency exponent/lacunarity (default: 1.4). Rate of frequency increase per octave
 * @returns Warped 2D position (vec2)
 *
 * @example
 * ```typescript
 * import { turbulence } from '@tslstudio/tsl-kit/noise';
 * import { simplexNoise3d } from '@tslstudio/tsl-kit/noise';
 * import { uv, uniform, vec3 } from 'three/tsl';
 *
 * const time = uniform(0);
 *
 * // Basic turbulence
 * const turbulent = turbulence(uv(), time);
 * const noise = simplexNoise3d(vec3(turbulent, time));
 *
 * // Custom parameters for different effects
 * const strongTurbulence = turbulence(
 *   uv().mul(2.0),
 *   time,
 *   12.0,  // more octaves
 *   1.2,   // stronger amplitude
 *   0.5,   // faster speed
 *   3.0,   // higher frequency
 *   1.6    // more lacunarity
 * );
 *
 * // Combine with noise for detailed patterns
 * const detailedNoise = simplexNoise3d(
 *   vec3(turbulence(uv().mul(4.0), time.mul(0.2)), 0.0)
 * );
 * ```
 */
export declare const turbulence: any;
//# sourceMappingURL=turbulence.d.ts.map