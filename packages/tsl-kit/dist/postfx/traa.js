/**
 * TRAA (Temporal Reprojection Anti-Aliasing)
 *
 * Temporal anti-aliasing using frame history for superior quality.
 * Combines current and previous frames to reduce aliasing over time.
 *
 * @module postfx/traa
 * @category Post-Processing
 * @source Three.js r181 Official
 * @author Three.js Contributors
 * @license MIT
 * @version r181
 */
// Re-export official Three.js r181 TRAA node
export { default as TRAANode, traa } from 'three/addons/tsl/display/TRAANode.js';
/**
 * TRAA Temporal Anti-Aliasing
 *
 * Highest quality anti-aliasing using temporal data.
 * Accumulates samples over time for film-like smoothness.
 *
 * **Usage:**
 * ```typescript
 * import { traa } from '@tslstudio/tsl-kit/postfx';
 * import { pass } from 'three/tsl';
 *
 * const scenePass = pass(scene, camera);
 *
 * // Basic TRAA
 * const antialiased = traa(scenePass);
 *
 * // TRAA requires velocity/motion data for best results
 * // It will automatically handle reprojection
 * ```
 *
 * **Parameters:**
 * - `node`: Input texture/pass (vec4)
 *
 * **Effect Details:**
 * - Temporal accumulation of samples
 * - Motion vector-based reprojection
 * - Ghosting reduction
 * - Jitter-based super-sampling
 * - Multi-frame blending
 *
 * **Performance:** Medium (requires history buffer)
 *
 * **Quality Comparison:**
 * - Best quality anti-aliasing
 * - Better than SMAA/FXAA
 * - Can achieve super-sampled quality
 * - Reduces temporal aliasing (flickering)
 *
 * **Advantages:**
 * - Smoothest edges
 * - Reduces flickering/shimmering
 * - No geometry cost
 * - Progressive improvement over frames
 *
 * **Limitations:**
 * - Ghosting on fast motion
 * - Requires 1-2 frames to stabilize
 * - History buffer memory cost
 * - Less effective in VR (high motion)
 *
 * **Use Cases:**
 * - Cinematic rendering
 * - Slow-to-medium camera movement
 * - Desktop/console targets
 * - When quality is paramount
 * - Reducing temporal aliasing
 *
 * **Best With:**
 * - Camera motion blur (hides ghosting)
 * - Stable camera movement
 * - High frame rates (60+ fps)
 */
//# sourceMappingURL=traa.js.map