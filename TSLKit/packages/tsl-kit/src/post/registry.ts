import { float, vec3 } from 'three/tsl';
import type { ShaderNodeObject } from 'three/tsl';

import {
  createAcesTonemapPass,
  createAnamorphicBloomPass,
  createDepthOfFieldPass,
  createFXAAPass,
  createGTAOPass,
  createLumaBloomPass,
  createMotionBlurPass,
  createReinhardTonemapPass,
  createSSRPass,
  createSSGIPass,
  createStandardBloomPass,
  createTAAPass,
  createUncharted2TonemapPass
} from './passes/index.js';
import type {
  NormalizedPostEffectSpec,
  PostEffectMetadata,
  PostEffectSpec,
  PostEffectType,
  PostPassBuildResult,
  PostPassContextNodes,
  PostPassDefinition,
  PostPassFactoryContext
} from './types.js';

const POST_DEFINITIONS: PostPassDefinition<PostEffectType, PostEffectSpec>[] = [
  {
    type: 'bloom.standard',
    metadata: {
      id: 'tsl.post.bloom.standard',
      label: 'Bloom',
      description: 'Thresholded bloom response tuned for cinematic highlights.',
      tags: ['bloom', 'glow', 'cinematic'],
      parameters: [
        {
          name: 'intensity',
          label: 'Intensity',
          description: 'Multiplier applied to the extracted bloom highlights.',
          type: 'number',
          min: 0,
          max: 3,
          step: 0.05,
          defaultValue: 1.2
        },
        {
          name: 'radius',
          label: 'Radius',
          description: 'Strength of the blur kernel used for diffusion.',
          type: 'number',
          min: 0,
          max: 2,
          step: 0.05,
          defaultValue: 0.65
        },
        {
          name: 'threshold',
          label: 'Threshold',
          description: 'Intensity threshold that controls highlight extraction.',
          type: 'number',
          min: 0,
          max: 1,
          step: 0.01,
          defaultValue: 0.85
        }
      ]
    },
    normalize(spec) {
      return {
        type: 'bloom.standard',
        intensity: spec.intensity ?? 1.2,
        radius: spec.radius ?? 0.65,
        threshold: spec.threshold ?? 0.85
      };
    },
    build(input, spec) {
      return createStandardBloomPass(input, spec);
    }
  },
  {
    type: 'bloom.anamorphic',
    metadata: {
      id: 'tsl.post.bloom.anamorphic',
      label: 'Anamorphic Bloom',
      description: 'Streaked bloom simulating anamorphic lens flares.',
      tags: ['bloom', 'lens', 'flare'],
      parameters: [
        {
          name: 'intensity',
          label: 'Intensity',
          description: 'Strength of the streaked bloom contribution.',
          type: 'number',
          min: 0,
          max: 3,
          step: 0.05,
          defaultValue: 0.9
        },
        {
          name: 'threshold',
          label: 'Threshold',
          description: 'Controls which highlights contribute to streaking.',
          type: 'number',
          min: 0,
          max: 1,
          step: 0.01,
          defaultValue: 0.75
        },
        {
          name: 'anamorphicRatio',
          label: 'Stretch Ratio',
          description: 'Aspect ratio applied to the bloom kernel.',
          type: 'number',
          min: 0.2,
          max: 3,
          step: 0.05,
          defaultValue: 1.6
        }
      ]
    },
    normalize(spec) {
      return {
        type: 'bloom.anamorphic',
        intensity: spec.intensity ?? 0.9,
        threshold: spec.threshold ?? 0.75,
        anamorphicRatio: spec.anamorphicRatio ?? 1.6
      };
    },
    build(input, spec) {
      return createAnamorphicBloomPass(input, spec);
    }
  },
  {
    type: 'bloom.luma',
    metadata: {
      id: 'tsl.post.bloom.luma',
      label: 'Luma Bloom',
      description: 'Adaptive bloom weighting driven by scene luminance.',
      tags: ['bloom', 'luminance'],
      parameters: [
        {
          name: 'intensity',
          label: 'Intensity',
          description: 'Overall strength applied to the luminance-weighted bloom.',
          type: 'number',
          min: 0,
          max: 3,
          step: 0.05,
          defaultValue: 1.0
        },
        {
          name: 'radius',
          label: 'Radius',
          description: 'Scaling factor for the luminance diffusion.',
          type: 'number',
          min: 0,
          max: 2,
          step: 0.05,
          defaultValue: 0.5
        },
        {
          name: 'threshold',
          label: 'Threshold',
          description: 'Minimum luminance required before bloom is applied.',
          type: 'number',
          min: 0,
          max: 1,
          step: 0.01,
          defaultValue: 0.65
        }
      ]
    },
    normalize(spec) {
      return {
        type: 'bloom.luma',
        intensity: spec.intensity ?? 1.0,
        radius: spec.radius ?? 0.5,
        threshold: spec.threshold ?? 0.65
      };
    },
    build(input, spec, context) {
      return createLumaBloomPass(input, spec, context);
    }
  },
  {
    type: 'dof.circle',
    metadata: {
      id: 'tsl.post.dof.circle',
      label: 'Depth of Field',
      description: 'Circle-of-confusion blur approximating bokeh depth of field.',
      tags: ['dof', 'camera'],
      parameters: [
        {
          name: 'focusDistance',
          label: 'Focus Distance',
          description: 'Normalized depth value kept in focus.',
          type: 'number',
          min: 0,
          max: 1,
          step: 0.01,
          defaultValue: 0.5
        },
        {
          name: 'focusRange',
          label: 'Focus Range',
          description: 'Range where the depth is considered sharp.',
          type: 'number',
          min: 0,
          max: 1,
          step: 0.01,
          defaultValue: 0.2
        },
        {
          name: 'bokehScale',
          label: 'Bokeh Scale',
          description: 'Strength applied to the blur kernel outside the focus range.',
          type: 'number',
          min: 0,
          max: 3,
          step: 0.05,
          defaultValue: 1.25
        }
      ]
    },
    normalize(spec) {
      return {
        type: 'dof.circle',
        focusDistance: spec.focusDistance ?? 0.5,
        focusRange: spec.focusRange ?? 0.2,
        bokehScale: spec.bokehScale ?? 1.25
      };
    },
    build(input, spec, context) {
      return createDepthOfFieldPass(input, spec, context);
    }
  },
  {
    type: 'tonemap.reinhard',
    metadata: {
      id: 'tsl.post.tonemap.reinhard',
      label: 'Reinhard Tonemap',
      description: 'Classic Reinhard tonemap for gentle highlight roll-off.',
      tags: ['tonemap', 'color'],
      parameters: [
        {
          name: 'exposure',
          label: 'Exposure',
          description: 'Exposure multiplier applied before tonemapping.',
          type: 'number',
          min: 0.1,
          max: 8,
          step: 0.1,
          defaultValue: 1.0
        }
      ]
    },
    normalize(spec) {
      return {
        type: 'tonemap.reinhard',
        exposure: spec.exposure ?? 1.0
      };
    },
    build(input, spec) {
      return createReinhardTonemapPass(input, spec);
    }
  },
  {
    type: 'tonemap.aces',
    metadata: {
      id: 'tsl.post.tonemap.aces',
      label: 'ACES Tonemap',
      description: 'ACES filmic curve inspired by cinematography pipelines.',
      tags: ['tonemap', 'color', 'filmic'],
      parameters: [
        {
          name: 'exposure',
          label: 'Exposure',
          description: 'Exposure multiplier applied before the ACES curve.',
          type: 'number',
          min: 0.1,
          max: 8,
          step: 0.1,
          defaultValue: 1.0
        }
      ]
    },
    normalize(spec) {
      return {
        type: 'tonemap.aces',
        exposure: spec.exposure ?? 1.0
      };
    },
    build(input, spec) {
      return createAcesTonemapPass(input, spec);
    }
  },
  {
    type: 'tonemap.uncharted2',
    metadata: {
      id: 'tsl.post.tonemap.uncharted2',
      label: 'Uncharted2 Tonemap',
      description: 'John Hable’s filmic curve popularized by Uncharted 2.',
      tags: ['tonemap', 'filmic'],
      parameters: [
        {
          name: 'exposure',
          label: 'Exposure',
          description: 'Exposure multiplier applied before the filmic curve.',
          type: 'number',
          min: 0.1,
          max: 8,
          step: 0.1,
          defaultValue: 1.2
        }
      ]
    },
    normalize(spec) {
      return {
        type: 'tonemap.uncharted2',
        exposure: spec.exposure ?? 1.2
      };
    },
    build(input, spec) {
      return createUncharted2TonemapPass(input, spec);
    }
  },
  {
    type: 'aa.fxaa',
    metadata: {
      id: 'tsl.post.aa.fxaa',
      label: 'FXAA',
      description: 'Fast approximate anti-aliasing smoothing specular aliasing.',
      tags: ['aa'],
      parameters: [
        {
          name: 'spanMax',
          label: 'Span Max',
          description: 'Controls the maximum blur span.',
          type: 'number',
          min: 1,
          max: 16,
          step: 0.5,
          defaultValue: 8
        },
        {
          name: 'reduceMin',
          label: 'Reduce Min',
          description: 'Minimum reduction threshold for FXAA.',
          type: 'number',
          min: 0,
          max: 1,
          step: 0.01,
          defaultValue: 0.04
        }
      ]
    },
    normalize(spec) {
      return {
        type: 'aa.fxaa',
        spanMax: spec.spanMax ?? 8,
        reduceMin: spec.reduceMin ?? 0.04
      };
    },
    build(input, spec) {
      return createFXAAPass(input, spec);
    }
  },
  {
    type: 'aa.taa',
    metadata: {
      id: 'tsl.post.aa.taa',
      label: 'TAA',
      description: 'Temporal anti-aliasing with motion-compensated blending.',
      tags: ['aa', 'temporal'],
      parameters: [
        {
          name: 'blendFactor',
          label: 'Blend Factor',
          description: 'Blend factor mixing history and current frame.',
          type: 'number',
          min: 0,
          max: 1,
          step: 0.01,
          defaultValue: 0.85
        },
        {
          name: 'jitterSpread',
          label: 'Jitter Spread',
          description: 'Width of the subpixel jitter pattern.',
          type: 'number',
          min: 0,
          max: 1,
          step: 0.01,
          defaultValue: 0.25
        }
      ]
    },
    normalize(spec) {
      return {
        type: 'aa.taa',
        blendFactor: spec.blendFactor ?? 0.85,
        jitterSpread: spec.jitterSpread ?? 0.25
      };
    },
    build(input, spec, context) {
      return createTAAPass(input, spec, context);
    }
  },
  {
    type: 'motion.blur',
    metadata: {
      id: 'tsl.post.motion.blur',
      label: 'Motion Blur',
      description: 'Velocity-driven motion blur with configurable intensity.',
      tags: ['motion', 'temporal'],
      parameters: [
        {
          name: 'intensity',
          label: 'Intensity',
          description: 'Scales the influence of the velocity buffer.',
          type: 'number',
          min: 0,
          max: 2,
          step: 0.05,
          defaultValue: 0.9
        },
        {
          name: 'samples',
          label: 'Samples',
          description: 'Number of taps accumulated along the motion vector.',
          type: 'number',
          min: 1,
          max: 32,
          step: 1,
          defaultValue: 12
        }
      ]
    },
    normalize(spec) {
      return {
        type: 'motion.blur',
        intensity: spec.intensity ?? 0.9,
        samples: spec.samples ?? 12
      };
    },
    build(input, spec, context) {
      return createMotionBlurPass(input, spec, context);
    }
  },
  {
    type: 'gi.ssr',
    metadata: {
      id: 'tsl.post.gi.ssr',
      label: 'Screen Space Reflections',
      description: 'Approximate reflections traced in screen space.',
      tags: ['gi', 'reflections'],
      parameters: [
        {
          name: 'intensity',
          label: 'Intensity',
          description: 'Strength applied to the reflection contribution.',
          type: 'number',
          min: 0,
          max: 2,
          step: 0.05,
          defaultValue: 1.0
        },
        {
          name: 'maxDistance',
          label: 'Max Distance',
          description: 'Ray marching distance in view space.',
          type: 'number',
          min: 0.1,
          max: 20,
          step: 0.1,
          defaultValue: 8
        },
        {
          name: 'thickness',
          label: 'Thickness',
          description: 'Surface thickness tolerance for hit testing.',
          type: 'number',
          min: 0.01,
          max: 2,
          step: 0.01,
          defaultValue: 0.2
        }
      ]
    },
    normalize(spec) {
      return {
        type: 'gi.ssr',
        intensity: spec.intensity ?? 1.0,
        maxDistance: spec.maxDistance ?? 8,
        thickness: spec.thickness ?? 0.2
      };
    },
    build(input, spec) {
      return createSSRPass(input, spec);
    }
  },
  {
    type: 'gi.gtao',
    metadata: {
      id: 'tsl.post.gi.gtao',
      label: 'Ground Truth Ambient Occlusion',
      description: 'Energy-conserving ambient occlusion approximation.',
      tags: ['gi', 'occlusion'],
      parameters: [
        {
          name: 'intensity',
          label: 'Intensity',
          description: 'Scales the occlusion shadowing.',
          type: 'number',
          min: 0,
          max: 2,
          step: 0.05,
          defaultValue: 1.1
        },
        {
          name: 'radius',
          label: 'Radius',
          description: 'Sampling radius for occlusion tracing.',
          type: 'number',
          min: 0.1,
          max: 2,
          step: 0.05,
          defaultValue: 0.4
        },
        {
          name: 'falloff',
          label: 'Falloff',
          description: 'Falloff applied to distant occluders.',
          type: 'number',
          min: 0,
          max: 2,
          step: 0.05,
          defaultValue: 0.9
        }
      ]
    },
    normalize(spec) {
      return {
        type: 'gi.gtao',
        intensity: spec.intensity ?? 1.1,
        radius: spec.radius ?? 0.4,
        falloff: spec.falloff ?? 0.9
      };
    },
    build(input, spec) {
      return createGTAOPass(input, spec);
    }
  },
  {
    type: 'gi.ssgi',
    metadata: {
      id: 'tsl.post.gi.ssgi',
      label: 'Screen Space GI',
      description: 'Secondary lighting approximated in screen space.',
      tags: ['gi', 'lighting'],
      parameters: [
        {
          name: 'intensity',
          label: 'Intensity',
          description: 'Strength applied to the bounced lighting.',
          type: 'number',
          min: 0,
          max: 2,
          step: 0.05,
          defaultValue: 0.8
        },
        {
          name: 'radius',
          label: 'Radius',
          description: 'Sampling radius for indirect light gathering.',
          type: 'number',
          min: 0.1,
          max: 3,
          step: 0.05,
          defaultValue: 1.2
        },
        {
          name: 'temporalBlend',
          label: 'Temporal Blend',
          description: 'Blend factor used for temporal accumulation.',
          type: 'number',
          min: 0,
          max: 1,
          step: 0.01,
          defaultValue: 0.6
        }
      ]
    },
    normalize(spec) {
      return {
        type: 'gi.ssgi',
        intensity: spec.intensity ?? 0.8,
        radius: spec.radius ?? 1.2,
        temporalBlend: spec.temporalBlend ?? 0.6
      };
    },
    build(input, spec, context) {
      return createSSGIPass(input, spec, context);
    }
  }
];

