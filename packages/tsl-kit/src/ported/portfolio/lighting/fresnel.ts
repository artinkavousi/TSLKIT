import { Fn, dot, float, max } from 'three/tsl';

export const createFresnelNode = Fn(([viewDir, normal, power = 1]: any[]) => {
  return float(1)
    .sub(max(0, dot(viewDir, normal)))
    .pow(power);
});
