/**
 * Fresnel Effect
 *
 * @author Maxime Heckel
 * @source https://github.com/MaximeHeckel/portfolio
 * @license MIT
 * @version Ported to Three.js r181+
 *
 * Schlick's approximation of the Fresnel effect.
 * Objects become more reflective at grazing angles.
 *
 * @param viewDir - View direction vector (vec3)
 * @param normal - Surface normal vector (vec3)
 * @param power - Fresnel power/exponent (float, default: 1)
 * @returns Fresnel factor in range [0, 1] (float)
 *
 * @example
 * ```typescript
 * import { createFresnelNode } from '@tslstudio/tsl-kit/lighting'
 * import { MeshPhysicalNodeMaterial } from 'three/webgpu'
 * import { normalView, viewDirection } from 'three/tsl'
 *
 * const material = new MeshPhysicalNodeMaterial()
 * material.clearcoatNode = createFresnelNode(viewDirection, normalView, 5.0)
 * ```
 */
export declare const createFresnelNode: any;
//# sourceMappingURL=fresnel.d.ts.map