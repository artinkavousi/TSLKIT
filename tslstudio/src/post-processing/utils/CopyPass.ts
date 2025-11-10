/**
 * Copy Pass
 * 
 * Simple pass that copies one render target to another.
 * Useful for debugging and final output.
 * 
 * @module post-processing/utils
 */

import { Pass } from '../core/Pass'
import { FullScreenQuad } from '../core/FullScreenQuad'
import { NodeMaterial } from 'three/webgpu'
import { texture, uv } from 'three/tsl'
import type { WebGPURenderer } from 'three/webgpu'
import type { Texture } from 'three'

/**
 * Copy pass for texture copying
 * 
 * Simple pass that copies the input texture to the output.
 * Often used as the final pass to render to screen.
 * 
 * @example
 * ```typescript
 * const copyPass = new CopyPass();
 * copyPass.renderToScreen = true;
 * composer.addPass(copyPass);
 * ```
 */
export class CopyPass extends Pass {
  private fsQuad: FullScreenQuad
  private material: NodeMaterial
  private inputTexture: Texture | null = null

  /**
   * Create a new copy pass
   */
  constructor() {
    super({ name: 'CopyPass', needsSwap: false })

    // Create simple copy material
    this.material = new NodeMaterial()
    
    // Will be set in render
    this.material.fragmentNode = texture(null).sample(uv())
    this.material.needsUpdate = true

    this.fsQuad = new FullScreenQuad(this.material)
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
    // Update material with input texture
    if (readBuffer && readBuffer.texture) {
      this.material.fragmentNode = texture(readBuffer.texture).sample(uv())
      this.material.needsUpdate = true
    }

    // Set render target
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer)

    // Clear if needed
    if (this.clear) {
      renderer.clear()
    }

    // Render
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

