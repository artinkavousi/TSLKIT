/**
 * Force Field System
 *
 * Manages multiple force fields acting on particles.
 *
 * @module compute/forces/ForceFieldSystem
 */
import * as THREE from 'three/webgpu';
/**
 * Force field system that manages and combines multiple force fields
 */
export class ForceFieldSystem {
    constructor() {
        this.forces = [];
        this.time = 0;
    }
    /**
     * Add a force field to the system
     */
    addForce(force) {
        this.forces.push(force);
    }
    /**
     * Remove a force field from the system
     */
    removeForce(force) {
        const index = this.forces.indexOf(force);
        if (index !== -1) {
            this.forces.splice(index, 1);
        }
    }
    /**
     * Remove all force fields
     */
    clear() {
        this.forces = [];
    }
    /**
     * Calculate total force at a position
     */
    calculateForce(position, velocity) {
        const totalForce = new THREE.Vector3();
        for (const force of this.forces) {
            if (force.enabled) {
                const f = force.calculateForce(position, velocity, this.time);
                totalForce.add(f);
            }
        }
        return totalForce;
    }
    /**
     * Update all force fields
     */
    update(deltaTime) {
        this.time += deltaTime;
        for (const force of this.forces) {
            force.update(deltaTime);
        }
    }
    /**
     * Get all forces
     */
    getForces() {
        return this.forces;
    }
    /**
     * Get force by type
     */
    getForcesByType(type) {
        return this.forces.filter(f => f.type === type);
    }
    /**
     * Enable/disable all forces
     */
    setEnabled(enabled) {
        for (const force of this.forces) {
            force.setEnabled(enabled);
        }
    }
}
//# sourceMappingURL=ForceFieldSystem.js.map