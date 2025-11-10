import { describe, expect, it } from 'vitest';

import { createFluidKernel } from './fluid.js';

describe('fluid kernel', () => {
  const createKernel = () =>
    createFluidKernel({
      particleCount: 4,
      separation: 10,
      gridScale: 0.5,
      heightAmplitude: 2,
      sizeAmplitude: 1,
      frequencyX: 1,
      frequencyZ: 0.5,
      timeScale: 2,
      workgroupSize: 2,
    });

  it('initialises grid positions', () => {
    const kernel = createKernel();
    kernel.dispatches.init.cpu(kernel.state);

    expect(Array.from(kernel.state.positions)).toEqual([
      10, 0, 10,
      0, 0, 10,
      10, 0, 0,
      0, 0, 0,
    ]);
  });

  it('updates heights and sprite scales', () => {
    const kernel = createKernel();
    kernel.dispatches.init.cpu(kernel.state);

    kernel.dispatches.update.cpu(kernel.state, { time: 0.25 });

    const { positions, sizes } = kernel.state;

    expect(positions[1]).toBeCloseTo(3.358, 3);
    expect(sizes[0]).toBeCloseTo(3.679, 3);
    expect(sizes[1]).toBeCloseTo(sizes[0]);
    expect(sizes[2]).toBeCloseTo(sizes[0]);
  });
});

