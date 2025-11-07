import { vec2, Fn, fract, sin, dot } from 'three/tsl';

export const grainTextureEffect = /*#__PURE__*/ Fn(([_uv]: [unknown]) => {
  return fract(sin(dot(_uv, vec2(12.9898, 78.233))).mul(43758.5453123));
}).setLayout({
  name: 'grainTextureEffect',
  type: 'float',
  inputs: [{ name: 'uv', type: 'vec2' }],
});
