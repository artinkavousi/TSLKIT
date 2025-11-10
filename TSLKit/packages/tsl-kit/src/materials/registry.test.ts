import { describe, expect, it } from 'vitest';

import { buildMaterialPreset, getMaterialMetadata, getMaterialSchema } from './index.js';

describe('materialsRegistry', () => {
  it('exposes built-in metadata', () => {
    const metadata = getMaterialMetadata();

    expect(Array.isArray(metadata)).toBe(true);
    const list = Array.isArray(metadata) ? metadata : [metadata];
    expect(list.some((entry) => entry.id === 'tsl.material.concrete')).toBe(true);
    expect(list.some((entry) => entry.id === 'tsl.material.opacityTest')).toBe(true);
  });

  it('builds presets with overrides', () => {
    const { spec, material } = buildMaterialPreset('tsl.material.concrete', { accentWeight: 0.5 });

    expect(spec.layers).toHaveLength(3);
    expect(spec.opacity).toBe(1);
    expect(material.isMeshPhysicalNodeMaterial).toBe(true);
  });

  it('provides schema accessors', () => {
    const schema = getMaterialSchema('tsl.material.concrete');
    expect(schema).toBeDefined();

    const collection = getMaterialSchema();
    expect(typeof collection).toBe('object');
  });
});
