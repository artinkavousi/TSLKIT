/**
 * After Image (Motion Trails) Effect
 * 
 * @author Three.js Contributors
 * @source https://github.com/mrdoob/three.js/blob/r181/examples/jsm/tsl/display/AfterImageNode.js
 * @license MIT
 * @version Three.js r181
 * 
 * Creates motion trail/ghosting effect by blending current and previous frames.
 * 
 * Also known as motion blur, ghosting, or persistence of vision effect.
 * Commonly used in visualization, music videos, and artistic effects.
 * 
 * @example
 * ```typescript
 * import { afterImage } from '@tslstudio/tsl-kit/postfx'
 * import { pass, uniform } from 'three/tsl'
 * 
 * // Apply motion trails
 * const scenePass = pass(scene, camera)
 * const trailEffect = afterImage(scenePass, uniform(0.9))
 * ```
 */

import { TempNode, QuadMesh, NodeUpdateType, RenderTarget, HalfFloatType, NearestFilter } from 'three/webgpu'
import { Fn, vec2, vec4, texture, uv, nodeObject } from 'three/tsl'
import type { Node, ShaderNodeObject } from 'three/tsl'
import type { NodeFrame } from 'three/webgpu'

/**
 * After image node class for motion trails effect.
 * 
 * Blends the current frame with the previous frame using a damping factor,
 * creating a persistence of vision effect.
 */
export class AfterImageNode extends TempNode {
  textureNode: Node
  damp: ShaderNodeObject<Node>
  private _textureNode: typeof texture | null = null
  private _compRT: RenderTarget | null = null
  private _oldRT: RenderTarget | null = null
  private _quadMesh: QuadMesh | null = null

  /**
   * @param textureNode - Input texture/color node
   * @param damp - Damping factor (0-1, higher = longer trails, default: 0.96)
   */
  constructor(textureNode: Node, damp: Node = vec4(0.96)) {
    super('vec4')

    this.textureNode = textureNode
    this.damp = nodeObject(damp)
  }

  /**
   * Setup the after image shader logic.
   */
  setup() {
    return Fn(() => {
      if (this._textureNode === null) {
        // Will be initialized in updateBefore
        return vec4(0, 0, 0, 1)
      }

      return this._textureNode
    })()
  }

  /**
   * Update render targets and perform blending.
   */
  updateBefore(frame: NodeFrame) {
    const { renderer } = frame

    // Get input texture
    const textureNode = this.textureNode
    const map = textureNode.value as any

    // Initialize render targets on first run
    if (this._compRT === null) {
      this._compRT = new RenderTarget(map.image.width, map.image.height, {
        type: HalfFloatType,
        minFilter: NearestFilter,
        magFilter: NearestFilter,
      })
    }

    if (this._oldRT === null) {
      this._oldRT = new RenderTarget(map.image.width, map.image.height, {
        type: HalfFloatType,
        minFilter: NearestFilter,
        magFilter: NearestFilter,
      })
    }

    if (this._quadMesh === null) {
      this._quadMesh = new QuadMesh()
    }

    // Blend current frame with previous frame
    const material = this._quadMesh.material
    const damping = this.damp

    material.fragmentNode = Fn(() => {
      const uvNode = uv()

      // Sample current frame
      const current = texture(map).sample(uvNode)

      // Sample previous frame (accumulated trails)
      const previous = texture(this._oldRT!.texture).sample(uvNode)

      // Blend: output = current * (1 - damp) + previous * damp
      // Higher damp = longer trails (previous frame has more influence)
      return vec4(
        current.rgb.mul(vec4(1.0).sub(damping).rgb)
          .add(previous.rgb.mul(damping.rgb)),
        1.0
      )
    })()

    // Render blended result to composition RT
    const currentRenderTarget = renderer.getRenderTarget()
    renderer.setRenderTarget(this._compRT)
    this._quadMesh.render(renderer)

    // Copy composition to old RT for next frame
    renderer.setRenderTarget(this._oldRT)
    this._quadMesh.material.fragmentNode = Fn(() => {
      return texture(this._compRT!.texture).sample(uv())
    })()
    this._quadMesh.render(renderer)

    // Restore original render target
    renderer.setRenderTarget(currentRenderTarget)

    // Set output texture
    this._textureNode = texture(this._compRT.texture)
  }

  /**
   * Dispose render targets and resources.
   */
  dispose() {
    if (this._compRT) {
      this._compRT.dispose()
      this._compRT = null
    }

    if (this._oldRT) {
      this._oldRT.dispose()
      this._oldRT = null
    }

    if (this._quadMesh) {
      this._quadMesh.dispose()
      this._quadMesh = null
    }
  }
}

/**
 * Creates an after image (motion trails) effect.
 * 
 * Blends current and previous frames to create motion blur/ghosting.
 * Higher damping values create longer, more visible trails.
 * 
 * @param texture - Input texture or color node
 * @param damp - Damping factor (vec4 or float, 0-1, default: 0.96)
 *               - 0.0 = no trail (shows only current frame)
 *               - 0.5 = 50% blend (moderate trails)
 *               - 0.96 = long trails (default, recommended)
 *               - 0.99 = very long trails
 *               - 1.0 = infinite trail (previous frame fully retained, not recommended)
 * @returns After image effect node
 * 
 * @example
 * ```typescript
 * // Basic motion trails
 * const output = afterImage(scenePass, uniform(0.96))
 * ```
 * 
 * @example
 * ```typescript
 * // Short trails (fast decay)
 * const output = afterImage(scenePass, uniform(0.7))
 * ```
 * 
 * @example
 * ```typescript
 * // Long trails (slow decay)
 * const output = afterImage(scenePass, uniform(0.98))
 * ```
 * 
 * @example
 * ```typescript
 * // Animated damping (pulsing effect)
 * const pulseDamp = uniform(0.5).add(sin(time.mul(2.0)).mul(0.3))
 * const output = afterImage(scenePass, pulseDamp)
 * ```
 * 
 * @example
 * ```typescript
 * // Per-channel damping (chromatic trails)
 * const rgbDamp = vec4(0.98, 0.95, 0.92, 1.0)
 * const output = afterImage(scenePass, rgbDamp)
 * ```
 * 
 * @remarks
 * - Creates two internal render targets for temporal blending
 * - Performance cost is minimal (single full-screen blend per frame)
 * - Works best with animated scenes
 * - Can create psychedelic effects with very high damping
 * - Remember to call `dispose()` when done to clean up resources
 */
export const afterImage = (texture: Node, damp?: Node): AfterImageNode => {
  return nodeObject(new AfterImageNode(nodeObject(texture), damp))
}

// Register node
// addNodeElement('afterImage', AfterImageNode) // Not exported in three/webgpu

export default afterImage

