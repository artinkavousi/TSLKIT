/**
 * Fabric and Cloth Material Presets
 *
 * Textile materials with sheen and anisotropy.
 *
 * @module materials/presets/fabric
 */
/**
 * Red velvet
 */
export const velvet = {
    name: 'Velvet',
    baseColor: { r: 0.45, g: 0.08, b: 0.12 },
    roughness: 0.9,
    sheen: 0.8,
    sheenColor: { r: 0.9, g: 0.4, b: 0.45 },
    sheenRoughness: 0.5,
    normalStrength: 1.5,
    fuzziness: 0.7
};
/**
 * Blue denim
 */
export const denim = {
    name: 'Denim',
    baseColor: { r: 0.15, g: 0.25, b: 0.45 },
    roughness: 0.85,
    sheen: 0.3,
    sheenColor: { r: 0.35, g: 0.45, b: 0.65 },
    sheenRoughness: 0.7,
    normalStrength: 2.0,
    fuzziness: 0.5
};
/**
 * White silk
 */
export const silk = {
    name: 'Silk',
    baseColor: { r: 0.95, g: 0.94, b: 0.92 },
    roughness: 0.3,
    sheen: 0.6,
    sheenColor: { r: 1.0, g: 0.98, b: 0.95 },
    sheenRoughness: 0.2,
    anisotropy: 0.6,
    anisotropyRotation: 0,
    normalStrength: 0.5,
    fuzziness: 0.2
};
/**
 * Red satin
 */
export const satin = {
    name: 'Satin',
    baseColor: { r: 0.75, g: 0.08, b: 0.12 },
    roughness: 0.25,
    sheen: 0.7,
    sheenColor: { r: 0.95, g: 0.4, b: 0.45 },
    sheenRoughness: 0.15,
    anisotropy: 0.7,
    anisotropyRotation: 0,
    normalStrength: 0.3,
    fuzziness: 0.1
};
/**
 * Canvas fabric
 */
export const canvas = {
    name: 'Canvas',
    baseColor: { r: 0.82, g: 0.78, b: 0.72 },
    roughness: 0.9,
    sheen: 0.2,
    sheenColor: { r: 0.9, g: 0.88, b: 0.85 },
    sheenRoughness: 0.8,
    normalStrength: 2.5,
    fuzziness: 0.3
};
/**
 * Wool (knit)
 */
export const wool = {
    name: 'Wool',
    baseColor: { r: 0.35, g: 0.32, b: 0.28 },
    roughness: 0.95,
    sheen: 0.4,
    sheenColor: { r: 0.55, g: 0.52, b: 0.48 },
    sheenRoughness: 0.6,
    normalStrength: 3.0,
    fuzziness: 0.8
};
/**
 * Leather (smooth)
 */
export const leather = {
    name: 'Leather',
    baseColor: { r: 0.35, g: 0.22, b: 0.15 },
    roughness: 0.6,
    sheen: 0.3,
    sheenColor: { r: 0.5, g: 0.35, b: 0.25 },
    sheenRoughness: 0.4,
    normalStrength: 1.2,
    fuzziness: 0.1
};
/**
 * Suede
 */
export const suede = {
    name: 'Suede',
    baseColor: { r: 0.45, g: 0.35, b: 0.28 },
    roughness: 0.85,
    sheen: 0.5,
    sheenColor: { r: 0.65, g: 0.55, b: 0.48 },
    sheenRoughness: 0.5,
    normalStrength: 2.0,
    fuzziness: 0.6
};
/**
 * Cotton (white)
 */
export const cotton = {
    name: 'Cotton',
    baseColor: { r: 0.95, g: 0.94, b: 0.92 },
    roughness: 0.9,
    sheen: 0.3,
    sheenColor: { r: 1.0, g: 0.98, b: 0.96 },
    sheenRoughness: 0.7,
    normalStrength: 1.8,
    fuzziness: 0.4
};
/**
 * Linen
 */
export const linen = {
    name: 'Linen',
    baseColor: { r: 0.88, g: 0.85, b: 0.80 },
    roughness: 0.88,
    sheen: 0.25,
    sheenColor: { r: 0.95, g: 0.92, b: 0.88 },
    sheenRoughness: 0.75,
    normalStrength: 2.2,
    fuzziness: 0.35
};
/**
 * All fabric presets
 */
export const fabricPresets = {
    velvet,
    denim,
    silk,
    satin,
    canvas,
    wool,
    leather,
    suede,
    cotton,
    linen
};
/**
 * Get fabric preset by name
 */
export function getFabricPreset(name) {
    return fabricPresets[name];
}
//# sourceMappingURL=fabric.js.map