/**
 * Color Grading Pass
 *
 * Cinematic color correction with lift/gamma/gain controls.
 *
 * @module postfx/passes/ColorGradingPass
 */
import * as THREE from 'three/webgpu';
import { ShaderPass } from '../core/PostPass';
export interface ColorGradingPassOptions {
    lift?: THREE.Vector3;
    gamma?: THREE.Vector3;
    gain?: THREE.Vector3;
    saturation?: number;
    contrast?: number;
    brightness?: number;
}
/**
 * Color grading pass with lift/gamma/gain controls
 */
export declare class ColorGradingPass extends ShaderPass {
    constructor(options?: ColorGradingPassOptions);
    setLift(lift: THREE.Vector3): void;
    setGamma(gamma: THREE.Vector3): void;
    setGain(gain: THREE.Vector3): void;
    setSaturation(saturation: number): void;
    setContrast(contrast: number): void;
    setBrightness(brightness: number): void;
}
//# sourceMappingURL=ColorGradingPass.d.ts.map