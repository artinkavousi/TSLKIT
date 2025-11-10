import { z } from 'zod';

import { schemaModuleSchema, schemaReferenceSchema } from './materials.js';

export const tutorialResourceSchema = z.object({
  label: z.string().min(1),
  url: z.string().url()
});

export const tutorialStepSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1)
});

export const tutorialSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  presetId: z.string().min(1),
  durationMinutes: z.number().int().positive(),
  topics: z.array(z.string()).default([]),
  focus: schemaModuleSchema,
  steps: z.array(tutorialStepSchema).default([]),
  resources: z.array(tutorialResourceSchema).default([]),
  schema: schemaReferenceSchema.optional()
});

export const tutorialCollectionSchema = z.array(tutorialSchema);

export type TutorialStep = z.infer<typeof tutorialStepSchema>;
export type TutorialResource = z.infer<typeof tutorialResourceSchema>;
export type TutorialEntry = z.infer<typeof tutorialSchema>;
