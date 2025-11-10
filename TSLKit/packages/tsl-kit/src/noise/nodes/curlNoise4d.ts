import { Fn, Node, ShaderNodeObject, div, float, mul, normalize, vec3, vec4 } from 'three/tsl';

import { simplexNoise3d } from './simplexNoise3d.js';

type NoiseVec4 = ShaderNodeObject<Node>;

type CurlInputs = [NoiseVec4];

export const curlNoise4d = /*#__PURE__*/ Fn<ShaderNodeObject<Node>>(([pInput]: CurlInputs) => {
  const p = vec4(pInput).toVar();
  const e = float(0.1);

  const dx = vec4(e, 0.0, 0.0, 1.0).toVar();
  const dy = vec4(0.0, e, 0.0, 1.0).toVar();
  const dz = vec4(0.0, 0.0, e, 1.0).toVar();

  const pX0 = vec3(simplexNoise3d(p.sub(dx))).toVar();
  const pX1 = vec3(simplexNoise3d(p.add(dx))).toVar();
  const pY0 = vec3(simplexNoise3d(p.sub(dy))).toVar();
  const pY1 = vec3(simplexNoise3d(p.add(dy))).toVar();
  const pZ0 = vec3(simplexNoise3d(p.sub(dz))).toVar();
  const pZ1 = vec3(simplexNoise3d(p.add(dz))).toVar();

  const x = float(pY1.z.sub(pY0.z).sub(pZ1.y).add(pZ0.y)).toVar();
  const y = float(pZ1.x.sub(pZ0.x).sub(pX1.z).add(pX0.z)).toVar();
  const z = float(pX1.y.sub(pX0.y).sub(pY1.x).add(pY0.x)).toVar();

  const divisor = float(div(1.0, mul(2.0, e)));

  return normalize(vec3(x, y, z).mul(divisor));
}).setLayout({
  name: 'curlNoise4d',
  type: 'vec3',
  inputs: [{ name: 'p', type: 'vec4' }]
});
