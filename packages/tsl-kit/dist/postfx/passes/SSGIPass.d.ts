/**
 * Screen Space Global Illumination Pass
 *
 * Approximates indirect lighting using screen-space information.
 *
 * @module postfx/passes/SSGIPass
 */
import * as THREE from 'three/webgpu';
import { PostPass } from '../core/PostPass';
export interface SSGIPassOptions {
    distance?: number;
    thickness?: number;
    autoThickness?: boolean;
    maxRoughness?: number;
    blend?: number;
    denoiseIterations?: number;
    denoiseKernel?: number;
    denoiseDiffuse?: number;
    denoiseSpecular?: number;
    depthPhi?: number;
    normalPhi?: number;
    roughnessPhi?: number;
    envBlur?: number;
    importanceSampling?: boolean;
    steps?: number;
    refineSteps?: number;
    spp?: number;
    resolutionScale?: number;
    missedRays?: boolean;
}
/**
 * Screen Space Global Illumination pass
 *
 * Advanced indirect lighting approximation.
 */
export declare class SSGIPass extends PostPass {
    private distance;
    private thickness;
    private steps;
    private refineSteps;
    private blend;
    private resolutionScale;
    constructor(camera: THREE.Camera, options?: SSGIPassOptions);
    initialize(): void;
    render(renderer: THREE.WebGPURenderer, writeBuffer: THREE.WebGLRenderTarget | null, readBuffer: THREE.WebGLRenderTarget, deltaTime: number): void;
    setDistance(distance: number): void;
    setBlend(blend: number): void;
}
//# sourceMappingURL=SSGIPass.d.ts.map