/**
 * SMAA (Subpixel Morphological Anti-Aliasing)
 *
 * High-quality post-processing anti-aliasing with better quality than FXAA.
 * Uses morphological filtering for superior edge smoothing.
 *
 * @module postfx/smaa
 * @category Post-Processing
 * @source Three.js r181 Official
 * @author Three.js Contributors, SMAA Team
 * @license MIT
 * @version r181
 */
// Re-export official Three.js r181 SMAA node
export { default as SMAANode, smaa } from 'three/addons/tsl/display/SMAANode.js';
/**
 * SMAA Anti-Aliasing Post-Processing
 *
 * Superior quality anti-aliasing compared to FXAA.
 * Uses pattern matching and morphological filtering.
 *
 * **Usage:**
 * ```typescript
 * import { smaa } from '@tslstudio/tsl-kit/postfx';
 * import { pass } from 'three/tsl';
 *
 * const scenePass = pass(scene, camera);
 *
 * // Basic SMAA
 * const antialiased = smaa(scenePass);
 *
 * // Common pipeline with SMAA:
 * // 1. Scene render
 * const scene = pass(scene, camera);
 *
 * // 2. Tone mapping
 * const toneMapped = acesTonemap(scene);
 *
 * // 3. SMAA (better quality than FXAA)
 * const final = smaa(toneMapped);
 * ```
 *
 * **Parameters:**
 * - `node`: Input texture/pass (vec4)
 *
 * **Effect Details:**
 * - Edge detection with pattern matching
 * - Morphological filtering
 * - Subpixel-accurate anti-aliasing
 * - Better preservation of texture detail vs FXAA
 * - Two-pass algorithm
 *
 * **Performance:** Medium-High (slower than FXAA, faster than TAA)
 *
 * **Quality Comparison:**
 * - Better than FXAA (less blur, better edges)
 * - Similar to MSAA 4x
 * - Less ghosting than TAA
 * - Better texture preservation
 *
 * **Use Cases:**
 * - High-quality anti-aliasing
 * - When FXAA is too blurry
 * - Static or slow-moving scenes
 * - Desktop/high-performance targets
 *
 * **Trade-offs:**
 * - Slower than FXAA (~1.5-2x cost)
 * - Still fast enough for real-time
 * - Best quality/performance ratio
 */
//# sourceMappingURL=smaa.js.map