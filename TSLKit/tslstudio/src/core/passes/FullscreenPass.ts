/**
 * Fullscreen Pass for post-processing effects
 * 
 * @module core/passes/FullscreenPass
 */

import { RenderPass, type RenderPassOptions } from './RenderPass.js'
import type { WebGPURenderer } from 'three/webgpu'
import type { WebGLRenderTarget, ShaderMaterial, Material } from 'three'
import {
  Scene,
  OrthographicCamera,
  PlaneGeometry,
  Mesh,
} from 'three'

/**
 * Fullscreen quad pass for post-processing
 * 
 * Renders a fullscreen quad with a custom material
 * Useful for screen-space effects
 */
export class FullscreenPass extends RenderPass {
  protected scene: Scene
  protected camera: OrthographicCamera
  protected quad: Mesh
  protected material: Material

  constructor(material: Material, options?: RenderPassOptions) {
    super(options)

    this.material = material

    // Setup fullscreen quad
    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this.scene = new Scene()

    const geometry = new PlaneGeometry(2, 2)
    this.quad = new Mesh(geometry, material)
    this.quad.frustumCulled = false
    this.scene.add(this.quad)
  }

  /**
   * Update material uniforms
   */
  public setUniform(name: string, value: unknown): void {
    if ('uniforms' in this.material && this.material.uniforms) {
      const uniforms = this.material.uniforms as Record<string, { value: unknown }>
      if (uniforms[name]) {
        uniforms[name].value = value
      }
    }
  }

  /**
   * Get material
   */
  public getMaterial(): Material {
    return this.material
  }

  /**
   * Set material
   */
  public setMaterial(material: Material): void {
    this.material = material
    this.quad.material = material
  }

  protected override onRender(renderer: WebGPURenderer): void {
    renderer.render(this.scene, this.camera)
  }

  public override dispose(): void {
    super.dispose()
    this.quad.geometry.dispose()
    this.material.dispose()
  }
}

/**
 * Helper to create fullscreen quad material uniforms
 */
export interface FullscreenUniforms {
  tDiffuse?: { value: WebGLRenderTarget | null }
  resolution?: { value: [number, number] }
  time?: { value: number }
  [key: string]: { value: unknown } | undefined
}

/**
 * Create default fullscreen uniforms
 */
export function createFullscreenUniforms(
  width: number = 1,
  height: number = 1
): FullscreenUniforms {
  return {
    tDiffuse: { value: null },
    resolution: { value: [width, height] },
    time: { value: 0 },
  }
}

