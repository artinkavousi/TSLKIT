import { describe, expect, it } from 'vitest';

import {
  bricksMetadata,
  bricksSchema,
  createBricksMaterial,
  createMarbleMaterial,
  createSatinMaterial,
  createWoodMaterial,
  marbleMetadata,
  marbleSchema,
  satinMetadata,
  satinSchema,
  woodMetadata,
  woodSchema
} from './index.js';

type SchemaWithDefaults = {
  properties: Record<string, { default?: unknown }>;
};

function expectDefaultsMatch(metadata: { schema: Record<string, unknown> }, defaults: Record<string, unknown>): void {
  const schema = metadata.schema as SchemaWithDefaults;
  const entries = Object.entries(schema.properties ?? {});

  entries.forEach(([key, value]) => {
    if (value.default !== undefined) {
      expect(defaults[key]).toEqual(value.default);
    }
  });
}

describe('material preset defaults', () => {
  it('matches defaults for bricks', () => {
    const defaults = bricksSchema.parse({});
    expectDefaultsMatch(bricksMetadata, defaults);
  });

  it('matches defaults for marble', () => {
    const defaults = marbleSchema.parse({});
    expectDefaultsMatch(marbleMetadata, defaults);
  });

  it('matches defaults for satin', () => {
    const defaults = satinSchema.parse({});
    expectDefaultsMatch(satinMetadata, defaults);
  });

  it('matches defaults for wood', () => {
    const defaults = woodSchema.parse({});
    expectDefaultsMatch(woodMetadata, defaults);
  });
});

describe('material preset factories', () => {
  it('creates a bricks material', () => {
    const result = createBricksMaterial();

    expect(result.spec.layers).toHaveLength(4);
    expect(result.material.isMeshPhysicalNodeMaterial).toBe(true);
  });

  it('creates a marble material', () => {
    const result = createMarbleMaterial();

    expect(result.spec.layers).toHaveLength(4);
    expect(result.material.isMeshPhysicalNodeMaterial).toBe(true);
  });

  it('creates a satin material', () => {
    const result = createSatinMaterial();

    expect(result.spec.layers).toHaveLength(4);
    expect(result.material.isMeshPhysicalNodeMaterial).toBe(true);
  });

  it('creates a wood material', () => {
    const result = createWoodMaterial();

    expect(result.spec.layers).toHaveLength(4);
    expect(result.material.isMeshPhysicalNodeMaterial).toBe(true);
  });
});
