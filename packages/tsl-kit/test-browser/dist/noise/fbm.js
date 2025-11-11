/**
 * Fractal Brownian Motion (FBM) Noise Functions
 *
 * @author Maxime Heckel
 * @source https://github.com/MaximeHeckel/fragments-boilerplate
 * @license MIT
 * @version Ported to Three.js r181+
 *
 * Collection of FBM noise variants that combine multiple octaves of simplex noise
 * at different frequencies and amplitudes to create rich, detailed patterns.
 *
 * Includes:
 * - Standard FBM: Classic fractal noise
 * - Ridged FBM: Creates sharp ridges for terrain
 * - Domain Warped FBM: Self-warping noise for organic patterns
 */
import { Fn, float, vec3, Loop, mul, add, div } from 'three/tsl';
import { simplexNoise3d } from './simplexNoise3d.js';
/**
 * Fractal Brownian Motion using 3D simplex noise
 *
 * Combines multiple octaves of noise at different frequencies and amplitudes.
 * Higher frequencies (lacunarity) add fine detail, while lower amplitudes (gain)
 * reduce their contribution.
 *
 * @param p - Input 3D position (vec3)
 * @param octaves - Number of noise octaves (default: 4.0)
 * @param frequency - Base frequency (default: 1.0)
 * @param amplitude - Base amplitude (default: 1.0)
 * @param lacunarity - Frequency multiplier between octaves (default: 2.0)
 * @param gain - Amplitude multiplier between octaves (default: 0.5)
 * @returns FBM noise value in range [-1, 1] (float)
 *
 * @example
 * ```typescript
 * import { fbm } from '@tslstudio/tsl-kit/noise'
 * import { vec3, uv } from 'three/tsl'
 *
 * // Terrain height with 6 octaves
 * const height = fbm(vec3(uv().mul(10.0), 0), 6.0)
 * ```
 */
export const fbm = /*#__PURE__*/ Fn(([p, octaves = 4.0, frequency = 1.0, amplitude = 1.0, lacunarity = 2.0, gain = 0.5]) => {
    const value = float(0.0).toVar();
    const currentAmplitude = float(amplitude).toVar();
    const currentFrequency = float(frequency).toVar();
    const maxValue = float(0.0).toVar();
    // @ts-ignore
    Loop({ start: 0.0, end: octaves, type: 'float' }, ({ i }) => {
        // Sample noise at current frequency
        const noiseValue = simplexNoise3d(mul(p, currentFrequency));
        // Add to accumulated value
        value.addAssign(mul(noiseValue, currentAmplitude));
        // Track maximum possible value for normalization
        maxValue.addAssign(currentAmplitude);
        // Update frequency and amplitude for next octave
        currentFrequency.mulAssign(lacunarity);
        currentAmplitude.mulAssign(gain);
    });
    // Normalize the result to [-1, 1] range
    return div(value, maxValue);
}).setLayout({
    name: 'fbm',
    type: 'float',
    inputs: [
        { name: 'p', type: 'vec3' },
        { name: 'octaves', type: 'float' },
        { name: 'frequency', type: 'float' },
        { name: 'amplitude', type: 'float' },
        { name: 'lacunarity', type: 'float' },
        { name: 'gain', type: 'float' },
    ],
});
/**
 * Ridged FBM variant that creates sharp ridges
 *
 * Inverts and squares the absolute value of each octave to create sharp ridges.
 * Perfect for mountainous terrain and crystalline structures.
 *
 * @param p - Input 3D position (vec3)
 * @param octaves - Number of noise octaves (default: 4.0)
 * @param frequency - Base frequency (default: 1.0)
 * @param amplitude - Base amplitude (default: 1.0)
 * @param lacunarity - Frequency multiplier between octaves (default: 2.0)
 * @param gain - Amplitude multiplier between octaves (default: 0.5)
 * @returns Ridged FBM noise value in range [0, 1] (float)
 *
 * @example
 * ```typescript
 * import { ridgedFbm } from '@tslstudio/tsl-kit/noise'
 *
 * // Mountain terrain with sharp peaks
 * const height = ridgedFbm(position.mul(0.5), 5.0)
 * ```
 */
