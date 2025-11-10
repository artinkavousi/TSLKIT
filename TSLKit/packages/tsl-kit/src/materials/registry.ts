import type { MeshPhysicalNodeMaterial } from 'three/webgpu';
import type { z } from 'zod';

import {
  concreteMetadata,
  concreteSchema,
  createConcreteMaterial,
  createOpacityTestMaterial,
  createRustMaterial,
  createWaterDropsMaterial,
  opacityTestMetadata,
  opacityTestSchema,
  rustMetadata,
  rustSchema,
  waterDropsMetadata,
  waterDropsSchema
} from './presets/index.js';
import type { MaterialPresetMetadata, MaterialPresetResult } from './types.js';

export interface MaterialPresetDefinition<TInput extends Record<string, unknown>> {
  type: string;
  metadata: MaterialPresetMetadata;
  schema: z.ZodType<TInput>;
  create: (params?: Partial<TInput>) => MaterialPresetResult & { material: MeshPhysicalNodeMaterial };
}

const BUILT_IN_PRESETS: MaterialPresetDefinition<any>[] = [
  {
    type: 'tsl.material.concrete',
    metadata: concreteMetadata,
    schema: concreteSchema,
    create: createConcreteMaterial
  },
  {
    type: 'tsl.material.rust',
    metadata: rustMetadata,
    schema: rustSchema,
    create: createRustMaterial
  },
  {
    type: 'tsl.material.waterDrops',
    metadata: waterDropsMetadata,
    schema: waterDropsSchema,
    create: createWaterDropsMaterial
  },
  {
    type: 'tsl.material.opacityTest',
    metadata: opacityTestMetadata,
    schema: opacityTestSchema,
    create: createOpacityTestMaterial
  }
];

export class MaterialRegistry {
  private readonly definitions = new Map<string, MaterialPresetDefinition<any>>();

  constructor() {
    BUILT_IN_PRESETS.forEach((preset) => {
      this.register(preset);
    });
  }

  register<TInput extends Record<string, unknown>>(definition: MaterialPresetDefinition<TInput>): void {
    this.definitions.set(definition.type, definition);
  }

  get(type: string): MaterialPresetDefinition<any> | undefined {
    return this.definitions.get(type);
  }

  list(): MaterialPresetMetadata[] {
    return Array.from(this.definitions.values()).map((definition) => definition.metadata);
  }
}

export const materialsRegistry = new MaterialRegistry();

export function buildMaterialPreset<TInput extends Record<string, unknown>>(
  type: string,
  params?: Partial<TInput>
): MaterialPresetResult & { material: MeshPhysicalNodeMaterial } {
  const definition = materialsRegistry.get(type);

  if (!definition) {
    throw new Error(`Unknown material preset: ${type}`);
  }

  return definition.create(params);
}

export function getMaterialMetadata(type?: string): MaterialPresetMetadata | MaterialPresetMetadata[] {
  if (type) {
    const definition = materialsRegistry.get(type);

    if (!definition) {
      throw new Error(`Unknown material preset: ${type}`);
    }

    return definition.metadata;
  }

  return materialsRegistry.list();
}
