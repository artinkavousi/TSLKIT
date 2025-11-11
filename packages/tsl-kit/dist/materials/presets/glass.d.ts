/**
 * Glass and Transparent Material Presets
 *
 * Various glass types with transmission and refraction.
 *
 * @module materials/presets/glass
 */
export interface GlassPreset {
    name: string;
    baseColor: {
        r: number;
        g: number;
        b: number;
    };
    transmission: number;
    ior: number;
    roughness: number;
    thickness: number;
    attenuationColor: {
        r: number;
        g: number;
        b: number;
    };
    attenuationDistance: number;
    specularIntensity: number;
    iridescence?: number;
    iridescenceIOR?: number;
    clearcoat?: number;
}
/**
 * Clear window glass
 */
export declare const windowGlass: GlassPreset;
/**
 * Colored glass - green tint
 */
export declare const greenGlass: GlassPreset;
/**
 * Frosted glass
 */
export declare const frostedGlass: GlassPreset;
/**
 * Wine glass (slight color)
 */
export declare const wineGlass: GlassPreset;
/**
 * Crystal/Diamond
 */
export declare const crystal: GlassPreset;
/**
 * Stained glass - blue
 */
export declare const stainedGlassBlue: GlassPreset;
/**
 * Stained glass - red
 */
export declare const stainedGlassRed: GlassPreset;
/**
 * Ice
 */
export declare const ice: GlassPreset;
/**
 * Soap bubble (with iridescence)
 */
export declare const soapBubble: GlassPreset;
/**
 * Plastic wrap/film
 */
export declare const plasticWrap: GlassPreset;
/**
 * All glass presets
 */
export declare const glassPresets: {
    window: GlassPreset;
    green: GlassPreset;
    frosted: GlassPreset;
    wine: GlassPreset;
    crystal: GlassPreset;
    stainedBlue: GlassPreset;
    stainedRed: GlassPreset;
    ice: GlassPreset;
    soapBubble: GlassPreset;
    plasticWrap: GlassPreset;
};
/**
 * Get glass preset by name
 */
export declare function getGlassPreset(name: keyof typeof glassPresets): GlassPreset;
//# sourceMappingURL=glass.d.ts.map