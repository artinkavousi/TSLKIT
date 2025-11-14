import { Fn, add, dot, max, mul, normalize, pow, reflect, saturate, vec3 } from 'three/examples/jsm/nodes/Nodes.js';

export const fresnelSchlick = /*#__PURE__*/ Fn(([viewDir, halfVector, f0]) => {
  const base = vec3(f0).add(vec3(1).sub(vec3(f0)).mul(pow(vec3(1).sub(vec3(dot(viewDir, halfVector))), 5)));
  return base;
});

export const hemisphereLight = /*#__PURE__*/ Fn(([normal, up, skyColor, groundColor]) => {
  const factor = add(vec3(dot(normalize(normal), normalize(up))).mul(0.5), 0.5);
  return vec3(skyColor).mix(vec3(groundColor), saturate(factor));
});

export const lambertDiffuse = /*#__PURE__*/ Fn(([normal, lightDir, lightColor]) => {
  const intensity = max(dot(normalize(normal), normalize(lightDir)), 0.0);
  return vec3(lightColor).mul(intensity);
});

export const phongSpecular = /*#__PURE__*/ Fn(([normal, viewDir, lightDir, shininess, specColor]) => {
  const reflectDir = reflect(vec3(lightDir).negate(), normalize(normal));
  const spec = pow(max(dot(reflectDir, normalize(viewDir)), 0.0), shininess);
  return vec3(specColor).mul(spec);
});
