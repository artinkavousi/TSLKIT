import {
  Fn,
  abs,
  dot,
  floor,
  fract,
  max,
  mul,
  step,
  sub,
  vec2,
  vec3,
  vec4
} from 'three/examples/jsm/nodes/Nodes.js';

import { fade, mod289, permute } from './common';
import type { Vector3Tuple } from '../../utils/types';

export const perlinNoise3dNode = /*#__PURE__*/ Fn(([pImmutable]) => {
  const P = vec3(pImmutable).toVar();
  const Pi0 = vec3(floor(P)).toVar();
  const Pi1 = vec3(Pi0.add(vec3(1.0))).toVar();
  Pi0.assign(mod289(Pi0));
  Pi1.assign(mod289(Pi1));

  const Pf0 = vec3(fract(P)).toVar();
  const Pf1 = vec3(Pf0.sub(vec3(1.0))).toVar();

  const ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x).toVar();
  const iy = vec4(Pi0.yy, Pi1.yy).toVar();
  const iz0 = vec4(Pi0.zzzz).toVar();
  const iz1 = vec4(Pi1.zzzz).toVar();

  const ixy = vec4(permute(permute(ix).add(iy))).toVar();
  const ixy0 = vec4(permute(ixy.add(iz0))).toVar();
  const ixy1 = vec4(permute(ixy.add(iz1))).toVar();

  const gx0 = vec4(ixy0.mul(1.0 / 7.0)).toVar();
  const gy0 = vec4(fract(floor(gx0).mul(1.0 / 7.0)).sub(0.5)).toVar();
  gx0.assign(fract(gx0));
  const gz0 = vec4(vec4(0.5).sub(abs(gx0)).sub(abs(gy0))).toVar();
  const sz0 = vec4(step(gz0, vec4(0.0))).toVar();
  gx0.subAssign(sz0.mul(step(0.0, gx0).sub(0.5)));
  gy0.subAssign(sz0.mul(step(0.0, gy0).sub(0.5)));

  const gx1 = vec4(ixy1.mul(1.0 / 7.0)).toVar();
  const gy1 = vec4(fract(floor(gx1).mul(1.0 / 7.0)).sub(0.5)).toVar();
  gx1.assign(fract(gx1));
  const gz1 = vec4(vec4(0.5).sub(abs(gx1)).sub(abs(gy1))).toVar();
  const sz1 = vec4(step(gz1, vec4(0.0))).toVar();
  gx1.subAssign(sz1.mul(step(0.0, gx1).sub(0.5)));
  gy1.subAssign(sz1.mul(step(0.0, gy1).sub(0.5)));

  const g000 = vec3(gx0.x, gy0.x, gz0.x).toVar();
  const g100 = vec3(gx0.y, gy0.y, gz0.y).toVar();
  const g010 = vec3(gx0.z, gy0.z, gz0.z).toVar();
  const g110 = vec3(gx0.w, gy0.w, gz0.w).toVar();
  const g001 = vec3(gx1.x, gy1.x, gz1.x).toVar();
  const g101 = vec3(gx1.y, gy1.y, gz1.y).toVar();
  const g011 = vec3(gx1.z, gy1.z, gz1.z).toVar();
  const g111 = vec3(gx1.w, gy1.w, gz1.w).toVar();

  const norm0 = vec4(1.79284291400159).div(vec4(0.85373472095314).mul(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110))).add(1));
  g000.mulAssign(norm0.x);
  g010.mulAssign(norm0.y);
  g100.mulAssign(norm0.z);
  g110.mulAssign(norm0.w);

  const norm1 = vec4(1.79284291400159).div(
    vec4(0.85373472095314).mul(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111))).add(1)
  );
  g001.mulAssign(norm1.x);
  g011.mulAssign(norm1.y);
  g101.mulAssign(norm1.z);
  g111.mulAssign(norm1.w);

  const n000 = dot(g000, Pf0);
  const n100 = dot(g100, vec3(Pf1.x, Pf0.y, Pf0.z));
  const n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  const n110 = dot(g110, vec3(Pf1.x, Pf1.y, Pf0.z));
  const n001 = dot(g001, vec3(Pf0.x, Pf0.y, Pf1.z));
  const n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  const n011 = dot(g011, vec3(Pf0.x, Pf1.y, Pf1.z));
  const n111 = dot(g111, Pf1);

  const fade_xyz = vec3(fade(Pf0)).toVar();
  const n_z = vec4(n000, n100, n010, n110).mix(vec4(n001, n101, n011, n111), fade_xyz.z);
  const n_yz = vec2(n_z.x, n_z.z).mix(vec2(n_z.y, n_z.w), fade_xyz.y);
  const n_xyz = n_yz.x.mix(n_yz.y, fade_xyz.x);

  return mul(2.2, n_xyz);
});

export function perlinNoise3d(point: Vector3Tuple): number {
  const fade3 = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

  const [x, y, z] = point;
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;

  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const zf = z - Math.floor(z);

  const u = fade3(xf);
  const v = fade3(yf);
  const w = fade3(zf);

  const aaa = grad(hash(X, Y, Z), xf, yf, zf);
  const baa = grad(hash(X + 1, Y, Z), xf - 1, yf, zf);
  const aba = grad(hash(X, Y + 1, Z), xf, yf - 1, zf);
  const bba = grad(hash(X + 1, Y + 1, Z), xf - 1, yf - 1, zf);
  const aab = grad(hash(X, Y, Z + 1), xf, yf, zf - 1);
  const bab = grad(hash(X + 1, Y, Z + 1), xf - 1, yf, zf - 1);
  const abb = grad(hash(X, Y + 1, Z + 1), xf, yf - 1, zf - 1);
  const bbb = grad(hash(X + 1, Y + 1, Z + 1), xf - 1, yf - 1, zf - 1);

  const x1 = lerp(aaa, baa, u);
  const x2 = lerp(aba, bba, u);
  const y1 = lerp(x1, x2, v);

  const x3 = lerp(aab, bab, u);
  const x4 = lerp(abb, bbb, u);
  const y2 = lerp(x3, x4, v);

  return lerp(y1, y2, w);
}

const p = new Uint8Array(512);
for (let i = 0; i < 256; i += 1) {
  p[i] = PERMUTATION[i];
  p[i + 256] = PERMUTATION[i];
}

function hash(x: number, y: number, z: number) {
  return p[p[p[x & 255] + (y & 255)] + (z & 255)];
}

function grad(hashValue: number, x: number, y: number, z: number) {
  const h = hashValue & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

function lerp(a: number, b: number, t: number) {
  return a + t * (b - a);
}

const PERMUTATION = new Uint8Array([
  151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142,
  8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203,
  117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74,
  165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220,
  105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132,
  187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3,
  64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227,
  47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221,
  153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185,
  112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51,
  145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121,
  50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78,
  66, 215, 61, 156, 180
]);
