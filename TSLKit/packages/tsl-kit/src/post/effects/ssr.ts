import { add } from 'three/tsl';
import { ssr } from 'three/examples/jsm/tsl/display/SSRNode.js';
import type { AppliedEffect, PostEffectDescriptor, PostEffectContext, ShaderNodeLike } from '../types.js';
import type { SSROptions } from '../../schemas/post.js';
import { ssrSchema } from '../../schemas/post.js';

type SSRNodeUniforms = ShaderNodeLike & {
  maxDistance: { value: number };
  thickness: { value: number };
  opacity: { value: number };
  quality: { value: number };
  blurQuality: { value: number };
};

const presets: PostEffectDescriptor<SSROptions>['presets'] = {
  balanced: { maxDistance: 12, thickness: 0.15, intensity: 1, quality: 0.75, blurQuality: 1 },
  highQuality: { maxDistance: 18, thickness: 0.2, intensity: 1.2, quality: 1.2, blurQuality: 2 },
  performance: { maxDistance: 6, thickness: 0.08, intensity: 0.8, quality: 0.5, blurQuality: 0.5 }
};

const capabilityHints = [
  {
    renderer: 'webgpu',
    description: 'Full-resolution SSR with hierarchical ray marching and blur refinement.'
  },
  {
    renderer: 'webgl',
    description: 'Limits quality and blur passes when history buffers are unavailable.'
  }
] as const;

const applySSR = (
  input: ShaderNodeLike,
  context: PostEffectContext,
  options: SSROptions
): AppliedEffect<SSROptions> => {
  const { depth, normal, metalness } = context.inputs;

  if (!depth || !normal || !metalness) {
    throw new Error('SSR requires depth, normal and metalness textures. Provide them via `inputs` when building the framegraph.');
  }

  const finalOptions: SSROptions = { ...options };
  const notes: string[] = [];
  let quality: AppliedEffect<SSROptions>['quality'] = 'native';

  if (context.renderer === 'webgl') {
    quality = 'fallback';
    finalOptions.quality = Math.min(finalOptions.quality, 0.5);
    finalOptions.blurQuality = Math.min(finalOptions.blurQuality, 0.5);
    notes.push('WebGL fallback reduces SSR quality and blur refinement.');
  }

  const reflection = ssr(
    input,
    depth,
    normal,
    metalness,
    context.inputs.roughness ?? metalness,
    context.camera
  ) as SSRNodeUniforms;

  reflection.maxDistance.value = finalOptions.maxDistance;
  reflection.thickness.value = finalOptions.thickness;
  reflection.opacity.value = finalOptions.intensity;
  reflection.quality.value = finalOptions.quality;
  reflection.blurQuality.value = finalOptions.blurQuality;

  const output = add(input, reflection);

  return {
    output,
    options: finalOptions,
    quality,
    notes: notes.length ? notes : undefined
  };
};

export const ssrEffect: PostEffectDescriptor<SSROptions> = {
  name: 'ssr',
  schema: ssrSchema,
  presets,
  capabilityHints: [...capabilityHints],
  create: applySSR
};
