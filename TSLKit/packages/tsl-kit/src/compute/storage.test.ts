import { describe, expect, it, vi } from 'vitest';

import { createStorageBuffer, writeStorageBuffer } from './storage.js';
import { GPUBufferDescriptorLike, GPUBufferLike, GPUDeviceLike, GPUQueueLike } from './types.js';

const FALLBACK_GPU_BUFFER_USAGE: Record<string, number> = {
  MAP_READ: 0x0001,
  MAP_WRITE: 0x0002,
  COPY_SRC: 0x0004,
  COPY_DST: 0x0008,
  INDEX: 0x0010,
  VERTEX: 0x0020,
  UNIFORM: 0x0040,
  STORAGE: 0x0080,
  INDIRECT: 0x0100,
  QUERY_RESOLVE: 0x0200,
};

function usageFlag(name: keyof typeof FALLBACK_GPU_BUFFER_USAGE): number {
  const usage = (globalThis as typeof globalThis & { GPUBufferUsage?: Record<string, number> }).GPUBufferUsage;
  return usage?.[name] ?? FALLBACK_GPU_BUFFER_USAGE[name];
}

type MockBuffer = GPUBufferLike & { getMappedRange?: () => ArrayBuffer; unmap?: () => void };

type MockDevice = GPUDeviceLike & {
  createBuffer: ReturnType<typeof vi.fn>;
  queue: GPUQueueLike & { writeBuffer: ReturnType<typeof vi.fn> };
};

function createMockDevice(buffer: MockBuffer): MockDevice {
  return {
    createTexture: vi.fn(),
    createCommandEncoder: vi.fn(),
    createBuffer: vi.fn(() => buffer),
    queue: {
      writeBuffer: vi.fn(),
      submit: vi.fn(),
    },
  } as unknown as MockDevice;
}

describe('createStorageBuffer', () => {
  it('applies default usage flags and uploads data', () => {
    const backing = { label: undefined, size: 32 } as MockBuffer;
    const device = createMockDevice(backing);
    const data = new Float32Array([1, 2, 3, 4]);

    const buffer = createStorageBuffer(device, {
      label: 'positions',
      size: data.byteLength,
      initialData: data,
    });

    expect(buffer).toBe(backing);

    const descriptor = device.createBuffer.mock.calls[0][0] as GPUBufferDescriptorLike;
    const expectedUsage = usageFlag('STORAGE') | usageFlag('COPY_SRC') | usageFlag('COPY_DST');
    expect(descriptor.usage).toBe(expectedUsage);
    expect(descriptor.label).toBe('positions');

    expect(device.queue.writeBuffer).toHaveBeenCalledWith(
      backing,
      0,
      data.buffer,
      data.byteOffset,
      data.byteLength,
    );
  });

  it('writes into mapped ranges when supported', () => {
    const mapped = new ArrayBuffer(16);
    const backing: MockBuffer = {
      label: 'mapped',
      size: 16,
      getMappedRange: vi.fn(() => mapped),
      unmap: vi.fn(),
    };
    const device = createMockDevice(backing);
    const data = new Uint8Array([1, 2, 3, 4]);

    createStorageBuffer(device, {
      label: 'mapped',
      size: mapped.byteLength,
      initialData: data,
      mappedAtCreation: true,
    });

    expect(backing.getMappedRange).toHaveBeenCalledTimes(1);
    expect(new Uint8Array(mapped)).toEqual(new Uint8Array([1, 2, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    expect(backing.unmap).toHaveBeenCalledTimes(1);
    expect(device.queue.writeBuffer).not.toHaveBeenCalled();
  });
});

describe('writeStorageBuffer', () => {
  it('delegates to the GPU queue', () => {
    const queue = {
      writeBuffer: vi.fn(),
      submit: vi.fn(),
    } as unknown as GPUQueueLike & { writeBuffer: ReturnType<typeof vi.fn> };
    const buffer = { label: 'buffer', size: 8 } as GPUBufferLike;
    const data = new Uint32Array([42]);

    writeStorageBuffer(queue, buffer, data, 4);

    expect(queue.writeBuffer).toHaveBeenCalledWith(
      buffer,
      4,
      data.buffer,
      data.byteOffset,
      data.byteLength,
    );
  });
});

