/**
 * Force Field System
 *
 * Manages multiple force fields acting on particles.
 *
 * @module compute/forces/ForceFieldSystem
 */
import * as THREE from 'three/webgpu';
import { ForceField } from './ForceField';
/**
 * Force field system that manages and combines multiple force fields
 */
export declare class ForceFieldSystem {
    private forces;
    private time;
    /**
     * Add a force field to the system
     */
    addForce(force: ForceField): void;
    /**
     * Remove a force field from the system
     */
    removeForce(force: ForceField): void;
    /**
     * Remove all force fields
     */
    clear(): void;
    /**
     * Calculate total force at a position
     */
    calculateForce(position: THREE.Vector3, velocity: THREE.Vector3): THREE.Vector3;
    /**
     * Update all force fields
     */
    update(deltaTime: number): void;
    /**
     * Get all forces
     */
    getForces(): ForceField[];
    /**
     * Get force by type
     */
    getForcesByType(type: string): ForceField[];
    /**
     * Enable/disable all forces
     */
    setEnabled(enabled: boolean): void;
}
//# sourceMappingURL=ForceFieldSystem.d.ts.map