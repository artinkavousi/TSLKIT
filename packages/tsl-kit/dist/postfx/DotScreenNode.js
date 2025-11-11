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
import { Fn, float, vec2, vec4, uv, sin, cos, nodeObject } from 'three/tsl';
/**
 * Dot screen node class for halftone effect.
 *
 * Creates a classic halftone printing effect where the image is represented
 * by a grid of dots whose size varies based on the brightness of the original image.
 */
export class DotScreenNode extends TempNode {
    /**
     * @param inputNode - Input color/texture
     * @param center - Center point of the dot pattern (vec2)
     * @param angle - Rotation angle of the dot grid (float, radians)
     * @param scale - Size scale of the dots (float)
     */
    constructor(inputNode, center = vec2(0.5, 0.5), angle = float(1.57), scale = float(1.0)) {
        super('vec4');
        this.inputNode = inputNode;
        this.center = nodeObject(center);
        this.angle = nodeObject(angle);
        this.scale = nodeObject(scale);
    }
    /**
     * Setup the dot screen shader logic.
     */
    setup() {
        const inputNode = this.inputNode;
        const center = this.center;
        const angle = this.angle;
        const scale = this.scale;
        const dotScreen = Fn(() => {
            // Get input color
            const color = vec4(inputNode);
            // Calculate rotated UV coordinates
            const pattern = uv().sub(center);
            const s = sin(angle);
            const c = cos(angle);
            // Apply rotation matrix
            const uvRotated = vec2(c.mul(pattern.x).sub(s.mul(pattern.y)), s.mul(pattern.x).add(c.mul(pattern.y))).mul(scale);
            // Create dot pattern using sine waves
            const dotSize = float(1.0).sub(sin(uvRotated.x).mul(sin(uvRotated.y)).mul(4.0));
            // Calculate brightness (luminance)
            const brightness = color.r.mul(0.299).add(color.g.mul(0.587)).add(color.b.mul(0.114));
            // Modulate dot visibility based on brightness
            const dots = brightness.mul(10.0).sub(5.0).add(dotSize);
            // Create final dot pattern
            const result = dots.greaterThan(0.0).select(vec4(1.0), vec4(0.0));
            // Preserve alpha channel
            return vec4(result.rgb, color.a);
        });
        return dotScreen();
    }
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
export const dotScreen = (input, center, angle, scale) => {
    return nodeObject(new DotScreenNode(nodeObject(input), center, angle, scale));
};
// Register node
// addNodeElement('dotScreen', DotScreenNode) // Not exported in three/webgpu
export default dotScreen;
//# sourceMappingURL=DotScreenNode.js.map