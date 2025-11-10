import { describe, expect, it } from 'vitest';

import { applyMaterialOverrides, createMaterialPresetSnapshot } from './preset.js';

const baseDefinition = {
  id: 'tsl.materials.test',
  label: 'Test Material',
  parameters: {
    color: {
      type: 'color',
      default: '#ffffff'
    },
    roughness: {
      type: 'number',
      min: 0,
      max: 1,
      default: 0.5
    }
  }
} as const;

describe('material presets', () => {
  it('creates a snapshot from a definition', () => {
    const snapshot = createMaterialPresetSnapshot(baseDefinition);

    expect(snapshot).toMatchObject({
      id: 'tsl.materials.test',
      label: 'Test Material'
    });
  });

  it('applies overrides on top of the snapshot', () => {
    const snapshot = createMaterialPresetSnapshot(baseDefinition);

    const overridden = applyMaterialOverrides(snapshot, {
      label: 'Custom Label',
      parameters: {
        roughness: {
          type: 'number',
          min: 0,
          max: 1,
          default: 0.75
        }
      }
    });

    expect(overridden.label).toBe('Custom Label');
    expect(overridden.parameters.roughness.default).toBe(0.75);
  });
});
