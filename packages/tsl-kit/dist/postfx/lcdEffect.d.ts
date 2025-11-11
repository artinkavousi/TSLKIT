/**
 * LCD Screen Effect
 *
 * Simulates an LCD/LED screen with visible pixel grid.
 * Creates retro digital display aesthetics.
 *
 * @module postfx/lcdEffect
 * @category Post-Processing
 * @source fragments-boilerplate (Maxime Heckel)
 * @author Maxime Heckel
 * @license MIT
 * @version r175 → r181
 */
import { ShaderNodeObject, Node } from 'three/tsl';
/**
 * LCD Effect Configuration
 */
export interface LCDEffectOptions {
    /** Render resolution (default: screenSize) */
    resolution?: ShaderNodeObject<Node>;
    /** LCD pixel density (default: 10) */
    scalar?: number;
    /** Size of individual pixels (default: 2.1) */
    zoom?: number;
    /** Sharpness of pixel edges (default: 1.8) */
    exponent?: number;
    /** Threshold for pixel visibility (default: 0.2) */
    edge?: number;
}
/**
 * LCD Screen Effect
 *
 * Creates a pixelated LCD/LED display effect with visible pixel grid.
 * Includes multiple pattern options (circle, diamond, square).
 *
 * @param props - Effect configuration options
 * @returns LCD pattern mask (0 = gaps between pixels, 1 = pixel centers)
 *
 * @example
 * ```typescript
 * import { lcdEffect } from '@tslstudio/tsl-kit/postfx';
 * import { texture, uv, uniform, vec2 } from 'three/tsl';
 *
 * const resolution = uniform(vec2(1920, 1080));
 * const sceneColor = texture(sceneTexture, uv());
 *
 * // Basic LCD effect
 * const lcd = lcdEffect({ resolution });
 * const final = sceneColor.rgb.mul(lcd);
 *
 * // High-density display
 * const hdLcd = lcdEffect({
 *   resolution,
 *   scalar: 20,    // smaller pixels
 *   zoom: 2.5,
 *   exponent: 2.0  // sharper edges
 * });
 *
 * // Retro low-res display
 * const retroLcd = lcdEffect({
 *   resolution,
 *   scalar: 5,     // larger pixels
 *   zoom: 1.8,
 *   edge: 0.3
 * });
 * ```
 */
export declare const lcdEffect: any;
//# sourceMappingURL=lcdEffect.d.ts.map