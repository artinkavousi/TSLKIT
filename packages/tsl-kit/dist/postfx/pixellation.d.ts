/**
 * Pixellation Effect
 *
 * Creates a pixelated/mosaic effect by quantizing UV coordinates.
 * Perfect for retro aesthetics, censoring, or stylized looks.
 *
 * @module postfx/pixellation
 * @category Post-Processing
 * @source fragments-boilerplate (Maxime Heckel)
 * @author Maxime Heckel
 * @license MIT
 * @version r175 → r181
 */
/**
 * Pixellation Effect
 *
 * Quantizes UV coordinates to create pixelated/mosaic appearance.
 * Reduces image resolution in a blocky, retro style.
 *
 * @param _uv - UV coordinates (vec2), should be aspect-corrected
 * @param size - Pixel block size in screen pixels (default: 20.0)
 * @returns Quantized UV coordinates (vec2)
 *
 * @example
 * ```typescript
 * import { pixellationEffect } from '@tslstudio/tsl-kit/postfx';
 * import { texture, uv, float } from 'three/tsl';
 * import { screenAspectUV } from '@tslstudio/tsl-kit/utils';
 *
 * const resolution = uniform(vec2(1920, 1080));
 *
 * // Basic pixellation
 * const aspectUV = screenAspectUV(resolution);
 * const pixelatedUV = pixellationEffect(aspectUV, float(20.0));
 * const pixelated = texture(sceneTexture, pixelatedUV);
 *
 * // Heavy pixellation (8-bit style)
 * const retro = pixellationEffect(aspectUV, float(50.0));
 *
 * // Subtle pixellation
 * const subtle = pixellationEffect(aspectUV, float(5.0));
 *
 * // Animated pixellation
 * const time = uniform(0);
 * const animatedSize = float(10.0).add(sin(time).mul(15.0));
 * const animated = pixellationEffect(aspectUV, animatedSize);
 * ```
 */
export declare const pixellationEffect: any;
//# sourceMappingURL=pixellation.d.ts.map