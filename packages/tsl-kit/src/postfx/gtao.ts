/**
 * GTAO (Ground Truth Ambient Occlusion)
 * 
 * High-quality screen-space ambient occlusion.
 * Adds realistic contact shadows and depth to scenes.
 * 
 * @module postfx/gtao
 * @category Post-Processing
 * @source Three.js r181 Official
 * @author Three.js Contributors, NVIDIA (GTAO algorithm)
 * @license MIT
 * @version r181
 */

// Re-export official Three.js r181 GTAO node
export { default as GTAONode, gtao } from 'three/addons/tsl/display/GTAONode.js';

/**
 * GTAO Ambient Occlusion Post-Processing
 * 
 * Ground Truth Ambient Occlusion - industry-standard SSAO technique.
 * Adds realistic shadowing in crevices and contact points.
 * 
 * **Usage:**
 * ```typescript
 * import { gtao } from '@tslstudio/tsl-kit/postfx';
 * import { pass } from 'three/tsl';
 * 
 * const scenePass = pass(scene, camera);
 * 
 * // Basic GTAO
 * const withAO = gtao(scenePass);
 * 
 * // Custom intensity
 * const strong = gtao(scenePass, 2.0);
 * 
 * // Subtle AO
 * const subtle = gtao(scenePass, 0.5);
 * 
 * // Complete AO pipeline:
 * const scene = pass(scene, camera);
 * const ao = gtao(scene, 1.5);
 * const blurred = blur(ao); // Optional: blur for smoother AO
 * const final = scene.mul(ao);
 * ```
 * 
 * **Parameters:**
 * - `node`: Input texture/pass (vec4)
 * - `intensity`: AO strength multiplier (default: 1.0)
 * 
 * **Effect Details:**
 * - Horizon-based ambient occlusion
 * - Multi-directional sampling
 * - Distance falloff
 * - Normal-aware computation
 * - Physically-based darkening
 * 
 * **Performance:** Medium-High (screen-space computation)
 * 
 * **Technical Details:**
 * - Requires depth and normal buffers (MRT)
 * - Multiple sample directions
 * - Horizon angle calculation
 * - Distance-based attenuation
 * - Can be noisy (blur recommended)
 * 
 * **Quality Factors:**
 * - Sample count (more = better, slower)
 * - Search radius (larger = more occlusion)
 * - Falloff distance
 * - Denoising/blur strength
 * 
 * **Use Cases:**
 * - Adding depth to scenes
 * - Realistic lighting
 * - Contact shadows
 * - Architectural visualization
 * - Character rendering
 * 
 * **Visual Impact:**
 * - High (dramatic improvement)
 * - Makes scenes feel grounded
 * - Adds depth perception
 * - Professional quality essential
 * 
 * **Optimization Tips:**
 * - Reduce samples on lower-end hardware
 * - Blur to hide noise
 * - Half-resolution GTAO + upscale
 * - Temporal filtering for stability
 * 
 * **Combine With:**
 * - SSR for complete screen-space lighting
 * - SSGI for indirect lighting
 * - Blur for denoising
 */

