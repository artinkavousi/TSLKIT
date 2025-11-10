import { describe, expect, it } from 'vitest';

import { createParticleKernel } from './particles.js';

const closeTo = (value: number, expected: number, precision = 3) => expect(value).toBeCloseTo(expected, precision);

describe('particle kernel', () => {
  const createKernel = () =>
    createParticleKernel({
      particleCount: 4,
      separation: 1,
      gravity: -1,
      bounce: 0.5,
      friction: 0.5,
      floorY: 0,
      floorDrag: 0.5,
      workgroupSize: 2,
      hitRadius: 2,
      hitStrength: 1,
      hitJitter: 0,
      seed: 2,
    });

  it('initialises grid-aligned positions and colours', () => {
    const kernel = createKernel();
    kernel.dispatches.init.cpu(kernel.state);

    const { positions, velocities, colors } = kernel.state;

    expect(Array.from(positions.slice(0, 12))).toEqual([
      1, 0, 1,
      0, 0, 1,
      1, 0, 0,
      0, 0, 0,
    ]);
    expect(Array.from(velocities)).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    for (const channel of colors) {
      expect(channel).toBeGreaterThanOrEqual(0);
      expect(channel).toBeLessThanOrEqual(1);
    }
  });

  it('applies gravity, friction, and floor interactions', () => {
    const kernel = createKernel();
    kernel.dispatches.init.cpu(kernel.state);

    kernel.dispatches.update.cpu(kernel.state, {
      deltaSeconds: 1,
      acceleration: [0, -1, 0],
    });

    const { positions, velocities } = kernel.state;

    expect(positions[1]).toBe(0);
    expect(velocities[1]).toBeGreaterThan(0);
    closeTo(velocities[1], 0.25, 3);
  });

  it('pushes particles away from an impulse', () => {
    const kernel = createKernel();
    kernel.dispatches.init.cpu(kernel.state);
    kernel.dispatches.update.cpu(kernel.state, {
      deltaSeconds: 1,
      acceleration: [0, -1, 0],
    });

    const { velocities } = kernel.state;
    const preHitVelocityX = velocities[0];

    kernel.dispatches.hit.cpu(kernel.state, {
      origin: [0, 0, 0],
      radius: 2,
      strength: 1,
      jitter: 0,
    });

    expect(velocities[0]).toBeGreaterThan(preHitVelocityX);
    closeTo(velocities[0], preHitVelocityX + 0.207, 2);
  });
});

