import { describe, expect, it } from 'vitest';

import {
  clearcoatLayer,
  diffuseLayer,
  evaluatePhysicalMaterial,
  sheenLayer,
  specularLayer,
  transmissionLayer,
  createPhysicalMaterial
} from './index.js';

const SPEC = {
  name: 'Test Material',
  layers: [
    diffuseLayer({ color: [1, 0, 0], weight: 0.5 }),
    diffuseLayer({ color: [0, 0, 1], weight: 0.5 }),
    specularLayer({ roughness: 0.2, metalness: 0.3, intensity: 0.5 }),
    clearcoatLayer({ intensity: 0.6, roughness: 0.4, color: [0.9, 0.9, 0.9] }),
    sheenLayer({ intensity: 0.3, roughness: 0.7, color: [0.6, 0.6, 0.9] }),
    transmissionLayer({
      intensity: 0.4,
      color: [0.8, 0.9, 1],
      thickness: 0.25,
      attenuationColor: [0.6, 0.7, 0.9],
      attenuationDistance: 2
    })
  ],
  opacity: 0.8,
  ior: 1.45
} as const;

describe('evaluatePhysicalMaterial', () => {
  it('computes aggregated BRDF properties', () => {
    const evaluation = evaluatePhysicalMaterial(SPEC);

    expect(evaluation.color).toEqual([0.5, 0, 0.5]);
    expect(evaluation.metalness).toBeCloseTo(0.3);
    expect(evaluation.roughness).toBeCloseTo(0.2);
    expect(evaluation.specularColor).toEqual([1, 1, 1]);
    expect(evaluation.specularIntensity).toBeCloseTo(0.5);
    expect(evaluation.clearcoat).toBeCloseTo(0.6);
    expect(evaluation.clearcoatRoughness).toBeCloseTo(0.4);
    expect(evaluation.sheen).toBeCloseTo(0.3);
    expect(evaluation.sheenColor[0]).toBeCloseTo(0.6);
    expect(evaluation.sheenColor[1]).toBeCloseTo(0.6);
    expect(evaluation.sheenColor[2]).toBeCloseTo(0.9);
    expect(evaluation.transmission).toBeCloseTo(0.4);
    expect(evaluation.transmissionColor[0]).toBeCloseTo(0.8);
    expect(evaluation.transmissionColor[1]).toBeCloseTo(0.9);
    expect(evaluation.transmissionColor[2]).toBeCloseTo(1);
    expect(evaluation.thickness).toBeCloseTo(0.25);
    expect(evaluation.attenuationColor[0]).toBeCloseTo(0.6);
    expect(evaluation.attenuationColor[1]).toBeCloseTo(0.7);
    expect(evaluation.attenuationColor[2]).toBeCloseTo(0.9);
    expect(evaluation.attenuationDistance).toBeCloseTo(2);
    expect(evaluation.opacity).toBeCloseTo(0.8);
    expect(evaluation.ior).toBeCloseTo(1.45);
  });
});

describe('createPhysicalMaterial', () => {
  it('produces a MeshPhysicalNodeMaterial with transparency inferred', () => {
    const material = createPhysicalMaterial(SPEC);

    expect(material.isMeshPhysicalNodeMaterial).toBe(true);
    expect(material.transparent).toBe(true);
    expect(material.name).toBe('Test Material');
  });
});
