/**
 * FXAA (Fast Approximate Anti-Aliasing)
 * 
 * Post-processing anti-aliasing that smooths jagged edges.
 * Fast, efficient alternative to MSAA for WebGPU rendering.
 * 
 * @module postfx/fxaa
 * @category Post-Processing
 * @source Three.js r181 Official
 * @author Three.js Contributors, NVIDIA (FXAA algorithm)
 * @license MIT
 * @version r181
 */

// Re-export official Three.js r181 FXAA node
export { default as FXAANode, fxaa } from 'three/addons/tsl/display/FXAANode.js';

/**
 * FXAA Anti-Aliasing Post-Processing
 * 
 * **Important:** FXAA requires sRGB input, so tone mapping and color space 
 * conversion must happen BEFORE anti-aliasing.
 * 
 * **Usage:**
 * ```typescript
 * import { fxaa } from '@tslstudio/tsl-kit/postfx';
 * import { pass } from 'three/tsl';
 * 
 * const scenePass = pass(scene, camera);
 * 
 * // Basic FXAA
 * const antialiased = fxaa(scenePass);
 * 
 * // Common pipeline order:
 * // 1. Scene render
 * const scene = pass(scene, camera);
 * 
 * // 2. Tone mapping (ACES, Reinhard, etc.)
 * const toneMapped = acesTonemap(scene);
 * 
 * // 3. Color space conversion (if needed)
 * const sRGB = colorSpaceConvert(toneMapped);
 * 
 * // 4. FXAA (must be last or near-last)
 * const final = fxaa(sRGB);
 * ```
 * 
 * **Parameters:**
 * - `node`: Input texture/pass (vec4) - **must be in sRGB color space**
 * 
 * **Effect Details:**
 * - Edge detection via luminance analysis
 * - Directional blur along detected edges
 * - Subpixel anti-aliasing
 * - Contrast-adaptive blending
 * - No geometry/topology changes
 * 
 * **Algorithm Features:**
 * - Edge detection threshold: 0.0312 (contrast) / 0.063 (relative)
 * - 6-step edge tracing
 * - Subpixel blending: 1.0 (full)
 * - Luminance-weighted sampling
 * 
 * **Performance:** Medium (multiple texture samples, edge tracing)
 * 
 * **Quality vs. Performance:**
 * - Faster than MSAA/SSAA
 * - Better than no AA
 * - Slightly softer than SMAA
 * - May blur textures slightly
 * 
 * **Use Cases:**
 * - General-purpose anti-aliasing
 * - Real-time rendering
 * - Mid-to-high performance targets
 * - WebGPU applications
 * - Mobile-friendly AA
 * 
 * **Alternatives:**
 * - SMAA: Better quality, slower
 * - TAA/TRAA: Best quality, requires temporal data
 * - MSAA: Higher cost, not available in WebGPU post-process
 */

