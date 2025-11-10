import { z } from 'zod';
import { computeSpecSchema } from './compute.js';
import { materialSpecSchema } from './materials.js';
import { postChainSpecSchema } from './post.js';

export const presetTargetSchema = z.enum(['material', 'post', 'compute']);

const materialPresetBase = z.object({
  id: z.string().min(1),
  label: z.string().optional(),
  description: z.string().optional()
});

export const materialPresetSchema = materialPresetBase.extend({
  target: z.literal('material'),
  spec: materialSpecSchema
});

export const postPresetSchema = materialPresetBase.extend({
  target: z.literal('post'),
  spec: postChainSpecSchema
});

export const computePresetSchema = materialPresetBase.extend({
  target: z.literal('compute'),
  spec: computeSpecSchema
});

export const presetSchema = z.discriminatedUnion('target', [
  materialPresetSchema,
  postPresetSchema,
  computePresetSchema
]);

export type PresetSpecInput = z.input<typeof presetSchema>;
export type PresetSpecOutput = z.output<typeof presetSchema>;
export type MaterialPresetInput = z.input<typeof materialPresetSchema>;
export type MaterialPresetOutput = z.output<typeof materialPresetSchema>;
export type PostPresetInput = z.input<typeof postPresetSchema>;
export type PostPresetOutput = z.output<typeof postPresetSchema>;
export type ComputePresetInput = z.input<typeof computePresetSchema>;
export type ComputePresetOutput = z.output<typeof computePresetSchema>;
export type PresetTarget = z.infer<typeof presetTargetSchema>;
