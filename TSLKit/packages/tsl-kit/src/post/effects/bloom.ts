import { add } from 'three/tsl';
import { anamorphic } from 'three/examples/jsm/tsl/display/AnamorphicNode.js';
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js';
import type { AppliedEffect, PostEffectDescriptor } from '../types.js';
import type { BloomOptions } from '../../schemas/post.js';
import { bloomSchema } from '../../schemas/post.js';
import type { PostEffectContext, ShaderNodeLike } from '../types.js';
import { scaleNode } from './utils.js';

const presets: PostEffectDescriptor<BloomOptions>['presets'] = {
  cinematic: { strength: 0.3, radius: 0.1, threshold: 0.2 },
  emissive: { strength: 1.5, radius: 0.2, threshold: 0.1 },
  laboratory: { strength: 0.12, radius: 0.05, threshold: 0.25 },
  anamorphic: { mode: 'anamorphic', strength: 0.85, threshold: 0.8, radius: 0.4, anamorphicScale: 3.5, anamorphicSamples: 48 }
};

const capabilityHints = [
  {
    renderer: 'webgpu',
    description: 'Full-resolution bloom with half-float buffers and anamorphic streaks.'
  },
  {
    renderer: 'webgl',
    description: 'Radius is clamped and anamorphic mode disabled when half-float render targets are unavailable.'
  }
] as const;

const applyBloom = (
  input: ShaderNodeLike,
  context: PostEffectContext,
  options: BloomOptions
): AppliedEffect<BloomOptions> => {
  const finalOptions: BloomOptions = { ...options };
  const notes: string[] = [];
  let quality: AppliedEffect<BloomOptions>['quality'] = 'native';

  if (context.renderer === 'webgl' && !context.capabilities.supportsHalfFloat) {
    quality = 'fallback';
    finalOptions.radius = Math.min(finalOptions.radius, 0.2);
    notes.push('Half-float buffers unavailable; radius clamped for WebGL.');

    if (finalOptions.mode === 'anamorphic') {
      finalOptions.mode = 'standard';
      notes.push('Anamorphic bloom disabled on fallback backend.');
    }
  }

  let output: ShaderNodeLike;

  if (finalOptions.mode === 'anamorphic') {
    const flare = anamorphic(input, finalOptions.threshold, finalOptions.anamorphicScale, finalOptions.anamorphicSamples);
    const scaledFlare = scaleNode(flare, finalOptions.strength);
    output = add(input, scaledFlare);
  } else {
    const bloomNode = bloom(input, finalOptions.strength, finalOptions.radius, finalOptions.threshold);
    output = add(input, bloomNode);
  }

  return {
    output,
    options: finalOptions,
    quality,
    notes: notes.length ? notes : undefined
  };
};

export const bloomEffect: PostEffectDescriptor<BloomOptions> = {
  name: 'bloom',
  schema: bloomSchema,
  presets,
  capabilityHints: [...capabilityHints],
  create: applyBloom
};
