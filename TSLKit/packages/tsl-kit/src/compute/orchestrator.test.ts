import { describe, expect, it, vi } from 'vitest';

import { ComputeOrchestrator } from './orchestrator.js';
import {
  GPUBindGroupLike,
  GPUCommandBufferLike,
  GPUComputePipelineLike,
  GPUDeviceLike,
} from './types.js';

type MockPass = {
  setPipeline: ReturnType<typeof vi.fn>;
  setBindGroup: ReturnType<typeof vi.fn>;
  dispatchWorkgroups: ReturnType<typeof vi.fn>;
  end: ReturnType<typeof vi.fn>;
};

type MockEncoder = {
  beginComputePass: ReturnType<typeof vi.fn>;
  finish: ReturnType<typeof vi.fn>;
};

type MockDevice = GPUDeviceLike & {
  createCommandEncoder: ReturnType<typeof vi.fn>;
  queue: GPUDeviceLike['queue'] & { submit: ReturnType<typeof vi.fn> };
};

function createMockDevice(): { device: MockDevice; pass: MockPass; encoder: MockEncoder; commandBuffer: GPUCommandBufferLike } {
  const pass: MockPass = {
    setPipeline: vi.fn(),
    setBindGroup: vi.fn(),
    dispatchWorkgroups: vi.fn(),
    end: vi.fn(),
  };

  const commandBuffer: GPUCommandBufferLike = { label: 'command-buffer' };

  const encoder: MockEncoder = {
    beginComputePass: vi.fn(() => pass),
    finish: vi.fn(() => commandBuffer),
  };

  const device = {
    createTexture: vi.fn(),
    createBuffer: vi.fn(),
    createCommandEncoder: vi.fn(() => encoder),
    queue: {
      writeBuffer: vi.fn(),
      submit: vi.fn(),
    },
  } as unknown as MockDevice;

  return { device, pass, encoder, commandBuffer };
}

describe('ComputeOrchestrator', () => {
  it('encodes dispatch steps in order', () => {
    const { device, pass, encoder, commandBuffer } = createMockDevice();
    const orchestrator = new ComputeOrchestrator(device);

    const pipelineA: GPUComputePipelineLike = { label: 'A' };
    const pipelineB: GPUComputePipelineLike = { label: 'B' };
    const bindGroupA: GPUBindGroupLike = { label: 'groupA' };
    const bindGroupB: GPUBindGroupLike = { label: 'groupB' };

    const result = orchestrator.submit([
      {
        label: 'step-a',
        pipeline: pipelineA,
        workgroupCount: [4, 1, 1],
        bindGroups: [{ index: 0, group: bindGroupA }],
      },
      {
        label: 'step-b',
        pipeline: pipelineB,
        workgroupCount: [2, 2, 1],
        bindGroups: [{ index: 1, group: bindGroupB }],
      },
    ]);

    expect(result).toBe(commandBuffer);
    expect(device.createCommandEncoder).toHaveBeenCalledTimes(1);
    expect(encoder.beginComputePass).toHaveBeenCalledTimes(2);

    expect(pass.setPipeline).toHaveBeenNthCalledWith(1, pipelineA);
    expect(pass.setBindGroup).toHaveBeenNthCalledWith(1, 0, bindGroupA);
    expect(pass.dispatchWorkgroups).toHaveBeenNthCalledWith(1, 4, 1, 1);

    expect(pass.setPipeline).toHaveBeenNthCalledWith(2, pipelineB);
    expect(pass.setBindGroup).toHaveBeenNthCalledWith(2, 1, bindGroupB);
    expect(pass.dispatchWorkgroups).toHaveBeenNthCalledWith(2, 2, 2, 1);

    expect(pass.end).toHaveBeenCalledTimes(2);
    expect(encoder.finish).toHaveBeenCalledTimes(1);
    expect(device.queue.submit).toHaveBeenCalledWith([commandBuffer]);
  });
});

