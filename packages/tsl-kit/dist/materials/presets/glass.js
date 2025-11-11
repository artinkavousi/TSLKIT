/**
 * Glass and Transparent Material Presets
 *
 * Various glass types with transmission and refraction.
 *
 * @module materials/presets/glass
 */
/**
 * Clear window glass
 */
export const windowGlass = {
    name: 'Window Glass',
    baseColor: { r: 1.0, g: 1.0, b: 1.0 },
    transmission: 0.95,
    ior: 1.52,
    roughness: 0.0,
    thickness: 0.5,
    attenuationColor: { r: 0.99, g: 0.99, b: 0.98 },
    attenuationDistance: 1.0,
    specularIntensity: 1.0
};
/**
 * Colored glass - green tint
 */
export const greenGlass = {
    name: 'Green Glass',
    baseColor: { r: 0.9, g: 1.0, b: 0.9 },
    transmission: 0.9,
    ior: 1.52,
    roughness: 0.0,
    thickness: 0.8,
    attenuationColor: { r: 0.6, g: 0.9, b: 0.65 },
    attenuationDistance: 0.5,
    specularIntensity: 1.0
};
/**
 * Frosted glass
 */
export const frostedGlass = {
    name: 'Frosted Glass',
    baseColor: { r: 0.98, g: 0.98, b: 1.0 },
    transmission: 0.7,
    ior: 1.52,
    roughness: 0.35,
    thickness: 0.6,
    attenuationColor: { r: 0.95, g: 0.95, b: 0.97 },
    attenuationDistance: 1.0,
    specularIntensity: 0.8
};
/**
 * Wine glass (slight color)
 */
export const wineGlass = {
    name: 'Wine Glass',
    baseColor: { r: 1.0, g: 0.99, b: 0.97 },
    transmission: 0.92,
    ior: 1.51,
    roughness: 0.02,
    thickness: 0.3,
    attenuationColor: { r: 0.98, g: 0.97, b: 0.95 },
    attenuationDistance: 1.2,
    specularIntensity: 1.0
};
/**
 * Crystal/Diamond
 */
export const crystal = {
    name: 'Crystal',
    baseColor: { r: 1.0, g: 1.0, b: 1.0 },
    transmission: 0.98,
    ior: 2.42, // Diamond IOR
    roughness: 0.0,
    thickness: 1.0,
    attenuationColor: { r: 1.0, g: 1.0, b: 1.0 },
    attenuationDistance: 2.0,
    specularIntensity: 1.5
};
/**
 * Stained glass - blue
 */
export const stainedGlassBlue = {
    name: 'Stained Glass (Blue)',
    baseColor: { r: 0.3, g: 0.5, b: 0.9 },
    transmission: 0.75,
    ior: 1.52,
    roughness: 0.05,
    thickness: 1.0,
    attenuationColor: { r: 0.2, g: 0.4, b: 0.8 },
    attenuationDistance: 0.3,
    specularIntensity: 0.9
};
/**
 * Stained glass - red
 */
export const stainedGlassRed = {
    name: 'Stained Glass (Red)',
    baseColor: { r: 0.9, g: 0.2, b: 0.2 },
    transmission: 0.75,
    ior: 1.52,
    roughness: 0.05,
    thickness: 1.0,
    attenuationColor: { r: 0.8, g: 0.15, b: 0.15 },
    attenuationDistance: 0.3,
    specularIntensity: 0.9
};
/**
 * Ice
 */
export const ice = {
    name: 'Ice',
    baseColor: { r: 0.9, g: 0.95, b: 1.0 },
    transmission: 0.8,
    ior: 1.31,
    roughness: 0.15,
    thickness: 0.7,
    attenuationColor: { r: 0.85, g: 0.92, b: 0.98 },
    attenuationDistance: 0.8,
    specularIntensity: 0.9
};
/**
 * Soap bubble (with iridescence)
 */
export const soapBubble = {
    name: 'Soap Bubble',
    baseColor: { r: 1.0, g: 1.0, b: 1.0 },
    transmission: 0.95,
    ior: 1.34,
    roughness: 0.0,
    thickness: 0.05, // Very thin
    attenuationColor: { r: 1.0, g: 1.0, b: 1.0 },
    attenuationDistance: 2.0,
    specularIntensity: 1.0,
    iridescence: 0.9,
    iridescenceIOR: 1.34
};
/**
 * Plastic wrap/film
 */
export const plasticWrap = {
    name: 'Plastic Wrap',
    baseColor: { r: 0.98, g: 0.98, b: 0.98 },
    transmission: 0.85,
    ior: 1.46,
    roughness: 0.08,
    thickness: 0.1,
    attenuationColor: { r: 0.96, g: 0.96, b: 0.96 },
    attenuationDistance: 1.5,
    specularIntensity: 0.7
};
/**
 * All glass presets
 */
export const glassPresets = {
    window: windowGlass,
    green: greenGlass,
    frosted: frostedGlass,
    wine: wineGlass,
    crystal,
    stainedBlue: stainedGlassBlue,
    stainedRed: stainedGlassRed,
    ice,
    soapBubble,
    plasticWrap
};
/**
 * Get glass preset by name
 */
export function getGlassPreset(name) {
    return glassPresets[name];
}
//# sourceMappingURL=glass.js.map