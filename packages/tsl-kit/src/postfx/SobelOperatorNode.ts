/**
 * Sobel Operator (Edge Detection)
 * 
 * @author Three.js Contributors
 * @source https://github.com/mrdoob/three.js/blob/r181/examples/jsm/tsl/display/SobelOperatorNode.js
 * @license MIT
 * @version Three.js r181
 * 
 * Classic Sobel operator for edge detection.
 * 
 * Detects edges in images using horizontal and vertical convolution kernels,
 * creating a stylized outline effect commonly used in NPR (Non-Photorealistic Rendering).
 * 
 * @example
 * ```typescript
 * import { sobel } from '@tslstudio/tsl-kit/postfx'
 * import { pass, uniform } from 'three/tsl'
 * 
 * // Apply edge detection
 * const scenePass = pass(scene, camera)
 * const resolution = uniform(vec2(1920, 1080))
 * const edges = sobel(scenePass, resolution)
 * ```
 */

import { TempNode, Vector2 } from 'three/webgpu'
import { Fn, vec2, vec4, uniform, luminance, max, abs, nodeObject, uv } from 'three/tsl'
// import { addNodeElement } from 'three/webgpu' // Not exported
import type { Node, ShaderNodeObject } from 'three/tsl'

/**
 * Sobel operator node class for edge detection.
 * 
 * Uses Sobel convolution kernels to detect edges in horizontal and
 * vertical directions, then combines them for final edge intensity.
 */
export class SobelOperatorNode extends TempNode {
  textureNode: Node
  resolution: ShaderNodeObject<Node>

  /**
   * @param textureNode - Input texture/color node
   * @param resolution - Screen resolution (vec2)
   */
  constructor(textureNode: Node, resolution: Node = uniform(new Vector2())) {
    super('float')

    this.textureNode = textureNode
    this.resolution = nodeObject(resolution)
  }

  /**
   * Setup the Sobel operator shader logic.
   */
  setup() {
    const { textureNode, resolution } = this

    const sobel = Fn(() => {
      // Pixel size
      const texelSize = vec2(1.0).div(resolution)

      // Sample 3x3 neighborhood
      // Grid positions:
      // tl tc tr
      // ml mc mr
      // bl bc br
      
      const uvNode = uv()

      // Top row
      const tl = luminance(textureNode.sample(uvNode.add(vec2(-1, -1).mul(texelSize))))
      const tc = luminance(textureNode.sample(uvNode.add(vec2(0, -1).mul(texelSize))))
      const tr = luminance(textureNode.sample(uvNode.add(vec2(1, -1).mul(texelSize))))

      // Middle row
      const ml = luminance(textureNode.sample(uvNode.add(vec2(-1, 0).mul(texelSize))))
      const mr = luminance(textureNode.sample(uvNode.add(vec2(1, 0).mul(texelSize))))

      // Bottom row
      const bl = luminance(textureNode.sample(uvNode.add(vec2(-1, 1).mul(texelSize))))
      const bc = luminance(textureNode.sample(uvNode.add(vec2(0, 1).mul(texelSize))))
      const br = luminance(textureNode.sample(uvNode.add(vec2(1, 1).mul(texelSize))))

      // Sobel kernels
      // Horizontal: [-1  0  1]    Vertical: [-1 -2 -1]
      //             [-2  0  2]              [ 0  0  0]
      //             [-1  0  1]              [ 1  2  1]

      // Horizontal gradient
      const gx = tl.mul(-1.0)
        .add(tr)
        .add(ml.mul(-2.0))
        .add(mr.mul(2.0))
        .add(bl.mul(-1.0))
        .add(br)

      // Vertical gradient
      const gy = tl.mul(-1.0)
        .add(tc.mul(-2.0))
        .add(tr.mul(-1.0))
        .add(bl)
        .add(bc.mul(2.0))
        .add(br)

      // Gradient magnitude
      const g = max(abs(gx), abs(gy))

      return g
    })

    return sobel()
  }
}

/**
 * Creates a Sobel edge detection effect.
 * 
 * Detects edges in the input image using the Sobel operator,
 * which computes horizontal and vertical gradients.
 * 
 * @param texture - Input texture or color node
 * @param resolution - Screen resolution (vec2, default: uniform(vec2))
 * @returns Edge intensity (float, 0 = no edge, 1 = strong edge)
 * 
 * @example
 * ```typescript
 * // Basic edge detection
 * const edges = sobel(scenePass, uniform(vec2(1920, 1080)))
 * const output = vec4(vec3(edges), 1.0) // White edges on black
 * ```
 * 
 * @example
 * ```typescript
 * // Inverted (black edges on white)
 * const edges = sobel(scenePass, resolution)
 * const output = vec4(vec3(float(1.0).sub(edges)), 1.0)
 * ```
 * 
 * @example
 * ```typescript
 * // Edge overlay on original
 * const edges = sobel(scenePass, resolution)
 * const originalColor = scenePass.sample(uv)
 * const output = originalColor.mul(float(1.0).sub(edges.mul(0.5)))
 * ```
 * 
 * @example
 * ```typescript
 * // Colored edges
 * const edges = sobel(scenePass, resolution)
 * const edgeColor = vec3(0, 1, 0) // Green edges
 * const output = vec4(edgeColor.mul(edges), 1.0)
 * ```
 * 
 * @example
 * ```typescript
 * // Toon shading with edges
 * const edges = sobel(scenePass, resolution)
 * const toonColor = floor(originalColor.mul(4.0)).div(4.0)
 * const withEdges = toonColor.mul(float(1.0).sub(edges))
 * ```
 */
export const sobel = (
  texture: Node,
  resolution?: Node
): SobelOperatorNode => {
  return nodeObject(new SobelOperatorNode(nodeObject(texture), resolution))
}

// Register node
// addNodeElement('sobel', SobelOperatorNode) // Not exported in three/webgpu

export default sobel

