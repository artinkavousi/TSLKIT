/**
 * Shader Pass
 * 
 * Generic pass for applying custom shader materials.
 * Base for many post-processing effects.
 * 
 * @module post-processing/utils
 */

import { Pass } from '../core/Pass'
import { FullScreenQuad } from '../core/FullScreenQuad'
import type { WebGPURenderer } from 'three/webgpu'
import type { Material } from 'three'

/**
 * Shader pass for custom material effects
 * 
 * Generic pass that renders a full-screen quad with a custom material.
 * Used as the base for most post-processing effects.
 * 
 * @example
 * ```typescript
 * const material = new NodeMaterial();
 * material.fragmentNode = customShader();
 * 
 * const pass = new ShaderPass(material);
 * composer.addPass(pass);
 * ```
 */
export class ShaderPass extends Pass {
  private fsQuad: FullScreenQuad
  public material: Material
  public uniforms: any

  /**
   * Create a new shader pass
   * 
   * @param material - The shader material to use
   * @param textureID - Optional texture uniform name (default: 'tDiffuse')
   */
  constructor(material: Material, textureID: string = 'tDiffuse') {
    super({ name: 'ShaderPass', needsSwap: true })

    this.material = material
    this.fsQuad = new FullScreenQuad(this.material)

    // Store reference to uniforms if available
    this.uniforms = (material as any).uniforms || null
  }

  /**
   * Render the pass
   */
  render(
    renderer: WebGPURenderer,
    writeBuffer: any,
    readBuffer: any,
    deltaTime: number,
    maskActive?: boolean
  ): void {
    // Set input texture if uniforms exist
    if (this.uniforms && this.uniforms.tDiffuse) {
      this.uniforms.tDiffuse.value = readBuffer.texture
    }

    // Set render target
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer)

    // Clear if needed
    if (this.clear) {
      renderer.clear()
    }

    // Render full-screen quad
    this.fsQuad.render(renderer)
  }

  /**
   * Dispose of the pass
   */
  dispose(): void {
    this.fsQuad.dispose()
    this.material.dispose()
  }
}

