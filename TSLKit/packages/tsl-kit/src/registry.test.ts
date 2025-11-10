import { beforeEach, describe, expect, it } from 'vitest';
import {
  applyPreset,
  clearRegistry,
  listPresets,
  makeMaterial,
  runCompute
} from './registry.js';

const baseMaterial = {
  name: 'Layered Matte',
  model: 'pbr',
  layers: [
    {
      id: 'base',
      type: 'baseColor',
      generator: { kind: 'texture', ref: 'albedo', params: {} },
      inputs: {}
    }
  ],
  metadata: { tags: ['test'] }
};

beforeEach(() => {
  clearRegistry();
});

describe('registry runtime APIs', () => {
  it('creates materials with summaries', () => {
    const handle = makeMaterial(baseMaterial);
    expect(handle.kind).toBe('material');
    expect(handle.summary).toContain('Layered Matte');
    expect(handle.spec.id).toMatch(/material-/);
  });

  it('runs compute specs and captures dispatch information', () => {
    const result = runCompute({
      name: 'Integrate',
      entry: 'integrate',
      dispatch: [4, 2, 1],
      resources: [{ name: 'positions', binding: 0, kind: 'storage' }]
    });

    expect(result.status).toBe('completed');
    expect(result.dispatch).toEqual({ x: 4, y: 2, z: 1 });
  });

  it('applies presets with overrides', () => {
    const application = applyPreset('tsl.materials.matte', {
      name: 'Custom Matte',
      layers: [
        {
          id: 'albedo',
          type: 'baseColor',
          generator: { kind: 'texture', ref: 'albedo', params: { uvScale: [2, 2] } },
          inputs: {}
        }
      ]
    });

    expect(application.preset.target).toBe('material');
    expect(application.handle.spec.layers[0].generator.params).toEqual({ uvScale: [2, 2] });
  });

  it('lists default presets after reset', () => {
    expect(listPresets().map((preset) => preset.id)).toContain('tsl.compute.integrate');
  });
});
