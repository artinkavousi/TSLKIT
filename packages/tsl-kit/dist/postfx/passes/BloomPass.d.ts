/**
 * Bloom Pass
 *
 * Glow effect for bright areas using gaussian blur.
 *
 * @module postfx/passes/BloomPass
 */
import * as THREE from 'three/webgpu';
import { PostPass } from '../core/PostPass';
export interface BloomPassOptions {
    threshold?: number;
    strength?: number;
    radius?: number;
    levels?: number;
}
/**
 * Bloom post-processing pass
 */
export declare class BloomPass extends PostPass {
    private threshold;
    private strength;
    private radius;
    private levels;
    private separateRenderTargets;
    private brightnessMaterial;
    private blurMaterial;
    private compositeMaterial;
    constructor(options?: BloomPassOptions);
    initialize(): void;
    render(renderer: THREE.WebGPURenderer, writeBuffer: THREE.WebGLRenderTarget | null, readBuffer: THREE.WebGLRenderTarget, deltaTime: number): void;
    setSize(width: number, height: number): void;
    setThreshold(threshold: number): void;
    setStrength(strength: number): void;
    dispose(): void;
}
//# sourceMappingURL=BloomPass.d.ts.map