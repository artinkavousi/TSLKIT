/**
 * Canvas Weave Effect
 *
 * Simulates canvas/fabric texture with woven threads.
 * Adds organic texture and painterly quality.
 *
 * @module postfx/canvasWeave
 * @category Post-Processing
 * @source fragments-boilerplate (Maxime Heckel)
 * @author Maxime Heckel
 * @license MIT
 * @version r175 → r181
 */
/**
 * Canvas Weave Texture Effect
 *
 * Creates a procedural canvas/fabric weave pattern with subtle irregularities.
 * Uses FBM noise to add organic variation to the weave pattern.
 *
 * @param _uv - UV coordinates (vec2)
 * @returns Weave texture value [0.9, 1.0] (subtle darkening in thread gaps)
 *
 * @example
 * ```typescript
 * import { canvasWeaveEffect } from '@tslstudio/tsl-kit/postfx';
 * import { texture, uv } from 'three/tsl';
 *
 * const sceneColor = texture(sceneTexture, uv());
 *
 * // Basic canvas weave
 * const weave = canvasWeaveEffect(uv());
 * const final = sceneColor.rgb.mul(weave);
 *
 * // Fine canvas (higher frequency)
 * const fineWeave = canvasWeaveEffect(uv().mul(2.0));
 *
 * // Coarse canvas (lower frequency)
 * const coarseWeave = canvasWeaveEffect(uv().mul(0.5));
 *
 * // Colored canvas tint
 * const tintColor = vec3(0.98, 0.96, 0.92); // warm paper tone
 * const tinted = sceneColor.rgb.mul(weave).mul(tintColor);
 * ```
 */
export declare const canvasWeaveEffect: any;
//# sourceMappingURL=canvasWeave.d.ts.map