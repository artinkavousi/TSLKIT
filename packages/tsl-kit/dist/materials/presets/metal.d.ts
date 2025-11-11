/**
 * Metal Material Presets
 *
 * Physically accurate metal materials with correct F0 values.
 *
 * @module materials/presets/metal
 */
export interface MetalPreset {
    name: string;
    baseColor: {
        r: number;
        g: number;
        b: number;
    };
    metallic: number;
    roughness: number;
    f0: {
        r: number;
        g: number;
        b: number;
    };
    anisotropy?: number;
    anisotropyRotation?: number;
}
/**
 * Gold (pure)
 * F0: (1.022, 0.782, 0.344) - accurate measured values
 */
export declare const gold: MetalPreset;
/**
 * Silver (pure)
 * F0: (0.972, 0.960, 0.915)
 */
export declare const silver: MetalPreset;
/**
 * Copper
 * F0: (0.955, 0.638, 0.538)
 */
export declare const copper: MetalPreset;
/**
 * Aluminum
 * F0: (0.913, 0.921, 0.925)
 */
export declare const aluminum: MetalPreset;
/**
 * Iron
 * F0: (0.562, 0.565, 0.578)
 */
export declare const iron: MetalPreset;
/**
 * Chromium (Chrome)
 * F0: (0.550, 0.556, 0.554)
 */
export declare const chrome: MetalPreset;
/**
 * Brushed aluminum (with anisotropy)
 */
export declare const brushedAluminum: MetalPreset;
/**
 * Brushed steel
 */
export declare const brushedSteel: MetalPreset;
/**
 * Titanium
 * F0: (0.542, 0.497, 0.449)
 */
export declare const titanium: MetalPreset;
/**
 * Brass
 * F0: (0.913, 0.777, 0.504)
 */
export declare const brass: MetalPreset;
/**
 * All metal presets
 */
export declare const metalPresets: {
    gold: MetalPreset;
    silver: MetalPreset;
    copper: MetalPreset;
    aluminum: MetalPreset;
    iron: MetalPreset;
    chrome: MetalPreset;
    brushedAluminum: MetalPreset;
    brushedSteel: MetalPreset;
    titanium: MetalPreset;
    brass: MetalPreset;
};
/**
 * Get metal preset by name
 */
export declare function getMetalPreset(name: keyof typeof metalPresets): MetalPreset;
//# sourceMappingURL=metal.d.ts.map