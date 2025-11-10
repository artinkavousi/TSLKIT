import { z } from 'zod';

import { presetParameterSchema, schemaReferenceSchema } from './materials.js';

const dispatchDimensionSchema = z.number().int().nonnegative();

export const computeBindingSchema = z.object({
  name: z.string().min(1),
  resource: z.enum(['storageBuffer', 'uniformBuffer', 'texture', 'sampler']),
  access: z.enum(['read', 'write', 'read-write']).default('read'),
  shaderStage: z.enum(['compute', 'fragment', 'vertex']).default('compute'),
  description: z.string().optional()
});

export const computeDispatchSchema = z.union([
  z
    .tuple([dispatchDimensionSchema, dispatchDimensionSchema, dispatchDimensionSchema])
    .transform(([x, y, zValue]) => ({ x, y, z: zValue })),
  z.object({
    x: dispatchDimensionSchema,
    y: dispatchDimensionSchema.default(1),
    z: dispatchDimensionSchema.default(1)
  })
]);

export const computeSpecSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  description: z.string().min(1),
  workgroupSize: z
    .tuple([
      z.number().int().positive().max(1024),
      z.number().int().positive().max(1024),
      z.number().int().positive().max(64)
    ])
    .default([8, 8, 1]),
  dispatch: computeDispatchSchema,
  parameters: z.array(presetParameterSchema).default([]),
  bindings: z.array(computeBindingSchema).default([]),
  outputs: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  schema: schemaReferenceSchema.optional(),
  documentation: z.string().url().optional()
});

export const computeSpecCollectionSchema = z.array(computeSpecSchema);

export type ComputeBinding = z.infer<typeof computeBindingSchema>;
export type ComputeDispatch = z.infer<typeof computeDispatchSchema>;
export type ComputeSpec = z.infer<typeof computeSpecSchema>;
