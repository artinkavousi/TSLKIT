/**
 * Compute Pass for GPU compute operations
 * 
 * @module core/passes/ComputePass
 */

import { RenderPass, type RenderPassOptions } from './RenderPass.js'
import type { WebGPURenderer } from 'three/webgpu'
import type { WebGLRenderTarget, DataTexture } from 'three'

/**
 * Compute pass options
 */
export interface ComputePassOptions extends RenderPassOptions {
  /** Compute workgroup size X */
  workgroupSizeX?: number
  /** Compute workgroup size Y */
  workgroupSizeY?: number
  /** Compute workgroup size Z */
  workgroupSizeZ?: number
}

/**
 * Base class for GPU compute passes
 * 
 * Provides infrastructure for compute shader operations:
 * - Buffer management
 * - Workgroup configuration
 * - Compute dispatch
 */
export abstract class ComputePass extends RenderPass {
  protected workgroupSize: [number, number, number]
  protected storageBuffers: Map<string, GPUBuffer> = new Map()
  protected uniformBuffers: Map<string, GPUBuffer> = new Map()

  constructor(options: ComputePassOptions = {}) {
    super(options)
    
    this.workgroupSize = [
      options.workgroupSizeX || 8,
      options.workgroupSizeY || 8,
      options.workgroupSizeZ || 1,
    ]
  }

  /**
   * Create a storage buffer
   */
  protected createStorageBuffer(
    device: GPUDevice,
    name: string,
    size: number,
    usage: GPUBufferUsageFlags = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
  ): GPUBuffer {
    const buffer = device.createBuffer({
      size,
      usage,
    })
    
    this.storageBuffers.set(name, buffer)
    return buffer
  }

  /**
   * Create a uniform buffer
   */
  protected createUniformBuffer(
    device: GPUDevice,
    name: string,
    size: number
  ): GPUBuffer {
    const buffer = device.createBuffer({
      size,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })
    
    this.uniformBuffers.set(name, buffer)
    return buffer
  }

  /**
   * Update buffer data
   */
  protected updateBuffer(
    device: GPUDevice,
    buffer: GPUBuffer,
    data: ArrayBuffer | ArrayBufferView
  ): void {
    device.queue.writeBuffer(
      buffer,
      0,
      data instanceof ArrayBuffer ? data : data.buffer
    )
  }

  /**
   * Compute workgroup count for given size
   */
  protected computeWorkgroups(
    size: number,
    workgroupSize: number
  ): number {
    return Math.ceil(size / workgroupSize)
  }

  /**
   * Dispose all buffers
   */
  public override dispose(): void {
    super.dispose()
    
    for (const buffer of this.storageBuffers.values()) {
      buffer.destroy()
    }
    this.storageBuffers.clear()

    for (const buffer of this.uniformBuffers.values()) {
      buffer.destroy()
    }
    this.uniformBuffers.clear()
  }
}

/**
 * Helper class for managing compute data
 */
export class ComputeData {
  private data: Float32Array | Uint32Array | Int32Array
  private buffer: GPUBuffer | null = null

  constructor(data: Float32Array | Uint32Array | Int32Array) {
    this.data = data
  }

  /**
   * Get the underlying data
   */
  public getData(): Float32Array | Uint32Array | Int32Array {
    return this.data
  }

  /**
   * Update data
   */
  public setData(data: Float32Array | Uint32Array | Int32Array): void {
    this.data = data
  }

  /**
   * Get or create GPU buffer
   */
  public getBuffer(device: GPUDevice, usage: GPUBufferUsageFlags): GPUBuffer {
    if (!this.buffer) {
      this.buffer = device.createBuffer({
        size: this.data.byteLength,
        usage,
        mappedAtCreation: true,
      })

      const arrayBuffer = this.buffer.getMappedRange()
      if (this.data instanceof Float32Array) {
        new Float32Array(arrayBuffer).set(this.data)
      } else if (this.data instanceof Uint32Array) {
        new Uint32Array(arrayBuffer).set(this.data)
      } else {
        new Int32Array(arrayBuffer).set(this.data)
      }
      this.buffer.unmap()
    }

    return this.buffer
  }

  /**
   * Upload data to existing buffer
   */
  public uploadToBuffer(device: GPUDevice, buffer: GPUBuffer): void {
    device.queue.writeBuffer(buffer, 0, this.data)
  }

  /**
   * Dispose buffer
   */
  public dispose(): void {
    if (this.buffer) {
      this.buffer.destroy()
      this.buffer = null
    }
  }
}

