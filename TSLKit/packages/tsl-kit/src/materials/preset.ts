import { z } from 'zod';

const parameterSchema = z.object({
  type: z.string(),
  label: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  default: z.unknown().optional()
});

const presetSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  parameters: z.record(parameterSchema)
});

export type MaterialPresetSnapshot = z.infer<typeof presetSchema>;

export interface MaterialPresetDefinition extends MaterialPresetSnapshot {}

export function createMaterialPresetSnapshot(
  definition: MaterialPresetDefinition,
  overrides?: Partial<MaterialPresetSnapshot>
): MaterialPresetSnapshot {
  const base = presetSchema.parse(definition);

  if (!overrides) {
    return base;
  }

  const merged = {
    ...base,
    ...overrides,
    parameters: {
      ...base.parameters,
      ...overrides.parameters
    }
  } satisfies MaterialPresetSnapshot;

  return presetSchema.parse(merged);
}

export function applyMaterialOverrides(
  snapshot: MaterialPresetSnapshot,
  overrides?: Partial<MaterialPresetSnapshot>
): MaterialPresetSnapshot {
  if (!overrides) {
    return snapshot;
  }

  return createMaterialPresetSnapshot(snapshot, overrides);
}
