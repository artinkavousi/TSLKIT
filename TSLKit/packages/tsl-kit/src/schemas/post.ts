import { z } from 'zod';

export const bloomModeSchema = z.enum(['standard', 'anamorphic']);

export const bloomSchema = z.object({
  mode: bloomModeSchema.default('standard'),
  strength: z.number().min(0).max(5).default(0.8).describe('Strength multiplier applied to the extracted bloom.'),
  radius: z.number().min(0).max(1).default(0.35).describe('Gaussian radius controlling the blur spread.'),
  threshold: z.number().min(0).max(2).default(1).describe('Luminance threshold for bloom extraction.'),
  anamorphicScale: z.number().min(1).max(6).default(3).describe('Horizontal scale for anamorphic streaks.'),
  anamorphicSamples: z.number().int().min(8).max(64).default(32).describe('Sample count for anamorphic flare integration.')
});

export type BloomOptions = z.output<typeof bloomSchema>;
export type BloomInput = z.input<typeof bloomSchema>;

export const depthOfFieldSchema = z.object({
  focusDistance: z.number().min(0.01).max(10000).default(500).describe('Distance in world units where the scene stays in focus.'),
  focalLength: z.number().min(0.01).max(200).default(35).describe('Lens focal length in world units.'),
  bokehScale: z.number().min(0).max(10).default(1.5).describe('Artistic multiplier for bokeh size.')
});

export type DepthOfFieldOptions = z.output<typeof depthOfFieldSchema>;
export type DepthOfFieldInput = z.input<typeof depthOfFieldSchema>;

export const ssrSchema = z.object({
  maxDistance: z.number().min(0.1).max(50).default(12).describe('World-space maximum ray distance.'),
  thickness: z.number().min(0.001).max(10).default(0.15).describe('Thickness bias for intersection tests.'),
  intensity: z.number().min(0).max(2).default(1).describe('Reflection contribution multiplier.'),
  quality: z.number().min(0.25).max(2).default(0.75).describe('Trace quality bias controlling steps and jitter.'),
  blurQuality: z.number().min(0).max(3).default(1).describe('Post blur amount applied to the reflection buffer.')
});

export type SSROptions = z.output<typeof ssrSchema>;
export type SSRInput = z.input<typeof ssrSchema>;

export const gtaoSchema = z.object({
  radius: z.number().min(0.01).max(3).default(0.6).describe('Sampling radius in view space.'),
  thickness: z.number().min(0.1).max(5).default(1).describe('Thickness used when evaluating occluders.'),
  distanceExponent: z.number().min(0).max(4).default(1).describe('Distance falloff exponent for occlusion.'),
  distanceFallOff: z.number().min(0).max(4).default(1).describe('Linear distance falloff.'),
  scale: z.number().min(0).max(4).default(1).describe('Intensity scale for the occlusion contribution.'),
  samples: z.number().int().min(4).max(64).default(20).describe('Sample count per pixel.')
});

export type GTAOOptions = z.output<typeof gtaoSchema>;
export type GTAOInput = z.input<typeof gtaoSchema>;

export const ssgiSchema = z.object({
  sliceCount: z.number().int().min(1).max(8).default(2).describe('Number of cone slices traced for diffuse GI.'),
  stepCount: z.number().int().min(4).max(32).default(12).describe('Steps evaluated per slice.'),
  aoIntensity: z.number().min(0).max(2).default(1).describe('Ground-truth ambient occlusion multiplier.'),
  giIntensity: z.number().min(0).max(20).default(6).describe('Diffuse indirect lighting multiplier.'),
  radius: z.number().min(0.1).max(40).default(12).describe('Trace radius for diffuse cones.'),
  screenSpaceOnly: z.boolean().default(true).describe('Disables world-space probes on low-end hardware.')
});

export type SSGIOptions = z.output<typeof ssgiSchema>;
export type SSGIInput = z.input<typeof ssgiSchema>;

export const taaSchema = z.object({
  blend: z.number().min(0).max(1).default(0.9).describe('Blend factor between current frame and history.'),
  clampRadius: z.number().min(0).max(1).default(0.05).describe('Neighborhood clamp radius to fight ghosting.')
});

export type TAAOptions = z.output<typeof taaSchema>;
export type TAAInput = z.input<typeof taaSchema>;
