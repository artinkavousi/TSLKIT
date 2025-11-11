/**
 * Material Presets Library
 *
 * Ready-to-use material configurations for common surfaces.
 *
 * @module materials/presets
 */
export * from './skin';
export * from './metal';
export * from './carPaint';
export * from './glass';
export * from './fabric';
/**
 * All material presets organized by category
 */
export declare const materialPresets: {
    skin: {
        fair: import("./skin").SkinPreset;
        medium: import("./skin").SkinPreset;
        dark: import("./skin").SkinPreset;
        lips: import("./skin").SkinPreset;
        ear: import("./skin").SkinPreset;
    };
    metal: {
        gold: import("./metal").MetalPreset;
        silver: import("./metal").MetalPreset;
        copper: import("./metal").MetalPreset;
        aluminum: import("./metal").MetalPreset;
        iron: import("./metal").MetalPreset;
        chrome: import("./metal").MetalPreset;
        brushedAluminum: import("./metal").MetalPreset;
        brushedSteel: import("./metal").MetalPreset;
        titanium: import("./metal").MetalPreset;
        brass: import("./metal").MetalPreset;
    };
    carPaint: {
        sportsRed: import("./carPaint").CarPaintPreset;
        deepBlue: import("./carPaint").CarPaintPreset;
        pearlWhite: import("./carPaint").CarPaintPreset;
        pianoBlack: import("./carPaint").CarPaintPreset;
        candyRed: import("./carPaint").CarPaintPreset;
        matteGreen: import("./carPaint").CarPaintPreset;
        chromeSilver: import("./carPaint").CarPaintPreset;
        metallicOrange: import("./carPaint").CarPaintPreset;
        chameleonPurple: import("./carPaint").CarPaintPreset;
    };
    glass: {
        window: import("./glass").GlassPreset;
        green: import("./glass").GlassPreset;
        frosted: import("./glass").GlassPreset;
        wine: import("./glass").GlassPreset;
        crystal: import("./glass").GlassPreset;
        stainedBlue: import("./glass").GlassPreset;
        stainedRed: import("./glass").GlassPreset;
        ice: import("./glass").GlassPreset;
        soapBubble: import("./glass").GlassPreset;
        plasticWrap: import("./glass").GlassPreset;
    };
    fabric: {
        velvet: import("./fabric").FabricPreset;
        denim: import("./fabric").FabricPreset;
        silk: import("./fabric").FabricPreset;
        satin: import("./fabric").FabricPreset;
        canvas: import("./fabric").FabricPreset;
        wool: import("./fabric").FabricPreset;
        leather: import("./fabric").FabricPreset;
        suede: import("./fabric").FabricPreset;
        cotton: import("./fabric").FabricPreset;
        linen: import("./fabric").FabricPreset;
    };
};
/**
 * Get total count of all presets
 */
export declare function getPresetCount(): {
    skin: number;
    metal: number;
    carPaint: number;
    glass: number;
    fabric: number;
    total: number;
};
//# sourceMappingURL=index.d.ts.map