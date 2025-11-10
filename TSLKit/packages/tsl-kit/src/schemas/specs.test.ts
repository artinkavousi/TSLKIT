import { describe, expect, it } from 'vitest';
import {
  computeSpecSchema,
  materialSpecSchema,
  postChainSpecSchema,
  presetSchema
} from './index.js';

const baseMaterial = {
  name: 'Example Matte',
  model: 'pbr',
  layers: [
    {
      id: 'base',
      type: 'baseColor',
      generator: { kind: 'texture', ref: 'albedo', params: { uvScale: [1, 1] } },
      inputs: {}
    }
  ]
};

describe('schema expansion', () => {
  it('normalizes material defaults', () => {
    const result = materialSpecSchema.parse(baseMaterial);
    expect(result.layers[0].blend).toBe('mix');
    expect(result.metadata.tags).toEqual([]);
    expect(result.uniforms).toEqual([]);
  });

  it('rejects material without layers', () => {
    expect(() => materialSpecSchema.parse({ name: 'bad', model: 'pbr', layers: [] })).toThrow(
      /at least one layer/i
    );
  });

  it('parses post-processing chains', () => {
    const parsed = postChainSpecSchema.parse({
      name: 'Cinematic',
      passes: [
        { id: 'grade', effect: 'colorGrade', inputs: { lut: 'filmic' } },
        { id: 'vignette', effect: 'vignette', priority: 1 }
      ]
    });

    expect(parsed.passes).toHaveLength(2);
    expect(parsed.output).toBe('screen');
  });

  it('parses compute specs from tuple dispatch', () => {
    const parsed = computeSpecSchema.parse({
      name: 'IntegrateParticles',
      entry: 'integrate',
      workgroupSize: [8, 4, 1],
      dispatch: [32, 16, 1],
      resources: [
        { name: 'positions', binding: 0, kind: 'storage' },
        { name: 'velocities', binding: 1, kind: 'storage', access: 'read-write' }
      ]
    });

    expect(parsed.dispatch).toEqual({ x: 32, y: 16, z: 1 });
    expect(parsed.workgroupSize).toEqual({ x: 8, y: 4, z: 1 });
  });

  it('supports preset discrimination', () => {
    const preset = presetSchema.parse({
      id: 'tsl.materials.matte',
      target: 'material',
      spec: baseMaterial
    });

    expect(preset.target).toBe('material');
  });
});
