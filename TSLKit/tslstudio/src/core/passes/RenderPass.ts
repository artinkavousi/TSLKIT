/**
 * Base Render Pass
 * 
 * Foundation for all rendering passes in TSLStudio
 * 
 * @module core/passes/RenderPass
 */

import type { WebGPURenderer } from 'three/webgpu'
import type { Scene, Camera, WebGLRenderTarget } from 'three'

/**
 * Render pass options
 */
export interface RenderPassOptions {
  /** Pass name for debugging */
  name?: string
  /** Enable/disable pass */
  enabled?: boolean
  /** Render to screen or buffer */
  renderToScreen?: boolean
  /** Clear color buffer */
  clear?: boolean
  /** Clear depth buffer */
  clearDepth?: boolean
  /** Clear stencil buffer */
  clearStencil?: boolean
}

/**
 * Abstract base class for render passes
 * 
 * Provides:
 * - Pass orchestration
 * - Render target management
 * - Enable/disable functionality
 * - Resource cleanup
 */
export abstract class RenderPass {
  public name: string
  public enabled: boolean
  public renderToScreen: boolean
  public clear: boolean
  public clearDepth: boolean
  public clearStencil: boolean

  protected _initialized = false

  constructor(options: RenderPassOptions = {}) {
    this.name = options.name || this.constructor.name
    this.enabled = options.enabled ?? true
    this.renderToScreen = options.renderToScreen ?? false
    this.clear = options.clear ?? false
    this.clearDepth = options.clearDepth ?? false
    this.clearStencil = options.clearStencil ?? false
  }

  /**
   * Initialize pass resources
   * Override in derived classes
   */
  protected initialize(renderer: WebGPURenderer): void {
    this._initialized = true
  }

  /**
   * Render the pass
   * 
   * @param renderer - WebGPU renderer
   * @param writeBuffer - Target render buffer
   * @param readBuffer - Source render buffer
   * @param deltaTime - Time since last frame
   */
  public render(
    renderer: WebGPURenderer,
    writeBuffer: WebGLRenderTarget | null,
    readBuffer: WebGLRenderTarget | null,
    deltaTime: number
  ): void {
    if (!this.enabled) return

    if (!this._initialized) {
      this.initialize(renderer)
    }

    // Set render target
    const target = this.renderToScreen ? null : writeBuffer
    renderer.setRenderTarget(target)

    // Clear if requested
    if (this.clear || this.clearDepth || this.clearStencil) {
      renderer.clear(this.clear, this.clearDepth, this.clearStencil)
    }

    // Perform pass-specific rendering
    this.onRender(renderer, writeBuffer, readBuffer, deltaTime)
  }

  /**
   * Pass-specific rendering logic
   * Override in derived classes
   */
  protected abstract onRender(
    renderer: WebGPURenderer,
    writeBuffer: WebGLRenderTarget | null,
    readBuffer: WebGLRenderTarget | null,
    deltaTime: number
  ): void

  /**
   * Resize pass resources
   */
  public setSize(_width: number, _height: number): void {
    // Override in derived classes if needed
  }

  /**
   * Dispose pass resources
   */
  public dispose(): void {
    // Override in derived classes
  }
}

/**
 * Scene render pass
 * Renders a scene with a camera
 */
export class SceneRenderPass extends RenderPass {
  private scene: Scene
  private camera: Camera

  constructor(scene: Scene, camera: Camera, options?: RenderPassOptions) {
    super({ clear: true, ...options })
    this.scene = scene
    this.camera = camera
  }

  protected onRender(renderer: WebGPURenderer): void {
    renderer.render(this.scene, this.camera)
  }
}

/**
 * Pass composer for chaining multiple passes
 */
export class PassComposer {
  private passes: RenderPass[] = []
  private renderer: WebGPURenderer
  private renderTarget1: WebGLRenderTarget | null = null
  private renderTarget2: WebGLRenderTarget | null = null
  private writeBuffer: WebGLRenderTarget | null = null
  private readBuffer: WebGLRenderTarget | null = null

  constructor(renderer: WebGPURenderer) {
    this.renderer = renderer
  }

  /**
   * Add a pass to the composer
   */
  public addPass(pass: RenderPass): void {
    this.passes.push(pass)
  }

  /**
   * Remove a pass from the composer
   */
  public removePass(pass: RenderPass): void {
    const index = this.passes.indexOf(pass)
    if (index !== -1) {
      this.passes.splice(index, 1)
    }
  }

  /**
   * Insert pass at specific index
   */
  public insertPass(pass: RenderPass, index: number): void {
    this.passes.splice(index, 0, pass)
  }

  /**
   * Render all passes
   */
  public render(deltaTime: number = 0): void {
    let currentReadBuffer = this.readBuffer
    let currentWriteBuffer = this.writeBuffer

    for (let i = 0; i < this.passes.length; i++) {
      const pass = this.passes[i]
      
      if (!pass.enabled) continue

      pass.render(this.renderer, currentWriteBuffer, currentReadBuffer, deltaTime)

      // Swap buffers
      if (!pass.renderToScreen) {
        const temp = currentReadBuffer
        currentReadBuffer = currentWriteBuffer
        currentWriteBuffer = temp
      }
    }
  }

  /**
   * Resize composer and all passes
   */
  public setSize(width: number, height: number): void {
    for (const pass of this.passes) {
      pass.setSize(width, height)
    }
  }

  /**
   * Dispose composer and all passes
   */
  public dispose(): void {
    for (const pass of this.passes) {
      pass.dispose()
    }
    this.passes = []
  }
}

