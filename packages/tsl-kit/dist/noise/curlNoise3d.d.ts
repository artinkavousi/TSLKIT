/**
 * 3D Curl Noise
 *
 * @author Maxime Heckel (original), Based on https://al-ro.github.io/projects/embers/
 * @source https://github.com/MaximeHeckel/fragments-boilerplate
 * @license MIT
 * @version Ported to Three.js r181+
 *
 * Generates divergence-free 3D noise using curl of simplex noise gradient.
 * Produces swirling, fluid-like vector fields ideal for particle systems,
 * fluid simulation, and organic motion.
 *
 * The curl operation ensures the output vector field has zero divergence,
 * making it perfect for incompressible flow simulation.
 *
 * @param input - 3D input coordinate (vec3)
 * @returns Normalized curl vector (vec3)
 *
 * @example
 * ```typescript
 * import { curlNoise3d } from '@tslstudio/tsl-kit/noise'
 * import { vec3 } from 'three/tsl'
 *
 * // Use for particle velocity field
 * const velocity = curlNoise3d(position.mul(0.5))
 * position.addAssign(velocity.mul(deltaTime))
 * ```
 */
export declare const curlNoise3d: any;
//# sourceMappingURL=curlNoise3d.d.ts.map