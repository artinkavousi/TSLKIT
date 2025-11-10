import { dof } from 'three/examples/jsm/tsl/display/DepthOfFieldNode.js';
import type { AppliedEffect, PostEffectDescriptor, PostEffectContext, ShaderNodeLike } from '../types.js';
import type { DepthOfFieldOptions } from '../../schemas/post.js';
import { depthOfFieldSchema } from '../../schemas/post.js';

const presets: PostEffectDescriptor<DepthOfFieldOptions>['presets'] = {
  portrait: { focusDistance: 200, focalLength: 85, bokehScale: 2.2 },
  macro: { focusDistance: 35, focalLength: 50, bokehScale: 3.5 },
  cinematic: { focusDistance: 600, focalLength: 35, bokehScale: 1.8 }
};

const capabilityHints = [
  {
    renderer: 'webgpu',
    description: 'Full-resolution circle-of-confusion with multi-target gather.'
  },
  {
    renderer: 'webgl',
    description: 'Bokeh scale is reduced and blur kernels shrink on LDR fallbacks.'
  }
] as const;

const applyDof = (
  input: ShaderNodeLike,
  context: PostEffectContext,
  options: DepthOfFieldOptions
): AppliedEffect<DepthOfFieldOptions> => {
  if (!context.inputs.viewZ) {
    throw new Error('Depth of field requires a viewZ texture. Provide `inputs.viewZ` when building the framegraph.');
  }

  const finalOptions: DepthOfFieldOptions = { ...options };
  const notes: string[] = [];
  let quality: AppliedEffect<DepthOfFieldOptions>['quality'] = 'native';

  if (context.renderer === 'webgl' && !context.capabilities.supportsHalfFloat) {
    quality = 'fallback';
    finalOptions.bokehScale = Math.min(finalOptions.bokehScale, 1.2);
    notes.push('Half-float buffers unavailable; clamping bokeh scale for WebGL.');
  }

  const output = dof(input, context.inputs.viewZ, finalOptions.focusDistance, finalOptions.focalLength, finalOptions.bokehScale);

  return {
    output,
    options: finalOptions,
    quality,
    notes: notes.length ? notes : undefined
  };
};

export const depthOfFieldEffect: PostEffectDescriptor<DepthOfFieldOptions> = {
  name: 'depthOfField',
  schema: depthOfFieldSchema,
  presets,
  capabilityHints: [...capabilityHints],
  create: applyDof
};
