import { describe, expect, it, vi } from 'vitest';

import { createPingPongTargets, createPingPongTextures, createPingPongTextureViews } from './pingPong.js';
import {
  GPUDeviceLike,
  GPUTextureDescriptorLike,
  GPUTextureLike,
  GPUTextureViewLike,
} from './types.js';

type MockDevice = GPUDeviceLike & {
  createTexture: ReturnType<typeof vi.fn>;
  queue: {
    writeBuffer: ReturnType<typeof vi.fn>;
    submit: ReturnType<typeof vi.fn>;
  };
};

function createMockDevice(): MockDevice {
  const createTexture = vi.fn((descriptor: GPUTextureDescriptorLike) => {
    const texture: GPUTextureLike = {
      label: descriptor.label,
      createView: vi.fn(() => ({ label: `${descriptor.label}-view` }) as GPUTextureViewLike),
    };
    return texture;
  });

  return {
    createTexture,
    createBuffer: vi.fn(),
    createCommandEncoder: vi.fn(),
    queue: {
      writeBuffer: vi.fn(),
      submit: vi.fn(),
    },
  } as unknown as MockDevice;
}

describe('createPingPongTargets', () => {
  it('swaps read/write roles', () => {
    const targets = createPingPongTargets(role => ({ role }));
    expect(targets.read.role).toBe('read');
    expect(targets.write.role).toBe('write');

    targets.swap();

    expect(targets.read.role).toBe('write');
    expect(targets.write.role).toBe('read');
  });
});

describe('createPingPongTextures', () => {
  it('creates labelled read/write textures', () => {
    const device = createMockDevice();
    const textures = createPingPongTextures(device, {
      label: 'particles',
      size: [4, 4, 1],
      format: 'rgba8unorm',
      usage: 0,
    });

    expect(device.createTexture).toHaveBeenCalledTimes(2);
    expect(textures.read.label).toBe('particles:read');
    expect(textures.write.label).toBe('particles:write');

    textures.swap();
    expect(textures.read.label).toBe('particles:write');
    expect(textures.write.label).toBe('particles:read');
  });

  it('creates mirrored texture views', () => {
    const device = createMockDevice();
    const textures = createPingPongTextures(device, {
      label: 'fluid',
      size: [8, 8, 1],
      format: 'rgba16float',
      usage: 0,
    });

    const views = createPingPongTextureViews(textures);
    expect(views.read.label).toBe('fluid:read-view');
    expect(views.write.label).toBe('fluid:write-view');

    textures.swap();
    const swappedViews = createPingPongTextureViews(textures);
    expect(swappedViews.read.label).toBe('fluid:write-view');
    expect(swappedViews.write.label).toBe('fluid:read-view');
  });
});

