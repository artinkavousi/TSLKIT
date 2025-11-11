/**
 * Tone Mapping Pass
 *
 * HDR to LDR tone mapping with multiple curve options.
 *
 * @module postfx/passes/ToneMapPass
 */
import { ShaderPass } from '../core/PostPass';
export type ToneMappingMode = 'linear' | 'reinhard' | 'cineon' | 'aces' | 'filmic' | 'uncharted2';
export interface ToneMapPassOptions {
    mode?: ToneMappingMode;
    exposure?: number;
    whitePoint?: number;
}
/**
 * Tone mapping pass with multiple tone curve options
 */
export declare class ToneMapPass extends ShaderPass {
    constructor(options?: ToneMapPassOptions);
    setMode(mode: ToneMappingMode): void;
    setExposure(exposure: number): void;
    setWhitePoint(whitePoint: number): void;
}
//# sourceMappingURL=ToneMapPass.d.ts.map