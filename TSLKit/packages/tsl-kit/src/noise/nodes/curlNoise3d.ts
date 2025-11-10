import {
  Fn,
  Node,
  ShaderNodeObject,
  add,
  div,
  mul,
  normalize,
  vec3
} from 'three/tsl';

import type { NoiseVec3 } from './simplexNoise3d.js';
import { simplexNoise3d } from './simplexNoise3d.js';

const snoiseVec3 = /*#__PURE__*/ Fn<ShaderNodeObject<Node>>(([positionInput]) => {
  const position = vec3(positionInput).toVar();

  return vec3(
    simplexNoise3d(position),
    simplexNoise3d(vec3(position.y.sub(19.1), position.z.add(33.4), position.x.add(47.2))),
    simplexNoise3d(vec3(position.z.add(74.2), position.x.sub(124.5), position.y.add(99.4)))
  );
}).setLayout({
  name: 'snoiseVec3',
  type: 'vec3',
  inputs: [{ name: 'p', type: 'vec3' }]
});

export const curlNoise3d = /*#__PURE__*/ Fn<ShaderNodeObject<Node>>(([positionInput]) => {
  const position = vec3(positionInput).toVar();
  const epsilon = 0.1;
  const dx = vec3(epsilon, 0.0, 0.0);
  const dy = vec3(0.0, epsilon, 0.0);
  const dz = vec3(0.0, 0.0, epsilon);

  const pX0 = vec3(snoiseVec3(position.sub(dx))).toVar();
  const pX1 = vec3(snoiseVec3(position.add(dx))).toVar();
  const pY0 = vec3(snoiseVec3(position.sub(dy))).toVar();
  const pY1 = vec3(snoiseVec3(position.add(dy))).toVar();
  const pZ0 = vec3(snoiseVec3(position.sub(dz))).toVar();
  const pZ1 = vec3(snoiseVec3(position.add(dz))).toVar();

  const x = pY1.z.sub(pY0.z).sub(pZ1.y).add(pZ0.y);
  const y = pZ1.x.sub(pZ0.x).sub(pX1.z).add(pX0.z);
  const z = pX1.y.sub(pX0.y).sub(pY1.x).add(pY0.x);

  return normalize(vec3(x, y, z).mul(div(1.0, mul(2.0, epsilon))));
}).setLayout({
  name: 'curlNoise3d',
  type: 'vec3',
  inputs: [{ name: 'p', type: 'vec3' }]
});

export type CurlNoiseNode = ShaderNodeObject<Node>;

export function curlNoise(position: NoiseVec3): ShaderNodeObject<Node> {
  return curlNoise3d(position);
}
