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
import { TempNode } from 'three/webgpu';
import type { Node, ShaderNodeObject } from 'three/tsl';
import type { NodeFrame } from 'three/webgpu';
/**
 * After image node class for motion trails effect.
 *
 * Blends the current frame with the previous frame using a damping factor,
 * creating a persistence of vision effect.
 */
export declare class AfterImageNode extends TempNode {
    textureNode: Node;
    damp: ShaderNodeObject<Node>;
    private _textureNode;
    private _compRT;
    private _oldRT;
    private _quadMesh;
    /**
     * @param textureNode - Input texture/color node
     * @param damp - Damping factor (0-1, higher = longer trails, default: 0.96)
     */
    constructor(textureNode: Node, damp?: Node);
    /**
     * Setup the after image shader logic.
     */
    setup(): any;
    /**
     * Update render targets and perform blending.
     */
    updateBefore(frame: NodeFrame): void;
    /**
     * Dispose render targets and resources.
     */
    dispose(): void;
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
export declare const afterImage: (texture: Node, damp?: Node) => AfterImageNode;
export default afterImage;
//# sourceMappingURL=AfterImageNode.d.ts.map