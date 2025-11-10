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

const DEFAULT_STORAGE_USAGE = usageFlag('STORAGE') | usageFlag('COPY_SRC') | usageFlag('COPY_DST');

export interface StorageBufferDescriptor extends GPUBufferDescriptorLike {
  label?: string;
  initialData?: ArrayBufferView;
}

export function createStorageBuffer(device: GPUDeviceLike, descriptor: StorageBufferDescriptor): GPUBufferLike {
  const { initialData, usage, label, size, mappedAtCreation = false, ...rest } = descriptor;

  const buffer = device.createBuffer({
    ...rest,
    label,
    size,
    usage: usage ?? DEFAULT_STORAGE_USAGE,
    mappedAtCreation,
  });

  if (initialData) {
    if (mappedAtCreation && 'getMappedRange' in (buffer as object) && typeof (buffer as { getMappedRange?: unknown }).getMappedRange === 'function') {
      const mapped = (buffer as unknown as { getMappedRange(offset?: number, size?: number): ArrayBuffer }).getMappedRange();
      new Uint8Array(mapped).set(new Uint8Array(initialData.buffer, initialData.byteOffset, initialData.byteLength));
      if ('unmap' in (buffer as object) && typeof (buffer as { unmap?: () => void }).unmap === 'function') {
        (buffer as unknown as { unmap(): void }).unmap();
      }
    } else {
      device.queue.writeBuffer(buffer, 0, initialData.buffer, initialData.byteOffset, initialData.byteLength);
    }
  }

  return buffer;
}

export function writeStorageBuffer(
  queue: GPUQueueLike,
  buffer: GPUBufferLike,
  data: ArrayBufferView,
  offset = 0,
): void {
  queue.writeBuffer(buffer, offset, data.buffer, data.byteOffset, data.byteLength);
}

