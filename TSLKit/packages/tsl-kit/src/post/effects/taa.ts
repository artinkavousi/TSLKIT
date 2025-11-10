import { mix, float } from 'three/tsl';
import { traa } from 'three/examples/jsm/tsl/display/TRAANode.js';
import type { AppliedEffect, PostEffectDescriptor, PostEffectContext, ShaderNodeLike } from '../types.js';
import type { TAAOptions } from '../../schemas/post.js';
import { taaSchema } from '../../schemas/post.js';

const presets: PostEffectDescriptor<TAAOptions>['presets'] = {
  cinematic: { blend: 0.92, clampRadius: 0.04 },
  balanced: { blend: 0.9, clampRadius: 0.05 },
  performance: { blend: 0.85, clampRadius: 0.08 }
};

const capabilityHints = [
  {
    renderer: 'webgpu',
    description: 'Temporal reprojection with jittered samples and history clamping.'
  },
  {
    renderer: 'webgl',
    description: 'Falls back to current frame when history buffers are not supported.'
  }
] as const;

const applyTAA = (
  input: ShaderNodeLike,
  context: PostEffectContext,
  options: TAAOptions
): AppliedEffect<TAAOptions> => {
  const { depth, velocity } = context.inputs;

  if (!depth || !velocity) {
    throw new Error('TAA requires depth and velocity textures. Provide them via `inputs` when building the framegraph.');
  }

  if (!context.capabilities.supportsHistoryBuffer) {
    return {
      output: input,
      options,
      quality: 'fallback',
      notes: ['History buffers are unavailable; returning unfiltered color.']
    };
  }

  const taaNode = traa(input, depth, velocity, context.camera);
  const historyBlend = Math.min(Math.max(options.blend, 0), 1);
  const clampMod = Math.min(Math.max(1 - options.clampRadius, 0), 1);
  const output = mix(input, taaNode, float(historyBlend * clampMod));

  return {
    output,
    options,
    quality: 'native'
  };
};

export const taaEffect: PostEffectDescriptor<TAAOptions> = {
  name: 'taa',
  schema: taaSchema,
  presets,
  capabilityHints: [...capabilityHints],
  create: applyTAA
};
