/**
 * Iridescence (Thin-Film Interference) for PBR Materials
 *
 * Rainbow-like color shifts based on viewing angle.
 * Common in soap bubbles, oil slicks, butterfly wings, etc.
 *
 * @module materials/pbr/iridescence
 */
/**
 * Thin-film Fresnel for iridescence
 *
 * @param cosTheta - Cosine of incident angle
 * @param filmIOR - IOR of thin film (e.g., 1.3 for soap)
 * @param baseIOR - IOR of base material (e.g., 1.5 for glass)
 * @param filmThickness - Film thickness in nanometers [100, 1000]
 */
export declare const thinFilmFresnel: any;
/**
 * Iridescence with F0 modulation
 *
 * @param NdotV - Normal dot view
 * @param baseF0 - Base reflectivity (vec3)
 * @param iridescenceIOR - Film IOR [1.0, 2.0]
 * @param iridescenceThickness - Film thickness [0, 1] (normalized)
 * @param iridescenceAmount - Effect strength [0, 1]
 */
export declare const iridescenceFresnel: any;
/**
 * Simplified iridescence (no physics, just pretty colors)
 *
 * @param NdotV - Normal dot view
 * @param shift - Color shift amount [0, 1]
 * @param saturation - Color saturation [0, 1]
 */
export declare const simpleIridescence: any;
/**
 * Oil slick iridescence (common preset)
 *
 * @param N - Normal
 * @param V - View
 * @param thickness - Thickness variation [0, 1]
 * @param intensity - Effect strength
 */
export declare const oilSlickIridescence: any;
/**
 * Soap bubble iridescence
 *
 * @param N - Normal
 * @param V - View
 * @param thickness - Bubble wall thickness [0, 1]
 * @param transparency - How see-through [0, 1]
 */
export declare const soapBubbleIridescence: any;
/**
 * Iridescence texture mapping helper
 *
 * Maps a thickness texture (grayscale) to iridescent colors.
 *
 * @param thicknessMap - Grayscale thickness variation [0, 1]
 * @param NdotV - Normal dot view
 * @param iorMin - Min IOR for thin areas
 * @param iorMax - Max IOR for thick areas
 */
export declare const iridescenceFromTexture: any;
//# sourceMappingURL=iridescence.d.ts.map