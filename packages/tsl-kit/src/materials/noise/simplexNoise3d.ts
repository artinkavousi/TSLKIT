import {
  Fn,
  abs,
  dot,
  float,
  floor,
  max,
  min,
  mul,
  step,
  sub,
  vec2,
  vec3,
  vec4
} from 'three/examples/jsm/nodes/Nodes.js';

import { mod289, permute, taylorInvSqrt } from './common';
import type { Vector3Tuple } from '../../utils/types';

export const simplexNoise3dNode = /*#__PURE__*/ Fn(([vImmutable]) => {
  const v = vec3(vImmutable).toVar();
  const C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const D = vec4(0.0, 0.5, 1.0, 2.0);

  const i = vec3(floor(v.add(dot(v, C.yyy)))).toVar();
  const x0 = vec3(v.sub(i).add(dot(i, C.xxx))).toVar();

  const g = vec3(step(x0.yzx, x0.xyz)).toVar();
  const l = vec3(sub(1.0, g)).toVar();
  const i1 = vec3(min(g.xyz, l.zxy)).toVar();
  const i2 = vec3(max(g.xyz, l.zxy)).toVar();

  const x1 = vec3(x0.sub(i1).add(mul(1.0, C.xxx))).toVar();
  const x2 = vec3(x0.sub(i2).add(mul(2.0, C.xxx))).toVar();
  const x3 = vec3(x0.sub(1).add(mul(3.0, C.xxx))).toVar();

  i.assign(mod289(i));

  const p = vec4(
    permute(
      permute(permute(i.z.add(vec4(0.0, i1.z, i2.z, 1.0))).add(i.y.add(vec4(0.0, i1.y, i2.y, 1.0)))).add(
        i.x.add(vec4(0.0, i1.x, i2.x, 1.0))
      )
    )
  ).toVar();

  const n_ = float(1.0 / 7.0).toVar();
  const ns = vec3(n_.mul(D.wyz).sub(D.xzx)).toVar();
  const j = vec4(p.sub(mul(49.0, floor(p.mul(ns.z.mul(ns.z)))))).toVar();
  const x_ = vec4(floor(j.mul(ns.z))).toVar();
  const y_ = vec4(floor(j.sub(mul(7.0, x_)))).toVar();

  const x = vec4(x_.mul(ns.x).add(ns.yyyy)).toVar();
  const y = vec4(y_.mul(ns.x).add(ns.yyyy)).toVar();
  const h = vec4(sub(1.0, abs(x).sub(abs(y)))).toVar();

  const b0 = vec4(x.xy, y.xy).toVar();
  const b1 = vec4(x.zw, y.zw).toVar();
  const s0 = vec4(floor(b0).mul(2.0).add(1.0)).toVar();
  const s1 = vec4(floor(b1).mul(2.0).add(1.0)).toVar();
  const sh = vec4(step(h, vec4(0.0)).negate()).toVar();

  const a0 = vec4(b0.xzyw.add(s0.xzyw.mul(sh.xxyy))).toVar();
  const a1 = vec4(b1.xzyw.add(s1.xzyw.mul(sh.zzww))).toVar();

  const p0 = vec3(a0.xy, h.x).toVar();
  const p1 = vec3(a0.zw, h.y).toVar();
  const p2 = vec3(a1.xy, h.z).toVar();
  const p3 = vec3(a1.zw, h.w).toVar();

  const norm = vec4(taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)))).toVar();
  p0.mulAssign(norm.x);
  p1.mulAssign(norm.y);
  p2.mulAssign(norm.z);
  p3.mulAssign(norm.w);

  const m = vec4(max(sub(0.6, vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3))), 0.0)).toVar();
  m.assign(m.mul(m));

  return mul(42.0, dot(m.mul(m), vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3))));
});

export function simplexNoise3d(point: Vector3Tuple): number {
  // CPU fallback identical to GPU implementation
  // [Same as earlier CPU implementation].
  const [x, y, z] = point;
  const F3 = 1 / 3;
  const G3 = 1 / 6;
  const s = (x + y + z) * F3;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  const k = Math.floor(z + s);
  const t = (i + j + k) * G3;
  const X0 = i - t;
  const Y0 = j - t;
  const Z0 = k - t;
  const x0 = x - X0;
  const y0 = y - Y0;
  const z0 = z - Z0;

  let i1 = 0;
  let j1 = 0;
  let k1 = 0;
  let i2 = 0;
  let j2 = 0;
  let k2 = 0;

  if (x0 >= y0) {
    if (y0 >= z0) {
      i1 = 1;
      i2 = 1;
      j2 = 1;
    } else if (x0 >= z0) {
      i1 = 1;
      i2 = 1;
      k2 = 1;
    } else {
      k1 = 1;
      i2 = 1;
      k2 = 1;
    }
  } else if (y0 < z0) {
    k1 = 1;
    j2 = 1;
    k2 = 1;
  } else if (x0 < z0) {
    j1 = 1;
    j2 = 1;
    k2 = 1;
  } else {
    j1 = 1;
    i2 = 1;
    j2 = 1;
  }

  const x1 = x0 - i1 + G3;
  const y1 = y0 - j1 + G3;
  const z1 = z0 - k1 + G3;
  const x2 = x0 - i2 + 2 * G3;
  const y2 = y0 - j2 + 2 * G3;
  const z2 = z0 - k2 + 2 * G3;
  const x3 = x0 - 1 + 3 * G3;
  const y3 = y0 - 1 + 3 * G3;
  const z3 = z0 - 1 + 3 * G3;

  const ii = i & 255;
  const jj = j & 255;
  const kk = k & 255;

  const gi0 = gradP(ii, jj, kk);
  const gi1 = gradP(ii + i1, jj + j1, kk + k1);
  const gi2 = gradP(ii + i2, jj + j2, kk + k2);
  const gi3 = gradP(ii + 1, jj + 1, kk + 1);

  const n0 = contribution(gi0, x0, y0, z0);
  const n1 = contribution(gi1, x1, y1, z1);
  const n2 = contribution(gi2, x2, y2, z2);
  const n3 = contribution(gi3, x3, y3, z3);

  return 32 * (n0 + n1 + n2 + n3);
}

const permTable = new Uint8Array(512);
const basePerm = new Uint8Array([
  151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69,
  142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219,
  203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
  74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230,
  220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209,
  76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173,
  186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206,
  59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163,
  70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232,
  178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241,
  81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176,
  115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128,
  195, 78, 66, 215, 61, 156, 180
]);

for (let idx = 0; idx < 512; idx += 1) {
  permTable[idx] = basePerm[idx & 255];
}

function gradP(ix: number, iy: number, iz: number): [number, number, number] {
  const hash = permTable[(permTable[(permTable[ix & 255] + (iy & 255)) & 255] + (iz & 255)) & 255];
  const h = hash & 15;
  const u = h < 8 ? 1 : 0;
  const v = h < 4 ? 1 : h === 12 || h === 14 ? 0 : 1;
  return [((h & 1) === 0 ? u : -u), ((h & 2) === 0 ? v : -v), ((h & 4) === 0 ? 1 : -1)];
}

function contribution(grad: [number, number, number], x: number, y: number, z: number) {
  const t = 0.6 - x * x - y * y - z * z;
  if (t < 0) {
    return 0;
  }
  const t4 = t * t * t * t;
  return t4 * (grad[0] * x + grad[1] * y + grad[2] * z);
}
