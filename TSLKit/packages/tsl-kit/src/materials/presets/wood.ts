import { z } from 'zod';

import { createPhysicalMaterial } from '../factory.js';
import { combineLayers, diffuseLayer, sheenLayer, specularLayer } from '../layers.js';
import type { MaterialPresetMetadata, MaterialPresetResult, PhysicalMaterialSpec } from '../types.js';

const colorTuple = z.tuple([
  z.number().min(0).max(1),
  z.number().min(0).max(1),
  z.number().min(0).max(1)
]);

export const woodSchema = z
  .object({
    baseColor: colorTuple.default([0.64, 0.38, 0.18]),
    ringColor: colorTuple.default([0.8, 0.55, 0.3]),
    ringWeight: z.number().min(0).max(1).default(0.35),
    roughness: z.number().min(0).max(1).default(0.6),
    sheenColor: colorTuple.default([1, 0.85, 0.6]),
    sheenIntensity: z.number().min(0).max(1).default(0.25)
  })
  .default({});

export type WoodParams = z.infer<typeof woodSchema>;

export const woodMetadata: MaterialPresetMetadata = {
  id: 'tsl.material.wood',
  label: 'Polished Wood',
  description: 'Layered wood grain with controllable rings and satin sheen.',
  tags: ['procedural', 'surface', 'organic'],
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjYTE2NjJmIi8+PC9zdmc+',
  schema: {
    type: 'object',
    properties: {
      baseColor: {
        type: 'array',
        items: { type: 'number', minimum: 0, maximum: 1 },
        minItems: 3,
        maxItems: 3,
        default: [0.64, 0.38, 0.18]
      },
      ringColor: {
        type: 'array',
        items: { type: 'number', minimum: 0, maximum: 1 },
        minItems: 3,
        maxItems: 3,
        default: [0.8, 0.55, 0.3]
      },
      ringWeight: { type: 'number', minimum: 0, maximum: 1, default: 0.35 },
      roughness: { type: 'number', minimum: 0, maximum: 1, default: 0.6 },
      sheenColor: {
        type: 'array',
        items: { type: 'number', minimum: 0, maximum: 1 },
        minItems: 3,
        maxItems: 3,
        default: [1, 0.85, 0.6]
      },
      sheenIntensity: { type: 'number', minimum: 0, maximum: 1, default: 0.25 }
    },
    additionalProperties: false
  },
  source: {
    type: 'tsl-texture',
    reference: 'PORT_MODULES/02_Materials/tsl-textures/wood.js'
  }
};

export function createWoodMaterial(params?: Partial<WoodParams>): MaterialPresetResult & {
  material: ReturnType<typeof createPhysicalMaterial>;
} {
  const resolved = woodSchema.parse(params ?? {});
  const ringWeight = Math.max(0, Math.min(1, resolved.ringWeight));
  const baseWeight = 1 - ringWeight;

  const layers = combineLayers([
    diffuseLayer({ color: resolved.baseColor, weight: baseWeight }),
    diffuseLayer({ color: resolved.ringColor, weight: ringWeight }),
    specularLayer({
      color: resolved.baseColor,
      weight: 1,
      roughness: resolved.roughness,
      intensity: 0.4
    }),
    sheenLayer({
      color: resolved.sheenColor,
      intensity: resolved.sheenIntensity,
      roughness: 0.35
    })
  ]);

  const spec: PhysicalMaterialSpec = {
    name: 'Polished Wood',
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
