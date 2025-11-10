import { z } from 'zod';

import { createPhysicalMaterial } from '../factory.js';
import { combineLayers, diffuseLayer, specularLayer } from '../layers.js';
import type { MaterialPresetMetadata, MaterialPresetResult, PhysicalMaterialSpec } from '../types.js';

const colorTuple = z.tuple([
  z.number().min(0).max(1),
  z.number().min(0).max(1),
  z.number().min(0).max(1)
]);

export const bricksSchema = z
  .object({
    brickColor: colorTuple.default([0.72, 0.3, 0.23]),
    mortarColor: colorTuple.default([0.85, 0.82, 0.78]),
    brickWeight: z.number().min(0).max(1).default(0.82),
    brickRoughness: z.number().min(0).max(1).default(0.78),
    mortarRoughness: z.number().min(0).max(1).default(0.9),
    specularIntensity: z.number().min(0).max(1).default(0.22)
  })
  .default({});

export type BricksParams = z.infer<typeof bricksSchema>;

export const bricksMetadata: MaterialPresetMetadata = {
  id: 'tsl.material.bricks',
  label: 'Weathered Bricks',
  description: 'Sun-baked brickwork with adjustable mortar mix and gloss.',
  tags: ['procedural', 'surface', 'architectural'],
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjYzI1NDJkIi8+PC9zdmc+',
  schema: {
    type: 'object',
    properties: {
      brickColor: {
        type: 'array',
        items: { type: 'number', minimum: 0, maximum: 1 },
        minItems: 3,
        maxItems: 3,
        default: [0.72, 0.3, 0.23]
      },
      mortarColor: {
        type: 'array',
        items: { type: 'number', minimum: 0, maximum: 1 },
        minItems: 3,
        maxItems: 3,
        default: [0.85, 0.82, 0.78]
      },
      brickWeight: { type: 'number', minimum: 0, maximum: 1, default: 0.82 },
      brickRoughness: { type: 'number', minimum: 0, maximum: 1, default: 0.78 },
      mortarRoughness: { type: 'number', minimum: 0, maximum: 1, default: 0.9 },
      specularIntensity: { type: 'number', minimum: 0, maximum: 1, default: 0.22 }
    },
    additionalProperties: false
  },
  source: {
    type: 'tsl-texture',
    reference: 'PORT_MODULES/02_Materials/tsl-textures/bricks.js'
  }
};

export function createBricksMaterial(params?: Partial<BricksParams>): MaterialPresetResult & {
  material: ReturnType<typeof createPhysicalMaterial>;
} {
  const resolved = bricksSchema.parse(params ?? {});
  const brickWeight = Math.max(0, Math.min(1, resolved.brickWeight));
  const mortarWeight = 1 - brickWeight;

  const layers = combineLayers([
    diffuseLayer({ color: resolved.brickColor, weight: brickWeight }),
    diffuseLayer({ color: resolved.mortarColor, weight: mortarWeight }),
    specularLayer({
      color: resolved.brickColor,
      weight: brickWeight,
      roughness: resolved.brickRoughness,
      intensity: resolved.specularIntensity
    }),
    specularLayer({
      color: resolved.mortarColor,
      weight: mortarWeight,
      roughness: resolved.mortarRoughness,
      intensity: resolved.specularIntensity * 0.6
    })
  ]);

  const spec: PhysicalMaterialSpec = {
    name: 'Weathered Bricks',
    layers,
    opacity: 1,
    ior: 1.5
  };

  return {
    input: resolved,
    spec,
    material: createPhysicalMaterial(spec)
  };
}
