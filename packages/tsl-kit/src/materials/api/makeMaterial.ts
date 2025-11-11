/**
 * Material Factory API
 * 
 * Type-safe material creation with Zod validation.
 * 
 * @module materials/api/makeMaterial
 */

import * as THREE from 'three/webgpu';
import { color } from 'three/tsl';
import {
  MaterialConfig,
  PBRMaterialConfig,
  WoodMaterialConfig,
  GlassMaterialConfig,
  MetalMaterialConfig,
  FabricMaterialConfig,
  materialSchema
} from './schemas';
import { WoodNodeMaterial } from '../procedural/WoodNodeMaterial';

/**
 * Convert color config to THREE.Color
 */
function parseColor(colorConfig: string | number[] | { r: number; g: number; b: number }): THREE.Color {
  if (typeof colorConfig === 'string') {
    return new THREE.Color(colorConfig);
  } else if (Array.isArray(colorConfig)) {
    return new THREE.Color(...colorConfig);
  } else {
    return new THREE.Color(colorConfig.r, colorConfig.g, colorConfig.b);
  }
}

/**
 * Convert side string to THREE constant
 */
function parseSide(side: 'front' | 'back' | 'double'): THREE.Side {
  switch (side) {
    case 'front': return THREE.FrontSide;
    case 'back': return THREE.BackSide;
    case 'double': return THREE.DoubleSide;
  }
}

/**
 * Create a PBR material
 */
function createPBRMaterial(config: PBRMaterialConfig): THREE.MeshPhysicalMaterial {
  const material = new THREE.MeshPhysicalMaterial({
    name: config.name,
    side: parseSide(config.side),
    transparent: config.transparent,
    opacity: config.opacity,
    depthWrite: config.depthWrite,
    depthTest: config.depthTest,
    
    color: parseColor(config.color),
    roughness: config.roughness,
    metalness: config.metalness,
    
    clearcoat: config.clearcoat,
    clearcoatRoughness: config.clearcoatRoughness,
    
    sheen: config.sheen,
    sheenRoughness: config.sheenRoughness,
    sheenColor: config.sheenColor ? parseColor(config.sheenColor) : undefined,
    
    transmission: config.transmission,
    thickness: config.thickness,
    ior: config.ior,
    
    iridescence: config.iridescence,
    iridescenceIOR: config.iridescenceIOR,
    
    emissive: parseColor(config.emissive),
    emissiveIntensity: config.emissiveIntensity,
    
    envMapIntensity: config.envMapIntensity
  });

  return material;
}

/**
 * Create a procedural wood material
 */
function createWoodMaterial(config: WoodMaterialConfig): WoodNodeMaterial {
  let material: WoodNodeMaterial;
  
  if (config.preset) {
    material = WoodNodeMaterial.fromPreset(config.preset as any);
  } else {
    material = new WoodNodeMaterial();
    
    // Apply custom properties
    // Note: Would need to implement setters in WoodNodeMaterial for these
  }
  
  // Apply common properties (cast to base material for property access)
  const baseMat = material as THREE.MeshPhysicalMaterial;
  baseMat.roughness = config.roughness;
  baseMat.metalness = config.metalness;
  baseMat.clearcoat = config.clearcoat;
  baseMat.clearcoatRoughness = config.clearcoatRoughness;
  
  if (config.name) baseMat.name = config.name;
  baseMat.side = parseSide(config.side);
  baseMat.transparent = config.transparent;
  baseMat.opacity = config.opacity;
  
  return material;
}

/**
 * Create a glass material
 */
function createGlassMaterial(config: GlassMaterialConfig): THREE.MeshPhysicalMaterial {
  const material = new THREE.MeshPhysicalMaterial({
    name: config.name,
    side: parseSide(config.side),
    transparent: true,
    opacity: config.opacity,
    depthWrite: config.depthWrite,
    depthTest: config.depthTest,
    
    color: parseColor(config.color),
    transmission: config.transmission,
    thickness: config.thickness,
    roughness: config.roughness,
    ior: config.ior,
    
    attenuationColor: config.attenuationColor ? parseColor(config.attenuationColor) : undefined,
    attenuationDistance: config.attenuationDistance
  });

  return material;
}

/**
 * Create a metal material
 */
function createMetalMaterial(config: MetalMaterialConfig): THREE.MeshPhysicalMaterial {
  // Metal color presets
  const metalColors: Record<string, number[]> = {
    aluminum: [0.91, 0.92, 0.92],
    copper: [0.95, 0.64, 0.54],
    gold: [1.0, 0.84, 0.0],
    silver: [0.97, 0.96, 0.91],
    iron: [0.56, 0.57, 0.58],
    steel: [0.74, 0.77, 0.78],
    bronze: [0.8, 0.5, 0.2]
  };
  
  const baseColor = config.preset && metalColors[config.preset]
    ? metalColors[config.preset]
    : config.color;
  
  const material = new THREE.MeshPhysicalMaterial({
    name: config.name,
    side: parseSide(config.side),
    transparent: config.transparent,
    opacity: config.opacity,
    
    color: parseColor(baseColor),
    roughness: config.roughness,
    metalness: config.metalness,
    
    anisotropy: config.anisotropy,
    anisotropyRotation: config.anisotropyRotation
  });

  return material;
}

/**
 * Create a fabric material
 */
function createFabricMaterial(config: FabricMaterialConfig): THREE.MeshPhysicalMaterial {
  const material = new THREE.MeshPhysicalMaterial({
    name: config.name,
    side: parseSide(config.side),
    transparent: config.transparent,
    opacity: config.opacity,
    
    color: parseColor(config.color),
    roughness: config.roughness,
    
    sheen: config.sheen,
    sheenRoughness: config.sheenRoughness,
    sheenColor: config.sheenColor ? parseColor(config.sheenColor) : undefined
  });

  return material;
}

/**
 * Create a material from a configuration object
 * 
 * @param config - Material configuration (validated with Zod)
 * @returns Configured Three.js material
 * 
 * @example
 * ```typescript
 * const glassMat = makeMaterial({
 *   type: 'glass',
 *   color: '#ffffff',
 *   transmission: 1.0,
 *   roughness: 0.0,
 *   ior: 1.5
 * });
 * ```
 */
export function makeMaterial(config: MaterialConfig): THREE.Material {
  // Validate config
  const validated = materialSchema.parse(config);
  
  // Create material based on type
  switch (validated.type) {
    case 'pbr':
      return createPBRMaterial(validated);
    case 'wood':
      return createWoodMaterial(validated);
    case 'glass':
      return createGlassMaterial(validated);
    case 'metal':
      return createMetalMaterial(validated);
    case 'fabric':
      return createFabricMaterial(validated);
    default:
      throw new Error(`Unknown material type: ${(validated as any).type}`);
  }
}

/**
 * Validate a material configuration without creating the material
 */
export function validateMaterialConfig(config: unknown): MaterialConfig {
  return materialSchema.parse(config);
}

