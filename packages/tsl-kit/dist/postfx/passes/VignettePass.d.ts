/**
 * Vignette Pass
 *
 * Darkens the edges of the screen for a cinematic look.
 *
 * @module postfx/passes/VignettePass
 */
import { ShaderPass } from '../core/PostPass';
export interface VignettePassOptions {
    offset?: number;
    darkness?: number;
}
/**
 * Vignette effect pass
 */
export declare class VignettePass extends ShaderPass {
    constructor(options?: VignettePassOptions);
    setOffset(offset: number): void;
    setDarkness(darkness: number): void;
}
//# sourceMappingURL=VignettePass.d.ts.map