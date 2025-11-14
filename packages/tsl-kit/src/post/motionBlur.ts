import { type PostProcessingChain } from './types';

export interface MotionBlurOptions {
  shutterAngle?: number;
  sampleCount?: number;
}

export function createMotionBlurChain(options: MotionBlurOptions = {}): PostProcessingChain {
  const { shutterAngle = 180, sampleCount = 8 } = options;

  return {
    id: 'motion-blur',
    label: 'Motion Blur',
    description: 'Velocity-buffer driven motion blur for cinematic sweeps and camera moves.',
    passes: [
      {
        name: 'velocity-prefilter',
        shader: 'velocityPrefilter.glsl',
        outputs: ['velocityFiltered']
      },
      {
        name: 'motion-blur',
        shader: 'motionBlur.glsl',
        defines: {
          SHUTTER_ANGLE: shutterAngle,
          SAMPLE_COUNT: sampleCount
        },
        inputs: ['color', 'velocityFiltered'],
        outputs: ['color']
      }
    ]
  };
}
