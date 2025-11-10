import { z } from 'zod';

import { createPhysicalMaterial } from '../factory.js';
import { clearcoatLayer, diffuseLayer, specularLayer } from '../layers.js';
import type { MaterialPresetMetadata, MaterialPresetResult, PhysicalMaterialSpec } from '../types.js';

const colorTuple = z.tuple([
  z.number().min(0).max(1),
  z.number().min(0).max(1),
  z.number().min(0).max(1)
]);

export const rustSchema = z
  .object({
    baseColor: colorTuple.default([0.34, 0.18, 0.11]),
    oxidizedColor: colorTuple.default([0.58, 0.34, 0.21]),
    oxidation: z.number().min(0).max(1).default(0.6),
    roughness: z.number().min(0).max(1).default(0.75),
    clearcoat: z.number().min(0).max(1).default(0.1)
  })
  .default({});

export type RustParams = z.infer<typeof rustSchema>;

export const rustMetadata: MaterialPresetMetadata = {
  id: 'tsl.material.rust',
  label: 'Oxidized Metal',
  description: 'Blends raw metal and oxidized patina layers for a weathered appearance.',
  tags: ['procedural', 'surface', 'industrial'],
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjOGE0YjJmIi8+PC9zdmc+',
  schema: {
    type: 'object',
    properties: {
      baseColor: {
        type: 'array',
        items: { type: 'number', minimum: 0, maximum: 1 },
        minItems: 3,
        maxItems: 3,
        default: [0.34, 0.18, 0.11]
      },
      oxidizedColor: {
        type: 'array',
        items: { type: 'number', minimum: 0, maximum: 1 },
        minItems: 3,
        maxItems: 3,
        default: [0.58, 0.34, 0.21]
      },
      oxidation: { type: 'number', minimum: 0, maximum: 1, default: 0.6 },
      roughness: { type: 'number', minimum: 0, maximum: 1, default: 0.75 },
      clearcoat: { type: 'number', minimum: 0, maximum: 1, default: 0.1 }
    },
    additionalProperties: false
  },
  source: {
    type: 'tsl-texture',
    reference: 'PORT_MODULES/02_Materials/tsl-textures/rust.js'
  }
};

export function createRustMaterial(params?: Partial<RustParams>): MaterialPresetResult & {
  material: ReturnType<typeof createPhysicalMaterial>;
} {
  const resolved = rustSchema.parse(params ?? {});
  const cleanWeight = Math.max(0, Math.min(1, 1 - resolved.oxidation));
  const oxidizedWeight = Math.max(0, Math.min(1, resolved.oxidation));

  const layers = [
    diffuseLayer({ color: resolved.baseColor, weight: cleanWeight }),
    diffuseLayer({ color: resolved.oxidizedColor, weight: oxidizedWeight }),
    specularLayer({
      roughness: resolved.roughness,
      metalness: cleanWeight * 0.9,
      intensity: 0.9
    }),
    clearcoatLayer({ intensity: resolved.clearcoat, roughness: 0.2 })
  ];

  const spec: PhysicalMaterialSpec = {
    name: 'Oxidized Metal',
    layers,
    opacity: 1,
    ior: 1.52
  };

  return {
    input: resolved,
    spec,
    material: createPhysicalMaterial(spec)
  };
}
