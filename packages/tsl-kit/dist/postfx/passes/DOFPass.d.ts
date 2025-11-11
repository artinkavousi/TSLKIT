/**
 * Depth of Field Pass
 *
 * Simulates camera lens focus with bokeh blur.
 *
 * @module postfx/passes/DOFPass
 */
import * as THREE from 'three/webgpu';
import { PostPass } from '../core/PostPass';
export interface DOFPassOptions {
    focus?: number;
    aperture?: number;
    maxblur?: number;
}
/**
 * Depth of Field pass with bokeh effect
 */
export declare class DOFPass extends PostPass {
    private focus;
    private aperture;
    private maxblur;
    private camera;
    constructor(camera: THREE.Camera, options?: DOFPassOptions);
    initialize(): void;
    render(renderer: THREE.WebGPURenderer, writeBuffer: THREE.WebGLRenderTarget | null, readBuffer: THREE.WebGLRenderTarget, deltaTime: number): void;
    setFocus(focus: number): void;
    setAperture(aperture: number): void;
    setMaxBlur(maxblur: number): void;
}
//# sourceMappingURL=DOFPass.d.ts.map