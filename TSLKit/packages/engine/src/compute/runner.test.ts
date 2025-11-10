import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { createFluidSimulationFactory, createParticleSystemFactory } from '@tslstudio/tsl-kit/compute';

import { ComputeRunner } from './runner.js';

beforeAll(() => {
  (globalThis as any).GPUBufferUsage = {
    STORAGE: 1 << 0,
    COPY_DST: 1 << 1,
    COPY_SRC: 1 << 2,
    UNIFORM: 1 << 3,
  };
});

afterAll(() => {
  delete (globalThis as any).GPUBufferUsage;
});

function createFakeGPUBuffer(label: string): GPUBuffer {
  return {
    label,
    size: 0,
    usage: 0,
    destroy: vi.fn(),
    mapAsync: vi.fn(),
    getMappedRange: vi.fn(),
    unmap: vi.fn(),
  } as unknown as GPUBuffer;
}

function createFakeCommandEncoder(): GPUCommandEncoder {
  const pass = {
    setPipeline: vi.fn(),
    setBindGroup: vi.fn(),
    dispatchWorkgroups: vi.fn(),
    end: vi.fn(),
  };

  return {
    beginComputePass: vi.fn(() => pass as unknown as GPUComputePassEncoder),
    finish: vi.fn(() => ({ label: 'command-buffer' }) as unknown as GPUCommandBuffer),
  } as unknown as GPUCommandEncoder;
}

function createFakeDevice() {
  const queue = {
    submit: vi.fn(),
    writeBuffer: vi.fn(),
  };

  const pipeline = {
    getBindGroupLayout: vi.fn(() => ({ label: 'layout' }) as unknown as GPUBindGroupLayout),
  };

  return {
    queue,
    createBuffer: vi.fn((descriptor: GPUBufferDescriptor) => createFakeGPUBuffer(descriptor.label ?? 'buffer')),
    createBindGroup: vi.fn(() => ({ label: 'bindGroup' }) as unknown as GPUBindGroup),
    createShaderModule: vi.fn(() => ({ label: 'shaderModule' }) as unknown as GPUShaderModule),
    createComputePipeline: vi.fn(() => pipeline as unknown as GPUComputePipeline),
    createCommandEncoder: vi.fn(() => createFakeCommandEncoder()),
  } as unknown as GPUDevice;
}

describe('ComputeRunner', () => {
  it('executes compute tasks before rendering and notifies the post chain', async () => {
    const device = createFakeDevice();
    const particleFactory = createParticleSystemFactory();
    const fluidFactory = createFluidSimulationFactory();

    const particles = particleFactory.create(device, { capacity: 256, emitterRadius: 4 });
    const fluid = fluidFactory.create(device, { resolution: [16, 16] });

    const events: string[] = [];
    const postEvaluate = vi.fn((timestamp: number, context) => {
      events.push(`post:${timestamp}:${context.frameIndex}`);
    });

    const runner = new ComputeRunner(device, () => {
      events.push('render');
    }, {
      postChain: { evaluate: postEvaluate },
      onDispatch: (tasks) => {
        events.push(`dispatch:${tasks.map((task) => task.id).join(',')}`);
      },
    });

    await runner.initialize([particles.initTask, fluid.initTask], 0);

    expect(events).toContain('dispatch:tsl.compute.particles:init,tsl.compute.fluid:init');
    expect(device.queue.submit).toHaveBeenCalledTimes(1);

    const initialParticlePositionWrite = particles.positions.write;
    const initialFluidVelocityWrite = fluid.velocity.write;

    runner.register(particles.updateTask);
    runner.register(fluid.updateTask);

    await runner.frame(16);

    expect(events).toContain('render');
    expect(events).toContain('dispatch:tsl.compute.particles:update,tsl.compute.fluid:update');
    expect(postEvaluate).toHaveBeenCalledWith(16, expect.objectContaining({ frameIndex: 0 }));
    expect(device.queue.submit).toHaveBeenCalledTimes(2);

    expect(particles.positions.read).toBe(initialParticlePositionWrite);
    expect(fluid.velocity.read).toBe(initialFluidVelocityWrite);
  });
});
