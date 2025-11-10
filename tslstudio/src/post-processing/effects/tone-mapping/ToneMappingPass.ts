/**
 * Tone Mapping Pass
 * 
 * Converts HDR (High Dynamic Range) values to LDR (Low Dynamic Range)
 * for display on standard monitors. Supports multiple tone mapping algorithms.
 * 
 * @module post-processing/effects/tone-mapping
 */

import { ShaderPass } from '../../utils/ShaderPass'
import { NodeMaterial } from 'three/webgpu'
import { Fn, texture, uv, uniform, float, vec3, vec4, mul, div, add, pow, max } from 'three/tsl'

/**
 * Tone mapping algorithms
 */
export enum ToneMappingAlgorithm {
  /** Linear tone mapping */
  Linear = 'linear',
  /** Reinhard tone mapping */
  Reinhard = 'reinhard',
  /** Cinematic tone mapping */
  Cinematic = 'cinematic',
  /** ACES Filmic tone mapping */
  ACESFilmic = 'aces',
  /** Uncharted 2 tone mapping */
  Uncharted2 = 'uncharted2',
}

/**
 * Tone mapping configuration
 */
export interface ToneMappingPassOptions {
  /** Tone mapping algorithm (default: ACESFilmic) */
  algorithm?: ToneMappingAlgorithm
  /** Exposure adjustment (default: 1.0) */
  exposure?: number
  /** White point (default: 1.0) */
  whitePoint?: number
}

/**
 * Tone mapping post-processing pass
 * 
 * Converts HDR to LDR using various tone mapping algorithms.
 * Essential for rendering HDR content on standard displays.
 * 
 * @example
 * ```typescript
 * const toneMappingPass = new ToneMappingPass({
 *   algorithm: ToneMappingAlgorithm.ACESFilmic,
 *   exposure: 1.0
 * });
 * 
 * composer.addPass(toneMappingPass);
 * ```
 */
export class ToneMappingPass extends ShaderPass {
  public algorithm: ToneMappingAlgorithm
  public exposure: number
  public whitePoint: number

  private exposureUniform: any
  private whitePointUniform: any

  /**
   * Create a new tone mapping pass
   * 
   * @param options - Tone mapping configuration
   */
  constructor(options: ToneMappingPassOptions = {}) {
    const material = new NodeMaterial()
    super(material)

    this.name = 'ToneMappingPass'
    this.algorithm = options.algorithm ?? ToneMappingAlgorithm.ACESFilmic
    this.exposure = options.exposure ?? 1.0
    this.whitePoint = options.whitePoint ?? 1.0

    this.exposureUniform = uniform(this.exposure)
    this.whitePointUniform = uniform(this.whitePoint)

    this.setupMaterial()
  }

  /**
   * Setup tone mapping shader
   */
  private setupMaterial(): void {
    // ACES Filmic tone mapping function
    const acesFilmic = Fn(([x]) => {
      const a = float(2.51)
      const b = float(0.03)
      const c = float(2.43)
      const d = float(0.59)
      const e = float(0.14)

      const numerator = x.mul(x.mul(a).add(b))
      const denominator = x.mul(x.mul(c).add(d)).add(e)

      return numerator.div(denominator).clamp(0, 1)
    })

    // Reinhard tone mapping
    const reinhard = Fn(([x]) => {
      return x.div(x.add(1))
    })

    // Cinematic tone mapping
    const cinematic = Fn(([x]) => {
      return max(vec3(0), x.sub(0.004)).div(x.mul(6.2).add(0.5))
    })

    // Uncharted 2 tone mapping
    const uncharted2 = Fn(([x]) => {
      const A = float(0.15)
      const B = float(0.50)
      const C = float(0.10)
      const D = float(0.20)
      const E = float(0.02)
      const F = float(0.30)

      return x.mul(x.mul(A).add(C.mul(B)))
        .add(D.mul(E))
        .div(x.mul(x.mul(A).add(B)).add(D.mul(F)))
        .sub(E.div(F))
    })

    const toneMappingShader = Fn(() => {
      const uvCoords = uv()
      const hdrColor = texture(null).sample(uvCoords)

      // Apply exposure
      let color = hdrColor.rgb.mul(this.exposureUniform).toVar()

      // Apply tone mapping based on algorithm
      switch (this.algorithm) {
        case ToneMappingAlgorithm.Linear:
          color.assign(color.clamp(0, 1))
          break
        case ToneMappingAlgorithm.Reinhard:
          color.assign(reinhard([color]))
          break
        case ToneMappingAlgorithm.Cinematic:
          color.assign(cinematic([color]))
          break
        case ToneMappingAlgorithm.ACESFilmic:
          color.assign(acesFilmic([color]))
          break
        case ToneMappingAlgorithm.Uncharted2:
          color.assign(uncharted2([color]))
          const whiteScale = uncharted2([vec3(this.whitePointUniform)])
          color.assign(color.div(whiteScale))
          break
      }

      // Gamma correction
      color.assign(pow(color, vec3(1.0 / 2.2)))

      return vec4(color, hdrColor.a)
    })

    this.material.fragmentNode = toneMappingShader()
    this.material.name = 'ToneMapping'
    this.material.needsUpdate = true
  }

  /**
   * Render the pass
   */
  render(renderer: any, writeBuffer: any, readBuffer: any, deltaTime: number, maskActive?: boolean): void {
    // Update uniforms
    this.exposureUniform.value = this.exposure
    this.whitePointUniform.value = this.whitePoint

    // Rebuild shader with current algorithm
    this.setupMaterial()

    // Update input texture
    const toneMappingShader = Fn(() => {
      const uvCoords = uv()
      const hdrColor = texture(readBuffer.texture).sample(uvCoords)
      let color = hdrColor.rgb.mul(this.exposureUniform).toVar()

      // Simplified version for runtime
      // In production, you'd want to avoid recreating this every frame
      if (this.algorithm === ToneMappingAlgorithm.ACESFilmic) {
        const a = float(2.51)
        const b = float(0.03)
        const c = float(2.43)
        const d = float(0.59)
        const e = float(0.14)
        const numerator = color.mul(color.mul(a).add(b))
        const denominator = color.mul(color.mul(c).add(d)).add(e)
        color.assign(numerator.div(denominator).clamp(0, 1))
      } else if (this.algorithm === ToneMappingAlgorithm.Reinhard) {
        color.assign(color.div(color.add(1)))
      } else {
        color.assign(color.clamp(0, 1))
      }

      // Gamma correction
      color.assign(pow(color, vec3(1.0 / 2.2)))

      return vec4(color, hdrColor.a)
    })

    this.material.fragmentNode = toneMappingShader()
    this.material.needsUpdate = true

    super.render(renderer, writeBuffer, readBuffer, deltaTime, maskActive)
  }
}

