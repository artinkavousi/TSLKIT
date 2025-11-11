/**
 * Post-Processing Chain
 *
 * Manages and renders a sequence of post-processing passes.
 *
 * @module postfx/core/PostChain
 */
import * as THREE from 'three/webgpu';
import { PostPass } from './PostPass';
export interface PostChainOptions {
    width?: number;
    height?: number;
    renderToScreen?: boolean;
}
/**
 * Post-processing chain that manages multiple passes
 */
export declare class PostChain {
    passes: PostPass[];
    private width;
    private height;
    private renderToScreen;
    private readBuffer;
    private writeBuffer;
    private renderTarget1;
    private renderTarget2;
    constructor(options?: PostChainOptions);
    /**
     * Add a pass to the chain
     */
    addPass(pass: PostPass): void;
    /**
     * Insert a pass at a specific index
     */
    insertPass(pass: PostPass, index: number): void;
    /**
     * Remove a pass from the chain
     */
    removePass(pass: PostPass): void;
    /**
     * Render the entire post-processing chain
     *
     * @param renderer - WebGPU renderer
     * @param inputBuffer - Source render target (from scene render)
     * @param deltaTime - Time since last frame
     */
    render(renderer: THREE.WebGPURenderer, inputBuffer: THREE.WebGLRenderTarget, deltaTime?: number): void;
    /**
     * Swap read and write buffers
     */
    private swapBuffers;
    /**
     * Set the size of all passes and render targets
     */
    setSize(width: number, height: number): void;
    /**
     * Get the final output texture
     */
    getOutputTexture(): THREE.Texture;
    /**
     * Dispose of all resources
     */
    dispose(): void;
    /**
     * Enable/disable a pass by name
     */
    setPassEnabled(name: string, enabled: boolean): void;
    /**
     * Get a pass by name
     */
    getPass(name: string): PostPass | undefined;
}
/**
 * Helper function to create a post-processing chain
 *
 * @param passes - Array of passes or pass configurations
 * @param options - Chain options
 */
export declare function makePostChain(passes: PostPass[], options?: PostChainOptions): PostChain;
//# sourceMappingURL=PostChain.d.ts.map