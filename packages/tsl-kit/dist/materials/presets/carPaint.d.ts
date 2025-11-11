/**
 * Car Paint Material Presets
 *
 * Multi-layer automotive paint with metallic flakes and clearcoat.
 *
 * @module materials/presets/carPaint
 */
export interface CarPaintPreset {
    name: string;
    baseColor: {
        r: number;
        g: number;
        b: number;
    };
    metallic: number;
    roughness: number;
    flakeColor: {
        r: number;
        g: number;
        b: number;
    };
    flakeSize: number;
    flakeDensity: number;
    clearcoat: number;
    clearcoatRoughness: number;
    clearcoatNormalStrength: number;
    anisotropy?: number;
    iridescence?: number;
    iridescenceIOR?: number;
    iridescenceThickness?: number;
}
/**
 * Classic red sports car paint
 */
export declare const sportsRed: CarPaintPreset;
/**
 * Deep blue metallic
 */
export declare const deepBlue: CarPaintPreset;
/**
 * Pearl white with subtle iridescence
 */
export declare const pearlWhite: CarPaintPreset;
/**
 * Black piano finish
 */
export declare const pianoBlack: CarPaintPreset;
/**
 * Candy apple red (translucent over metallic)
 */
export declare const candyRed: CarPaintPreset;
/**
 * Matte military green
 */
export declare const matteGreen: CarPaintPreset;
/**
 * Chrome silver
 */
export declare const chromeSilver: CarPaintPreset;
/**
 * Orange with metallic flakes
 */
export declare const metallicOrange: CarPaintPreset;
/**
 * Purple with color-shift iridescence
 */
export declare const chameleonPurple: CarPaintPreset;
/**
 * All car paint presets
 */
export declare const carPaintPresets: {
    sportsRed: CarPaintPreset;
    deepBlue: CarPaintPreset;
    pearlWhite: CarPaintPreset;
    pianoBlack: CarPaintPreset;
    candyRed: CarPaintPreset;
    matteGreen: CarPaintPreset;
    chromeSilver: CarPaintPreset;
    metallicOrange: CarPaintPreset;
    chameleonPurple: CarPaintPreset;
};
/**
 * Get car paint preset by name
 */
export declare function getCarPaintPreset(name: keyof typeof carPaintPresets): CarPaintPreset;
//# sourceMappingURL=carPaint.d.ts.map