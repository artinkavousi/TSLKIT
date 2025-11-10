import { z } from 'zod';

import { createPhysicalMaterial } from '../factory.js';
import { diffuseLayer, specularLayer } from '../layers.js';
import type { MaterialPresetMetadata, MaterialPresetResult, PhysicalMaterialSpec } from '../types.js';

const colorTuple = z.tuple([
  z.number().min(0).max(1),
  z.number().min(0).max(1),
  z.number().min(0).max(1)
]);

export const concreteSchema = z
  .object({
    baseColor: colorTuple.default([0.58, 0.58, 0.58]),
    accentColor: colorTuple.default([0.48, 0.48, 0.48]),
    accentWeight: z.number().min(0).max(1).default(0.25),
    roughness: z.number().min(0).max(1).default(0.85),
    specularIntensity: z.number().min(0).max(1).default(0.1)
  })
  .default({});

export type ConcreteParams = z.infer<typeof concreteSchema>;

export const concreteMetadata: MaterialPresetMetadata = {
  id: 'tsl.material.concrete',
  label: 'Concrete',
  description: 'Layered grey concrete surface with adjustable accent tint and sheen.',
  tags: ['procedural', 'surface', 'architectural'],
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjN2M3YzdjIi8+PC9zdmc+',
  schema: {
    type: 'object',
    properties: {
      baseColor: {
        type: 'array',
        items: { type: 'number', minimum: 0, maximum: 1 },
        minItems: 3,
        maxItems: 3,
        default: [0.58, 0.58, 0.58]
      },
      accentColor: {
        type: 'array',
        items: { type: 'number', minimum: 0, maximum: 1 },
        minItems: 3,
        maxItems: 3,
        default: [0.48, 0.48, 0.48]
      },
      accentWeight: { type: 'number', minimum: 0, maximum: 1, default: 0.25 },
      roughness: { type: 'number', minimum: 0, maximum: 1, default: 0.85 },
      specularIntensity: { type: 'number', minimum: 0, maximum: 1, default: 0.1 }
    },
    additionalProperties: false
  },
  source: {
    type: 'tsl-texture',
    reference: 'PORT_MODULES/02_Materials/tsl-textures/concrete.js'
  }
};

export function createConcreteMaterial(params?: Partial<ConcreteParams>): MaterialPresetResult & {
  material: ReturnType<typeof createPhysicalMaterial>;
} {
  const resolved = concreteSchema.parse(params ?? {});
  const primaryWeight = Math.max(0, Math.min(1, 1 - resolved.accentWeight));
  const secondaryWeight = Math.max(0, Math.min(1, resolved.accentWeight));

  const layers = [
    diffuseLayer({ color: resolved.baseColor, weight: primaryWeight }),
    diffuseLayer({ color: resolved.accentColor, weight: secondaryWeight }),
    specularLayer({ roughness: resolved.roughness, intensity: resolved.specularIntensity })
  ];

  const spec: PhysicalMaterialSpec = {
    name: 'Concrete',
    layers,
    opacity: 1,
    ior: 1.45
  };

  return {
    input: resolved,
    spec,
    material: createPhysicalMaterial(spec)
  };
}
