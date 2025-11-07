import { Fn, floor, float, screenSize } from 'three/tsl';

/**
 * Creates a pixellation effect given the current UV coordinates and screenSize.
 * @param {vec2} _uv - The UV coordinates.
 * @param {number} [size=20.0] - The size of the pixellation.
 * @returns {float} The pixellation effect value.
 */
export const pixellationEffect = Fn(([_uv, size = 20.0]: [any, any?]) => {
  const _size = float(size);

  const pixelSize = _size.div(screenSize.x);
  return floor(_uv.div(pixelSize)).mul(pixelSize);
});
