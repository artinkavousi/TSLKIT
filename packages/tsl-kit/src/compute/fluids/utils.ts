/**
 * Utility classes and functions for fluid simulation
 * @module compute/fluids/utils
 */

import { UniformField } from './types';

/**
 * Generate a unique ID using crypto API
 */
export function uniqueId(): string {
  return crypto.randomUUID();
}

/**
 * Create a storage buffer for GPU compute
 */
export function createStorageBuffer(
  device: GPUDevice,
  label: string,
  channels: number,
  width: number,
  height: number,
  depth: number = 1
): GPUBuffer {
  return device.createBuffer({
    label,
    size: 4 * channels * width * height * depth,
    usage: GPUBufferUsage.STORAGE,
  });
}

/**
 * Double-buffered storage buffer for ping-pong compute operations
 */
export class DoubleStorageBuffer {
  read: GPUBuffer;
  write: GPUBuffer;

  constructor(
    device: GPUDevice,
    label: string,
    channels: number,
    width: number,
    height: number,
    depth: number = 1
  ) {
    this.read = createStorageBuffer(device, `${label}_1`, channels, width, height, depth);
    this.write = createStorageBuffer(device, `${label}_2`, channels, width, height, depth);
  }

  /**
   * Swap read and write buffers
   */
  swap(): void {
    const tmp = this.read;
    this.read = this.write;
    this.write = tmp;
  }

  /**
   * Destroy both buffers
   */
  destroy(): void {
    this.read.destroy();
    this.write.destroy();
  }
}

/**
 * Uniform buffer with automatic struct generation
 */
export class UniformBuffer {
  label: string;
  propDefinitions: Record<string, 'f32' | 'u32' | 'i32'>;
  values: Record<string, number | null>;
  fields: UniformField[];
  struct: string;
  gpuBuffer: GPUBuffer;
  littleEndian: boolean;
  arrayBuffer?: ArrayBuffer;
  dataView?: DataView;

  constructor(
    device: GPUDevice,
    label: string,
    name: string,
    propDefinitions: Record<string, 'f32' | 'u32' | 'i32'>,
    props?: Record<string, number>
  ) {
    this.label = label;
    this.propDefinitions = propDefinitions;
    this.values = {};
    this.fields = [];

    // Build struct string
    let structFields = '';
    for (const [key, type] of Object.entries(propDefinitions)) {
      if (!['f32', 'u32', 'i32'].includes(type)) {
        throw new Error(`Invalid type for ${key}: ${type}`);
      }
      structFields += `\t${key} : ${type},\n`;
      this.fields.push({ name: key, type });
      this.values[key] = null;
    }

    this.struct = `struct ${name} {\n${structFields}}`;

    // Check endianness
    const a = new Uint32Array([0x12345678]);
    const b = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
    this.littleEndian = b[0] !== 0x12;

    // Create GPU buffer
    this.gpuBuffer = device.createBuffer({
      label: this.label,
      size: 4 * this.fields.length,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      mappedAtCreation: !!props,
    });

    // Initialize with props if provided
    if (props) {
      this.updateProps(props);
      const buffer = this.gpuBuffer.getMappedRange();
      this.updateView(new DataView(buffer, 0));
      this.gpuBuffer.unmap();
    }
  }

  /**
   * Update property values
   */
  updateProps(newProps: Record<string, number>): void {
    for (const key of Object.keys(newProps)) {
      if (!(key in this.values)) {
        throw new Error(`Invalid uniform prop ${key}`);
      }
      if (newProps[key] === undefined) {
        throw new Error(`Undefined value for prop ${key}`);
      }
      this.values[key] = newProps[key];
    }
  }

  /**
   * Update DataView with current values
   */
  updateView(view: DataView): void {
    for (let i = 0; i < this.fields.length; i++) {
      const type = this.fields[i].type;
      const value = this.values[this.fields[i].name];
      
      if (value === null || value === undefined) {
        throw new Error(`Undefined value for ${this.fields[i].name}`);
      }

      if (type === 'f32') {
        view.setFloat32(i * 4, parseFloat(value.toString()), this.littleEndian);
      } else if (type === 'u32') {
        view.setUint32(i * 4, value, this.littleEndian);
      } else {
        view.setInt32(i * 4, value, this.littleEndian);
      }
    }
  }