export const ridgedFbm = /*#__PURE__*/ Fn(([p, octaves = 4.0, frequency = 1.0, amplitude = 1.0, lacunarity = 2.0, gain = 0.5]) => {
    const value = float(0.0).toVar();
    const currentAmplitude = float(amplitude).toVar();
    const currentFrequency = float(frequency).toVar();
    const maxValue = float(0.0).toVar();
    // @ts-ignore
    Loop({ start: 0.0, end: octaves, type: 'float' }, ({ i }) => {
        // Sample noise and create ridges by taking absolute value and inverting
        const noiseValue = simplexNoise3d(mul(p, currentFrequency));
        const ridgedValue = float(1.0).sub(noiseValue.abs());
        // Square the ridged value to make ridges sharper
        const sharpRidges = ridgedValue.mul(ridgedValue);
        // Add to accumulated value
        value.addAssign(mul(sharpRidges, currentAmplitude));
        // Track maximum possible value for normalization
        maxValue.addAssign(currentAmplitude);
        // Update frequency and amplitude for next octave
        currentFrequency.mulAssign(lacunarity);
        currentAmplitude.mulAssign(gain);
    });
    // Normalize the result to [0, 1] range
    return div(value, maxValue);
}).setLayout({
    name: 'ridgedFbm',
    type: 'float',
    inputs: [
        { name: 'p', type: 'vec3' },
        { name: 'octaves', type: 'float' },
        { name: 'frequency', type: 'float' },
        { name: 'amplitude', type: 'float' },
        { name: 'lacunarity', type: 'float' },
        { name: 'gain', type: 'float' },
    ],
});
/**
 * Domain warped FBM that uses FBM to warp the input coordinates
 *
 * Uses FBM to offset the sampling position before sampling FBM again,
 * creating flowing, organic patterns with self-similarity at all scales.
 *
 * @param p - Input 3D position (vec3)
 * @param octaves - Number of noise octaves (default: 4.0)
 * @param frequency - Base frequency (default: 1.0)
 * @param amplitude - Base amplitude (default: 1.0)
 * @param lacunarity - Frequency multiplier between octaves (default: 2.0)
 * @param gain - Amplitude multiplier between octaves (default: 0.5)
 * @param warpStrength - Strength of domain warping (default: 0.1)
 * @returns Domain warped FBM noise value in range [-1, 1] (float)
 *
 * @example
 * ```typescript
 * import { domainWarpedFbm } from '@tslstudio/tsl-kit/noise'
 *
 * // Organic, flowing patterns
 * const pattern = domainWarpedFbm(position, 4.0, 1.0, 1.0, 2.0, 0.5, 0.3)
 * ```
 */
export const domainWarpedFbm = /*#__PURE__*/ Fn(([p, octaves = 4.0, frequency = 1.0, amplitude = 1.0, lacunarity = 2.0, gain = 0.5, warpStrength = 0.1]) => {
    // Create warping offset using FBM at three different offset positions
    const warpOffset = vec3(fbm(p, octaves, frequency, amplitude, lacunarity, gain), fbm(add(p, vec3(100.0)), octaves, frequency, amplitude, lacunarity, gain), fbm(add(p, vec3(200.0)), octaves, frequency, amplitude, lacunarity, gain));
    // Apply warping to input position
    const warpedP = add(p, mul(warpOffset, warpStrength));
    // Sample FBM at warped position
    return fbm(warpedP, octaves, frequency, amplitude, lacunarity, gain);
}).setLayout({
    name: 'domainWarpedFbm',
    type: 'float',
    inputs: [
        { name: 'p', type: 'vec3' },
        { name: 'octaves', type: 'float' },
        { name: 'frequency', type: 'float' },
        { name: 'amplitude', type: 'float' },
        { name: 'lacunarity', type: 'float' },
        { name: 'gain', type: 'float' },
        { name: 'warpStrength', type: 'float' },
    ],
});
//# sourceMappingURL=fbm.js.map