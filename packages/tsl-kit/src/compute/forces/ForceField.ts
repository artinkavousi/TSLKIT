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
export abstract class ForceField {
  type: ForceFieldType;
  strength: number;
  enabled: boolean;

  constructor(config: ForceFieldConfig) {
    this.type = config.type;
    this.strength = config.strength;
    this.enabled = config.enabled !== undefined ? config.enabled : true;
  }

  /**
   * Calculate force at a given position
   */
  abstract calculateForce(position: THREE.Vector3, velocity: THREE.Vector3, time: number): THREE.Vector3;

  /**
   * Update force field state
   */
  update(deltaTime: number): void {
    // Override in subclasses if needed
  }

  /**
   * Set strength
   */
  setStrength(strength: number): void {
    this.strength = strength;
  }

  /**
   * Enable/disable force field
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

/**
 * Gravity force field
 */
export class GravityForce extends ForceField {
  direction: THREE.Vector3;

  constructor(direction: THREE.Vector3, strength: number = 9.8) {
    super({ type: 'gravity', strength });
    this.direction = direction.clone().normalize();
  }

  calculateForce(position: THREE.Vector3, velocity: THREE.Vector3, time: number): THREE.Vector3 {
    if (!this.enabled) return new THREE.Vector3();
    return this.direction.clone().multiplyScalar(this.strength);
  }

  setDirection(direction: THREE.Vector3): void {
    this.direction.copy(direction).normalize();
  }
}

/**
 * Attractor force field
 */
export class AttractorForce extends ForceField {
  position: THREE.Vector3;
  radius: number;
  falloff: number;

  constructor(position: THREE.Vector3, strength: number = 1.0, radius: number = 100, falloff: number = 2) {
    super({ type: 'attractor', strength, radius });
    this.position = position.clone();
    this.radius = radius;
    this.falloff = falloff;
  }

  calculateForce(position: THREE.Vector3, velocity: THREE.Vector3, time: number): THREE.Vector3 {
    if (!this.enabled) return new THREE.Vector3();

    const direction = this.position.clone().sub(position);
    const distance = direction.length();

    if (distance > this.radius) return new THREE.Vector3();

    direction.normalize();
    
    // Apply inverse square law with falloff
    const forceMagnitude = this.strength * Math.pow(1.0 - distance / this.radius, this.falloff);
    
    return direction.multiplyScalar(forceMagnitude);
  }

  setPosition(position: THREE.Vector3): void {
    this.position.copy(position);
  }
}

/**
 * Repulsor force field (negative attractor)
 */
export class RepulsorForce extends AttractorForce {
  constructor(position: THREE.Vector3, strength: number = 1.0, radius: number = 100, falloff: number = 2) {
    super(position, -Math.abs(strength), radius, falloff);
    this.type = 'repulsor';
  }
}

/**
 * Vortex force field
 */
export class VortexForce extends ForceField {
  position: THREE.Vector3;
  axis: THREE.Vector3;
  radius: number;

  constructor(position: THREE.Vector3, axis: THREE.Vector3, strength: number = 1.0, radius: number = 100) {
    super({ type: 'vortex', strength, radius });
    this.position = position.clone();
    this.axis = axis.clone().normalize();
    this.radius = radius;
  }

  calculateForce(position: THREE.Vector3, velocity: THREE.Vector3, time: number): THREE.Vector3 {
    if (!this.enabled) return new THREE.Vector3();

    const toPoint = position.clone().sub(this.position);
    const distance = toPoint.length();

    if (distance > this.radius) return new THREE.Vector3();

    // Project onto vortex axis
    const axisDistance = toPoint.dot(this.axis);
    const radialVector = toPoint.clone().sub(this.axis.clone().multiplyScalar(axisDistance));
    const radialDistance = radialVector.length();

    if (radialDistance < 0.001) return new THREE.Vector3();

    // Tangential force (perpendicular to radial)
    const tangent = new THREE.Vector3().crossVectors(this.axis, radialVector).normalize();
    
    // Inward force (toward axis)
    const radialForce = radialVector.clone().normalize().multiplyScalar(-this.strength * 0.5);
    
    // Combined vortex force
    const falloff = 1.0 - distance / this.radius;
    const force = tangent.multiplyScalar(this.strength * falloff).add(radialForce);
    
    return force;
  }

  setPosition(position: THREE.Vector3): void {
    this.position.copy(position);
  }

  setAxis(axis: THREE.Vector3): void {
    this.axis.copy(axis).normalize();
  }
}

/**
 * Curl noise force field
 */
export class CurlNoiseForce extends ForceField {
  scale: number;
  timeScale: number;
  private time: number = 0;

  constructor(strength: number = 1.0, scale: number = 0.01, timeScale: number = 0.1) {
    super({ type: 'curl', strength });
    this.scale = scale;
    this.timeScale = timeScale;
  }

  calculateForce(position: THREE.Vector3, velocity: THREE.Vector3, time: number): THREE.Vector3 {
    if (!this.enabled) return new THREE.Vector3();

    // Simplified curl noise approximation using multiple octaves of sine/cosine
    const p = position.clone().multiplyScalar(this.scale);
    const t = time * this.timeScale;

    const x = Math.sin(p.y + t) * Math.cos(p.z + t);
    const y = Math.sin(p.z + t) * Math.cos(p.x + t);
    const z = Math.sin(p.x + t) * Math.cos(p.y + t);

    return new THREE.Vector3(x, y, z).multiplyScalar(this.strength);
  }

  update(deltaTime: number): void {
    this.time += deltaTime * this.timeScale;
  }

  setScale(scale: number): void {
    this.scale = scale;
  }

  setTimeScale(timeScale: number): void {
    this.timeScale = timeScale;
  }
}

/**
 * Wind force field
 */
export class WindForce extends ForceField {
  direction: THREE.Vector3;
  turbulence: number;
  private time: number = 0;

  constructor(direction: THREE.Vector3, strength: number = 1.0, turbulence: number = 0.5) {
    super({ type: 'wind', strength });
    this.direction = direction.clone().normalize();
    this.turbulence = turbulence;
  }

  calculateForce(position: THREE.Vector3, velocity: THREE.Vector3, time: number): THREE.Vector3 {
    if (!this.enabled) return new THREE.Vector3();

    // Base wind force
    const force = this.direction.clone().multiplyScalar(this.strength);

    // Add turbulence
    if (this.turbulence > 0) {
      const turb = new THREE.Vector3(
        Math.sin(position.x * 0.1 + time) * this.turbulence,
        Math.sin(position.y * 0.1 + time * 1.3) * this.turbulence,
        Math.sin(position.z * 0.1 + time * 0.7) * this.turbulence
      );
      force.add(turb);
    }

    return force;
  }

  update(deltaTime: number): void {
    this.time += deltaTime;
  }

  setDirection(direction: THREE.Vector3): void {
    this.direction.copy(direction).normalize();
  }

  setTurbulence(turbulence: number): void {
    this.turbulence = turbulence;
  }
}

