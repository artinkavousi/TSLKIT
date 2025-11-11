/**
 * Outline Post-Processing Effect
 * Re-exports from Three.js official TSL implementation
 * 
 * Renders outlines around selected objects with customizable edge detection.
 * 
 * @module postfx/outline
 */

export { OutlineNode, outline } from 'three/tsl';

/**
 * Renders outlines around selected objects.
 * 
 * @example
 * ```ts
 * import { outline } from '@tsl-kit/postfx/outline.js';
 * 
 * const outlinePass = outline(scene, camera, {
 *   selectedObjects,
 *   edgeStrength: uniform(3.0),
 *   edgeGlow: uniform(0.0),
 *   edgeThickness: uniform(1.0)
 * });
 * 
 * // Compose custom outline colors
 * const { visibleEdge, hiddenEdge } = outlinePass;
 * const outlineColor = visibleEdge.mul(visibleEdgeColor)
 *   .add(hiddenEdge.mul(hiddenEdgeColor))
 *   .mul(edgeStrength);
 * ```
 * 
 * @param scene - The scene containing objects to outline
 * @param camera - The camera used for rendering
 * @param options - Configuration options (selectedObjects, edgeGlow, edgeThickness, etc.)
 * @returns Outline pass with visibleEdge and hiddenEdge nodes
 */

