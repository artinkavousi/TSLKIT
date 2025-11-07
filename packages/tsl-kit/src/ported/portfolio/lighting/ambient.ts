import { Fn } from 'three/tsl';

export const ambientLightNode = Fn(([lightColor, intensity]: any[]) => {
  return lightColor.mul(intensity);
});
