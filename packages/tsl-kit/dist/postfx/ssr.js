/**
 * SSR (Screen Space Reflections)
 *
 * Real-time reflections using screen-space ray marching.
 * Adds reflective surfaces without expensive ray tracing.
 *
 * @module postfx/ssr
 * @category Post-Processing
 * @source Three.js r181 Official
 * @author Three.js Contributors
 * @license MIT
 * @version r181
 */
// Re-export official Three.js r181 SSR node
export { default as SSRNode, ssr } from 'three/addons/tsl/display/SSRNode.js';
/**
 * SSR Screen Space Reflections
 *
 * Real-time reflections via screen-space ray marching.
 * Creates realistic reflections on any surface.
 *
 * **Usage:**
 * ```typescript
 * import { ssr } from '@tslstudio/tsl-kit/postfx';
 * import { pass, mrt } from 'three/tsl';
 *
 * // SSR requires MRT (Multiple Render Targets)
 * const scenePass = pass(scene, camera);
 * scenePass.setMRT(mrt({
 *   output: scenePass.getTextureNode(),
 *   normal: normalPass,
 *   depth: depthPass,
 *   roughness: roughnessPass
 * }));
 *
 * // Basic SSR
 * const reflected = ssr(scenePass);
 *
 * // Custom settings
 * const customSSR = ssr(
 *   scenePass,
 *   1.0,    // intensity
 *   32,     // max steps
 *   0.5,    // thickness
 *   0.1     // max roughness
 * );
 * ```
 *
 * **Parameters:**
 * - `node`: Input texture/pass (vec4) with MRT
 * - `intensity`: Reflection strength (default: 1.0)
 * - `maxSteps`: Ray march steps (default: 32)
 * - `thickness`: Surface thickness (default: 0.5)
 * - `maxRoughness`: Max roughness for reflections (default: 0.1)
 *
 * **Requirements:**
 * - Scene depth buffer
 * - Scene normal buffer (MRT)
 * - Scene roughness/metallic (optional but better)
 * - Camera matrices
 *
 * **Effect Details:**
 * - Screen-space ray marching
 * - Depth-based hit detection
 * - Roughness-based blur
 * - Fresnel falloff
 * - Edge fade-out
 *
 * **Performance:** High (ray marching per pixel)
 *
 * **Limitations:**
 * - Only reflects what's on screen
 * - No off-screen reflections
 * - Edge artifacts at screen borders
 * - Performance sensitive to max steps
 * - Grainy on rough surfaces (needs blur)
 *
 * **Quality Factors:**
 * - Step count (more = better, slower)
 * - Thickness parameter (affects hit detection)
 * - Jittering for smoothness
 * - Temporal stability
 * - Blur for rough materials
 *
 * **Use Cases:**
 * - Wet floors
 * - Metallic surfaces
 * - Water reflections
 * - Glossy materials
 * - Mirrors
 * - Polished surfaces
 *
 * **Visual Impact:**
 * - Very High (dramatic effect)
 * - Essential for realism
 * - Modern AAA quality
 *
 * **Optimization Tips:**
 * - Half-resolution SSR + upscale
 * - Reduce steps on lower-end hardware
 * - Roughness-based step reduction
 * - Temporal accumulation
 * - Hierarchical depth buffer
 *
 * **Combine With:**
 * - GTAO for complete lighting
 * - SSGI for indirect lighting
 * - TAA for temporal stability
 * - Blur for rough reflections
 */
//# sourceMappingURL=ssr.js.map