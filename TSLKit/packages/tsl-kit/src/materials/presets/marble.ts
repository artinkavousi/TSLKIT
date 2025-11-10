import { z } from 'zod';

import { createPhysicalMaterial } from '../factory.js';
import { combineLayers, diffuseLayer, specularLayer, transmissionLayer } from '../layers.js';
import type { MaterialPresetMetadata, MaterialPresetResult, PhysicalMaterialSpec } from '../types.js';

const colorTuple = z.tuple([
  z.number().min(0).max(1),
  z.number().min(0).max(1),
  z.number().min(0).max(1)
]);

export const marbleSchema = z
  .object({
    baseColor: colorTuple.default([0.95, 0.95, 0.95]),
    veinColor: colorTuple.default([0.7, 0.7, 0.75]),
    veinWeight: z.number().min(0).max(1).default(0.25),
    roughness: z.number().min(0).max(1).default(0.2),
    transmissionColor: colorTuple.default([0.9, 0.9, 1]),
    transmissionIntensity: z.number().min(0).max(1).default(0.2),
    thickness: z.number().min(0).max(5).default(0.5)
  })
  .default({});

export type MarbleParams = z.infer<typeof marbleSchema>;

export const marbleMetadata: MaterialPresetMetadata = {
  id: 'tsl.material.marble',
  label: 'Translucent Marble',
  description: 'Softly veined marble with subtle subsurface scattering.',
  tags: ['procedural', 'surface', 'stone'],
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZDlkOWQ5Ii8+PC9zdmc+',
  schema: {
    type: 'object',
    properties: {
      baseColor: {
        type: 'array',
        items: { type: 'number', minimum: 0, maximum: 1 },
        minItems: 3,
        maxItems: 3,
        default: [0.95, 0.95, 0.95]
      },
      veinColor: {
        type: 'array',
        items: { type: 'number', minimum: 0, maximum: 1 },
        minItems: 3,
        maxItems: 3,
        default: [0.7, 0.7, 0.75]
      },
      veinWeight: { type: 'number', minimum: 0, maximum: 1, default: 0.25 },
      roughness: { type: 'number', minimum: 0, maximum: 1, default: 0.2 },
      transmissionColor: {
        type: 'array',
        items: { type: 'number', minimum: 0, maximum: 1 },
        minItems: 3,
        maxItems: 3,
        default: [0.9, 0.9, 1]
      },
      transmissionIntensity: { type: 'number', minimum: 0, maximum: 1, default: 0.2 },
      thickness: { type: 'number', minimum: 0, maximum: 5, default: 0.5 }
    },
    additionalProperties: false
  },
  source: {
    type: 'tsl-texture',
    reference: 'PORT_MODULES/02_Materials/tsl-textures/marble.js'
  }
};

export function createMarbleMaterial(params?: Partial<MarbleParams>): MaterialPresetResult & {
  material: ReturnType<typeof createPhysicalMaterial>;
} {
  const resolved = marbleSchema.parse(params ?? {});
  const veinWeight = Math.max(0, Math.min(1, resolved.veinWeight));
  const baseWeight = 1 - veinWeight;

  const layers = combineLayers([
    diffuseLayer({ color: resolved.baseColor, weight: baseWeight }),
    diffuseLayer({ color: resolved.veinColor, weight: veinWeight }),
    specularLayer({
      color: resolved.baseColor,
      weight: 1,
      roughness: resolved.roughness,
      intensity: 0.35
    }),
    transmissionLayer({
      color: resolved.transmissionColor,
      intensity: resolved.transmissionIntensity,
      thickness: resolved.thickness,
      attenuationColor: resolved.baseColor,
      attenuationDistance: 1.5
    })
  ]);

  const spec: PhysicalMaterialSpec = {
    name: 'Translucent Marble',
    layers,
    opacity: 1,
    ior: 1.55
  };

  return {
    input: resolved,
    spec,
    material: createPhysicalMaterial(spec)
  };
}
