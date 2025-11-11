/**
 * Compute System Presets
 * 
 * Ready-to-use force field and particle configurations.
 * 
 * @module compute/presets
 */

import * as THREE from 'three/webgpu';
import {
  ForceFieldSystem,
  GravityForce,
  AttractorForce,
  RepulsorForce,
  VortexForce,
  CurlNoiseForce,
  WindForce
} from './forces';

/**
 * Earth-like gravity preset
 */
export function earthGravity(): ForceFieldSystem {
  const system = new ForceFieldSystem();
  system.addForce(new GravityForce(new THREE.Vector3(0, -1, 0), 9.8));
  return system;
}

/**
 * Zero gravity with subtle drift
 */
export function zeroGravity(): ForceFieldSystem {
  const system = new ForceFieldSystem();
  system.addForce(new CurlNoiseForce(0.5, 0.02, 0.05));
  return system;
}

/**
 * Tornado/vortex effect
 */
export function tornado(): ForceFieldSystem {
  const system = new ForceFieldSystem();
  system.addForce(new VortexForce(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 1, 0),
    15.0,
    100
  ));
  system.addForce(new GravityForce(new THREE.Vector3(0, 1, 0), 2.0)); // Upward lift
  return system;
}

/**
 * Orbital system with central attractor
 */
export function orbitalSystem(): ForceFieldSystem {
  const system = new ForceFieldSystem();
  system.addForce(new AttractorForce(
    new THREE.Vector3(0, 0, 0),
    50.0,
    200,
    1.5
  ));
  return system;
}

/**
 * Repulsion field (explosion-like)
 */
export function explosion(): ForceFieldSystem {
  const system = new ForceFieldSystem();
  system.addForce(new RepulsorForce(
    new THREE.Vector3(0, 0, 0),
    100.0,
    150,
    2.0
  ));
  return system;
}

/**
 * Organic flowing motion
 */
export function organicFlow(): ForceFieldSystem {
  const system = new ForceFieldSystem();
  system.addForce(new CurlNoiseForce(8.0, 0.015, 0.2));
  system.addForce(new WindForce(
    new THREE.Vector3(1, 0.2, 0.5).normalize(),
    2.0,
    0.3
  ));
  return system;
}

/**
 * Turbulent atmosphere
 */
export function turbulentWind(): ForceFieldSystem {
  const system = new ForceFieldSystem();
  system.addForce(new WindForce(
    new THREE.Vector3(1, 0, 0),
    10.0,
    2.0
  ));
  system.addForce(new CurlNoiseForce(5.0, 0.01, 0.3));
  return system;
}

/**
 * Multiple attractors (planet system)
 */
export function multiAttractor(): ForceFieldSystem {
  const system = new ForceFieldSystem();
  
  // Central large attractor
  system.addForce(new AttractorForce(
    new THREE.Vector3(0, 0, 0),
    80.0,
    250,
    1.8
  ));
  
  // Orbiting attractors
  system.addForce(new AttractorForce(
    new THREE.Vector3(50, 0, 0),
    20.0,
    80,
    1.5
  ));
  system.addForce(new AttractorForce(
    new THREE.Vector3(-50, 0, 0),
    20.0,
    80,
    1.5
  ));
  
  return system;
}

/**
 * Gentle floating upward
 */
export function floatingUp(): ForceFieldSystem {
  const system = new ForceFieldSystem();
  system.addForce(new GravityForce(new THREE.Vector3(0, 1, 0), 3.0));
  system.addForce(new CurlNoiseForce(2.0, 0.03, 0.1));
  return system;
}

/**
 * Chaotic turbulence
 */
export function chaosField(): ForceFieldSystem {
  const system = new ForceFieldSystem();
  system.addForce(new CurlNoiseForce(15.0, 0.008, 0.4));
  system.addForce(new VortexForce(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 1, 0),
    8.0,
    120
  ));
  system.addForce(new WindForce(
    new THREE.Vector3(1, 0.5, 0.3).normalize(),
    5.0,
    1.5
  ));
  return system;
}

/**
 * Magnetic-like attraction and repulsion
 */
export function magneticField(): ForceFieldSystem {
  const system = new ForceFieldSystem();
  
  // Positive pole
  system.addForce(new AttractorForce(
    new THREE.Vector3(0, 50, 0),
    40.0,
    100,
    2.0
  ));
  
  // Negative pole
  system.addForce(new RepulsorForce(
    new THREE.Vector3(0, -50, 0),
    40.0,
    100,
    2.0
  ));
  
  return system;
}

/**
 * Underwater current simulation
 */
export function underwaterCurrent(): ForceFieldSystem {
  const system = new ForceFieldSystem();
  system.addForce(new GravityForce(new THREE.Vector3(0, -1, 0), 2.0)); // Reduced gravity
  system.addForce(new WindForce(
    new THREE.Vector3(0.7, 0.3, 0.5).normalize(),
    3.0,
    0.8
  ));
  system.addForce(new CurlNoiseForce(4.0, 0.02, 0.15));
  return system;
}

/**
 * All compute presets
 */
export const computePresets = {
  earthGravity: earthGravity,
  zeroGravity: zeroGravity,
  tornado: tornado,
  orbital: orbitalSystem,
  explosion: explosion,
  organicFlow: organicFlow,
  turbulentWind: turbulentWind,
  multiAttractor: multiAttractor,
  floatingUp: floatingUp,
  chaos: chaosField,
  magnetic: magneticField,
  underwater: underwaterCurrent
};

