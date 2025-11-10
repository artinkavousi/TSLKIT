/**
 * Vignette Pass
 * 
 * Adds a cinematic vignette effect that darkens the edges of the screen.
 * Commonly used to focus attention on the center of the frame.
 * 
 * @module post-processing/effects/vignette
 */

import { ShaderPass } from '../../utils/ShaderPass'
import { NodeMaterial } from 'three/webgpu'
import { Fn, texture, uv, uniform, float, vec2, length, smoothstep, mix, vec4 } from 'three/tsl'

/**
 * Vignette effect configuration
 */
export interface VignettePassOptions {
  /** Vignette darkness/intensity (default: 0.5) */
  darkness?: number
  /** Vignette size/offset from edges (default: 1.0) */
  offset?: number
  /** Whether to use smooth falloff (default: true) */
  smooth?: boolean
}

/**
 * Vignette post-processing pass
 * 
 * Creates a darkening effect around the edges of the screen,
 * focusing viewer attention on the center.
 * 
 * @example
 * ```typescript
 * const vignettePass = new VignettePass({
 *   darkness: 0.5,
 *   offset: 1.0,
 *   smooth: true
 * });
 * 
 * composer.addPass(vignettePass);
 * ```
 */
export class VignettePass extends ShaderPass {
  public darkness: number
  public offset: number
  public smooth: boolean

  private darknessUniform: any
  private offsetUniform: any

  /**
   * Create a new vignette pass
   * 
   * @param options - Vignette configuration
   */
  constructor(options: VignettePassOptions = {}) {
    const material = new NodeMaterial()
    
    super(material)
    
    this.name = 'VignettePass'
    this.darkness = options.darkness ?? 0.5
    this.offset = options.offset ?? 1.0
    this.smooth = options.smooth ?? true

    this.setupMaterial()
  }

  /**
   * Setup the vignette shader material
   */
  private setupMaterial(): void {
    this.darknessUniform = uniform(this.darkness)
    this.offsetUniform = uniform(this.offset)

    const vignetteShader = Fn(([inputTexture]) => {
      // Sample input texture
      const texColor = texture(inputTexture).sample(uv())
      
      // Calculate distance from center
      const uvCoords = uv()
      const center = vec2(0.5, 0.5)
      const dist = length(uvCoords.sub(center))
      
      // Calculate vignette factor
      let vignetteFactor
      if (this.smooth) {
        // Smooth vignette
        vignetteFactor = smoothstep(
          this.offsetUniform,
          this.offsetUniform.sub(this.darknessUniform),
          dist
        )
      } else {
        // Hard vignette
        const threshold = this.offsetUniform.sub(this.darknessUniform.mul(0.5))
        vignetteFactor = float(1).sub(
          smoothstep(threshold, this.offsetUniform, dist)
        )
      }
      
      // Apply vignette
      return vec4(texColor.rgb.mul(vignetteFactor), texColor.a)
    })

    this.material.fragmentNode = vignetteShader([null])
    this.material.name = 'Vignette'
    this.material.needsUpdate = true
  }

  /**
   * Render the pass
   */
  render(renderer: any, writeBuffer: any, readBuffer: any, deltaTime: number, maskActive?: boolean): void {
    // Update uniforms
    this.darknessUniform.value = this.darkness
    this.offsetUniform.value = this.offset

    // Update material with input texture
    const vignetteShader = Fn(() => {
      const texColor = texture(readBuffer.texture).sample(uv())
      const uvCoords = uv()
      const center = vec2(0.5, 0.5)
      const dist = length(uvCoords.sub(center))
      
      const vignetteFactor = smoothstep(
        this.offsetUniform,
        this.offsetUniform.sub(this.darknessUniform),
        dist
      )
      
      return vec4(texColor.rgb.mul(vignetteFactor), texColor.a)
    })

    this.material.fragmentNode = vignetteShader()
    this.material.needsUpdate = true

    // Call parent render
    super.render(renderer, writeBuffer, readBuffer, deltaTime, maskActive)
  }
}

