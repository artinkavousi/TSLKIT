import { Fn, mix } from 'three/tsl';

export const createHemisphereLight = Fn(([normal, groundColor, skyColor]: any[]) => {
  const hemiMix = normal.y.mul(0.5).add(0.5);
  return mix(groundColor, skyColor, hemiMix);
});
