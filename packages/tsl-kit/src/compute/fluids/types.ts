/**
 * Type definitions for fluid simulation system
 * @module compute/fluids/types
 */

/**
 * Fluid simulation configuration
 */
export interface FluidConfig {
  // Grid settings
  gridSize: number;
  gridScale: number;
  
  // Physical properties
  viscosity: number;
  dissipation: number;
  vorticityScale: number;
  
  // Simulation settings
  pressureIterations: number;
  timeStep: number;
  
  // Rendering
  densityScale: number;
  velocityScale: number;
  
  // Camera
  camPosRadius: number;
  camPosTheta: number;
  camPosPhi: number;
}

/**
 * Preset configuration for different fluid types
 */
export interface FluidPreset {
  label: string;
  props: Partial<FluidConfig>;
  description?: string;
}

/**
 * Emitter configuration
 */
export interface FluidEmitter {
  position: [number, number, number];
  radius: number;
  temperature: number;
  density: number;
  velocity?: [number, number, number];
  color?: [number, number, number];
}

/**
 * Uniform buffer field definition
 */
export interface UniformField {
  name: string;
  type: 'f32' | 'u32' | 'i32';
}

/**
 * Compute shader dispatch configuration
 */
export interface ComputeDispatch {
  x: number;
  y: number;
  z: number;
}

