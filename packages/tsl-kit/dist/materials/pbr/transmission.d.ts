/**
 * Transmission (Transparency/Glass) for PBR Materials
 *
 * Light passing through translucent materials with refraction.
 *
 * @module materials/pbr/transmission
 */
/**
 * Calculate transmission color with Beer's law absorption
 *
 * @param transmissionColor - Base transmission tint
 * @param thickness - Material thickness [0, ∞]
 * @param attenuationColor - Absorption color (darker = more absorption)
 * @param attenuationDistance - Distance for full absorption
 */
export declare const transmissionAbsorption: any;
/**
 * Fresnel-modulated transmission
 *
 * @param NdotV - Normal dot view
 * @param ior - Index of refraction [1.0, 3.0]
 * @param transmission - Transmission amount [0, 1]
 */
export declare const transmissionFresnel: any;
/**
 * Refracted view direction for transmission ray
 *
 * @param V - View direction (incoming)
 * @param N - Surface normal
 * @param ior - Index of refraction
 */
export declare const refractedDirection: any;
/**
 * Thin surface transmission (for thin objects like glass panes)
 *
 * @param V - View direction
 * @param N - Normal
 * @param ior - Index of refraction
 * @param thickness - Surface thickness
 */
export declare const thinSurfaceTransmission: any;
/**
 * Volume scattering approximation
 *
 * @param transmissionColor - Base color
 * @param scatterColor - Scattering tint
 * @param density - Scattering density [0, 1]
 * @param thickness - Ray travel distance
 */
export declare const volumeScattering: any;
/**
 * Chromatic aberration for transmission
 *
 * Simulates color separation through glass (rainbow edges).
 *
 * @param V - View direction
 * @param N - Normal
 * @param iorRed - IOR for red wavelength
 * @param iorGreen - IOR for green wavelength
 * @param iorBlue - IOR for blue wavelength
 */
export declare const chromaticTransmission: any;
/**
 * Frosted glass transmission (rough transmission)
 *
 * @param transmission - Clear transmission amount
 * @param roughness - Surface roughness [0, 1]
 * @param blurStrength - Blur intensity
 */
export declare const frostedTransmission: any;
/**
 * Simple glass appearance
 *
 * @param N - Normal
 * @param V - View
 * @param ior - Index of refraction (1.5 for glass)
 * @param tint - Glass tint color
 * @param thickness - Glass thickness
 */
export declare const glassAppearance: any;
//# sourceMappingURL=transmission.d.ts.map