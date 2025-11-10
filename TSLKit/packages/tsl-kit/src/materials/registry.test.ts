import { describe, expect, it } from 'vitest';

import { buildMaterialPreset, getMaterialMetadata } from './index.js';

describe('materialsRegistry', () => {
  it('exposes built-in metadata', () => {
    const metadata = getMaterialMetadata();

    expect(Array.isArray(metadata)).toBe(true);
    const list = Array.isArray(metadata) ? metadata : [metadata];
    expect(list.some((entry) => entry.id === 'tsl.material.concrete')).toBe(true);
    expect(list.some((entry) => entry.id === 'tsl.material.bricks')).toBe(true);
    expect(list.some((entry) => entry.id === 'tsl.material.marble')).toBe(true);
    expect(list.some((entry) => entry.id === 'tsl.material.opacityTest')).toBe(true);
    expect(list.some((entry) => entry.id === 'tsl.material.satin')).toBe(true);
    expect(list.some((entry) => entry.id === 'tsl.material.wood')).toBe(true);
  });

  it('builds presets with overrides', () => {
    const { spec, material } = buildMaterialPreset('tsl.material.concrete', { accentWeight: 0.5 });

    expect(spec.layers).toHaveLength(3);
    expect(spec.opacity).toBe(1);
    expect(material.isMeshPhysicalNodeMaterial).toBe(true);
  });
});
