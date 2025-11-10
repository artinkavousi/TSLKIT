import { z } from 'zod';
import { jsonValueSchema, parameterSchema, vectorSchema } from './common.js';

export const computeResourceKindSchema = z.enum(['storage', 'uniform', 'texture', 'sampler']);

export const computeResourceSchema = z.object({
  name: z.string().min(1),
  binding: z.number().int().min(0),
  kind: computeResourceKindSchema,
  access: z.enum(['read', 'write', 'read-write']).default('read-write'),
  format: z.string().optional(),
  description: z.string().optional()
});

export const dispatchTupleSchema = z
  .tuple([z.number().int().min(1), z.number().int().min(1), z.number().int().min(1)])
  .transform(([x, y, zValue]) => ({ x, y, z: zValue }));

export const dispatchObjectSchema = z
  .object({
    x: z.number().int().min(1),
    y: z.number().int().min(1).default(1),
    z: z.number().int().min(1).default(1)
  })
  .transform(({ x, y, z }) => ({ x, y, z }));

export const dispatchSchema = z.union([dispatchTupleSchema, dispatchObjectSchema]);

export const workgroupSizeTupleSchema = z
  .tuple([z.number().int().min(1), z.number().int().min(1), z.number().int().min(1)])
  .transform(([x, y, z]) => ({ x, y, z }));

export const workgroupSizeObjectSchema = z
  .object({
    x: z.number().int().min(1),
    y: z.number().int().min(1).default(1),
    z: z.number().int().min(1).default(1)
  })
  .transform(({ x, y, z }) => ({ x, y, z }));

export const workgroupSizeSchema = z
  .union([workgroupSizeTupleSchema, workgroupSizeObjectSchema])
  .default({ x: 8, y: 8, z: 1 });

export const computeSpecSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  entry: z.string().min(1),
  workgroupSize: workgroupSizeSchema,
  dispatch: dispatchSchema.default({ x: 1, y: 1, z: 1 }),
  resources: z.array(computeResourceSchema).default([]),
  constants: z.record(jsonValueSchema).default({}),
  parameters: z.array(parameterSchema).default([]),
  outputs: z.array(vectorSchema.or(z.array(z.number()))).default([])
});

export type ComputeSpecInput = z.input<typeof computeSpecSchema>;
export type ComputeSpecOutput = z.output<typeof computeSpecSchema>;
export type ComputeResourceInput = z.input<typeof computeResourceSchema>;
export type ComputeResourceOutput = z.output<typeof computeResourceSchema>;
