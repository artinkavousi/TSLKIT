/**
 * Clearcoat Layer for PBR Materials
 *
 * Secondary specular lobe for multi-layer materials (car paint, lacquer, etc.)
 *
 * @module materials/pbr/clearcoat
 */
/**
 * Clearcoat normal distribution (GGX)
 *
 * @param clearcoatNdotH - Clearcoat normal dot half
 * @param clearcoatRoughness - Clearcoat roughness [0, 1]
 */
export declare const clearcoatNDF: any;
/**
 * Clearcoat geometry function (Kelemen)
 *
 * @param clearcoatNdotV - Clearcoat normal dot view
 * @param clearcoatNdotL - Clearcoat normal dot light
 */
export declare const clearcoatGeometry: any;
/**
 * Complete clearcoat BRDF
 *
 * @param clearcoatNormal - Clearcoat normal (can differ from base normal)
 * @param V - View direction
 * @param L - Light direction
 * @param H - Half vector
 * @param clearcoatAmount - Clearcoat strength [0, 1]
 * @param clearcoatRoughness - Clearcoat roughness [0, 1]
 */
export declare const clearcoatBRDF: any;
/**
 * Clearcoat attenuation for base layer
 *
 * When light passes through clearcoat, some is reflected, attenuating the base layer.
 *
 * @param clearcoatAmount - Clearcoat strength
 * @param VdotH - View dot half
 */
export declare const clearcoatAttenuation: any;
/**
 * Perturbed clearcoat normal (for orange peel effect)
 *
 * @param baseNormal - Base surface normal
 * @param clearcoatNormalMap - Clearcoat normal perturbation
 * @param strength - Perturbation strength
 */
export declare const perturbClearcoatNormal: any;
//# sourceMappingURL=clearcoat.d.ts.map