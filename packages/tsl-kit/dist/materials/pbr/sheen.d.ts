/**
 * Sheen Layer for PBR Materials
 *
 * Soft velvet/fabric-like reflection at grazing angles.
 * Based on the Charlie sheen BRDF.
 *
 * @module materials/pbr/sheen
 */
/**
 * Charlie sheen distribution (for cloth/fabric)
 *
 * @param NdotH - Normal dot half vector
 * @param sheenRoughness - Sheen roughness [0, 1]
 */
export declare const charlieDistribution: any;
/**
 * Ashikhmin sheen visibility function
 *
 * @param NdotV - Normal dot view
 * @param NdotL - Normal dot light
 */
export declare const sheenVisibility: any;
/**
 * Complete sheen BRDF (Charlie model)
 *
 * @param N - Surface normal
 * @param V - View direction
 * @param L - Light direction
 * @param H - Half vector
 * @param sheenColor - Sheen tint color (vec3)
 * @param sheenRoughness - Sheen roughness [0, 1]
 */
export declare const sheenBRDF: any;
/**
 * Simplified sheen (faster, less accurate)
 *
 * @param NdotV - Normal dot view
 * @param sheenColor - Sheen tint
 * @param sheenIntensity - Sheen strength [0, 1]
 * @param sheenPower - Falloff power (higher = tighter)
 */
export declare const simplifiedSheen: any;
/**
 * Energy-compensated sheen
 *
 * Accounts for energy added by sheen layer to maintain conservation.
 *
 * @param baseColor - Base layer color
 * @param sheenAmount - Sheen contribution
 */
export declare const sheenEnergyCompensation: any;
/**
 * Velvet appearance (combines diffuse with sheen)
 *
 * @param N - Normal
 * @param V - View
 * @param L - Light
 * @param H - Half vector
 * @param baseColor - Fabric base color
 * @param sheenColor - Sheen tint (often brighter than base)
 * @param roughness - Surface roughness
 */
export declare const velvetAppearance: any;
//# sourceMappingURL=sheen.d.ts.map