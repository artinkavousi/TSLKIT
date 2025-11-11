/**
 * Subsurface Scattering for PBR Materials
 *
 * Light penetration and scattering inside translucent materials (skin, wax, marble, etc.)
 *
 * @module materials/pbr/subsurface
 */
import { Fn, float, vec3, pow, dot, max, clamp, exp, PI } from 'three/tsl';
/**
 * Wrap diffuse lighting (simple SSS approximation)
 *
 * Wraps lighting around the surface to simulate subsurface scatter.
 *
 * @param NdotL - Normal dot light
 * @param wrap - Wrap amount [0, 1] (how much light wraps around)
 */
export const wrapDiffuse = Fn(([NdotL, wrap]) => {
    // Wrap formula: (NdotL + wrap) / (1 + wrap)
    const wrapped = NdotL.add(wrap).div(float(1).add(wrap)).max(0);
    return wrapped;
});
/**
 * Thickness-based subsurface scattering
 *
 * @param NdotL - Normal dot light (front lighting)
 * @param VdotL - View dot light (back lighting indicator)
 * @param thickness - Material thickness map [0, 1]
 * @param subsurfaceColor - Scattering color (usually warm for skin)
 * @param power - Scattering falloff
 */
export const thicknessSSS = Fn(([NdotL, VdotL, thickness, subsurfaceColor, power]) => {
    // Front-lit diffuse
    const frontLight = max(NdotL, 0);
    // Back-lit transmission (when light is behind surface)
    const backLight = max(VdotL.negate(), 0)
        .mul(thickness)
        .pow(power)
        .mul(subsurfaceColor);
    return frontLight.add(backLight);
});
/**
 * Gaussian SSS profile (single scatter)
 *
 * @param NdotL - Normal dot light
 * @param NdotV - Normal dot view
 * @param thickness - Material thickness
 * @param scatterDistance - How far light scatters [0, 1]
 * @param subsurfaceColor - Scatter tint
 */
export const gaussianSSS = Fn(([NdotL, NdotV, thickness, scatterDistance, subsurfaceColor]) => {
    // Distance light travels through material
    const dist = thickness.mul(scatterDistance);
    // Gaussian falloff
    const scatter = exp(dist.negate().mul(dist).mul(4)).mul(subsurfaceColor);
    // Combine with regular diffuse
    const diffuse = max(NdotL, 0);
    return diffuse.add(scatter.mul(thickness));
});
/**
 * Burley normalized SSS (Disney/Pixar model)
 *
 * More accurate diffusion profile for skin.
 *
 * @param NdotL - Normal dot light
 * @param r - Radial distance from light entry
 * @param scatterRadius - Mean free path length
 */
export const burleySSS = Fn(([NdotL, r, scatterRadius]) => {
    // Normalized diffusion profile
    const d = scatterRadius.mul(2);
    const profile = exp(r.negate().div(d)).div(float(2).mul(PI).mul(d).mul(d));
    return profile.mul(max(NdotL, 0));
});
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
export const multiLayerSSS = Fn(([NdotL, thickness, shallowColor, deepColor, shallowDist, deepDist]) => {
    // Shallow (short-distance) scatter
    const shallow = exp(thickness.negate().div(shallowDist)).mul(shallowColor);
    // Deep (long-distance) scatter
    const deep = exp(thickness.negate().div(deepDist)).mul(deepColor);
    // Combine layers
    const scatter = shallow.add(deep).mul(max(NdotL, 0));
    return scatter;
});
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
export const translucency = Fn(([N, V, L, thickness, distortion, power, scale, tint]) => {
    // Calculate back-scatter direction
    const H = L.add(N.mul(distortion)).normalize();
    const VdotH = max(dot(V, H), 0);
    // Power function for falloff
    const scatter = pow(VdotH, power).mul(scale);
    // Attenuate by thickness
    const attenuated = scatter.mul(float(1).sub(thickness).max(0));
    return attenuated.mul(tint);
});
/**
 * Approximated curvature for SSS
 *
 * Higher curvature = more scatter visibility.
 *
 * @param normalDDX - Screen-space normal derivative X
 * @param normalDDY - Screen-space normal derivative Y
 */
export const sssCurvatureTerm = Fn(([normalDDX, normalDDY]) => {
    // Approximate curvature from normal derivatives
    const curvature = normalDDX.length().add(normalDDY.length());
    return clamp(curvature, 0, 1);
});
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
export const simpleSkinShader = Fn(([N, V, L, baseColor, thickness, roughness]) => {
    const NdotL = dot(N, L);
    const NdotV = max(dot(N, V), 0);
    // Wrapped diffuse for SSS
    const diffuse = wrapDiffuse(NdotL, float(0.5)).mul(baseColor);
    // Thickness-based scatter (reddish)
    const scatter = thicknessSSS(NdotL, dot(V, L), thickness, vec3(1.0, 0.4, 0.25), // Warm red scatter
    float(2.0));
    // Combine
    return diffuse.add(scatter).div(PI);
});
/**
 * Wax-like appearance
 *
 * @param N - Normal
 * @param L - Light
 * @param thickness - Material thickness
 * @param waxColor - Base wax color
 * @param translucency - How see-through [0, 1]
 */
export const waxAppearance = Fn(([N, L, thickness, waxColor, translucency]) => {
    const NdotL = dot(N, L);
    // Front lighting
    const front = max(NdotL, 0);
    // Back lighting (glow through)
    const back = max(NdotL.negate(), 0)
        .mul(translucency)
        .mul(float(1).sub(thickness))
        .mul(vec3(1.0, 0.9, 0.7)); // Warm glow
    return waxColor.mul(front.add(back)).div(PI);
});
//# sourceMappingURL=subsurface.js.map