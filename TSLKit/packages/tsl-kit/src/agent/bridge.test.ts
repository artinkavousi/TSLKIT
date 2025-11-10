import { beforeEach, describe, expect, it } from 'vitest';
import { AgentBridge } from './bridge.js';
import { clearRegistry } from '../registry.js';

const bridge = new AgentBridge();

beforeEach(() => {
  clearRegistry();
});

describe('AgentBridge automation responses', () => {
  it('returns structured material handle on success', () => {
    const response = bridge.execute({
      command: 'makeMaterial',
      payload: {
        name: 'Procedural Matte',
        model: 'pbr',
        layers: [
          {
            id: 'albedo',
            type: 'baseColor',
            generator: { kind: 'texture', ref: 'albedo', params: {} },
            inputs: {}
          }
        ]
      }
    });

    expect(response.ok).toBe(true);
    if (response.ok) {
      expect(response.command).toBe('makeMaterial');
      expect(response.handle.kind).toBe('material');
      expect(response.summary).toContain('Procedural Matte');
    }
  });

  it('surfaces validation errors', () => {
    const response = bridge.execute({
      command: 'makeMaterial',
      payload: { name: 'invalid', model: 'pbr', layers: [] }
    });

    expect(response.ok).toBe(false);
    if (!response.ok) {
      expect(response.errors[0].message).toMatch(/at least one layer/i);
    }
  });

  it('applies presets through the registry', () => {
    const response = bridge.execute({
      command: 'applyPreset',
      preset: 'tsl.post.cinematic',
      overrides: {
        name: 'Cinematic Adjusted',
        passes: [
          { id: 'grade', effect: 'colorGrade', inputs: { lut: 'filmic' } },
          { id: 'vignette', effect: 'vignette', priority: 2 }
        ]
      }
    });

    expect(response.ok).toBe(true);
    if (response.ok) {
      expect(response.command).toBe('applyPreset');
      expect(response.target).toBe('post');
      expect(response.summary).toContain('applyPreset');
    }
  });
});
