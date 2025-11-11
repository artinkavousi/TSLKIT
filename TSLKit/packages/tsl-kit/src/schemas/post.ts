import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';
import { z } from 'zod';

export const postEffectTypeSchema = z.enum([
  'bloom.standard',
  'bloom.anamorphic',
  'bloom.luma',
  'dof.circle',
  'tonemap.reinhard',
  'tonemap.aces',
  'tonemap.uncharted2',
  'aa.fxaa',
  'aa.taa',
  'motion.blur',
  'gi.ssr',
  'gi.gtao',
  'gi.ssgi'
]);

const bloomStandard = z.object({
  type: z.literal('bloom.standard'),
  intensity: z.number().min(0).max(3).default(1.2),
  radius: z.number().min(0).max(2).default(0.65),
  threshold: z.number().min(0).max(1).default(0.85)
});

const bloomAnamorphic = z.object({
  type: z.literal('bloom.anamorphic'),
  intensity: z.number().min(0).max(3).default(0.9),
  threshold: z.number().min(0).max(1).default(0.75),
  anamorphicRatio: z.number().min(0.2).max(3).default(1.6)
});

const bloomLuma = z.object({
  type: z.literal('bloom.luma'),
  intensity: z.number().min(0).max(3).default(1.0),
  radius: z.number().min(0).max(2).default(0.5),
  threshold: z.number().min(0).max(1).default(0.65)
});

const dofCircle = z.object({
  type: z.literal('dof.circle'),
  focusDistance: z.number().min(0).max(1).default(0.5),
  focusRange: z.number().min(0).max(1).default(0.2),
  bokehScale: z.number().min(0).max(3).default(1.25)
});

const tonemapReinhard = z.object({
  type: z.literal('tonemap.reinhard'),
  exposure: z.number().min(0.1).max(8).default(1.0)
});

const tonemapAces = z.object({
  type: z.literal('tonemap.aces'),
  exposure: z.number().min(0.1).max(8).default(1.0)
});

const tonemapUncharted2 = z.object({
  type: z.literal('tonemap.uncharted2'),
  exposure: z.number().min(0.1).max(8).default(1.2)
});

const aaFxaa = z.object({
  type: z.literal('aa.fxaa'),
  spanMax: z.number().min(1).max(16).default(8),
  reduceMin: z.number().min(0).max(1).default(0.04)
});

const aaTaa = z.object({
  type: z.literal('aa.taa'),
  blendFactor: z.number().min(0).max(1).default(0.85),
  jitterSpread: z.number().min(0).max(1).default(0.25)
});

const motionBlur = z.object({
  type: z.literal('motion.blur'),
  intensity: z.number().min(0).max(2).default(0.9),
  samples: z.number().int().min(1).max(32).default(12)
});

const giSSR = z.object({
  type: z.literal('gi.ssr'),
  intensity: z.number().min(0).max(2).default(1.0),
  maxDistance: z.number().min(0.1).max(20).default(8),
  thickness: z.number().min(0.01).max(2).default(0.2)
});

const giGTAO = z.object({
  type: z.literal('gi.gtao'),
  intensity: z.number().min(0).max(2).default(1.1),
  radius: z.number().min(0.1).max(2).default(0.4),
  falloff: z.number().min(0).max(2).default(0.9)
});

const giSSGI = z.object({
  type: z.literal('gi.ssgi'),
  intensity: z.number().min(0).max(2).default(0.8),
  radius: z.number().min(0.1).max(3).default(1.2),
  temporalBlend: z.number().min(0).max(1).default(0.6)
});

export const postEffectSpecSchema = z.discriminatedUnion('type', [
  bloomStandard,
  bloomAnamorphic,
  bloomLuma,
  dofCircle,
  tonemapReinhard,
  tonemapAces,
  tonemapUncharted2,
  aaFxaa,
  aaTaa,
  motionBlur,
  giSSR,
  giGTAO,
  giSSGI
]);

export type PostEffectSpecInput = z.input<typeof postEffectSpecSchema>;
export type PostEffectSpecOutput = z.output<typeof postEffectSpecSchema>;

const tbBloomStandard = Type.Object({
  type: Type.Literal('bloom.standard'),
  intensity: Type.Optional(Type.Number({ minimum: 0, maximum: 3, default: 1.2 })),
  radius: Type.Optional(Type.Number({ minimum: 0, maximum: 2, default: 0.65 })),
  threshold: Type.Optional(Type.Number({ minimum: 0, maximum: 1, default: 0.85 }))
});

