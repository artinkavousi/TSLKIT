import { describe, expect, it } from 'vitest';

import { materialPresetSchema, presetParameterSchema, schemaReferenceSchema } from './materials.js';

describe('materialPresetSchema', () => {
  it('parses a full preset definition', () => {
    const parsed = materialPresetSchema.parse({
      id: 'material.example',
      kind: 'material',
      name: 'Example Material',
      version: '1.0.0',
      description: 'Demonstration preset for tests.',
      tags: ['demo'],
      previewColor: '#ffffff',
      previewGeometry: 'sphere',
      parameters: [
        {
          type: 'number',
          name: 'roughness',
          label: 'Roughness',
          description: 'Controls microfacet distribution.',
          defaultValue: 0.5,
          min: 0,
          max: 1,
          step: 0.01
        },
        {
          type: 'color',
          name: 'tint',
          label: 'Tint',
          defaultValue: '#ff0000'
        }
      ],
      noiseSpec: {
        type: 'simplex',
        frequency: 2
      },
      schema: {
        module: 'materials',
        name: 'materialPreset',
        version: '1.0.0'
      },
      createdAt: '2024-05-17T10:00:00.000Z',
      updatedAt: '2024-05-17T10:00:00.000Z',
      suitability: ['realtime']
    });

    expect(parsed.parameters).toHaveLength(2);
    expect(parsed.noiseSpec?.type).toBe('simplex');
    expect(parsed.schema.module).toBe('materials');
  });

  it('rejects invalid schema references', () => {
    expect(() =>
      schemaReferenceSchema.parse({
        module: 'materials',
        name: '',
        version: '1.0.0'
      })
    ).toThrowError();
  });

  it('validates parameter definitions', () => {
    const result = presetParameterSchema.safeParse({
      type: 'number',
      name: 'scale',
      label: 'Scale',
      defaultValue: 1
    });

    expect(result.success).toBe(true);
  });
});