  /**
   * Async update GPU buffer with new values
   */
  async update(device: GPUDevice, newProps: Record<string, number>): Promise<void> {
    if (!this.arrayBuffer) {
      this.arrayBuffer = new ArrayBuffer(this.fields.length * 4);
      this.dataView = new DataView(this.arrayBuffer, 0);
    }
    
    this.updateProps(newProps);
    this.updateView(this.dataView!);
    device.queue.writeBuffer(
      this.gpuBuffer,
      0,
      this.arrayBuffer,
      0,
      this.arrayBuffer.byteLength
    );
  }
}

/**
 * Compute shader wrapper with automatic bind group creation
 */
export class ComputeShader {
  label: string;
  pipeline: GPUComputePipeline;

  constructor(label: string, device: GPUDevice, code: string) {
    this.label = label;
    this.pipeline = device.createComputePipeline({
      label,
      layout: 'auto',
      compute: {
        module: device.createShaderModule({
          label,
          code,
        }),
      },
    });
  }

  /**
   * Execute compute pass
   */
  computePass(
    device: GPUDevice,
    pass: GPUComputePassEncoder,
    entries: (GPUBuffer | GPUBindingResource)[],
    dispatchX: number,
    dispatchY: number,
    dispatchZ: number
  ): void {
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(
      0,
      device.createBindGroup({
        label: this.label,
        layout: this.pipeline.getBindGroupLayout(0),
        entries: entries.map((element, i) => ({
          binding: i,
          resource: typeof element === 'object' && 'buffer' in element 
            ? element 
            : { buffer: element as GPUBuffer },
        })),
      })
    );
    pass.dispatchWorkgroups(dispatchX, dispatchY, dispatchZ);
  }
}

/**
 * Timer for animation and delta time
 */
export class Timer {
  startTime: number;
  prev: number;
  currentTime: number;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.startTime = performance.now();
    this.prev = this.startTime;
    this.currentTime = 0.0;
  }

  /**
   * Get current time and delta time
   * @param speed Time speed multiplier
   * @returns [currentTime, deltaTime] in seconds
   */
  getTimeAndDelta(speed: number = 1.0): [number, number] {
    const now = performance.now();
    const delta = Math.min(1000 / 10, now - this.prev) * speed;
    this.prev = now;
    this.currentTime += delta;
    return [this.currentTime / 1000, delta / 1000];
  }
}

/**
 * Convert spherical coordinates to Cartesian
 * @param spherical [radius, theta, phi]
 * @returns [x, y, z]
 */
export function sphericalToCartesian(spherical: [number, number, number]): [number, number, number] {
  return [
    spherical[0] * Math.sin(spherical[1]) * Math.cos(spherical[2]),
    spherical[0] * Math.sin(spherical[1]) * Math.sin(spherical[2]),
    spherical[0] * Math.cos(spherical[1]),
  ];
}

/**
 * Rolling average calculator for smoothing values (e.g., FPS)
 */
export class RollingAverage {
  total: number;
  cursor: number;
  size: number;
  samples: number[];

  constructor(size: number = 100) {
    this.total = 0;
    this.cursor = 0;
    this.size = size;
    this.samples = [];
  }

  /**
   * Add a new sample
   */
  addSample(value: number): void {
    this.total += value - (this.samples[this.cursor] || 0);
    this.samples[this.cursor] = value;
    this.cursor = (this.cursor + 1) % this.size;
  }

  /**
   * Get current average
   */
  get(): number {
    return this.total / this.samples.length;
  }
}

/**
 * Convert HSV color to RGB
 * @param hsv [hue (0-1), saturation (0-1), value (0-1)]
 * @returns [r, g, b] (0-1)
 */
export function hsvToRgb([h, s, v]: [number, number, number]): [number, number, number] {
  let r = 0, g = 0, b = 0;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  
  return [r, g, b];
}

