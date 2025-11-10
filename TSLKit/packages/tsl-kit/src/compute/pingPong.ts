import {
  PingPongTarget,
  GPUDeviceLike,
  GPUTextureLike,
  GPUTextureDescriptorLike,
  GPUTextureViewDescriptorLike,
  GPUTextureViewLike,
} from './types.js';

export type PingPongInitializer<T> = (role: 'read' | 'write') => T;

export function createPingPongTargets<T>(initializer: PingPongInitializer<T>): PingPongTarget<T> {
  let read = initializer('read');
  let write = initializer('write');

  return {
    get read(): T {
      return read;
    },
    get write(): T {
      return write;
    },
    swap(): void {
      [read, write] = [write, read];
    },
    map<U>(callback: (target: T, role: 'read' | 'write') => U): [U, U] {
      return [callback(read, 'read'), callback(write, 'write')];
    },
  };
}

export interface PingPongTextureDescriptor extends GPUTextureDescriptorLike {
  label?: string;
}

export type PingPongTextures = PingPongTarget<GPUTextureLike>;

export function createPingPongTextures(device: GPUDeviceLike, descriptor: PingPongTextureDescriptor): PingPongTextures {
  const { label = 'ping-pong-texture', ...rest } = descriptor;

  return createPingPongTargets(role =>
    device.createTexture({
      ...rest,
      label: `${label}:${role}`,
    }),
  );
}

export function createPingPongTextureViews(
  textures: PingPongTextures,
  descriptor?: GPUTextureViewDescriptorLike,
): PingPongTarget<GPUTextureViewLike> {
  return createPingPongTargets(role => (role === 'read' ? textures.read : textures.write).createView(descriptor));
}

