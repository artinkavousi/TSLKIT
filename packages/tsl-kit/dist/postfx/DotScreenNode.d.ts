/**
 * Dot Screen (Halftone) Effect
 *
 * @author Three.js Contributors
 * @source https://github.com/mrdoob/three.js/blob/r181/examples/jsm/tsl/display/DotScreenNode.js
 * @license MIT
 * @version Three.js r181
 *
 * Classic halftone dot screen effect.
 *
 * Creates a newspaper/comic book printing effect by converting the image
 * into a pattern of dots whose size varies based on brightness.
 *
 * @example
 * ```typescript
 * import { dotScreen } from '@tslstudio/tsl-kit/postfx'
 * import { pass } from 'three/tsl'
 *
 * // Apply dot screen effect
 * const scenePass = pass(scene, camera)
 * const dotScreenPass = dotScreen(scenePass, screenCoordinate, 0.5, 1.0)
 * ```
 */
import { TempNode } from 'three/webgpu';
import type { Node, ShaderNodeObject } from 'three/tsl';
/**
 * Dot screen node class for halftone effect.
 *
 * Creates a classic halftone printing effect where the image is represented
 * by a grid of dots whose size varies based on the brightness of the original image.
 */
export declare class DotScreenNode extends TempNode {
    inputNode: Node;
    center: ShaderNodeObject<Node>;
    angle: ShaderNodeObject<Node>;
    scale: ShaderNodeObject<Node>;
    /**
     * @param inputNode - Input color/texture
     * @param center - Center point of the dot pattern (vec2)
     * @param angle - Rotation angle of the dot grid (float, radians)
     * @param scale - Size scale of the dots (float)
     */
    constructor(inputNode: Node, center?: Node, angle?: Node, scale?: Node);
    /**
     * Setup the dot screen shader logic.
     */
    setup(): any;
}
/**
 * Creates a dot screen (halftone) effect.
 *
 * Converts the input image into a classic halftone printing pattern
 * with dots whose size varies based on image brightness.
 *
 * @param input - Input color or texture node
 * @param center - Center point of dot pattern (vec2, default: vec2(0.5, 0.5))
 * @param angle - Rotation angle in radians (float, default: 1.57 ≈ 90°)
 * @param scale - Dot scale factor (float, default: 1.0, higher = smaller dots)
 * @returns Dot screen effect node
 *
 * @example
 * ```typescript
 * // Basic dot screen
 * const output = dotScreen(input)
 * ```
 *
 * @example
 * ```typescript
 * // Angled with custom scale
 * const output = dotScreen(input, vec2(0.5, 0.5), float(0.785), float(2.0))
 * ```
 *
 * @example
 * ```typescript
 * // Animated rotating dots
 * const animatedAngle = time.mul(0.5)
 * const output = dotScreen(input, vec2(0.5, 0.5), animatedAngle, float(1.5))
 * ```
 *
 * @example
 * ```typescript
 * // CMYK-style with multiple angles
 * const cyan = dotScreen(input, vec2(0.5, 0.5), float(0.26), float(1.0))
 * const magenta = dotScreen(input, vec2(0.5, 0.5), float(1.31), float(1.0))
 * const yellow = dotScreen(input, vec2(0.5, 0.5), float(0.52), float(1.0))
 * const combined = cyan.mul(magenta).mul(yellow)
 * ```
 */
export declare const dotScreen: (input: Node, center?: Node, angle?: Node, scale?: Node) => DotScreenNode;
export default dotScreen;
//# sourceMappingURL=DotScreenNode.d.ts.map