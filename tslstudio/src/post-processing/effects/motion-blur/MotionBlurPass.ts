/**
 * Motion Blur Pass
 * 
 * Simulates motion blur by blending current frame with previous frames.
 * Creates realistic motion trails for moving objects and camera.
 * 
 * @module post-processing/effects/motion-blur
 */

import { Pass } from '../../core/Pass'
import { FullScreenQuad } from '../../core/FullScreenQuad'
import type { WebGPURenderer } from 'three/webgpu'
import { WebGLRenderTarget, LinearFilter, RGBAFormat } from 'three'
import { NodeMaterial } from 'three/webgpu'
import { Fn, texture, uv, uniform, float, vec4, mix } from 'three/tsl'

/**
 * Motion blur configuration
 */
export interface MotionBlurPassOptions {
  /** Motion blur intensity (default: 0.5) */
  intensity?: number
  /** Number of frames to accumulate (default: 8) */
  samples?: number
}

/**
 * Motion blur post-processing pass
 * 
 * Blends current and previous frames to create motion blur effect.
 * Simulates camera shutter speed and motion trails.
 * 
 * @example
 * ```typescript
 * const motionBlurPass = new MotionBlurPass({
 *   intensity: 0.5,
 *   samples: 8
 * });
 * 
 * composer.addPass(motionBlurPass);
 * ```
 */
export class MotionBlurPass extends Pass {
  public intensity: number
  public samples: number

  private material: NodeMaterial
  private fsQuad: FullScreenQuad
  private previousFrameRT: WebGLRenderTarget | null = null
  private intensityUniform: any

  /**
   * Create a new motion blur pass
   * 
   * @param options - Motion blur configuration
   */
  constructor(options: MotionBlurPassOptions = {}) {
    super({ name: 'MotionBlurPass', needsSwap: true })

    this.intensity = options.intensity ?? 0.5
    this.samples = options.samples ?? 8

    this.material = new NodeMaterial()
    this.fsQuad = new FullScreenQuad(this.material)

    this.intensityUniform = uniform(this.intensity)

    this.setupMaterial()
  }

  /**
   * Setup motion blur shader
   */
  private setupMaterial(): void {
    const motionBlurShader = Fn(() => {
      const uvCoords = uv()
      const currentFrame = texture(null).sample(uvCoords)
      const previousFrame = texture(null).sample(uvCoords)

      // Blend current and previous frames
      const blended = mix(currentFrame, previousFrame, this.intensityUniform)

      return vec4(blended.rgb, 1.0)
    })

    this.material.fragmentNode = motionBlurShader()
    this.material.name = 'MotionBlur'
    this.material.needsUpdate = true
  }

  /**
   * Set the size of render targets
   */
  setSize(width: number, height: number): void {
    if (this.previousFrameRT) {
      this.previousFrameRT.setSize(width, height)
    } else {
      this.previousFrameRT = new WebGLRenderTarget(width, height, {
        minFilter: LinearFilter,
        magFilter: LinearFilter,
        format: RGBAFormat,
      })
      this.previousFrameRT.texture.name = 'MotionBlur.previous'
    }
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
    // Update uniform
    this.intensityUniform.value = this.intensity

    // Initialize previous frame buffer if needed
    if (!this.previousFrameRT) {
      const size = renderer.getSize(new (require('three').Vector2)())
      this.setSize(size.width, size.height)
    }

    // Update material with textures
    const motionBlurShader = Fn(() => {
      const uvCoords = uv()
      const currentFrame = texture(readBuffer.texture).sample(uvCoords)

      // If we have a previous frame, blend with it
      if (this.previousFrameRT && this.previousFrameRT.texture) {
        const previousFrame = texture(this.previousFrameRT.texture).sample(uvCoords)
        const blended = mix(currentFrame, previousFrame, this.intensityUniform)
        return vec4(blended.rgb, 1.0)
      }

      return vec4(currentFrame.rgb, 1.0)
    })

    this.material.fragmentNode = motionBlurShader()
    this.material.needsUpdate = true

    // Render to output
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer)
    if (this.clear) renderer.clear()
    this.fsQuad.render(renderer)

    // Copy current frame to previous frame buffer
    if (this.previousFrameRT) {
      renderer.setRenderTarget(this.previousFrameRT)
      const copyShader = Fn(() => {
        return texture(writeBuffer.texture).sample(uv())
      })
      this.material.fragmentNode = copyShader()
      this.material.needsUpdate = true
      this.fsQuad.render(renderer)
    }
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    this.fsQuad.dispose()
    this.material.dispose()
    if (this.previousFrameRT) {
      this.previousFrameRT.dispose()
    }
  }
}

