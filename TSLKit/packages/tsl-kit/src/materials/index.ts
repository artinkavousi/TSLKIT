export type {
  ColorRGB,
  PhysicalMaterialLayerSpec,
  PhysicalMaterialSpec,
  PhysicalMaterialEvaluation,
  MaterialPresetMetadata,
  MaterialPresetResult
} from './types.js';
export {
  diffuseLayer,
  specularLayer,
  clearcoatLayer,
  sheenLayer,
  transmissionLayer,
  combineLayers
} from './layers.js';
export { createPhysicalMaterial, evaluatePhysicalMaterial } from './factory.js';
export { MaterialXLoader } from './materialx-loader.js';
export {
  buildMaterialPreset,
  getMaterialMetadata,
  materialsRegistry,
  type MaterialPresetDefinition
} from './registry.js';
export {
  concreteSchema,
  rustSchema,
  waterDropsSchema,
  opacityTestSchema,
  createConcreteMaterial,
  createRustMaterial,
  createWaterDropsMaterial,
  createOpacityTestMaterial,
  concreteMetadata,
  rustMetadata,
  waterDropsMetadata,
  opacityTestMetadata
} from './presets/index.js';
