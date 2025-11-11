/**
 * Gaussian Blur Post-Processing
 *
 * @author Three.js Authors
 * @source three.js r181 official examples
 * @license MIT
 * @version Three.js r181+
 *
 * Official Three.js GaussianBlurNode for high-quality blur effects.
 * Uses two-pass separable gaussian kernel for efficient blurring.
 *
 * This is the official implementation from Three.js r181 examples,
 * included here for convenience as it's a core post-processing effect.
 */
import { TempNode } from 'three/webgpu';
/**
 * Post processing node for creating a gaussian blur effect.
 *
 * @augments TempNode
 */
declare class GaussianBlurNode extends TempNode {
    textureNode: any;
    directionNode: any;
    sigma: number;
    _invSize: any;
    _passDirection: any;
    _horizontalRT: any;
    _verticalRT: any;
    _textureNode: any;
    _material: any;
    resolutionScale: number;
    premultipliedAlpha: boolean;
    updateBeforeType: any;
    static get type(): string;
    /**
     * Constructs a new gaussian blur node.
     *
     * @param {TextureNode} textureNode - The texture node that represents the input of the effect.
     * @param {Node<vec2|float>} directionNode - Defines the direction and radius of the blur.
     * @param {number} sigma - Controls the kernel of the blur filter. Higher values mean a wider blur radius.
     * @param {Object} [options={}] - Additional options for the gaussian blur effect.
     * @param {boolean} [options.premultipliedAlpha=false] - Whether to use premultiplied alpha for the blur effect.
     * @param {number} [options.resolutionScale=1] - The resolution of the effect. 0.5 means half the resolution of the texture node.
     */
    constructor(textureNode: any, directionNode?: any, sigma?: number, options?: {
        premultipliedAlpha?: boolean;
        resolutionScale?: number;
    });
    setSize(width: any, height: any): void;
    updateBefore(frame: any): void;
    getTextureNode(): any;
    setup(builder: any): any;
    dispose(): void;
    _getCoefficients(kernelRadius: any): any[];
}
export default GaussianBlurNode;
/**
 * TSL function for creating a gaussian blur node for post processing.
 *
 * @param {Node<vec4>} node - The node that represents the input of the effect.
 * @param {Node<vec2|float>} directionNode - Defines the direction and radius of the blur.
 * @param {number} sigma - Controls the kernel of the blur filter. Higher values mean a wider blur radius.
 * @param {Object} [options={}] - Additional options for the gaussian blur effect.
 * @param {boolean} [options.premultipliedAlpha=false] - Whether to use premultiplied alpha for the blur effect.
 * @param {number} [options.resolutionScale=1] - The resolution of the effect. 0.5 means half the resolution of the texture node.
 * @returns {GaussianBlurNode}
 *
 * @example
 * ```typescript
 * import { gaussianBlur } from '@tslstudio/tsl-kit/postfx'
 * import { texture } from 'three/tsl'
 *
 * const blurred = gaussianBlur(texture(myTexture), null, 5, { resolutionScale: 0.5 })
 * ```
 */
export declare const gaussianBlur: (node: any, directionNode: any, sigma: any, options?: {}) => any;
//# sourceMappingURL=gaussianBlur.d.ts.map