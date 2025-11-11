/**
 * Raymarching Utilities
 *
 * @author Three.js Contributors
 * @source https://github.com/mrdoob/three.js/blob/r181/examples/jsm/tsl/utils/Raymarching.js
 * @license MIT
 * @version Three.js r181
 *
 * Utilities for raymarching through signed distance fields (SDFs).
 *
 * Raymarching is a rendering technique for volumetric and SDF-based geometry
 * where a ray is marched through space step-by-step, evaluating a distance
 * function at each step to determine surface intersections.
 *
 * **Features**:
 * - Box-bounded raymarching (`RaymarchingBox`)
 * - Automatic ray-box intersection
 * - Configurable step count
 * - Callback-based sampling
 * - TSL integration for shader generation
 *
 * @example
 * ```typescript
 * import { RaymarchingBox } from '@tslstudio/tsl-kit/sdf'
 * import { Fn, float } from 'three/tsl'
 *
 * // Raymarch 100 steps through a box
 * RaymarchingBox(100, ({ positionRay }) => {
 *   // Sample SDF at positionRay
 *   const distance = sphereSDF(positionRay, 0.5)
 *
 *   // Early exit if close to surface
 *   distance.lessThan(0.01).discard()
 * })
 * ```
 *
 * @module raymarching
 */
import { Node } from 'three/tsl';
/**
 * Callback function signature for `RaymarchingBox`.
 * Called once per raymarching step with the current ray position.
 */
export type RaymarchingCallback = (params: {
    /** Current position along the ray in object space */
    positionRay: Node<'vec3'>;
}) => void;
/**
 * TSL function for performing raymarching in a box-bounded volume.
 *
 * This function sets up a raymarching loop that:
 * 1. Computes ray-box intersection
 * 2. Marches the ray through the box with fixed steps
 * 3. Calls the provided callback at each step
 *
 * The box is centered at the object's origin with extents [-0.5, 0.5].
 * Use object transforms to position and scale the raymarching volume.
 *
 * **Usage Pattern**:
 * ```typescript
 * RaymarchingBox(100, ({ positionRay }) => {
 *   // Evaluate SDF
 *   const dist = mySDF(positionRay)
 *
 *   // Accumulate color/density
 *   color.addAssign(dist.mul(0.01))
 *
 *   // Early exit if opaque
 *   alpha.greaterThan(0.99).discard()
 * })
 * ```
 *
 * @tsl
 * @function
 * @param steps - The number of raymarching steps (higher = better quality, slower)
 * @param callback - Function called at each step with current ray position
 *
 * @example
 * ```typescript
 * // Simple volumetric sphere
 * const material = new NodeMaterial()
 * material.fragmentNode = Fn(() => {
 *   const color = vec4(0, 0, 0, 1).toVar()
 *
 *   RaymarchingBox(64, ({ positionRay }) => {
 *     // SDF for sphere at origin with radius 0.3
 *     const dist = length(positionRay).sub(0.3)
 *
 *     // Accumulate color based on distance
 *     const contribution = float(0.02).div(abs(dist).add(0.01))
 *     color.xyz.addAssign(contribution.mul(vec3(1, 0.5, 0.2)))
 *   })
 *
 *   return color
 * })()
 * ```
 *
 * @example
 * ```typescript
 * // Smoke/cloud effect
 * RaymarchingBox(128, ({ positionRay }) => {
 *   // 3D noise for density
 *   const density = noise3d(positionRay.mul(4.0))
 *
 *   // Accumulate smoke
 *   const alpha = density.mul(0.01)
 *   color.xyz.addAssign(alpha.mul(vec3(0.9, 0.9, 1.0)))
 *   color.w.addAssign(alpha)
 * })
 * ```
 */
export declare const RaymarchingBox: (steps: number | Node, callback: RaymarchingCallback) => void;
//# sourceMappingURL=raymarching.d.ts.map