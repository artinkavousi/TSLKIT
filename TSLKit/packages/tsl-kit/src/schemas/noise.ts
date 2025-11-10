import { z } from 'zod';

export const noiseTypeSchema = z.enum([
  'simplex',
  'simplex2d',
  'simplex4d',
  'curl',
  'curl4d',
  'fbm',
  'perlin',
  'voronoi',
  'turbulence',
  'domainWarp'
]);

export const noiseSpecSchema = z.object({
  type: noiseTypeSchema,
  frequency: z.number().min(0.01).max(32).default(1).describe('Base tiling frequency.'),
  amplitude: z.number().min(0).max(10).default(1).describe('Amplitude multiplier for the noise result.'),
  seed: z.number().int().min(0).max(9999).default(0).describe('Deterministic seed for reproducibility.'),
  octaves: z
    .number()
    .int()
    .min(1)
    .max(8)
    .default(1)
    .describe('Number of layered octaves for FBM-like noise.'),
  warp: z
    .number()
    .min(0)
    .max(5)
    .default(0)
    .describe('Domain warp strength applied before the noise evaluation.')
});

export type NoiseSpecInput = z.input<typeof noiseSpecSchema>;
export type NoiseSpecOutput = z.output<typeof noiseSpecSchema>;
