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
export class ForceFieldSystem {
  private forces: ForceField[] = [];
  private time: number = 0;

  /**
   * Add a force field to the system
   */
  addForce(force: ForceField): void {
    this.forces.push(force);
  }

  /**
   * Remove a force field from the system
   */
  removeForce(force: ForceField): void {
    const index = this.forces.indexOf(force);
    if (index !== -1) {
      this.forces.splice(index, 1);
    }
  }

  /**
   * Remove all force fields
   */
  clear(): void {
    this.forces = [];
  }

  /**
   * Calculate total force at a position
   */
  calculateForce(position: THREE.Vector3, velocity: THREE.Vector3): THREE.Vector3 {
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
  update(deltaTime: number): void {
    this.time += deltaTime;
    
    for (const force of this.forces) {
      force.update(deltaTime);
    }
  }

  /**
   * Get all forces
   */
  getForces(): ForceField[] {
    return this.forces;
  }

  /**
   * Get force by type
   */
  getForcesByType(type: string): ForceField[] {
    return this.forces.filter(f => f.type === type);
  }

  /**
   * Enable/disable all forces
   */
  setEnabled(enabled: boolean): void {
    for (const force of this.forces) {
      force.setEnabled(enabled);
    }
  }
}

