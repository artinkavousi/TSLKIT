/**
 * Bloom Pass
 * 
 * Implements a high-quality bloom effect with configurable
 * strength, radius, and threshold parameters.
 * 
 * Based on Unreal Engine's bloom implementation.
 * 
 * @module post-processing/effects/bloom
 */

import { Pass } from '../../core/Pass'
import type { WebGPURenderer } from 'three/webgpu'
import { 
  WebGLRenderTarget, 
  Vector2, 
  Vector3,
  HalfFloatType,
  LinearFilter,
  RGBAFormat
} from 'three'
import { NodeMaterial } from 'three/webgpu'
import { 
  Fn, 
  texture, 
  uv, 
  uniform, 
  vec2, 
  vec4,
  float,
  luminance,
  smoothstep,
  mix,
  Loop,
  int,
  uniformArray,
  add
} from 'three/tsl'
import { FullScreenQuad } from '../../core/FullScreenQuad'

/**
 * Bloom pass configuration
 */
export interface BloomPassOptions {
  /** Bloom strength/intensity (default: 1.0) */
  strength?: number
  /** Bloom radius (default: 0.5) */
  radius?: number
  /** Luminance threshold (default: 0.8) */
  threshold?: number
  /** Number of blur mips (default: 5) */
  mips?: number
}

/**
 * High-quality bloom post-processing pass
 * 
 * Creates a bloom/glow effect by extracting bright areas,
 * blurring them at multiple scales, and compositing back.
 * 
 * @example
 * ```typescript
 * const bloomPass = new BloomPass({
 *   strength: 1.5,
 *   radius: 0.5,
 *   threshold: 0.8
 * });
 * 
 * composer.addPass(bloomPass);
 * ```
 */
export class BloomPass extends Pass {
  // Public parameters
  public strength: number
  public radius: number
  public threshold: number
  public smoothWidth: number

  // Private rendering resources
  private nMips: number
  private renderTargetsHorizontal: WebGLRenderTarget[]
  private renderTargetsVertical: WebGLRenderTarget[]
  private renderTargetBright: WebGLRenderTarget
  
  private highPassMaterial: NodeMaterial | null = null
  private separableBlurMaterials: any[] = []
  private compositeMaterial: NodeMaterial | null = null
  
  private fsQuad: FullScreenQuad
  
  private blurDirectionX = new Vector2(1.0, 0.0)
  private blurDirectionY = new Vector2(0.0, 1.0)

  /**
   * Create a new bloom pass
   * 
   * @param options - Bloom configuration options
   */
  constructor(options: BloomPassOptions = {}) {
    super({ name: 'BloomPass', needsSwap: true })

    this.strength = options.strength ?? 1.0
    this.radius = options.radius ?? 0.5
    this.threshold = options.threshold ?? 0.8
    this.smoothWidth = 0.01
    this.nMips = options.mips ?? 5

    // Create render targets for blur passes
    this.renderTargetsHorizontal = []
    this.renderTargetsVertical = []

    const rtParams = {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      type: HalfFloatType,
      depthBuffer: false,
      stencilBuffer: false,
    }

    // Bright pass render target
    this.renderTargetBright = new WebGLRenderTarget(1, 1, rtParams)
    this.renderTargetBright.texture.name = 'BloomPass.bright'
    this.renderTargetBright.texture.generateMipmaps = false

    // Create blur render targets
    for (let i = 0; i < this.nMips; i++) {
      const rtH = new WebGLRenderTarget(1, 1, rtParams)
      rtH.texture.name = `BloomPass.h${i}`
      rtH.texture.generateMipmaps = false
      this.renderTargetsHorizontal.push(rtH)

      const rtV = new WebGLRenderTarget(1, 1, rtParams)
      rtV.texture.name = `BloomPass.v${i}`
      rtV.texture.generateMipmaps = false
      this.renderTargetsVertical.push(rtV)
    }

    this.fsQuad = new FullScreenQuad()

    // Materials will be created in setupMaterials()
  }

