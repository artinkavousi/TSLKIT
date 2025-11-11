/**
 * Iridescence (Thin-Film Interference) for PBR Materials
 *
 * Rainbow-like color shifts based on viewing angle.
 * Common in soap bubbles, oil slicks, butterfly wings, etc.
 *
 * @module materials/pbr/iridescence
 */
import { Fn, float, vec3, pow, dot, max, clamp, sin, cos, mix, PI } from 'three/tsl';
/**
 * Thin-film Fresnel for iridescence
 *
 * @param cosTheta - Cosine of incident angle
 * @param filmIOR - IOR of thin film (e.g., 1.3 for soap)
 * @param baseIOR - IOR of base material (e.g., 1.5 for glass)
 * @param filmThickness - Film thickness in nanometers [100, 1000]
 */
export const thinFilmFresnel = Fn(([cosTheta, filmIOR, baseIOR, filmThickness]) => {
    // Optical path difference
    const phi = float(2).mul(PI).mul(filmIOR).mul(filmThickness).mul(cosTheta).div(550); // 550nm = green
    // Phase shift
    const r1 = filmIOR.sub(1).div(filmIOR.add(1)); // Air-film interface
    const r2 = baseIOR.sub(filmIOR).div(baseIOR.add(filmIOR)); // Film-base interface
    // Interference for each wavelength
    const reflectRed = r1.add(r2.mul(cos(phi.mul(650).div(550)))).mul(0.5).add(0.5); // 650nm
    const reflectGreen = r1.add(r2.mul(cos(phi))).mul(0.5).add(0.5); // 550nm
    const reflectBlue = r1.add(r2.mul(cos(phi.mul(450).div(550)))).mul(0.5).add(0.5); // 450nm
    return vec3(reflectRed, reflectGreen, reflectBlue).pow(2);
});
/**
 * Iridescence with F0 modulation
 *
 * @param NdotV - Normal dot view
 * @param baseF0 - Base reflectivity (vec3)
 * @param iridescenceIOR - Film IOR [1.0, 2.0]
 * @param iridescenceThickness - Film thickness [0, 1] (normalized)
 * @param iridescenceAmount - Effect strength [0, 1]
 */
export const iridescenceFresnel = Fn(([NdotV, baseF0, iridescenceIOR, iridescenceThickness, iridescenceAmount]) => {
    // Convert normalized thickness to nanometers [100, 1000]
    const thicknessNM = iridescenceThickness.mul(900).add(100);
    // Calculate thin-film interference
    const filmReflect = thinFilmFresnel(NdotV, iridescenceIOR, float(1.5), thicknessNM);
    // Modulate base F0
    const iridescent = mix(baseF0, filmReflect, iridescenceAmount);
    // Apply Schlick Fresnel on top
    const fresnel = iridescent.add(float(1).sub(iridescent).mul(pow(clamp(float(1).sub(NdotV), 0, 1), 5)));
    return fresnel;
});
/**
 * Simplified iridescence (no physics, just pretty colors)
 *
 * @param NdotV - Normal dot view
 * @param shift - Color shift amount [0, 1]
 * @param saturation - Color saturation [0, 1]
 */
export const simpleIridescence = Fn(([NdotV, shift, saturation]) => {
    // Create rainbow gradient based on angle
    const hue = NdotV.mul(shift).mul(6.28318); // 0 to 2π
    // HSV to RGB (simplified)
    const r = sin(hue).mul(0.5).add(0.5);
    const g = sin(hue.add(2.0944)).mul(0.5).add(0.5); // +120°
    const b = sin(hue.add(4.1888)).mul(0.5).add(0.5); // +240°
    const iridescent = vec3(r, g, b);
    // Mix with white based on saturation
    return mix(vec3(1, 1, 1), iridescent, saturation);
});
/**
 * Oil slick iridescence (common preset)
 *
 * @param N - Normal
 * @param V - View
 * @param thickness - Thickness variation [0, 1]
 * @param intensity - Effect strength
 */
export const oilSlickIridescence = Fn(([N, V, thickness, intensity]) => {
    const NdotV = max(dot(N, V), 0);
    // Use view angle and thickness for interference pattern
    const filmIOR = float(1.33); // Water-like
    const baseIOR = float(1.0); // Air
    const thicknessNM = thickness.mul(500).add(200); // 200-700nm
    const interference = thinFilmFresnel(NdotV, filmIOR, baseIOR, thicknessNM);
    return interference.mul(intensity);
});
/**
 * Soap bubble iridescence
 *
 * @param N - Normal
 * @param V - View
 * @param thickness - Bubble wall thickness [0, 1]
 * @param transparency - How see-through [0, 1]
 */
export const soapBubbleIridescence = Fn(([N, V, thickness, transparency]) => {
    const NdotV = max(dot(N, V), 0);
    // Soap film properties
    const filmIOR = float(1.34); // Soap
    const airIOR = float(1.0);
    const thicknessNM = thickness.mul(800).add(100); // Very thin (100-900nm)
    const frontReflect = thinFilmFresnel(NdotV, filmIOR, airIOR, thicknessNM);
    const backReflect = thinFilmFresnel(NdotV, airIOR, filmIOR, thicknessNM);
    // Combine front and back reflections
    const combined = frontReflect.add(backReflect.mul(transparency)).mul(0.5);
    return combined;
});
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
export const iridescenceFromTexture = Fn(([thicknessMap, NdotV, iorMin, iorMax]) => {
    const thickness = thicknessMap.r; // Use red channel
    const ior = mix(iorMin, iorMax, thickness);
    const thicknessNM = thickness.mul(900).add(100);
    return thinFilmFresnel(NdotV, ior, float(1.5), thicknessNM);
});
//# sourceMappingURL=iridescence.js.map