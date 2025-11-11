/**
 * Fabric and Cloth Material Presets
 *
 * Textile materials with sheen and anisotropy.
 *
 * @module materials/presets/fabric
 */
export interface FabricPreset {
    name: string;
    baseColor: {
        r: number;
        g: number;
        b: number;
    };
    roughness: number;
    sheen: number;
    sheenColor: {
        r: number;
        g: number;
        b: number;
    };
    sheenRoughness: number;
    anisotropy?: number;
    anisotropyRotation?: number;
    normalStrength: number;
    fuzziness: number;
}
/**
 * Red velvet
 */
export declare const velvet: FabricPreset;
/**
 * Blue denim
 */
export declare const denim: FabricPreset;
/**
 * White silk
 */
export declare const silk: FabricPreset;
/**
 * Red satin
 */
export declare const satin: FabricPreset;
/**
 * Canvas fabric
 */
export declare const canvas: FabricPreset;
/**
 * Wool (knit)
 */
export declare const wool: FabricPreset;
/**
 * Leather (smooth)
 */
export declare const leather: FabricPreset;
/**
 * Suede
 */
export declare const suede: FabricPreset;
/**
 * Cotton (white)
 */
export declare const cotton: FabricPreset;
/**
 * Linen
 */
export declare const linen: FabricPreset;
/**
 * All fabric presets
 */
export declare const fabricPresets: {
    velvet: FabricPreset;
    denim: FabricPreset;
    silk: FabricPreset;
    satin: FabricPreset;
    canvas: FabricPreset;
    wool: FabricPreset;
    leather: FabricPreset;
    suede: FabricPreset;
    cotton: FabricPreset;
    linen: FabricPreset;
};
/**
 * Get fabric preset by name
 */
export declare function getFabricPreset(name: keyof typeof fabricPresets): FabricPreset;
//# sourceMappingURL=fabric.d.ts.map