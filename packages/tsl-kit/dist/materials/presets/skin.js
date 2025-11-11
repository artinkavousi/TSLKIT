/**
 * Skin Material Presets
 *
 * Realistic human skin materials with subsurface scattering.
 *
 * @module materials/presets/skin
 */
/**
 * Fair/Light skin tone
 */
export const fairSkin = {
    name: 'Fair Skin',
    baseColor: { r: 0.95, g: 0.82, b: 0.76 },
    roughness: 0.4,
    subsurfaceColor: { r: 1.0, g: 0.5, b: 0.4 },
    subsurfaceRadius: 0.5,
    shallowScatter: { r: 1.0, g: 0.4, b: 0.3 },
    deepScatter: { r: 0.3, g: 0.3, b: 0.5 },
    shallowDistance: 0.1,
    deepDistance: 0.5,
    specularIntensity: 0.5,
    normalStrength: 1.0
};
/**
 * Medium/Tan skin tone
 */
export const mediumSkin = {
    name: 'Medium Skin',
    baseColor: { r: 0.82, g: 0.62, b: 0.51 },
    roughness: 0.4,
    subsurfaceColor: { r: 0.95, g: 0.45, b: 0.35 },
    subsurfaceRadius: 0.5,
    shallowScatter: { r: 0.95, g: 0.4, b: 0.25 },
    deepScatter: { r: 0.25, g: 0.25, b: 0.45 },
    shallowDistance: 0.12,
    deepDistance: 0.55,
    specularIntensity: 0.48,
    normalStrength: 1.0
};
/**
 * Dark/Deep skin tone
 */
export const darkSkin = {
    name: 'Dark Skin',
    baseColor: { r: 0.45, g: 0.32, b: 0.26 },
    roughness: 0.35,
    subsurfaceColor: { r: 0.7, g: 0.3, b: 0.2 },
    subsurfaceRadius: 0.6,
    shallowScatter: { r: 0.8, g: 0.35, b: 0.2 },
    deepScatter: { r: 0.2, g: 0.2, b: 0.35 },
    shallowDistance: 0.15,
    deepDistance: 0.6,
    specularIntensity: 0.45,
    normalStrength: 0.9
};
/**
 * Lips material
 */
export const lips = {
    name: 'Lips',
    baseColor: { r: 0.85, g: 0.35, b: 0.38 },
    roughness: 0.3,
    subsurfaceColor: { r: 1.0, g: 0.3, b: 0.3 },
    subsurfaceRadius: 0.4,
    shallowScatter: { r: 1.0, g: 0.3, b: 0.25 },
    deepScatter: { r: 0.4, g: 0.2, b: 0.3 },
    shallowDistance: 0.08,
    deepDistance: 0.35,
    specularIntensity: 0.6,
    normalStrength: 0.8
};
/**
 * Ear material (slightly more translucent)
 */
export const ear = {
    name: 'Ear',
    baseColor: { r: 0.92, g: 0.75, b: 0.68 },
    roughness: 0.45,
    subsurfaceColor: { r: 1.0, g: 0.6, b: 0.5 },
    subsurfaceRadius: 0.7,
    shallowScatter: { r: 1.0, g: 0.5, b: 0.35 },
    deepScatter: { r: 0.35, g: 0.35, b: 0.55 },
    shallowDistance: 0.15,
    deepDistance: 0.7,
    specularIntensity: 0.4,
    normalStrength: 0.9
};
/**
 * All skin presets
 */
export const skinPresets = {
    fair: fairSkin,
    medium: mediumSkin,
    dark: darkSkin,
    lips,
    ear
};
/**
 * Get skin preset by name
 */
export function getSkinPreset(name) {
    return skinPresets[name];
}
//# sourceMappingURL=skin.js.map