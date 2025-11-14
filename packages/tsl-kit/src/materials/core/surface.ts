import { Fn, add, mul, normalize, vec3 } from 'three/examples/jsm/nodes/Nodes.js';

import { lambertDiffuse, phongSpecular } from './lighting';

export const standardSurface = /*#__PURE__*/ Fn(([normal, viewDir, lightDir, lightColor, baseColor, specularColor, roughness]) => {
  const n = normalize(normal);
  const l = normalize(lightDir);
  const v = normalize(viewDir);

  const diffuse = lambertDiffuse(n, l, lightColor).mul(vec3(baseColor));
  const spec = phongSpecular(n, v, l, vec3(64), specularColor);

  return add(diffuse, spec);
});
