/**
 * Skin Material Presets
 *
 * Realistic human skin materials with subsurface scattering.
 *
 * @module materials/presets/skin
 */
export interface SkinPreset {
    name: string;
    baseColor: {
        r: number;
        g: number;
        b: number;
    };
    roughness: number;
    subsurfaceColor: {
        r: number;
        g: number;
        b: number;
    };
    subsurfaceRadius: number;
    shallowScatter: {
        r: number;
        g: number;
        b: number;
    };
    deepScatter: {
        r: number;
        g: number;
        b: number;
    };
    shallowDistance: number;
    deepDistance: number;
    specularIntensity: number;
    normalStrength: number;
}
/**
 * Fair/Light skin tone
 */
export declare const fairSkin: SkinPreset;
/**
 * Medium/Tan skin tone
 */
export declare const mediumSkin: SkinPreset;
/**
 * Dark/Deep skin tone
 */
export declare const darkSkin: SkinPreset;
/**
 * Lips material
 */
export declare const lips: SkinPreset;
/**
 * Ear material (slightly more translucent)
 */
export declare const ear: SkinPreset;
/**
 * All skin presets
 */
export declare const skinPresets: {
    fair: SkinPreset;
    medium: SkinPreset;
    dark: SkinPreset;
    lips: SkinPreset;
    ear: SkinPreset;
};
/**
 * Get skin preset by name
 */
export declare function getSkinPreset(name: keyof typeof skinPresets): SkinPreset;
//# sourceMappingURL=skin.d.ts.map