import { describe, expect, it } from 'vitest';
import { float, vec3 } from 'three/tsl';

import {
  ambientLight,
  diffuseLight,
  directionalLight,
  fresnel,
  hemisphereLight
} from './index.js';

describe('lighting nodes', () => {
  const white = vec3(1.0, 1.0, 1.0);
  const normal = vec3(0.0, 1.0, 0.0);

  it('returns ambient contribution', () => {
    expect(ambientLight(white, float(0.5))).toBeDefined();
  });

  it('returns diffuse contribution', () => {
    expect(diffuseLight(white, vec3(0.0, -1.0, 0.0), normal)).toBeDefined();
  });

  it('returns directional contribution', () => {
    const node = directionalLight(
      white,
      float(1.0),
      normal,
      vec3(0.0, -1.0, 0.0),
      vec3(0.0, 0.0, 1.0),
      float(8.0)
    );

    expect(node).toBeDefined();
  });

  it('returns hemisphere blend', () => {
    expect(hemisphereLight(normal, vec3(0.2, 0.2, 0.2), white)).toBeDefined();
  });

  it('supports fresnel with default power', () => {
    expect(fresnel(vec3(0.0, 0.0, 1.0), normal, undefined)).toBeDefined();
  });
});
