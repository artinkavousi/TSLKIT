/**
 * Full Screen Quad
 * 
 * Utility for rendering full-screen post-processing effects.
 * Creates a quad that covers the entire screen for shader passes.
 * 
 * @module post-processing/core
 */

import { OrthographicCamera, PlaneGeometry, Mesh } from 'three'
import type { Material } from 'three'

/**
 * Full-screen quad for post-processing
 * 
 * Creates a screen-aligned quad mesh for rendering
 * post-processing effects that cover the entire viewport.
 * 
 * @example
 * ```typescript
 * const quad = new FullScreenQuad(material);
 * 
 * // In render function
 * renderer.setRenderTarget(renderTarget);
 * quad.render(renderer);
 * ```
 */
export class FullScreenQuad {
  private camera: OrthographicCamera
  private geometry: PlaneGeometry
  private mesh: Mesh
  private _material: Material | null

  /**
   * Create a new full-screen quad
   * 
   * @param material - The material to use for rendering
   */
  constructor(material?: Material) {
    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)

    this.geometry = new PlaneGeometry(2, 2)

    this._material = material || null

    this.mesh = new Mesh(this.geometry, this._material || undefined)
  }

  /**
   * Get the current material
   */
  get material(): Material | null {
    return this._material
  }

  /**
   * Set a new material
   */
  set material(value: Material | null) {
    this._material = value
    this.mesh.material = value || undefined
  }

  /**
   * Dispose of the quad and free resources
   */
  dispose(): void {
    this.geometry.dispose()
  }

  /**
   * Render the quad
   * 
   * @param renderer - The WebGPU renderer
   */
  render(renderer: any): void {
    renderer.render(this.mesh, this.camera)
  }
}

