import { z } from 'zod';

import { noiseSpecSchema } from './noise.js';

const colorHexSchema = z
  .string()
  .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/u, 'Expected a CSS hex color value.');

export const schemaModuleSchema = z.enum(['materials', 'post', 'noise', 'compute']);

export const schemaReferenceSchema = z.object({
  module: schemaModuleSchema,
  name: z.string().min(1, 'Schema name is required.'),
  version: z.string().min(1, 'Schema version is required.'),
  url: z.string().url().optional()
});

const baseParameterSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['number', 'boolean', 'color', 'select'])
});

const numberParameterSchema = baseParameterSchema.extend({
  type: z.literal('number'),
  defaultValue: z.number().default(0),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  unit: z.string().optional()
});

const booleanParameterSchema = baseParameterSchema.extend({
  type: z.literal('boolean'),
  defaultValue: z.boolean().default(false)
});

const colorParameterSchema = baseParameterSchema.extend({
  type: z.literal('color'),
  defaultValue: colorHexSchema.default('#ffffff')
});

const selectParameterSchema = baseParameterSchema.extend({
  type: z.literal('select'),
  options: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.union([z.string(), z.number()])
      })
    )
    .min(1),
  defaultValue: z.union([z.string(), z.number()]).optional()
});

export const presetParameterSchema = z.union([
  numberParameterSchema,
  booleanParameterSchema,
  colorParameterSchema,
  selectParameterSchema
]);

const isoDateSchema = z.string().datetime({ offset: true }).optional();

export const materialPresetSchema = z.object({
  id: z.string().min(1),
  kind: z.literal('material'),
  name: z.string().min(1),
  version: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()).default([]),
  previewColor: colorHexSchema,
  previewGeometry: z.enum(['sphere', 'cube', 'torus']).optional(),
  parameters: z.array(presetParameterSchema).default([]),
  noiseSpec: noiseSpecSchema.optional(),
  schema: schemaReferenceSchema,
  documentation: z.string().url().optional(),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
  featureFlags: z.array(z.string()).default([]),
  suitability: z.array(z.string()).default([]),
  heroImage: z.string().url().optional()
});

export const materialPresetCollectionSchema = z.array(materialPresetSchema);

export type SchemaModule = z.infer<typeof schemaModuleSchema>;
export type SchemaReference = z.infer<typeof schemaReferenceSchema>;
export type PresetParameter = z.infer<typeof presetParameterSchema>;
export type MaterialPreset = z.infer<typeof materialPresetSchema>;
