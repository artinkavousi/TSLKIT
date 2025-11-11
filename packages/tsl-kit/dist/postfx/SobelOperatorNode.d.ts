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
import { TempNode } from 'three/webgpu';
import type { Node, ShaderNodeObject } from 'three/tsl';
/**
 * Sobel operator node class for edge detection.
 *
 * Uses Sobel convolution kernels to detect edges in horizontal and
 * vertical directions, then combines them for final edge intensity.
 */
export declare class SobelOperatorNode extends TempNode {
    textureNode: Node;
    resolution: ShaderNodeObject<Node>;
    /**
     * @param textureNode - Input texture/color node
     * @param resolution - Screen resolution (vec2)
     */
    constructor(textureNode: Node, resolution?: Node);
    /**
     * Setup the Sobel operator shader logic.
     */
    setup(): any;
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
export declare const sobel: (texture: Node, resolution?: Node) => SobelOperatorNode;
export default sobel;
//# sourceMappingURL=SobelOperatorNode.d.ts.map