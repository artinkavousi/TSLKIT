import { z } from 'zod';
import { jsonValueSchema, parameterSchema } from './common.js';

export const postEffectTypeSchema = z.enum([
  'bloom',
  'toneMap',
  'colorGrade',
  'fxaa',
  'blur',
  'lut',
  'vignette',
  'custom'
]);

export const postPassSchema = z.object({
  id: z.string().min(1),
  effect: postEffectTypeSchema,
  label: z.string().optional(),
  enabled: z.boolean().default(true),
  priority: z.number().int().default(0),
  inputs: z.record(jsonValueSchema).default({}),
  parameters: z.array(parameterSchema).default([]),
  outputs: z.array(z.string().min(1)).default([])
});

export const postChainSpecSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  output: z.enum(['screen', 'texture']).default('screen'),
  passes: z
    .array(postPassSchema)
    .min(1, 'Post-processing chains require at least one pass.'),
  sharedUniforms: z.record(jsonValueSchema).default({})
});

export type PostChainSpecInput = z.input<typeof postChainSpecSchema>;
export type PostChainSpecOutput = z.output<typeof postChainSpecSchema>;
export type PostPassInput = z.input<typeof postPassSchema>;
export type PostPassOutput = z.output<typeof postPassSchema>;
