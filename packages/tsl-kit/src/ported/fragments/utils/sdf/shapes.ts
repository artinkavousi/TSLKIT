import { Fn, length, float } from 'three/tsl';

export const sdSphere = /*#__PURE__*/ Fn(([_uv, r = float(0.0)]: [unknown, unknown?]) => {
  const radius = float(r);
  return length(_uv).sub(radius);
}).setLayout({
  name: 'sdSphere',
  type: 'float',
  inputs: [
    { name: 'uv', type: 'vec2' },
    { name: 'radius', type: 'float', defaultValue: 0 },
  ],
});
