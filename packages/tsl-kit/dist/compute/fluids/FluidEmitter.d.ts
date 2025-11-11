/**
 * Fluid Emitter
 *
 * Injects density and velocity into fluid simulation.
 *
 * @module compute/fluids/FluidEmitter
 */
import * as THREE from 'three/webgpu';
export type EmitterShape = 'sphere' | 'box' | 'cone' | 'point';
export interface FluidEmitterConfig {
    position?: THREE.Vector3;
    velocity?: THREE.Vector3;
    density?: number;
    temperature?: number;
    radius?: number;
    shape?: EmitterShape;
    enabled?: boolean;
    continuous?: boolean;
    emitRate?: number;
}
/**
 * Fluid emitter for injecting fluid properties
 */
export declare class FluidEmitter {
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    density: number;
    temperature: number;
    radius: number;
    shape: EmitterShape;
    enabled: boolean;
    continuous: boolean;
    emitRate: number;
    private time;
    private lastEmitTime;
    constructor(config?: FluidEmitterConfig);
    /**
     * Update emitter state
     */
    update(deltaTime: number): void;
    /**
     * Check if emission should occur at a given cell position
     */
    shouldEmitAtPosition(cellPos: THREE.Vector3): boolean;
    /**
     * Get emission strength at a given position
     */
    getEmissionStrength(cellPos: THREE.Vector3): number;
    /**
     * Emit into a fluid grid cell
     */
    emitIntoCell(cellPos: THREE.Vector3, currentDensity: number, currentVelocity: THREE.Vector3, currentTemperature: number, deltaTime: number): {
        density: number;
        velocity: THREE.Vector3;
        temperature: number;
    };
    /**
     * Set emitter position
     */
    setPosition(position: THREE.Vector3): void;
    /**
     * Set emitter velocity
     */
    setVelocity(velocity: THREE.Vector3): void;
    /**
     * Enable/disable emitter
     */
    setEnabled(enabled: boolean): void;
    /**
     * Trigger a one-shot emission (for non-continuous emitters)
     */
    emit(): void;
}
/**
 * Emitter manager for multiple emitters
 */
export declare class FluidEmitterSystem {
    private emitters;
    /**
     * Add an emitter to the system
     */
    addEmitter(emitter: FluidEmitter): void;
    /**
     * Remove an emitter
     */
    removeEmitter(emitter: FluidEmitter): void;
    /**
     * Get all emitters
     */
    getEmitters(): FluidEmitter[];
    /**
     * Update all emitters
     */
    update(deltaTime: number): void;
    /**
     * Apply all emitters to a grid cell
     */
    applyEmitters(cellPos: THREE.Vector3, currentDensity: number, currentVelocity: THREE.Vector3, currentTemperature: number, deltaTime: number): {
        density: number;
        velocity: THREE.Vector3;
        temperature: number;
    };
    /**
     * Clear all emitters
     */
    clear(): void;
}
//# sourceMappingURL=FluidEmitter.d.ts.map