  /**
   * Setup shader materials for bloom effect
   */
  private setupMaterials(): void {
    if (this.highPassMaterial) return // Already setup

    // 1. High-pass filter material (extract bright areas)
    const thresholdUniform = uniform(this.threshold)
    const smoothWidthUniform = uniform(this.smoothWidth)

    const highPassShader = Fn(() => {
      const texColor = texture(null).sample(uv())
      const lum = luminance(texColor.rgb)
      const alpha = smoothstep(thresholdUniform, thresholdUniform.add(smoothWidthUniform), lum)
      return mix(vec4(0), texColor, alpha)
    })

    this.highPassMaterial = new NodeMaterial()
    this.highPassMaterial.fragmentNode = highPassShader()
    this.highPassMaterial.name = 'Bloom_highPass'
    this.highPassMaterial.needsUpdate = true

    // Store uniform references
    ;(this.highPassMaterial as any).thresholdUniform = thresholdUniform
    ;(this.highPassMaterial as any).smoothWidthUniform = smoothWidthUniform

    // 2. Separable blur materials (Gaussian blur)
    const kernelSizeArray = [6, 10, 14, 18, 22]

    for (let i = 0; i < this.nMips; i++) {
      this.separableBlurMaterials.push(
        this.createSeparableBlurMaterial(kernelSizeArray[i])
      )
    }

    // 3. Composite material (combine all blur mips)
    const strengthUniform = uniform(this.strength)
    const radiusUniform = uniform(this.radius)

    const bloomFactors = uniformArray([1.0, 0.8, 0.6, 0.4, 0.2])
    const bloomTintColors = uniformArray([
      new Vector3(1, 1, 1),
      new Vector3(1, 1, 1),
      new Vector3(1, 1, 1),
      new Vector3(1, 1, 1),
      new Vector3(1, 1, 1),
    ])

    const lerpBloomFactor = Fn(([factor, radius]) => {
      const mirrorFactor = float(1.2).sub(factor)
      return mix(factor, mirrorFactor, radius)
    })

    // Create texture nodes for each blur mip
    const textureNodes = this.renderTargetsVertical.map(rt => texture(rt.texture))

    const compositeShader = Fn(() => {
      let sum = vec4(0).toVar()

      for (let i = 0; i < this.nMips; i++) {
        const factor = lerpBloomFactor([bloomFactors.element(i), radiusUniform])
        const tint = vec4(bloomTintColors.element(i), 1.0)
        const blurred = textureNodes[i].sample(uv())
        sum.addAssign(factor.mul(tint).mul(blurred))
      }

      return sum.mul(strengthUniform)
    })

    this.compositeMaterial = new NodeMaterial()
    this.compositeMaterial.fragmentNode = compositeShader()
    this.compositeMaterial.name = 'Bloom_composite'
    this.compositeMaterial.needsUpdate = true

    // Store uniform references
    ;(this.compositeMaterial as any).strengthUniform = strengthUniform
    ;(this.compositeMaterial as any).radiusUniform = radiusUniform
  }

  /**
   * Create separable Gaussian blur material
   */
  private createSeparableBlurMaterial(kernelRadius: number): any {
    const coefficients = []
    const sigma = kernelRadius / 3

    for (let i = 0; i < kernelRadius; i++) {
      coefficients.push(0.39894 * Math.exp(-0.5 * i * i / (sigma * sigma)) / sigma)
    }

    const colorTexture = texture(null)
    const gaussianCoeffs = uniformArray(coefficients)
    const invSize = uniform(new Vector2())
    const direction = uniform(new Vector2(0.5, 0.5))

    const blurShader = Fn(() => {
      const uvNode = uv()
      const diffuseSum = colorTexture.sample(uvNode).rgb.mul(gaussianCoeffs.element(0)).toVar()

      Loop({ start: int(1), end: int(kernelRadius), type: 'int', condition: '<' }, ({ i }) => {
        const x = float(i)
        const w = gaussianCoeffs.element(i)
        const uvOffset = direction.mul(invSize).mul(x)
        const sample1 = colorTexture.sample(uvNode.add(uvOffset)).rgb
        const sample2 = colorTexture.sample(uvNode.sub(uvOffset)).rgb
        diffuseSum.addAssign(add(sample1, sample2).mul(w))
      })

      return vec4(diffuseSum, 1.0)
    })

    const material = new NodeMaterial()
    material.fragmentNode = blurShader()
    material.name = 'Bloom_blur'
    material.needsUpdate = true

    return {
      material,
      colorTexture,
      direction,
      invSize,
    }
  }

