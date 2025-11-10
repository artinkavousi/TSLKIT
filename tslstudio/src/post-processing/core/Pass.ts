/**
 * Base Pass Class
 * 
 * Abstract base class for all post-processing passes.
 * Provides common functionality and interface for effect composition.
 * 
 * @module post-processing/core
 */

import type { WebGPURenderer } from 'three/webgpu'
import type { Camera, Scene } from 'three'

/**
 * Base pass configuration options
 */
export interface PassOptions {
  /** Pass name for debugging */
  name?: string
  /** Whether pass is enabled */
  enabled?: boolean
  /** Whether pass needs to swap read/write buffers */
  needsSwap?: boolean
  /** Whether pass clears the buffer before rendering */
  clear?: boolean
  /** Render to screen or to buffer */
  renderToScreen?: boolean
}

/**
 * Abstract base class for post-processing passes
 * 
 * @example
 * ```typescript
 * class MyPass extends Pass {
 *   constructor() {
 *     super({ name: 'MyPass', needsSwap: true });
 *   }
 *   
 *   render(renderer, writeBuffer, readBuffer, deltaTime) {
 *     // Implement rendering logic
 *   }
 * }
 * ```
 */
export abstract class Pass {
  /** Pass name for identification and debugging */
  public name: string

  /** Whether the pass is currently enabled */
  public enabled: boolean

  /** Whether the pass needs to swap read/write buffers after rendering */
  public needsSwap: boolean

  /** Whether to clear the buffer before rendering */
  public clear: boolean

  /** Whether this pass renders directly to screen */
  public renderToScreen: boolean

  /**
   * Create a new pass
   * @param options - Pass configuration options
   */
  constructor(options: PassOptions = {}) {
    this.name = options.name || 'Pass'
    this.enabled = options.enabled !== undefined ? options.enabled : true
    this.needsSwap = options.needsSwap !== undefined ? options.needsSwap : true
    this.clear = options.clear !== undefined ? options.clear : false
    this.renderToScreen = options.renderToScreen !== undefined ? options.renderToScreen : false
  }

  /**
   * Render the pass
   * 
   * @param renderer - The WebGPU renderer
   * @param writeBuffer - The buffer to write to
   * @param readBuffer - The buffer to read from
   * @param deltaTime - Time since last frame in seconds
   * @param maskActive - Whether masking is active
   */
  abstract render(
    renderer: WebGPURenderer,
    writeBuffer: any,
    readBuffer: any,
    deltaTime: number,
    maskActive?: boolean
  ): void

  /**
   * Set the size of the pass
   * Called when the renderer or composer is resized
   * 
   * @param width - New width in pixels
   * @param height - New height in pixels
   */
  setSize(width: number, height: number): void {
    // Override in subclasses if needed
  }

  /**
   * Dispose of the pass and free resources
   * Called when the pass is removed or composer is disposed
   */
  dispose(): void {
    // Override in subclasses if needed
  }
}

/**
 * Scene pass that renders a scene with a camera
 * Useful as the first pass in a post-processing chain
 */
export class RenderPass extends Pass {
  public scene: Scene
  public camera: Camera
  public overrideMaterial: any | null
  public clearColor: any | null
  public clearAlpha: number

  constructor(scene: Scene, camera: Camera, overrideMaterial: any = null, clearColor: any = null, clearAlpha = 0) {
    super({ name: 'RenderPass', needsSwap: false })

    this.scene = scene
    this.camera = camera
    this.overrideMaterial = overrideMaterial
    this.clearColor = clearColor
    this.clearAlpha = clearAlpha
  }

  render(renderer: WebGPURenderer, writeBuffer: any, readBuffer: any, deltaTime: number, maskActive?: boolean): void {
    const oldAutoClear = renderer.autoClear
    renderer.autoClear = false

    let oldClearColor, oldClearAlpha
    let oldOverrideMaterial

    if (this.overrideMaterial) {
      oldOverrideMaterial = this.scene.overrideMaterial
      this.scene.overrideMaterial = this.overrideMaterial
    }

    if (this.clearColor) {
      oldClearColor = renderer.getClearColor(oldClearColor)
      oldClearAlpha = renderer.getClearAlpha()
      renderer.setClearColor(this.clearColor, this.clearAlpha)
    }

    if (this.clear) {
      renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer)
      renderer.clear()
    }

    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer)
    renderer.render(this.scene, this.camera)

    if (this.clearColor) {
      renderer.setClearColor(oldClearColor, oldClearAlpha)
    }

    if (this.overrideMaterial) {
      this.scene.overrideMaterial = oldOverrideMaterial
    }

    renderer.autoClear = oldAutoClear
  }
}

