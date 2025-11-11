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
import { RenderTarget, Vector2, NodeMaterial, RendererUtils, QuadMesh, TempNode, NodeUpdateType } from 'three/webgpu';
import { nodeObject, Fn, float, uv, uniform, convertToTexture, vec2, vec4, passTexture, premultiplyAlpha, unpremultiplyAlpha } from 'three/tsl';
const _quadMesh = /*@__PURE__*/ new QuadMesh();
let _rendererState;
/**
 * Post processing node for creating a gaussian blur effect.
 *
 * @augments TempNode
 */
class GaussianBlurNode extends TempNode {
    static get type() {
        return 'GaussianBlurNode';
    }
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
    constructor(textureNode, directionNode = null, sigma = 4, options = {}) {
        super('vec4');
        this.textureNode = textureNode;
        this.directionNode = directionNode;
        this.sigma = sigma;
        this._invSize = uniform(new Vector2());
        this._passDirection = uniform(new Vector2());
        this._horizontalRT = new RenderTarget(1, 1, { depthBuffer: false });
        this._horizontalRT.texture.name = 'GaussianBlurNode.horizontal';
        this._verticalRT = new RenderTarget(1, 1, { depthBuffer: false });
        this._verticalRT.texture.name = 'GaussianBlurNode.vertical';
        this._textureNode = passTexture(this, this._verticalRT.texture);
        this._textureNode.uvNode = textureNode.uvNode;
        this.updateBeforeType = NodeUpdateType.FRAME;
        this.resolutionScale = options.resolutionScale || 1;
        this.premultipliedAlpha = options.premultipliedAlpha || false;
    }
    setSize(width, height) {
        width = Math.max(Math.round(width * this.resolutionScale), 1);
        height = Math.max(Math.round(height * this.resolutionScale), 1);
        this._invSize.value.set(1 / width, 1 / height);
        this._horizontalRT.setSize(width, height);
        this._verticalRT.setSize(width, height);
    }
    updateBefore(frame) {
        const { renderer } = frame;
        _rendererState = RendererUtils.resetRendererState(renderer, _rendererState);
        const textureNode = this.textureNode;
        const map = textureNode.value;
        const currentTexture = textureNode.value;
        _quadMesh.material = this._material;
        this.setSize(map.image.width, map.image.height);
        const textureType = map.type;
        this._horizontalRT.texture.type = textureType;
        this._verticalRT.texture.type = textureType;
        // horizontal pass
        renderer.setRenderTarget(this._horizontalRT);
        this._passDirection.value.set(1, 0);
        _quadMesh.name = 'Gaussian Blur [ Horizontal Pass ]';
        _quadMesh.render(renderer);
        // vertical pass
        textureNode.value = this._horizontalRT.texture;
        renderer.setRenderTarget(this._verticalRT);
        this._passDirection.value.set(0, 1);
        _quadMesh.name = 'Gaussian Blur [ Vertical Pass ]';
        _quadMesh.render(renderer);
        // restore
        textureNode.value = currentTexture;
        RendererUtils.restoreRendererState(renderer, _rendererState);
    }
    getTextureNode() {
        return this._textureNode;
    }
    setup(builder) {
        const textureNode = this.textureNode;
        const uvNode = uv();
        const directionNode = vec2(this.directionNode || 1);
        let sampleTexture, output;
        if (this.premultipliedAlpha) {
            sampleTexture = (uv) => premultiplyAlpha(textureNode.sample(uv));
            output = (color) => unpremultiplyAlpha(color);
        }
        else {
            sampleTexture = (uv) => textureNode.sample(uv);
            output = (color) => color;
        }
        const blur = Fn(() => {
            const kernelSize = 3 + (2 * this.sigma);
            const gaussianCoefficients = this._getCoefficients(kernelSize);
            const invSize = this._invSize;
            const direction = directionNode.mul(this._passDirection);
            const diffuseSum = vec4(sampleTexture(uvNode).mul(gaussianCoefficients[0])).toVar();
            for (let i = 1; i < kernelSize; i++) {
                const x = float(i);
                const w = float(gaussianCoefficients[i]);
                const uvOffset = vec2(direction.mul(invSize.mul(x))).toVar();
                const sample1 = sampleTexture(uvNode.add(uvOffset));
                const sample2 = sampleTexture(uvNode.sub(uvOffset));
                diffuseSum.addAssign(sample1.add(sample2).mul(w));
            }
            return output(diffuseSum);
        });
        const material = this._material || (this._material = new NodeMaterial());
        material.fragmentNode = blur().context(builder.getSharedContext());
        material.name = 'Gaussian_blur';
        material.needsUpdate = true;
        const properties = builder.getNodeProperties(this);
        properties.textureNode = textureNode;
        return this._textureNode;
    }
    dispose() {
        this._horizontalRT.dispose();
        this._verticalRT.dispose();
    }
    _getCoefficients(kernelRadius) {
        const coefficients = [];
        const sigma = kernelRadius / 3;
        for (let i = 0; i < kernelRadius; i++) {
            coefficients.push(0.39894 * Math.exp(-0.5 * i * i / (sigma * sigma)) / sigma);
        }
        return coefficients;
    }
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
export const gaussianBlur = (node, directionNode, sigma, options = {}) => nodeObject(new GaussianBlurNode(convertToTexture(node), directionNode, sigma, options));
//# sourceMappingURL=gaussianBlur.js.map