/**
 * Post-Processing Pass Base Class
 *
 * Foundation for all post-processing effects.
 *
 * @module postfx/core/PostPass
 */
import * as THREE from 'three/webgpu';
/**
 * Base class for post-processing passes
 */
export class PostPass {
    constructor(options = {}) {
        this.needsSwap = true;
        this.material = null;
        this.fullScreenQuad = null;
        this.name = options.name || 'PostPass';
        this.enabled = options.enabled !== undefined ? options.enabled : true;
        this.renderToScreen = options.renderToScreen || false;
    }
    /**
     * Set the size of the pass
     */
    setSize(width, height) {
        // Override in subclasses if needed
    }
    /**
     * Dispose of resources
     */
    dispose() {
        if (this.material) {
            this.material.dispose();
        }
        if (this.fullScreenQuad) {
            this.fullScreenQuad.geometry.dispose();
        }
    }
    /**
     * Create a full-screen quad for rendering
     */
    createFullScreenQuad(material) {
        const geometry = new THREE.PlaneGeometry(2, 2);
        this.fullScreenQuad = new THREE.Mesh(geometry, material);
        this.fullScreenQuad.frustumCulled = false;
        return this.fullScreenQuad;
    }
}
/**
 * Shader pass - renders a full-screen shader effect
 */
export class ShaderPass extends PostPass {
    constructor(shader, options = {}) {
        super(options);
        this.shader = shader;
        this.uniforms = shader.uniforms || {};
    }
    initialize() {
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.shader.vertexShader || defaultVertexShader,
            fragmentShader: this.shader.fragmentShader || defaultFragmentShader,
            depthTest: false,
            depthWrite: false
        });
        this.createFullScreenQuad(this.material);
    }
    render(renderer, writeBuffer, readBuffer, deltaTime) {
        if (!this.enabled || !this.fullScreenQuad)
            return;
        // Set input texture
        if (this.uniforms.tDiffuse) {
            this.uniforms.tDiffuse.value = readBuffer.texture;
        }
        // Render to target or screen
        if (this.renderToScreen) {
            renderer.setRenderTarget(null);
        }
        else if (writeBuffer) {
            renderer.setRenderTarget(writeBuffer);
        }
        renderer.render(this.fullScreenQuad, orthoCamera);
    }
}
/**
 * Default vertex shader for full-screen quads
 */
const defaultVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;
/**
 * Default fragment shader (pass-through)
 */
const defaultFragmentShader = `
uniform sampler2D tDiffuse;
varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(tDiffuse, vUv);
}
`;
/**
 * Orthographic camera for full-screen rendering
 */
const orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
//# sourceMappingURL=PostPass.js.map