const tbBloomAnamorphic = Type.Object({
  type: Type.Literal('bloom.anamorphic'),
  intensity: Type.Optional(Type.Number({ minimum: 0, maximum: 3, default: 0.9 })),
  threshold: Type.Optional(Type.Number({ minimum: 0, maximum: 1, default: 0.75 })),
  anamorphicRatio: Type.Optional(Type.Number({ minimum: 0.2, maximum: 3, default: 1.6 }))
});

const tbBloomLuma = Type.Object({
  type: Type.Literal('bloom.luma'),
  intensity: Type.Optional(Type.Number({ minimum: 0, maximum: 3, default: 1.0 })),
  radius: Type.Optional(Type.Number({ minimum: 0, maximum: 2, default: 0.5 })),
  threshold: Type.Optional(Type.Number({ minimum: 0, maximum: 1, default: 0.65 }))
});

const tbDof = Type.Object({
  type: Type.Literal('dof.circle'),
  focusDistance: Type.Optional(Type.Number({ minimum: 0, maximum: 1, default: 0.5 })),
  focusRange: Type.Optional(Type.Number({ minimum: 0, maximum: 1, default: 0.2 })),
  bokehScale: Type.Optional(Type.Number({ minimum: 0, maximum: 3, default: 1.25 }))
});

const tbTonemapReinhard = Type.Object({
  type: Type.Literal('tonemap.reinhard'),
  exposure: Type.Optional(Type.Number({ minimum: 0.1, maximum: 8, default: 1.0 }))
});

const tbTonemapAces = Type.Object({
  type: Type.Literal('tonemap.aces'),
  exposure: Type.Optional(Type.Number({ minimum: 0.1, maximum: 8, default: 1.0 }))
});

const tbTonemapUncharted2 = Type.Object({
  type: Type.Literal('tonemap.uncharted2'),
  exposure: Type.Optional(Type.Number({ minimum: 0.1, maximum: 8, default: 1.2 }))
});

const tbFxaa = Type.Object({
  type: Type.Literal('aa.fxaa'),
  spanMax: Type.Optional(Type.Number({ minimum: 1, maximum: 16, default: 8 })),
  reduceMin: Type.Optional(Type.Number({ minimum: 0, maximum: 1, default: 0.04 }))
});

const tbTaa = Type.Object({
  type: Type.Literal('aa.taa'),
  blendFactor: Type.Optional(Type.Number({ minimum: 0, maximum: 1, default: 0.85 })),
  jitterSpread: Type.Optional(Type.Number({ minimum: 0, maximum: 1, default: 0.25 }))
});

const tbMotionBlur = Type.Object({
  type: Type.Literal('motion.blur'),
  intensity: Type.Optional(Type.Number({ minimum: 0, maximum: 2, default: 0.9 })),
  samples: Type.Optional(Type.Integer({ minimum: 1, maximum: 32, default: 12 }))
});

const tbSSR = Type.Object({
  type: Type.Literal('gi.ssr'),
  intensity: Type.Optional(Type.Number({ minimum: 0, maximum: 2, default: 1.0 })),
  maxDistance: Type.Optional(Type.Number({ minimum: 0.1, maximum: 20, default: 8 })),
  thickness: Type.Optional(Type.Number({ minimum: 0.01, maximum: 2, default: 0.2 }))
});

const tbGTAO = Type.Object({
  type: Type.Literal('gi.gtao'),
  intensity: Type.Optional(Type.Number({ minimum: 0, maximum: 2, default: 1.1 })),
  radius: Type.Optional(Type.Number({ minimum: 0.1, maximum: 2, default: 0.4 })),
  falloff: Type.Optional(Type.Number({ minimum: 0, maximum: 2, default: 0.9 }))
});

const tbSSGI = Type.Object({
  type: Type.Literal('gi.ssgi'),
  intensity: Type.Optional(Type.Number({ minimum: 0, maximum: 2, default: 0.8 })),
  radius: Type.Optional(Type.Number({ minimum: 0.1, maximum: 3, default: 1.2 })),
  temporalBlend: Type.Optional(Type.Number({ minimum: 0, maximum: 1, default: 0.6 }))
});

export const postEffectSpecTypeBox = Type.Union([
  tbBloomStandard,
  tbBloomAnamorphic,
  tbBloomLuma,
  tbDof,
  tbTonemapReinhard,
  tbTonemapAces,
  tbTonemapUncharted2,
  tbFxaa,
  tbTaa,
  tbMotionBlur,
  tbSSR,
  tbGTAO,
  tbSSGI
]);

export type PostEffectSpecTypeBox = Static<typeof postEffectSpecTypeBox>;
