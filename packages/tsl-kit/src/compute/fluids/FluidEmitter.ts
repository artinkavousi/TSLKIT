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
export class FluidEmitter {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  density: number;
  temperature: number;
  radius: number;
  shape: EmitterShape;
  enabled: boolean;
  continuous: boolean;
  emitRate: number;

  private time: number = 0;
  private lastEmitTime: number = 0;

  constructor(config: FluidEmitterConfig = {}) {
    this.position = config.position?.clone() || new THREE.Vector3(0, 0, 0);
    this.velocity = config.velocity?.clone() || new THREE.Vector3(0, 1, 0);
    this.density = config.density !== undefined ? config.density : 1.0;
    this.temperature = config.temperature !== undefined ? config.temperature : 1.0;
    this.radius = config.radius !== undefined ? config.radius : 0.1;
    this.shape = config.shape || 'sphere';
    this.enabled = config.enabled !== undefined ? config.enabled : true;
    this.continuous = config.continuous !== undefined ? config.continuous : true;
    this.emitRate = config.emitRate !== undefined ? config.emitRate : 1.0;
  }

  /**
   * Update emitter state
   */
  update(deltaTime: number): void {
    this.time += deltaTime;
  }

  /**
   * Check if emission should occur at a given cell position
   */
  shouldEmitAtPosition(cellPos: THREE.Vector3): boolean {
    if (!this.enabled) return false;

    const distance = cellPos.distanceTo(this.position);

    switch (this.shape) {
      case 'sphere':
        return distance <= this.radius;
      
      case 'box':
        const halfSize = this.radius;
        return Math.abs(cellPos.x - this.position.x) <= halfSize &&
               Math.abs(cellPos.y - this.position.y) <= halfSize &&
               Math.abs(cellPos.z - this.position.z) <= halfSize;
      
      case 'cone':
        const toCell = cellPos.clone().sub(this.position);
        const height = toCell.dot(this.velocity.clone().normalize());
        const lateralDist = toCell.length() * Math.sin(Math.acos(height / toCell.length()));
        return height > 0 && height <= this.radius * 2 && lateralDist <= height * 0.5;
      
      case 'point':
        return distance < 0.01;
      
      default:
        return false;
    }
  }

  /**
   * Get emission strength at a given position
   */
  getEmissionStrength(cellPos: THREE.Vector3): number {
    if (!this.shouldEmitAtPosition(cellPos)) return 0;

    const distance = cellPos.distanceTo(this.position);
    const normalizedDist = distance / this.radius;
    
    // Falloff function (smooth)
    return Math.max(0, 1.0 - normalizedDist * normalizedDist);
  }

  /**
   * Emit into a fluid grid cell
   */
  emitIntoCell(
    cellPos: THREE.Vector3,
    currentDensity: number,
    currentVelocity: THREE.Vector3,
    currentTemperature: number,
    deltaTime: number
  ): {
    density: number;
    velocity: THREE.Vector3;
    temperature: number;
  } {
    const strength = this.getEmissionStrength(cellPos);
    
    if (strength === 0) {
      return {
        density: currentDensity,
        velocity: currentVelocity,
        temperature: currentTemperature
      };
    }

    const emitAmount = strength * this.emitRate * deltaTime;

    return {
      density: currentDensity + this.density * emitAmount,
      velocity: currentVelocity.clone().lerp(this.velocity, emitAmount),
      temperature: currentTemperature + this.temperature * emitAmount
    };
  }

  /**
   * Set emitter position
   */
  setPosition(position: THREE.Vector3): void {
    this.position.copy(position);
  }

  /**
   * Set emitter velocity
   */
  setVelocity(velocity: THREE.Vector3): void {
    this.velocity.copy(velocity);
  }

  /**
   * Enable/disable emitter
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Trigger a one-shot emission (for non-continuous emitters)
   */
  emit(): void {
    if (!this.continuous) {
      this.lastEmitTime = this.time;
    }
  }
}

/**
 * Emitter manager for multiple emitters
 */
export class FluidEmitterSystem {
  private emitters: FluidEmitter[] = [];

  /**
   * Add an emitter to the system
   */
  addEmitter(emitter: FluidEmitter): void {
    this.emitters.push(emitter);
  }

  /**
   * Remove an emitter
   */
  removeEmitter(emitter: FluidEmitter): void {
    const index = this.emitters.indexOf(emitter);
    if (index !== -1) {
      this.emitters.splice(index, 1);
    }
  }

  /**
   * Get all emitters
   */
  getEmitters(): FluidEmitter[] {
    return this.emitters;
  }

  /**
   * Update all emitters
   */
  update(deltaTime: number): void {
    for (const emitter of this.emitters) {
      emitter.update(deltaTime);
    }
  }

  /**
   * Apply all emitters to a grid cell
   */
  applyEmitters(
    cellPos: THREE.Vector3,
    currentDensity: number,
    currentVelocity: THREE.Vector3,
    currentTemperature: number,
    deltaTime: number
  ): {
    density: number;
    velocity: THREE.Vector3;
    temperature: number;
  } {
    let result = {
      density: currentDensity,
      velocity: currentVelocity.clone(),
      temperature: currentTemperature
    };

    for (const emitter of this.emitters) {
      if (!emitter.enabled) continue;
      
      result = emitter.emitIntoCell(
        cellPos,
        result.density,
        result.velocity,
        result.temperature,
        deltaTime
      );
    }

    return result;
  }

  /**
   * Clear all emitters
   */
  clear(): void {
    this.emitters = [];
  }
}

