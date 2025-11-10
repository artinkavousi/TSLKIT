import { PingPongResource } from './pingPong.js';

export interface StorageBufferDescriptor {
  label: string;
  channels: number;
  width: number;
  height?: number;
  depth?: number;
  usage?: GPUBufferUsageFlags;
}

function getDimensionValue(value: number | undefined, fallback: number): number {
  return value !== undefined ? value : fallback;
}

export function createStorageBuffer(device: GPUDevice, descriptor: StorageBufferDescriptor): GPUBuffer {
  const { label, channels, width } = descriptor;
  const height = getDimensionValue(descriptor.height, 1);
  const depth = getDimensionValue(descriptor.depth, 1);
  const usage = descriptor.usage ?? GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC;

  const elementCount = Math.max(1, Math.trunc(width) * Math.trunc(height) * Math.trunc(depth));
  const bufferSize = 4 * channels * elementCount;

  return device.createBuffer({
    label,
    size: bufferSize,
    usage,
  });
}

export class DoubleStorageBuffer extends PingPongResource<GPUBuffer> {
  constructor(device: GPUDevice, descriptor: StorageBufferDescriptor) {
    super([
      createStorageBuffer(device, { ...descriptor, label: `${descriptor.label}:read` }),
      createStorageBuffer(device, { ...descriptor, label: `${descriptor.label}:write` }),
    ]);
  }
}
