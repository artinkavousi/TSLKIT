import { z } from 'zod';

import { presetParameterSchema, schemaReferenceSchema } from './materials.js';

const colorHexSchema = z
  .string()
  .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/u, 'Expected a CSS hex color value.');

const isoDateSchema = z.string().datetime({ offset: true }).optional();

export const postStackSpecSchema = z.object({
  stages: z.array(z.string().min(1)).min(1),
  supportsRealtime: z.boolean().default(true),
  supportsDeferred: z.boolean().default(false),
  hasAsyncPasses: z.boolean().default(false),
  renderScale: z.number().min(0.25).max(2).default(1),
  outputs: z.array(z.string()).default([])
});

export const postStackPresetSchema = z.object({
  id: z.string().min(1),
  kind: z.literal('post'),
  name: z.string().min(1),
  version: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()).default([]),
  previewColor: colorHexSchema,
  parameters: z.array(presetParameterSchema).default([]),
  postStack: postStackSpecSchema,
  schema: schemaReferenceSchema,
  documentation: z.string().url().optional(),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
  featureFlags: z.array(z.string()).default([]),
  suitability: z.array(z.string()).default([])
});

export const postStackPresetCollectionSchema = z.array(postStackPresetSchema);

export type PostStackSpec = z.infer<typeof postStackSpecSchema>;
export type PostStackPreset = z.infer<typeof postStackPresetSchema>;
