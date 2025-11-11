import { instancedArray } from 'three/tsl';
/**
 * Compute-based Particle System Utilities
 *
 * Provides reusable TSL compute functions for GPU-accelerated particle systems.
 *
 * @module compute/particleSystem
 */
export interface ParticleSystemArrays {
    positions: ReturnType<typeof instancedArray>;
    velocities: ReturnType<typeof instancedArray>;
    colors?: ReturnType<typeof instancedArray>;
    sizes?: ReturnType<typeof instancedArray>;
}
export interface ParticleInitOptions {
    particleCount: number;
    separation?: number;
    randomizeColor?: boolean;
    randomizeHeight?: boolean;
}
export interface ParticlePhysicsOptions {
    gravity?: number;
    bounce?: number;
    friction?: number;
    floorY?: number;
}
/**
 * Creates instanced arrays for particle data
 *
 * @param particleCount - Number of particles
 * @param includeColors - Whether to include color array
 * @param includeSizes - Whether to include size array
 * @returns Object containing instanced arrays
 *
 * @example
 * ```ts
 * const arrays = createParticleArrays(10000, true, true);
 * ```
 */
export declare function createParticleArrays(particleCount: number, includeColors?: boolean, includeSizes?: boolean): ParticleSystemArrays;
/**
 * Creates a grid-based particle initialization compute function
 *
 * @param arrays - Particle system arrays
 * @param options - Initialization options
 * @returns Compute function for initialization
 *
 * @example
 * ```ts
 * const arrays = createParticleArrays(10000);
 * const initCompute = createGridInitCompute(arrays, {
 *   particleCount: 10000,
 *   separation: 0.2,
 *   randomizeColor: true
 * });
 * initCompute().compute(10000);
 * ```
 */
export declare function createGridInitCompute(arrays: ParticleSystemArrays, options: ParticleInitOptions): any;
/**
 * Creates a physics-based particle update compute function
 *
 * @param arrays - Particle system arrays
 * @param options - Physics options
 * @returns Compute function for update
 *
 * @example
 * ```ts
 * const updateCompute = createPhysicsUpdateCompute(arrays, {
 *   gravity: -0.00098,
 *   bounce: 0.8,
 *   friction: 0.99,
 *   floorY: 0
 * });
 * // In animation loop:
 * updateCompute().compute(10000);
 * ```
 */
export declare function createPhysicsUpdateCompute(arrays: ParticleSystemArrays, options?: ParticlePhysicsOptions): any;
/**
 * Creates a wave-based particle animation compute function
 *
 * @param arrays - Particle system arrays
 * @param particleCount - Number of particles
 * @param waveParams - Wave parameters (frequency, amplitude, speed)
 * @returns Compute function for wave animation
 *
 * @example
 * ```ts
 * const waveCompute = createWaveUpdateCompute(arrays, 10000, {
 *   frequencyX: 0.7,
 *   frequencyZ: 0.5,
 *   amplitudeX: 50,
 *   amplitudeZ: 50,
 *   speed: 5
 * });
 * // In animation loop with time uniform:
 * waveCompute(timeUniform).compute(10000);
 * ```
 */
export declare function createWaveUpdateCompute(arrays: ParticleSystemArrays, particleCount: number, waveParams?: {
    frequencyX: number;
    frequencyZ: number;
    amplitudeX: number;
    amplitudeZ: number;
    speed: number;
    separation: number;
}): any;
//# sourceMappingURL=particleSystem.d.ts.map