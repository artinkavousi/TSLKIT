import { z } from 'zod';

import { createPhysicalMaterial } from '../factory.js';
import { diffuseLayer, specularLayer, transmissionLayer } from '../layers.js';
import type { MaterialPresetMetadata, MaterialPresetResult, PhysicalMaterialSpec } from '../types.js';

const colorTuple = z.tuple([
  z.number().min(0).max(1),
  z.number().min(0).max(1),
  z.number().min(0).max(1)
]);

export const waterDropsSchema = z
  .object({
    surfaceColor: colorTuple.default([0.18, 0.32, 0.45]),
    depthColor: colorTuple.default([0.04, 0.08, 0.14]),
    transmission: z.number().min(0).max(1).default(0.85),
    thickness: z.number().min(0).max(5).default(0.35),
    roughness: z.number().min(0).max(1).default(0.05)
  })
  .default({});

export type WaterDropsParams = z.infer<typeof waterDropsSchema>;

export const waterDropsMetadata: MaterialPresetMetadata = {
  id: 'tsl.material.waterDrops',
  label: 'Water Drops',
  description: 'Translucent water droplet material with controllable thickness and refraction.',
  tags: ['procedural', 'transmission', 'effects'],
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjMmY2YzhhIi8+PC9zdmc+',
  schema: {
    type: 'object',
    properties: {
      surfaceColor: {
        type: 'array',
        items: { type: 'number', minimum: 0, maximum: 1 },
        minItems: 3,
        maxItems: 3,
        default: [0.18, 0.32, 0.45]
      },
      depthColor: {
        type: 'array',
        items: { type: 'number', minimum: 0, maximum: 1 },
        minItems: 3,
        maxItems: 3,
        default: [0.04, 0.08, 0.14]
      },
      transmission: { type: 'number', minimum: 0, maximum: 1, default: 0.85 },
      thickness: { type: 'number', minimum: 0, maximum: 5, default: 0.35 },
      roughness: { type: 'number', minimum: 0, maximum: 1, default: 0.05 }
    },
    additionalProperties: false
  },
  source: {
    type: 'tsl-texture',
    reference: 'PORT_MODULES/02_Materials/tsl-textures/water-drops.js'
  }
};

export function createWaterDropsMaterial(params?: Partial<WaterDropsParams>): MaterialPresetResult & {
  material: ReturnType<typeof createPhysicalMaterial>;
} {
  const resolved = waterDropsSchema.parse(params ?? {});

  const layers = [
    diffuseLayer({ color: resolved.surfaceColor, weight: 0.2 }),
    diffuseLayer({ color: resolved.depthColor, weight: 0.8 }),
    specularLayer({ roughness: resolved.roughness, intensity: 0.9, metalness: 0 }),
    transmissionLayer({
      intensity: resolved.transmission,
      color: resolved.surfaceColor,
      thickness: resolved.thickness,
      attenuationColor: resolved.depthColor,
      attenuationDistance: 1.5
    })
  ];

  const spec: PhysicalMaterialSpec = {
    name: 'Water Drops',
    layers,
    opacity: 0.95,
    ior: 1.33
  };

  return {
    input: resolved,
    spec,
    material: createPhysicalMaterial(spec)
  };
}
