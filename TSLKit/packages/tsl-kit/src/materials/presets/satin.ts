import { z } from 'zod';

import { createPhysicalMaterial } from '../factory.js';
import { clearcoatLayer, combineLayers, diffuseLayer, sheenLayer, specularLayer } from '../layers.js';
import type { MaterialPresetMetadata, MaterialPresetResult, PhysicalMaterialSpec } from '../types.js';

const colorTuple = z.tuple([
  z.number().min(0).max(1),
  z.number().min(0).max(1),
  z.number().min(0).max(1)
]);

export const satinSchema = z
  .object({
    baseColor: colorTuple.default([0.85, 0.25, 0.65]),
    sheenColor: colorTuple.default([1, 0.8, 0.95]),
    sheenIntensity: z.number().min(0).max(1).default(0.6),
    roughness: z.number().min(0).max(1).default(0.35),
    clearcoatIntensity: z.number().min(0).max(1).default(0.25),
    clearcoatRoughness: z.number().min(0).max(1).default(0.1)
  })
  .default({});

export type SatinParams = z.infer<typeof satinSchema>;

export const satinMetadata: MaterialPresetMetadata = {
  id: 'tsl.material.satin',
  label: 'Satin Fabric',
  description: 'Shimmering fabric with layered sheen and clearcoat highlights.',
  tags: ['procedural', 'surface', 'fabric'],
  thumbnail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZDk0NmVmIi8+PC9zdmc+',
  schema: {
    type: 'object',
    properties: {
      baseColor: {
        type: 'array',
        items: { type: 'number', minimum: 0, maximum: 1 },
        minItems: 3,
        maxItems: 3,
        default: [0.85, 0.25, 0.65]
      },
      sheenColor: {
        type: 'array',
        items: { type: 'number', minimum: 0, maximum: 1 },
        minItems: 3,
        maxItems: 3,
        default: [1, 0.8, 0.95]
      },
      sheenIntensity: { type: 'number', minimum: 0, maximum: 1, default: 0.6 },
      roughness: { type: 'number', minimum: 0, maximum: 1, default: 0.35 },
      clearcoatIntensity: { type: 'number', minimum: 0, maximum: 1, default: 0.25 },
      clearcoatRoughness: { type: 'number', minimum: 0, maximum: 1, default: 0.1 }
    },
    additionalProperties: false
  },
  source: {
    type: 'tsl-texture',
    reference: 'PORT_MODULES/02_Materials/tsl-textures/satin.js'
  }
};

export function createSatinMaterial(params?: Partial<SatinParams>): MaterialPresetResult & {
  material: ReturnType<typeof createPhysicalMaterial>;
} {
  const resolved = satinSchema.parse(params ?? {});

  const layers = combineLayers([
    diffuseLayer({ color: resolved.baseColor, weight: 1 }),
    specularLayer({
      color: resolved.baseColor,
      weight: 1,
      roughness: resolved.roughness,
      intensity: 0.5
    }),
    sheenLayer({
      color: resolved.sheenColor,
      intensity: resolved.sheenIntensity,
      roughness: 0.25
    }),
    clearcoatLayer({
      color: resolved.sheenColor,
      intensity: resolved.clearcoatIntensity,
      roughness: resolved.clearcoatRoughness
    })
  ]);

  const spec: PhysicalMaterialSpec = {
    name: 'Satin Fabric',
    layers,
    opacity: 1,
    ior: 1.4
  };

  return {
    input: resolved,
    spec,
    material: createPhysicalMaterial(spec)
  };
}
