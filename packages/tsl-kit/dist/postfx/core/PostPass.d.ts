/**
 * Post-Processing Pass Base Class
 *
 * Foundation for all post-processing effects.
 *
 * @module postfx/core/PostPass
 */
import * as THREE from 'three/webgpu';
export interface PostPassOptions {
    name?: string;
    enabled?: boolean;
    renderToScreen?: boolean;
}
/**
 * Base class for post-processing passes
 */
export declare abstract class PostPass {
    name: string;
    enabled: boolean;
    renderToScreen: boolean;
    needsSwap: boolean;
    protected material: THREE.Material | null;
    protected fullScreenQuad: THREE.Mesh | null;
    constructor(options?: PostPassOptions);
    /**
     * Initialize the pass (create materials, geometry, etc.)
     */
    abstract initialize(): void;
    /**
     * Render the pass
     *
     * @param renderer - WebGPU renderer
     * @param writeBuffer - Target render target
     * @param readBuffer - Source render target
     * @param deltaTime - Time since last frame
     */
    abstract render(renderer: THREE.WebGPURenderer, writeBuffer: THREE.WebGLRenderTarget | null, readBuffer: THREE.WebGLRenderTarget, deltaTime: number): void;
    /**
     * Set the size of the pass
     */
    setSize(width: number, height: number): void;
    /**
     * Dispose of resources
     */
    dispose(): void;
    /**
     * Create a full-screen quad for rendering
     */
    protected createFullScreenQuad(material: THREE.Material): THREE.Mesh;
}
/**
 * Shader pass - renders a full-screen shader effect
 */
export declare class ShaderPass extends PostPass {
    private shader;
    uniforms: Record<string, THREE.IUniform>;
    constructor(shader: {
        uniforms?: Record<string, THREE.IUniform>;
        vertexShader?: string;
        fragmentShader?: string;
    }, options?: PostPassOptions);
    initialize(): void;
    render(renderer: THREE.WebGPURenderer, writeBuffer: THREE.WebGLRenderTarget | null, readBuffer: THREE.WebGLRenderTarget, deltaTime: number): void;
}
//# sourceMappingURL=PostPass.d.ts.map