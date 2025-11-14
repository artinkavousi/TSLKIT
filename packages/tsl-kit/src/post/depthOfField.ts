import { type PostProcessingChain } from './types';

export interface DepthOfFieldOptions {
  focusDistance?: number;
  aperture?: number;
  maxBlur?: number;
}

export function createDepthOfFieldChain(options: DepthOfFieldOptions = {}): PostProcessingChain {
  const { focusDistance = 2.5, aperture = 0.024, maxBlur = 0.01 } = options;

  return {
    id: 'depth-of-field',
    label: 'Depth of Field',
    description: 'Circular bokeh depth of field with autofocus tap for interactive presets.',
    passes: [
      {
        name: 'coc-calc',
        shader: 'circleOfConfusion.glsl',
        defines: {
          FOCUS_DISTANCE: focusDistance,
          APERTURE: aperture
        },
        outputs: ['coc']
      },
      {
        name: 'prefilter',
        shader: 'dofPrefilter.glsl',
        inputs: ['color', 'coc'],
        outputs: ['dofPrefiltered']
      },
      {
        name: 'bokeh',
        shader: 'dofBokeh.glsl',
        defines: {
          MAX_BLUR: maxBlur
        },
        inputs: ['dofPrefiltered', 'coc'],
        outputs: ['dofBokeh']
      },
      {
        name: 'composite',
        shader: 'dofComposite.glsl',
        inputs: ['color', 'dofBokeh', 'coc'],
        outputs: ['color']
      }
    ]
  };
}