  /**
   * Render the bloom effect
   */
  render(
    renderer: WebGPURenderer,
    writeBuffer: any,
    readBuffer: any,
    deltaTime: number,
    maskActive?: boolean
  ): void {
    // Setup materials on first render
    if (!this.highPassMaterial) {
      this.setupMaterials()
    }

    // Update uniform values
    if (this.highPassMaterial) {
      ;(this.highPassMaterial as any).thresholdUniform.value = this.threshold
      ;(this.highPassMaterial as any).smoothWidthUniform.value = this.smoothWidth
    }

    if (this.compositeMaterial) {
      ;(this.compositeMaterial as any).strengthUniform.value = this.strength
      ;(this.compositeMaterial as any).radiusUniform.value = this.radius
    }

    // 1. Extract bright areas
    const inputTexture = readBuffer.texture
    ;(this.highPassMaterial as any).fragmentNode = Fn(() => {
      const texColor = texture(inputTexture).sample(uv())
      const lum = luminance(texColor.rgb)
      const thresholdUniform = uniform(this.threshold)
      const smoothWidthUniform = uniform(this.smoothWidth)
      const alpha = smoothstep(thresholdUniform, thresholdUniform.add(smoothWidthUniform), lum)
      return mix(vec4(0), texColor, alpha)
    })()
    this.highPassMaterial!.needsUpdate = true

    renderer.setRenderTarget(this.renderTargetBright)
    this.fsQuad.material = this.highPassMaterial
    this.fsQuad.render(renderer)

    // 2. Blur progressively
    let inputRT = this.renderTargetBright

    for (let i = 0; i < this.nMips; i++) {
      const blurMaterial = this.separableBlurMaterials[i]

      // Horizontal blur
      blurMaterial.colorTexture.value = inputRT.texture
      blurMaterial.direction.value = this.blurDirectionX
      renderer.setRenderTarget(this.renderTargetsHorizontal[i])
      this.fsQuad.material = blurMaterial.material
      this.fsQuad.render(renderer)

      // Vertical blur
      blurMaterial.colorTexture.value = this.renderTargetsHorizontal[i].texture
      blurMaterial.direction.value = this.blurDirectionY
      renderer.setRenderTarget(this.renderTargetsVertical[i])
      this.fsQuad.render(renderer)

      inputRT = this.renderTargetsVertical[i]
    }

    // 3. Composite
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer)
    this.fsQuad.material = this.compositeMaterial
    this.fsQuad.render(renderer)
  }

  /**
   * Set the size of render targets
   */
  setSize(width: number, height: number): void {
    let resx = Math.round(width / 2)
    let resy = Math.round(height / 2)

    this.renderTargetBright.setSize(resx, resy)

    for (let i = 0; i < this.nMips; i++) {
      this.renderTargetsHorizontal[i].setSize(resx, resy)
      this.renderTargetsVertical[i].setSize(resx, resy)

      if (this.separableBlurMaterials[i]) {
        this.separableBlurMaterials[i].invSize.value.set(1 / resx, 1 / resy)
      }

      resx = Math.round(resx / 2)
      resy = Math.round(resy / 2)
    }
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    this.renderTargetBright.dispose()

    for (const rt of this.renderTargetsHorizontal) {
      rt.dispose()
    }

    for (const rt of this.renderTargetsVertical) {
      rt.dispose()
    }

    this.highPassMaterial?.dispose()
    this.compositeMaterial?.dispose()

    for (const mat of this.separableBlurMaterials) {
      mat.material.dispose()
    }

    this.fsQuad.dispose()
  }
}

