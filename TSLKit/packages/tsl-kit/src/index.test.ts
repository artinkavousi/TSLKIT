import { describe, expect, it } from 'vitest';

import * as Kit from './index.js';

describe('tsl-kit public API', () => {
  it('exposes noise, sdf and compute helpers', () => {
    expect(typeof Kit.evaluateNoiseSpec).toBe('function');
    expect(typeof Kit.smoothUnion).toBe('function');
    expect(typeof Kit.sdSphere).toBe('function');
    expect(typeof Kit.noiseSchema).toBeDefined();
    expect(typeof Kit.createParticleSystemFactory).toBe('function');
    expect(typeof Kit.createFluidSimulationFactory).toBe('function');
  });
});
