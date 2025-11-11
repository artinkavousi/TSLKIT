/**
 * PBR (Physically Based Rendering) Core
 * 
 * Essential building blocks for PBR materials:
 * - BRDF (Bidirectional Reflectance Distribution Function)
 * - Fresnel effects
 * - Triplanar mapping
 * - Image-Based Lighting (IBL)
 * - Disney PBR layers (clearcoat, sheen, anisotropy, iridescence, transmission, subsurface)
 * 
 * @module materials/pbr
 */

// Core PBR
export * from './brdf';
export * from './fresnel';
export * from './triplanar';
export * from './ibl';

// Disney PBR Layers
export * from './clearcoat';
export * from './sheen';
export * from './anisotropy';
export * from './iridescence';
export * from './transmission';
export * from './subsurface';

