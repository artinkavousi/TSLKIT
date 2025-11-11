/**
 * SSGI (Screen Space Global Illumination)
 * 
 * Screen-space indirect lighting and color bleeding.
 * Simulates light bouncing for realistic indirect illumination.
 * 
 * @module postfx/ssgi
 * @category Post-Processing
 * @source Three.js r181 Official
 * @author Three.js Contributors
 * @license MIT
 * @version r181
 */

// Re-export official Three.js r181 SSGI node
export { default as SSGINode, ssgi } from 'three/addons/tsl/display/SSGINode.js';

/**
 * SSGI Screen Space Global Illumination
 * 
 * Real-time indirect lighting via screen-space techniques.
 * Simulates light bouncing and color bleeding.
 * 
 * **Usage:**
 * ```typescript
 * import { ssgi } from '@tslstudio/tsl-kit/postfx';
 * import { pass, mrt } from 'three/tsl';
 * 
 * // SSGI requires MRT setup
 * const scenePass = pass(scene, camera);
 * scenePass.setMRT(mrt({
 *   output: scenePass.getTextureNode(),
 *   normal: normalPass,
 *   depth: depthPass
 * }));
 * 
 * // Basic SSGI
 * const withGI = ssgi(scenePass);
 * 
 * // Custom intensity
 * const strong = ssgi(scenePass, 2.0);
 * 
 * // Complete lighting pipeline:
 * const scene = pass(scene, camera);
 * const ao = gtao(scene);
 * const gi = ssgi(scene, 1.5);
 * const reflections = ssr(scene);
 * const final = scene.add(gi).mul(ao).add(reflections);
 * ```
 * 
 * **Parameters:**
 * - `node`: Input texture/pass (vec4) with MRT
 * - `intensity`: GI contribution strength (default: 1.0)
 * - `samples`: Sample count (default: 16-32)
 * - `radius`: Sampling radius (default: 1.0)
 * 
 * **Requirements:**
 * - Scene depth buffer
 * - Scene normal buffer (MRT)
 * - Scene color buffer
 * - Camera matrices
 * 
 * **Effect Details:**
 * - Multi-directional sampling
 * - Color bleeding from nearby surfaces
 * - Distance-based falloff
 * - Normal-aware gathering
 * - Indirect diffuse lighting
 * 
 * **Performance:** Very High (expensive)
 * 
 * **What It Adds:**
 * - Bounced light from surfaces
 * - Color bleeding (red wall → red light)
 * - Indirect illumination
 * - Softer, more realistic lighting
 * - Ambient color variation
 * 
 * **Quality Factors:**
 * - Sample count (more = better, much slower)
 * - Sampling radius
 * - Denoising strength
 * - Temporal accumulation
 * - Multi-bounce approximation
 * 
 * **Use Cases:**
 * - Realistic indoor lighting
 * - Color bleeding effects
 * - Soft ambient lighting
 * - Cornell box scenarios
 * - Architectural visualization
 * - Film-quality rendering
 * 
 * **Visual Impact:**
 * - Very High (transforms lighting)
 * - Most realistic lighting possible
 * - Film/game cinematic quality
 * 
 * **Limitations:**
 * - Very expensive (GPU intensive)
 * - Requires denoising (noisy output)
 * - Screen-space limitations
 * - Temporal instability
 * - Not suitable for real-time on all hardware
 * 
 * **Optimization Tips:**
 * - Quarter-resolution + upscale
 * - Reduce sample count aggressively
 * - Temporal accumulation (essential)
 * - Bilateral blur denoising
 * - Checkerboard rendering
 * - Only enable on high-end hardware
 * 
 * **Combine With:**
 * - GTAO (essential, they complement)
 * - SSR (for specular GI)
 * - TAA (for temporal stability)
 * - Aggressive denoising
 * 
 * **Note:** SSGI is the most expensive effect.
 * Consider it optional/quality setting.
 */

