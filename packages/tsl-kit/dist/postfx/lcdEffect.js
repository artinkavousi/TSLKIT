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
import { Fn, fract, pow, uniform, smoothstep, length, screenSize, float } from 'three/tsl';
import { screenAspectUV } from '../utils/screenAspectUV';
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
export const lcdEffect = Fn(([props]) => {
    const resolution = props?.resolution || screenSize;
    const scalar = props?.scalar !== undefined ? float(props.scalar) : float(10);
    const zoom = props?.zoom !== undefined ? uniform(float(props.zoom)) : uniform(float(2.1));
    const exponent = props?.exponent !== undefined ? uniform(float(props.exponent)) : uniform(float(1.8));
    const edge = props?.edge !== undefined ? uniform(float(props.edge)) : uniform(float(0.2));
    const _uv = screenAspectUV(resolution).toVar();
    const _scaledRes = resolution.div(scalar);
    _uv.assign(fract(_uv.mul(_scaledRes)).sub(0.5));
    // Circle pattern (default)
    const pattern = length(_uv.mul(zoom)).oneMinus().toVar();
    pattern.assign(smoothstep(edge, float(1.0), pattern));
    pattern.assign(pow(pattern, exponent));
    return pattern;
});
//# sourceMappingURL=lcdEffect.js.map