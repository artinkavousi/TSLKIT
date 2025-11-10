import { add, float, mix, mul } from 'three/tsl';
import { ssgi } from 'three/examples/jsm/tsl/display/SSGINode.js';
import type { AppliedEffect, PostEffectDescriptor, PostEffectContext, ShaderNodeLike } from '../types.js';
import type { SSGIOptions } from '../../schemas/post.js';
import { ssgiSchema } from '../../schemas/post.js';
import { scaleNode } from './utils.js';

type SSGINodeUniforms = ShaderNodeLike & {
  sliceCount: { value: number };
  stepCount: { value: number };
  aoIntensity: { value: number };
  giIntensity: { value: number };
  radius: { value: number };
  useScreenSpaceSampling: { value: boolean };
  rgb?: ShaderNodeLike;
  a?: ShaderNodeLike;
  w?: ShaderNodeLike;
};

const presets: PostEffectDescriptor<SSGIOptions>['presets'] = {
  balanced: { sliceCount: 2, stepCount: 12, aoIntensity: 1, giIntensity: 6, radius: 12, screenSpaceOnly: true },
  cinematic: { sliceCount: 4, stepCount: 20, aoIntensity: 1.2, giIntensity: 10, radius: 18, screenSpaceOnly: false },
  performance: { sliceCount: 1, stepCount: 8, aoIntensity: 0.8, giIntensity: 4, radius: 8, screenSpaceOnly: true }
};

const capabilityHints = [
  {
    renderer: 'webgpu',
    description: 'Multi-slice diffuse GI with optional world-space tracing.'
  },
  {
    renderer: 'webgl',
    description: 'Falls back to screen-space sampling and reduced step count.'
  }
] as const;

const applySSGI = (
  input: ShaderNodeLike,
  context: PostEffectContext,
  options: SSGIOptions
): AppliedEffect<SSGIOptions> => {
  const { depth, normal } = context.inputs;

  if (!depth || !normal) {
    throw new Error('SSGI requires depth and normal textures. Provide them via `inputs` when building the framegraph.');
  }

  const finalOptions: SSGIOptions = { ...options };
  const notes: string[] = [];
  let quality: AppliedEffect<SSGIOptions>['quality'] = 'native';

  if (context.renderer === 'webgl') {
    quality = 'fallback';
    finalOptions.sliceCount = Math.min(finalOptions.sliceCount, 2);
    finalOptions.stepCount = Math.min(finalOptions.stepCount, 10);
    finalOptions.screenSpaceOnly = true;
    notes.push('WebGL fallback enforces screen-space sampling and fewer steps.');
  }

  const giNode = ssgi(input, depth, normal, context.camera) as SSGINodeUniforms;

  giNode.sliceCount.value = finalOptions.sliceCount;
  giNode.stepCount.value = finalOptions.stepCount;
  giNode.aoIntensity.value = finalOptions.aoIntensity;
  giNode.giIntensity.value = finalOptions.giIntensity;
  giNode.radius.value = finalOptions.radius;
  giNode.useScreenSpaceSampling.value = finalOptions.screenSpaceOnly;

  const giColor = giNode.rgb ?? (giNode as ShaderNodeLike);
  const aoComponent = giNode.a ?? giNode.w ?? float(1);
  const occlusion = mix(float(1), aoComponent, float(finalOptions.aoIntensity));
  const giContribution = scaleNode(giColor, finalOptions.giIntensity);
  const output = add(mul(input, occlusion), giContribution);

  return {
    output,
    options: finalOptions,
    quality,
    notes: notes.length ? notes : undefined
  };
};

export const ssgiEffect: PostEffectDescriptor<SSGIOptions> = {
  name: 'ssgi',
  schema: ssgiSchema,
  presets,
  capabilityHints: [...capabilityHints],
  create: applySSGI
};
