import { z } from 'zod';

import { createPhysicalMaterial } from '../factory.js';
import { diffuseLayer, specularLayer } from '../layers.js';
import type { MaterialPresetMetadata, MaterialPresetResult, PhysicalMaterialSpec } from '../types.js';

const colorTuple = z.tuple([
  z.number().min(0).max(1),
  z.number().min(0).max(1),
  z.number().min(0).max(1)
]);

export const opacityTestSchema = z
  .object({
    baseColor: colorTuple.default([0.2, 0.8, 0.2]),
    opacity: z.number().min(0).max(1).default(0.5),
    roughness: z.number().min(0).max(1).default(0.2),
    metalness: z.number().min(0).max(1).default(0),
    specular: z.number().min(0).max(1).default(1),
    ior: z.number().min(1).max(3).default(1.5)
  })
  .default({});

export type OpacityTestParams = z.infer<typeof opacityTestSchema>;

export const opacityTestMetadata: MaterialPresetMetadata = {
  id: 'tsl.material.opacityTest',
  label: 'MaterialX Opacity Test',
  description: 'Baseline material mirroring the MaterialX opacity_only_test standard surface.',
  tags: ['materialx', 'reference'],
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjMmZiODZjIi8+PC9zdmc+',
  schema: {
    type: 'object',
    properties: {
      baseColor: {
        type: 'array',
        items: { type: 'number', minimum: 0, maximum: 1 },
        minItems: 3,
        maxItems: 3,
        default: [0.2, 0.8, 0.2]
      },
      opacity: { type: 'number', minimum: 0, maximum: 1, default: 0.5 },
      roughness: { type: 'number', minimum: 0, maximum: 1, default: 0.2 },
      metalness: { type: 'number', minimum: 0, maximum: 1, default: 0 },
      specular: { type: 'number', minimum: 0, maximum: 1, default: 1 },
      ior: { type: 'number', minimum: 1, maximum: 3, default: 1.5 }
    },
    additionalProperties: false
  },
  source: {
    type: 'materialx',
    reference: 'opacity_only_test.mtlx'
  }
};

export function createOpacityTestMaterial(params?: Partial<OpacityTestParams>): MaterialPresetResult & {
  material: ReturnType<typeof createPhysicalMaterial>;
} {
  const resolved = opacityTestSchema.parse(params ?? {});

  const layers = [
    diffuseLayer({ color: resolved.baseColor, weight: 1 }),
    specularLayer({
      color: [1, 1, 1],
      roughness: resolved.roughness,
      metalness: resolved.metalness,
      intensity: resolved.specular
    })
  ];

  const spec: PhysicalMaterialSpec = {
    name: 'mat_opacity_only_test',
    layers,
    opacity: resolved.opacity,
    ior: resolved.ior
  };

  return {
    input: resolved,
    spec,
    material: createPhysicalMaterial(spec)
  };
}
