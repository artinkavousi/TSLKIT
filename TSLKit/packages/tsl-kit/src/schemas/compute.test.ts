import { describe, expect, it } from 'vitest';

import { computeDispatchSchema, computeSpecSchema } from './compute.js';

describe('computeSpecSchema', () => {
  it('parses explicit dispatch tuples', () => {
    const parsed = computeSpecSchema.parse({
      id: 'compute.blur',
      label: 'Gaussian Blur',
      description: 'Performs a separable blur over an input texture.',
      workgroupSize: [8, 8, 1],
      dispatch: [32, 32, 1],
      parameters: [
        {
          type: 'number',
          name: 'radius',
          label: 'Radius',
          defaultValue: 5,
          min: 1,
          max: 25,
          step: 1
        }
      ],
      bindings: [
        {
          name: 'inputTexture',
          resource: 'texture',
          access: 'read'
        }
      ],
      outputs: ['blurredTexture'],
      tags: ['post'],
      schema: {
        module: 'compute',
        name: 'computeSpec',
        version: '1.0.0'
      }
    });

    expect(parsed.dispatch).toEqual({ x: 32, y: 32, z: 1 });
    expect(parsed.bindings[0].resource).toBe('texture');
  });

  it('accepts object based dispatch definitions', () => {
    const result = computeDispatchSchema.safeParse({ x: 4, y: 2, z: 1 });
    expect(result.success).toBe(true);
  });
});
