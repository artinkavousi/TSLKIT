/**
 * Film Grain Pass
 *
 * Adds analog film grain noise for a cinematic look.
 *
 * @module postfx/passes/FilmGrainPass
 */
import * as THREE from 'three/webgpu';
import { ShaderPass } from '../core/PostPass';
export interface FilmGrainPassOptions {
    intensity?: number;
    scale?: number;
}
/**
 * Film grain effect pass
 */
export declare class FilmGrainPass extends ShaderPass {
    private time;
    constructor(options?: FilmGrainPassOptions);
    render(renderer: THREE.WebGPURenderer, writeBuffer: THREE.WebGLRenderTarget | null, readBuffer: THREE.WebGLRenderTarget, deltaTime: number): void;
    setIntensity(intensity: number): void;
    setScale(scale: number): void;
}
//# sourceMappingURL=FilmGrainPass.d.ts.map