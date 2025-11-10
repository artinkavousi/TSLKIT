/**
 * Chromatic Aberration Pass
 * 
 * Simulates lens chromatic aberration by offsetting RGB channels.
 * Creates a color fringing effect at edges, useful for stylized visuals.
 * 
 * @module post-processing/effects/chromatic-aberration
 */

import { ShaderPass } from '../../utils/ShaderPass'
import { NodeMaterial } from 'three/webgpu'
import { Fn, texture, uv, uniform, vec2, vec4, float } from 'three/tsl'

/**
 * Chromatic aberration configuration
 */
export interface ChromaticAberrationPassOptions {
  /** Offset amount for RGB channels (default: 0.002) */
  offset?: number
  /** Whether to use radial distortion (default: true) */
  radial?: boolean
}

/**
 * Chromatic aberration post-processing pass
 * 
 * Separates RGB channels to simulate lens chromatic aberration.
 * Can be uniform or radial (increasing towards edges).
 * 
 * @example
 * ```typescript
 * const chromaticPass = new ChromaticAberrationPass({
 *   offset: 0.002,
 *   radial: true
 * });
 * 
 * composer.addPass(chromaticPass);
 * ```
 */
export class ChromaticAberrationPass extends ShaderPass {
  public offset: number
  public radial: boolean

  private offsetUniform: any

  /**
   * Create a new chromatic aberration pass
   * 
   * @param options - Configuration options
   */
  constructor(options: ChromaticAberrationPassOptions = {}) {
    const material = new NodeMaterial()
    
    super(material)
    
    this.name = 'ChromaticAberrationPass'
    this.offset = options.offset ?? 0.002
    this.radial = options.radial ?? true

    this.setupMaterial()
  }

  /**
   * Setup the chromatic aberration shader
   */
  private setupMaterial(): void {
    this.offsetUniform = uniform(this.offset)

    const chromaticShader = Fn(([inputTexture]) => {
      const uvCoords = uv()
      
      if (this.radial) {
        // Radial chromatic aberration (increases towards edges)
        const center = vec2(0.5, 0.5)
        const direction = uvCoords.sub(center)
        const distanceFromCenter = direction.length()
        
        // Sample each channel with different offsets
        const offsetVec = direction.mul(this.offsetUniform).mul(distanceFromCenter)
        
        const r = texture(inputTexture).sample(uvCoords.sub(offsetVec)).r
        const g = texture(inputTexture).sample(uvCoords).g
        const b = texture(inputTexture).sample(uvCoords.add(offsetVec)).b
        const a = texture(inputTexture).sample(uvCoords).a
        
        return vec4(r, g, b, a)
      } else {
        // Uniform chromatic aberration
        const offsetVec = vec2(this.offsetUniform, 0)
        
        const r = texture(inputTexture).sample(uvCoords.sub(offsetVec)).r
        const g = texture(inputTexture).sample(uvCoords).g
        const b = texture(inputTexture).sample(uvCoords.add(offsetVec)).b
        const a = texture(inputTexture).sample(uvCoords).a
        
        return vec4(r, g, b, a)
      }
    })

    this.material.fragmentNode = chromaticShader([null])
    this.material.name = 'ChromaticAberration'
    this.material.needsUpdate = true
  }

  /**
   * Render the pass
   */
  render(renderer: any, writeBuffer: any, readBuffer: any, deltaTime: number, maskActive?: boolean): void {
    // Update uniform
    this.offsetUniform.value = this.offset

    // Update material with input texture
    const chromaticShader = Fn(() => {
      const uvCoords = uv()
      
      if (this.radial) {
        const center = vec2(0.5, 0.5)
        const direction = uvCoords.sub(center)
        const distanceFromCenter = direction.length()
        const offsetVec = direction.mul(this.offsetUniform).mul(distanceFromCenter)
        
        const r = texture(readBuffer.texture).sample(uvCoords.sub(offsetVec)).r
        const g = texture(readBuffer.texture).sample(uvCoords).g
        const b = texture(readBuffer.texture).sample(uvCoords.add(offsetVec)).b
        const a = texture(readBuffer.texture).sample(uvCoords).a
        
        return vec4(r, g, b, a)
      } else {
        const offsetVec = vec2(this.offsetUniform, 0)
        
        const r = texture(readBuffer.texture).sample(uvCoords.sub(offsetVec)).r
        const g = texture(readBuffer.texture).sample(uvCoords).g
        const b = texture(readBuffer.texture).sample(uvCoords.add(offsetVec)).b
        const a = texture(readBuffer.texture).sample(uvCoords).a
        
        return vec4(r, g, b, a)
      }
    })

    this.material.fragmentNode = chromaticShader()
    this.material.needsUpdate = true

    super.render(renderer, writeBuffer, readBuffer, deltaTime, maskActive)
  }
}

