/**
 * Ground Truth Ambient Occlusion Pass
 *
 * High-quality screen-space ambient occlusion.
 *
 * @module postfx/passes/GTAOPass
 */
import * as THREE from 'three/webgpu';
import { PostPass } from '../core/PostPass';
export interface GTAOPassOptions {
    radius?: number;
    distanceExponent?: number;
    thickness?: number;
    scale?: number;
    samples?: number;
    distanceFallOff?: number;
    screenSpaceRadius?: boolean;
}
/**
 * Ground Truth Ambient Occlusion pass
 *
 * Requires depth and normal buffers.
 */
export declare class GTAOPass extends PostPass {
    private radius;
    private distanceExponent;
    private thickness;
    private scale;
    private samples;
    private distanceFallOff;
    private screenSpaceRadius;
    constructor(camera: THREE.Camera, options?: GTAOPassOptions);
    initialize(): void;
    render(renderer: THREE.WebGPURenderer, writeBuffer: THREE.WebGLRenderTarget | null, readBuffer: THREE.WebGLRenderTarget, deltaTime: number): void;
    setRadius(radius: number): void;
    setScale(scale: number): void;
}
//# sourceMappingURL=GTAOPass.d.ts.map