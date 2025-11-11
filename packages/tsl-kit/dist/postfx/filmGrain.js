/**
 * Film Grain Effect
 *
 * Adds subtle noise/grain to simulate analog film texture.
 * Creates a more organic, cinematic look.
 *
 * @module postfx/filmGrain
 * @category Post-Processing
 * @source fragments-boilerplate (Maxime Heckel)
 * @author Maxime Heckel
 * @license MIT
 * @version r175 → r181
 */
import { vec2, Fn, fract, sin, dot } from 'three/tsl';
/**
 * Film Grain Texture Generator
 *
 * Generates pseudo-random grain/noise pattern based on UV coordinates.
 * Uses a simple but effective hash function for randomness.
 *
 * @param _uv - UV coordinates (vec2), typically animated with time for moving grain
 * @returns Grain value in range [0, 1] (float)
 *
 * @example
 * ```typescript
 * import { filmGrainEffect } from '@tslstudio/tsl-kit/postfx';
 * import { uv, vec2, uniform, texture } from 'three/tsl';
 *
 * const time = uniform(0);
 * const sceneColor = texture(sceneTexture, uv());
 *
 * // Animated grain (moves every frame)
 * const grain = filmGrainEffect(uv().add(time.mul(0.001)));
 * const grainStrength = 0.05;
 * const final = sceneColor.rgb.add(grain.sub(0.5).mul(grainStrength));
 *
 * // Static grain
 * const staticGrain = filmGrainEffect(uv());
 *
 * // High-frequency grain
 * const fineGrain = filmGrainEffect(uv().mul(10.0).add(time.mul(0.001)));
 * ```
 */
export const filmGrainEffect = Fn(([_uv]) => {
    // Simple but effective hash function
    return fract(sin(dot(_uv, vec2(12.9898, 78.233))).mul(43758.5453123));
});
//# sourceMappingURL=filmGrain.js.map