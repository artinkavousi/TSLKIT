import { z } from 'zod';
import { colorSchema, jsonValueSchema, parameterSchema, vectorSchema } from './common.js';

export const materialModelSchema = z.enum(['pbr', 'standard', 'unlit']);

export const materialGeneratorSchema = z.object({
  kind: z.enum(['texture', 'noise', 'expression', 'value']),
  ref: z.string().min(1),
  params: z.record(jsonValueSchema).default({})
});

export const materialLayerSchema = z.object({
  id: z.string().min(1),
  label: z.string().optional(),
  stage: z.enum(['surface', 'lighting', 'post']).default('surface'),
  type: z
    .enum(['baseColor', 'normal', 'roughness', 'metallic', 'emissive', 'opacity', 'custom'])
    .default('custom'),
  blend: z.enum(['mix', 'add', 'multiply', 'screen', 'overlay']).default('mix'),
  weight: z.number().min(0).max(1).default(1),
  generator: materialGeneratorSchema,
  inputs: z.record(jsonValueSchema).default({})
});

export const materialUniformSchema = z.object({
  name: z.string().min(1),
  label: z.string().optional(),
  type: z.enum(['float', 'vector2', 'vector3', 'vector4', 'color', 'boolean']),
  value: z.union([z.number(), z.boolean(), colorSchema, vectorSchema, z.array(z.number())]),
  visible: z.boolean().default(true)
});

export const materialMetadataSchema = z
  .object({
    author: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([])
  })
  .default({ tags: [] });

export const materialSpecSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  model: materialModelSchema.default('pbr'),
  layers: z
    .array(materialLayerSchema)
    .min(1, 'Material specs require at least one layer to produce output.'),
  uniforms: z.array(materialUniformSchema).default([]),
  parameters: z.array(parameterSchema).default([]),
  metadata: materialMetadataSchema
});

export type MaterialSpecInput = z.input<typeof materialSpecSchema>;
export type MaterialSpecOutput = z.output<typeof materialSpecSchema>;
export type MaterialLayerInput = z.input<typeof materialLayerSchema>;
export type MaterialLayerOutput = z.output<typeof materialLayerSchema>;
export type MaterialGeneratorInput = z.input<typeof materialGeneratorSchema>;
export type MaterialGeneratorOutput = z.output<typeof materialGeneratorSchema>;
