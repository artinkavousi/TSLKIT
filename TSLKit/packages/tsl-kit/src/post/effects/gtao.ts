import { float, mix, mul } from 'three/tsl';
import { ao } from 'three/examples/jsm/tsl/display/GTAONode.js';
import type { AppliedEffect, PostEffectDescriptor, PostEffectContext, ShaderNodeLike } from '../types.js';
import type { GTAOOptions } from '../../schemas/post.js';
import { gtaoSchema } from '../../schemas/post.js';

type GTAONodeUniforms = ShaderNodeLike & {
  radius: { value: number };
  thickness: { value: number };
  distanceExponent: { value: number };
  distanceFallOff: { value: number };
  scale: { value: number };
  samples: { value: number };
};

const presets: PostEffectDescriptor<GTAOOptions>['presets'] = {
  cinematic: { radius: 0.9, thickness: 1.2, distanceExponent: 1.2, distanceFallOff: 1, scale: 1.1, samples: 32 },
  balanced: { radius: 0.6, thickness: 1, distanceExponent: 1, distanceFallOff: 1, scale: 1, samples: 20 },
  performance: { radius: 0.4, thickness: 0.9, distanceExponent: 0.8, distanceFallOff: 0.8, scale: 0.9, samples: 12 }
};

const capabilityHints = [
  {
    renderer: 'webgpu',
    description: 'High sample GTAO with multi-scale gather for stable temporal AA.'
  },
  {
    renderer: 'webgl',
    description: 'Reduces sample count and radius to avoid banding on low precision depth.'
  }
] as const;

const applyGTAO = (
  input: ShaderNodeLike,
  context: PostEffectContext,
  options: GTAOOptions
): AppliedEffect<GTAOOptions> => {
  const { depth, normal } = context.inputs;

  if (!depth || !normal) {
    throw new Error('GTAO requires depth and normal textures. Provide them via `inputs` when building the framegraph.');
  }

  const finalOptions: GTAOOptions = { ...options };
  const notes: string[] = [];
  let quality: AppliedEffect<GTAOOptions>['quality'] = 'native';

  if (context.renderer === 'webgl') {
    quality = 'fallback';
    finalOptions.samples = Math.min(finalOptions.samples, 12);
    finalOptions.radius = Math.min(finalOptions.radius, 0.5);
    notes.push('WebGL fallback limits samples and radius for stable SSAO.');
  }

  const aoNode = ao(depth, normal, context.camera) as GTAONodeUniforms;

  aoNode.radius.value = finalOptions.radius;
  aoNode.thickness.value = finalOptions.thickness;
  aoNode.distanceExponent.value = finalOptions.distanceExponent;
  aoNode.distanceFallOff.value = finalOptions.distanceFallOff;
  aoNode.scale.value = finalOptions.scale;
  aoNode.samples.value = finalOptions.samples;

  const occlusion = mix(float(1), aoNode, float(finalOptions.scale));
  const output = mul(input, occlusion);

  return {
    output,
    options: finalOptions,
    quality,
    notes: notes.length ? notes : undefined
  };
};

export const gtaoEffect: PostEffectDescriptor<GTAOOptions> = {
  name: 'gtao',
  schema: gtaoSchema,
  presets,
  capabilityHints: [...capabilityHints],
  create: applyGTAO
};
