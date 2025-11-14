import { describe, expect, it } from 'vitest';

import { createFluidAdvectionPreset } from '../compute/fluid';
import { createParticleSwarmPreset } from '../compute/particles';

describe('compute presets', () => {
  it('configures particle swarm pipeline with spawn and step kernels', () => {
    const preset = createParticleSwarmPreset({ particleCount: 1024 });
    expect(preset.pipeline.kernels).toHaveLength(2);
    const labels = preset.pipeline.kernels.map((kernel) => kernel.label);
    expect(labels).toContain('particle-spawn');
    expect(labels).toContain('particle-step');
    expect(preset.pipeline.kernels[0].dispatchSize[0]).toBeGreaterThan(0);
  });

  it('configures fluid advection with pressure projection', () => {
    const preset = createFluidAdvectionPreset({ resolution: 64 });
    expect(preset.pipeline.kernels.map((kernel) => kernel.label)).toContain('pressure-project');
    expect(preset.timeline.stepsPerFrame).toBeGreaterThan(1);
    expect(preset.pipeline.persistentBuffers).toEqual(expect.arrayContaining(['velocity', 'pressure', 'density']));
  });
});
