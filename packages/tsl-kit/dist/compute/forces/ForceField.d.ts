/**
 * Force Field
 *
 * Base class for particle force fields.
 *
 * @module compute/forces/ForceField
 */
import * as THREE from 'three/webgpu';
import { ForceFieldConfig, ForceFieldType } from './types';
/**
 * Base force field class
 */
export declare abstract class ForceField {
    type: ForceFieldType;
    strength: number;
    enabled: boolean;
    constructor(config: ForceFieldConfig);
    /**
     * Calculate force at a given position
     */
    abstract calculateForce(position: THREE.Vector3, velocity: THREE.Vector3, time: number): THREE.Vector3;
    /**
     * Update force field state
     */
    update(deltaTime: number): void;
    /**
     * Set strength
     */
    setStrength(strength: number): void;
    /**
     * Enable/disable force field
     */
    setEnabled(enabled: boolean): void;
}
/**
 * Gravity force field
 */
export declare class GravityForce extends ForceField {
    direction: THREE.Vector3;
    constructor(direction: THREE.Vector3, strength?: number);
    calculateForce(position: THREE.Vector3, velocity: THREE.Vector3, time: number): THREE.Vector3;
    setDirection(direction: THREE.Vector3): void;
}
/**
 * Attractor force field
 */
export declare class AttractorForce extends ForceField {
    position: THREE.Vector3;
    radius: number;
    falloff: number;
    constructor(position: THREE.Vector3, strength?: number, radius?: number, falloff?: number);
    calculateForce(position: THREE.Vector3, velocity: THREE.Vector3, time: number): THREE.Vector3;
    setPosition(position: THREE.Vector3): void;
}
/**
 * Repulsor force field (negative attractor)
 */
export declare class RepulsorForce extends AttractorForce {
    constructor(position: THREE.Vector3, strength?: number, radius?: number, falloff?: number);
}
/**
 * Vortex force field
 */
export declare class VortexForce extends ForceField {
    position: THREE.Vector3;
    axis: THREE.Vector3;
    radius: number;
    constructor(position: THREE.Vector3, axis: THREE.Vector3, strength?: number, radius?: number);
    calculateForce(position: THREE.Vector3, velocity: THREE.Vector3, time: number): THREE.Vector3;
    setPosition(position: THREE.Vector3): void;
    setAxis(axis: THREE.Vector3): void;
}
/**
 * Curl noise force field
 */
export declare class CurlNoiseForce extends ForceField {
    scale: number;
    timeScale: number;
    private time;
    constructor(strength?: number, scale?: number, timeScale?: number);
    calculateForce(position: THREE.Vector3, velocity: THREE.Vector3, time: number): THREE.Vector3;
    update(deltaTime: number): void;
    setScale(scale: number): void;
    setTimeScale(timeScale: number): void;
}
/**
 * Wind force field
 */
export declare class WindForce extends ForceField {
    direction: THREE.Vector3;
    turbulence: number;
    private time;
    constructor(direction: THREE.Vector3, strength?: number, turbulence?: number);
    calculateForce(position: THREE.Vector3, velocity: THREE.Vector3, time: number): THREE.Vector3;
    update(deltaTime: number): void;
    setDirection(direction: THREE.Vector3): void;
    setTurbulence(turbulence: number): void;
}
//# sourceMappingURL=ForceField.d.ts.map