/**
 * Subsurface Scattering for PBR Materials
 *
 * Light penetration and scattering inside translucent materials (skin, wax, marble, etc.)
 *
 * @module materials/pbr/subsurface
 */
/**
 * Wrap diffuse lighting (simple SSS approximation)
 *
 * Wraps lighting around the surface to simulate subsurface scatter.
 *
 * @param NdotL - Normal dot light
 * @param wrap - Wrap amount [0, 1] (how much light wraps around)
 */
export declare const wrapDiffuse: any;
/**
 * Thickness-based subsurface scattering
 *
 * @param NdotL - Normal dot light (front lighting)
 * @param VdotL - View dot light (back lighting indicator)
 * @param thickness - Material thickness map [0, 1]
 * @param subsurfaceColor - Scattering color (usually warm for skin)
 * @param power - Scattering falloff
 */
export declare const thicknessSSS: any;
/**
 * Gaussian SSS profile (single scatter)
 *
 * @param NdotL - Normal dot light
 * @param NdotV - Normal dot view
 * @param thickness - Material thickness
 * @param scatterDistance - How far light scatters [0, 1]
 * @param subsurfaceColor - Scatter tint
 */
export declare const gaussianSSS: any;
/**
 * Burley normalized SSS (Disney/Pixar model)
 *
 * More accurate diffusion profile for skin.
 *
 * @param NdotL - Normal dot light
 * @param r - Radial distance from light entry
 * @param scatterRadius - Mean free path length
 */
export declare const burleySSS: any;
/**
 * Multi-layer SSS (for complex materials like skin)
 *
 * @param NdotL - Normal dot light
 * @param thickness - Thickness map
 * @param shallowColor - Shallow scatter color (red for skin)
 * @param deepColor - Deep scatter color (blue-ish for skin)
 * @param shallowDist - Shallow scatter distance
 * @param deepDist - Deep scatter distance
 */
export declare const multiLayerSSS: any;
/**
 * Translucency (back-lit SSS)
 *
 * Light shining through from behind (leaves, ears, etc.)
 *
 * @param N - Normal
 * @param V - View direction
 * @param L - Light direction
 * @param thickness - Material thickness [0, 1]
 * @param distortion - Scatter cone distortion [0, 1]
 * @param power - Falloff sharpness
 * @param scale - Overall intensity
 * @param tint - Transmission color
 */
export declare const translucency: any;
/**
 * Approximated curvature for SSS
 *
 * Higher curvature = more scatter visibility.
 *
 * @param normalDDX - Screen-space normal derivative X
 * @param normalDDY - Screen-space normal derivative Y
 */
export declare const sssCurvatureTerm: any;
/**
 * Simple skin shader (combined SSS + specular)
 *
 * @param N - Normal
 * @param V - View
 * @param L - Light
 * @param baseColor - Skin color
 * @param thickness - Skin thickness map
 * @param roughness - Skin roughness
 */
export declare const simpleSkinShader: any;
/**
 * Wax-like appearance
 *
 * @param N - Normal
 * @param L - Light
 * @param thickness - Material thickness
 * @param waxColor - Base wax color
 * @param translucency - How see-through [0, 1]
 */
export declare const waxAppearance: any;
//# sourceMappingURL=subsurface.d.ts.map