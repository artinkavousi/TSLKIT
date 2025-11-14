import type { BufferGeometry } from 'three';
import { z } from 'zod';

export const normalTextureSchema = z.object({
  src: z.string(),
  strength: z.number().min(0).max(10).optional(),
  anisotropy: z.number().int().min(1).max(16).optional()
});

export const surfaceSchema = z.object({
  normal: z.tuple([z.number(), z.number(), z.number()]).optional(),
  view: z.tuple([z.number(), z.number(), z.number()]).optional(),
  lightDirection: z.tuple([z.number(), z.number(), z.number()]).optional(),
  lightColor: z.union([z.tuple([z.number(), z.number(), z.number()]), z.number()]).optional(),
  specularColor: z.union([z.tuple([z.number(), z.number(), z.number()]), z.number()]).optional()
});

export const materialSchema = z.object({
  geometry: z.custom<BufferGeometry>(),
  baseColor: z.union([z.number(), z.tuple([z.number(), z.number(), z.number()])]),
  metalness: z.number().min(0).max(1).optional(),
  roughness: z.number().min(0).max(1).optional(),
  normalTexture: normalTextureSchema.optional(),
  surface: surfaceSchema.optional(),
  position: z.tuple([z.number(), z.number(), z.number()]).optional(),
  rotation: z.tuple([z.number(), z.number(), z.number()]).optional(),
  scale: z.tuple([z.number(), z.number(), z.number()]).optional()
});

export type MaterialSchema = z.infer<typeof materialSchema>;
