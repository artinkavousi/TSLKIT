/**
 * Screen Space Reflections Pass
 *
 * GPU-accelerated screen-space reflections using depth buffer raymarching.
 *
 * @module postfx/passes/SSRPass
 */
import * as THREE from 'three/webgpu';
import { PostPass } from '../core/PostPass';
export interface SSRPassOptions {
    maxDistance?: number;
    resolution?: number;
    steps?: number;
    binarySearchSteps?: number;
    maxRoughness?: number;
    jitter?: number;
    fade?: number;
    thickness?: number;
}
/**
 * Screen Space Reflections pass
 *
 * Requires depth and normal buffers from scene render.
 */
export declare class SSRPass extends PostPass {
    private maxDistance;
    private resolution;
    private steps;
    private binarySearchSteps;
    private maxRoughness;
    private jitter;
    private fade;
    private thickness;
    constructor(camera: THREE.Camera, options?: SSRPassOptions);
    initialize(): void;
    render(renderer: THREE.WebGPURenderer, writeBuffer: THREE.WebGLRenderTarget | null, readBuffer: THREE.WebGLRenderTarget, deltaTime: number): void;
    setMaxDistance(distance: number): void;
    setSteps(steps: number): void;
}
//# sourceMappingURL=SSRPass.d.ts.map