import { Fn, smoothstep, pow } from 'three/tsl';
import { sdSphere } from '../utils/sdf/shapes.js';

export const vignetteEffect = /*#__PURE__*/ Fn(([_uv, smoothing = 0.45, exponent = 1.2]: [unknown, number?, number?]) => {
  const vignette = smoothstep(smoothing, 1, sdSphere(_uv)).oneMinus();
  return pow(vignette, exponent);
}).setLayout({
  name: 'vignetteEffect',
  type: 'float',
  inputs: [
    { name: 'uv', type: 'vec2' },
    { name: 'smoothing', type: 'float', defaultValue: 0.45 },
    { name: 'exponent', type: 'float', defaultValue: 1.2 },
  ],
});
