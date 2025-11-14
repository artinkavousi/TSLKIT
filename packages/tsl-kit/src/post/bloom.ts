import { type PostProcessingChain } from './types';

export interface BloomOptions {
  strength?: number;
  radius?: number;
  threshold?: number;
}

export function createBloomChain(options: BloomOptions = {}): PostProcessingChain {
  const { strength = 0.9, radius = 0.45, threshold = 0.85 } = options;
  return {
    id: 'bloom',
    label: 'Filmic Bloom',
    description: 'Multi-resolution bloom tuned for neon-grade highlights and volumetric streaks.',
    passes: [
      {
        name: 'bright-pass',
        shader: 'brightPass.glsl',
        defines: {
          THRESHOLD: threshold,
          SOFT_THRESHOLD: threshold - 0.2
        },
        outputs: ['bloomThreshold']
      },
      {
        name: 'mip-chain',
        shader: 'mipDownsample.glsl',
        inputs: ['bloomThreshold'],
        outputs: ['bloomMip0', 'bloomMip1', 'bloomMip2', 'bloomMip3']
      },
      {
        name: 'blur-horizontal',
        shader: 'blur.glsl',
        defines: {
          DIRECTION: 'vec2(1.0, 0.0)',
          RADIUS: radius
        },
        inputs: ['bloomMip3'],
        outputs: ['bloomBlurH']
      },
      {
        name: 'blur-vertical',
        shader: 'blur.glsl',
        defines: {
          DIRECTION: 'vec2(0.0, 1.0)',
          RADIUS: radius
        },
        inputs: ['bloomBlurH'],
        outputs: ['bloomBlurV']
      },
      {
        name: 'compose',
        shader: 'bloomCompose.glsl',
        defines: {
          STRENGTH: strength
        },
        inputs: ['color', 'bloomBlurV'],
        outputs: ['color']
      }
    ]
  };
}
