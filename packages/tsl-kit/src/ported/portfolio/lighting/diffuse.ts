import { Fn, dot, max } from 'three/tsl';

export const diffuseNode = Fn(([lightColor, lightDir, normal]: any[]) => {
  const dp = max(0, dot(lightDir, normal));
  return dp.mul(lightColor);
});
