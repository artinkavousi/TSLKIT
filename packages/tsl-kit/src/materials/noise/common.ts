import { Fn, float, floor, vec3, vec4 } from 'three/examples/jsm/nodes/Nodes.js';

export const mod289 = /*#__PURE__*/ Fn(([x]) => vec3(x).sub(vec3(floor(vec3(x).mul(float(1 / 289))).mul(289))));

export const permute = /*#__PURE__*/ Fn(([x]) => mod289(vec3(vec3(x).mul(float(34)).add(float(1))).mul(vec3(x))));

export const taylorInvSqrt = /*#__PURE__*/ Fn(([r]) => vec4(1.79284291400159).sub(vec4(r).mul(0.85373472095314)));

export const fade = /*#__PURE__*/ Fn(([t]) => vec3(t)
  .mul(vec3(t))
  .mul(vec3(t.mul(6).sub(15).mul(t).add(10))));
