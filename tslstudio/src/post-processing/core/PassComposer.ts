/**
 * Pass Composer
 * 
 * Manages and executes a chain of post-processing passes.
 * Handles render target swapping and buffer management.
 * 
 * @module post-processing/core
 */

import type { WebGPURenderer } from 'three/webgpu'
import { WebGLRenderTarget, Vector2 } from 'three'
import type { Pass } from './Pass'

/**
 * Composer configuration options
 */
export interface PassComposerOptions {
  /** Render target format */
  format?: number
  /** Render target type */
  type?: number
  /** Number of samples for MSAA */
  samples?: number
  /** Whether to use stencil buffer */
  stencil?: boolean
}

/**
 * Post-processing pass composer
 * 
 * Manages a chain of post-processing passes and handles
 * render target ping-ponging for efficient multi-pass rendering.
 * 
 * @example
 * ```typescript
 * const composer = new PassComposer(renderer, renderTarget);
 * 
 * composer.addPass(new RenderPass(scene, camera));
 * composer.addPass(new BloomPass());
 * composer.addPass(new FXAAPass());
 * 
 * // In animation loop
 * composer.render(deltaTime);
 * ```
 */
export class PassComposer {
  public renderer: WebGPURenderer
  public passes: Pass[]
  
  private renderTarget1: WebGLRenderTarget
  private renderTarget2: WebGLRenderTarget
  private writeBuffer: WebGLRenderTarget
  private readBuffer: WebGLRenderTarget
  
  private renderToScreen: boolean
  private size: Vector2

  /**
   * Create a new pass composer
   * 
   * @param renderer - The WebGPU renderer
   * @param renderTarget - Optional render target (created automatically if not provided)
   * @param options - Composer configuration options
   */
  constructor(
    renderer: WebGPURenderer,
    renderTarget?: WebGLRenderTarget,
    options: PassComposerOptions = {}
  ) {
    this.renderer = renderer
    this.passes = []
    this.renderToScreen = true

    // Get renderer size
    const size = renderer.getSize(new Vector2())
    this.size = size

    // Create render targets if not provided
    if (renderTarget === undefined) {
      const parameters = {
        minFilter: 1006, // LinearFilter
        magFilter: 1006, // LinearFilter
        format: options.format || 1023, // RGBAFormat
        type: options.type,
        samples: options.samples,
        stencilBuffer: options.stencil !== undefined ? options.stencil : false,
      }

      renderTarget = new WebGLRenderTarget(size.width, size.height, parameters)
      renderTarget.texture.name = 'PassComposer.rt1'
    }

    this.renderTarget1 = renderTarget
    this.renderTarget2 = renderTarget.clone()
    this.renderTarget2.texture.name = 'PassComposer.rt2'

    this.writeBuffer = this.renderTarget1
    this.readBuffer = this.renderTarget2
  }

  /**
   * Add a pass to the composer
   * Passes are executed in the order they are added
   * 
   * @param pass - The pass to add
   */
  addPass(pass: Pass): void {
    this.passes.push(pass)
    pass.setSize(this.size.width, this.size.height)
  }

  /**
   * Insert a pass at a specific index
   * 
   * @param pass - The pass to insert
   * @param index - The index to insert at
   */
  insertPass(pass: Pass, index: number): void {
    this.passes.splice(index, 0, pass)
    pass.setSize(this.size.width, this.size.height)
  }

  /**
   * Remove a pass from the composer
   * 
   * @param pass - The pass to remove
   */
  removePass(pass: Pass): void {
    const index = this.passes.indexOf(pass)
    if (index !== -1) {
      this.passes.splice(index, 1)
    }
  }

  /**
   * Check if composer is last pass
   * Used to determine if we should render to screen
   */
  isLastEnabledPass(passIndex: number): boolean {
    for (let i = passIndex + 1; i < this.passes.length; i++) {
      if (this.passes[i].enabled) {
        return false
      }
    }
    return true
  }

  /**
   * Render all passes
   * 
   * @param deltaTime - Time since last frame in seconds
   */
  render(deltaTime: number = 0): void {
    const currentRenderTarget = this.renderer.getRenderTarget()

    let maskActive = false

    for (let i = 0, il = this.passes.length; i < il; i++) {
      const pass = this.passes[i]

      if (!pass.enabled) continue

      pass.renderToScreen = this.renderToScreen && this.isLastEnabledPass(i)
      pass.render(this.renderer, this.writeBuffer, this.readBuffer, deltaTime, maskActive)

      if (pass.needsSwap) {
        if (maskActive) {
          const context = this.renderer.getContext()
          // @ts-ignore
          context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff)
          // Copy readBuffer to writeBuffer
          this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, deltaTime)
          // @ts-ignore
          context.stencilFunc(context.EQUAL, 1, 0xffffffff)
        }

        this.swapBuffers()
      }
    }

    this.renderer.setRenderTarget(currentRenderTarget)
  }

  /**
   * Reset the composer
   * Useful when changing render target sizes
   */
  reset(renderTarget?: WebGLRenderTarget): void {
    if (renderTarget === undefined) {
      const size = this.renderer.getSize(new Vector2())

      renderTarget = this.renderTarget1.clone()
      renderTarget.setSize(size.width, size.height)
    }

    this.renderTarget1.dispose()
    this.renderTarget2.dispose()

    this.renderTarget1 = renderTarget
    this.renderTarget2 = renderTarget.clone()

    this.writeBuffer = this.renderTarget1
    this.readBuffer = this.renderTarget2
  }

  /**
   * Set the size of the composer and all passes
   * 
   * @param width - New width in pixels
   * @param height - New height in pixels
   */
  setSize(width: number, height: number): void {
    this.size.set(width, height)

    this.renderTarget1.setSize(width, height)
    this.renderTarget2.setSize(width, height)

    for (let i = 0; i < this.passes.length; i++) {
      this.passes[i].setSize(width, height)
    }
  }

  /**
   * Set the pixel ratio
   * 
   * @param pixelRatio - The device pixel ratio
   */
  setPixelRatio(pixelRatio: number): void {
    const size = this.renderer.getSize(new Vector2())
    this.setSize(size.width * pixelRatio, size.height * pixelRatio)
  }

  /**
   * Swap read and write buffers
   */
  private swapBuffers(): void {
    const tmp = this.readBuffer
    this.readBuffer = this.writeBuffer
    this.writeBuffer = tmp
  }

  /**
   * Dispose of the composer and all passes
   * Frees all resources
   */
  dispose(): void {
    this.renderTarget1.dispose()
    this.renderTarget2.dispose()

    for (let i = 0; i < this.passes.length; i++) {
      this.passes[i].dispose()
    }
  }

  // Placeholder for copy pass (will be implemented in utils)
  private copyPass: any = {
    render: () => {},
  }
}

