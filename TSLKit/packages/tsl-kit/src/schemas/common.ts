import { z } from 'zod';

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(jsonValueSchema)
  ])
);

export const colorSchema = z.union([
  z.tuple([
    z.number().min(0).max(1),
    z.number().min(0).max(1),
    z.number().min(0).max(1)
  ]),
  z.tuple([
    z.number().min(0).max(1),
    z.number().min(0).max(1),
    z.number().min(0).max(1),
    z.number().min(0).max(1)
  ])
]);

export const vectorSchema = z.union([
  z.tuple([z.number(), z.number()]),
  z.tuple([z.number(), z.number(), z.number()]),
  z.tuple([z.number(), z.number(), z.number(), z.number()])
]);

export const numericRangeSchema = z
  .object({
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().positive().optional()
  })
  .refine((range) =>
    range.min === undefined || range.max === undefined || range.min <= range.max
  , {
    message: 'Range min must be less than or equal to max.'
  });

export const parameterValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  colorSchema,
  vectorSchema,
  z.array(z.number()),
  z.record(jsonValueSchema)
]);

export const parameterSchema = z.object({
  name: z.string().min(1),
  label: z.string().optional(),
  type: z.enum(['float', 'integer', 'boolean', 'color', 'vector', 'texture', 'enum']),
  description: z.string().optional(),
  required: z.boolean().default(false),
  defaultValue: parameterValueSchema.optional(),
  options: z.array(z.union([z.string(), z.number()])).optional(),
  range: numericRangeSchema.optional()
});

export type ParameterInput = z.input<typeof parameterSchema>;
export type ParameterOutput = z.output<typeof parameterSchema>;
