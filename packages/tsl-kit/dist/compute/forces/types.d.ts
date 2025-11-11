/**
 * Force Field Types
 *
 * Type definitions for particle force fields and attractors.
 *
 * @module compute/forces/types
 */
import * as THREE from 'three/webgpu';
/**
 * Force field type
 */
export type ForceFieldType = 'gravity' | 'attractor' | 'repulsor' | 'vortex' | 'curl' | 'wind';
/**
 * Base force field configuration
 */
export interface ForceFieldConfig {
    type: ForceFieldType;
    strength: number;
    radius?: number;
    position?: THREE.Vector3;
    enabled?: boolean;
}
/**
 * Gravity force field
 */
export interface GravityForceConfig extends ForceFieldConfig {
    type: 'gravity';
    direction: THREE.Vector3;
}
/**
 * Attractor/Repulsor force field
 */
export interface AttractorForceConfig extends ForceFieldConfig {
    type: 'attractor' | 'repulsor';
    position: THREE.Vector3;
    radius: number;
    falloff?: number;
}
/**
 * Vortex force field
 */
export interface VortexForceConfig extends ForceFieldConfig {
    type: 'vortex';
    position: THREE.Vector3;
    axis: THREE.Vector3;
    radius: number;
}
/**
 * Curl noise force field
 */
export interface CurlNoiseForceConfig extends ForceFieldConfig {
    type: 'curl';
    scale: number;
    timeScale: number;
}
/**
 * Wind force field
 */
export interface WindForceConfig extends ForceFieldConfig {
    type: 'wind';
    direction: THREE.Vector3;
    turbulence: number;
}
/**
 * Union type for all force field configurations
 */
export type AnyForceFieldConfig = GravityForceConfig | AttractorForceConfig | VortexForceConfig | CurlNoiseForceConfig | WindForceConfig;
//# sourceMappingURL=types.d.ts.map