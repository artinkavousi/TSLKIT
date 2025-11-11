/**
 * Particle Waves System
 *
 * A CPU-based particle system that creates wave patterns with up to 200K particles.
 * Uses efficient BufferGeometry updates for animation.
 *
 * @module compute/particleWaves
 */
import * as THREE from 'three/webgpu';
export interface ParticleWavesConfig {
    /**
     * Number of particles (default: 200,000)
     */
    particleCount?: number;
    /**
     * Grid dimensions [width, height] (default: [500, 500])
     */
    gridSize?: [number, number];
    /**
     * Wave amplitude (default: 50)
     */
    waveAmplitude?: number;
    /**
     * Wave frequency multiplier (default: 0.7)
     */
    waveFrequency?: number;
    /**
     * Particle size (default: 1.0)
     */
    particleSize?: number;
}
/**
 * Particle Waves System
 *
 * Creates animated wave patterns with many particles.
 *
 * @example
 * ```ts
 * import { ParticleWaves } from '@tsl-kit/compute';
 *
 * // Create particle waves system
 * const waves = new ParticleWaves({
 *   particleCount: 200_000,
 *   gridSize: [500, 500],
 *   waveAmplitude: 50
 * });
 *
 * await waves.init();
 * scene.add(waves.mesh);
 *
 * // In animation loop
 * waves.update(deltaTime);
 * ```
 */
export declare class ParticleWaves {
    particleCount: number;
    gridSize: [number, number];
    waveAmplitude: number;
    waveFrequency: number;
    particleSize: number;
    material: THREE.PointsMaterial;
    mesh: THREE.Points;
    geometry: THREE.BufferGeometry;
    private positionAttribute;
    private basePositions;
    private time;
    constructor(config?: ParticleWavesConfig);
    /**
     * Initialize the particle system
     */
    init(): Promise<void>;
    /**
     * Update particle positions with wave animation
     *
     * @param deltaTime - Time elapsed since last frame in seconds
     */
    update(deltaTime: number): void;
    /**
     * Update wave amplitude
     */
    updateAmplitude(amplitude: number): void;
    /**
     * Update wave frequency
     */
    updateFrequency(frequency: number): void;
    /**
     * Set particle size
     */
    setParticleSize(size: number): void;
    /**
     * Set particle color
     */
    setColor(colorValue: THREE.ColorRepresentation): void;
    /**
     * Dispose of resources
     */
    dispose(): void;
}
//# sourceMappingURL=particleWaves.d.ts.map