const registry = new Map<PostEffectType, PostPassDefinition<PostEffectType, PostEffectSpec>>();

for (const definition of POST_DEFINITIONS) {
  registry.set(definition.type, definition);
}

function resolveContext(context: PostPassFactoryContext | undefined): PostPassContextNodes {
  const depth = context?.depth ?? float(0.5);
  const velocity = context?.velocity ?? vec3(0.0, 0.0, 0.0);
  const previousColor = context?.previousColor ?? vec3(0.0, 0.0, 0.0);
  return { depth, velocity, previousColor };
}

export function buildPostPass(
  input: ShaderNodeObject<any>,
  spec: PostEffectSpec,
  context?: PostPassFactoryContext
): PostPassBuildResult<PostEffectType> {
  const definition = registry.get(spec.type);

  if (!definition) {
    throw new Error(`Unknown post effect type: ${spec.type}`);
  }

  const normalized = definition.normalize(spec as never) as NormalizedPostEffectSpec;
  const resolvedContext = resolveContext(context);
  const node = definition.build(input, normalized as never, resolvedContext);

  return {
    type: spec.type,
    spec: normalized as never,
    metadata: definition.metadata,
    node
  };
}

export function getPostMetadata(type?: PostEffectType): PostEffectMetadata | PostEffectMetadata[] | null {
  if (typeof type === 'undefined') {
    return Array.from(registry.values()).map((entry) => entry.metadata);
  }

  const definition = registry.get(type);
  return definition ? definition.metadata : null;
}

export function listPostPassMetadata(): PostEffectMetadata[] {
  return Array.from(registry.values()).map((entry) => entry.metadata);
}

export function listPostPassDefinitions(): PostPassDefinition<PostEffectType, PostEffectSpec>[] {
  return Array.from(registry.values());
}
