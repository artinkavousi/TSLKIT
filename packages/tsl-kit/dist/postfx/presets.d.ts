/**
 * Post-Processing Presets
 *
 * Ready-to-use post-processing chain configurations.
 *
 * @module postfx/presets
 */
import { ToneMapPass, BloomPass, ColorGradingPass, VignettePass, FilmGrainPass } from './passes';
/**
 * Cinematic look preset
 */
export declare function cinematicLook(): (ToneMapPass | BloomPass | ColorGradingPass | VignettePass)[];
/**
 * Dramatic high-contrast preset
 */
export declare function dramaticContrast(): (ToneMapPass | BloomPass | ColorGradingPass | VignettePass)[];
/**
 * Soft dreamy look preset
 */
export declare function dreamyLook(): (ToneMapPass | BloomPass | ColorGradingPass | FilmGrainPass)[];
/**
 * Vintage film look preset
 */
export declare function vintageFilm(): (ToneMapPass | ColorGradingPass | VignettePass | FilmGrainPass)[];
/**
 * Cool cyberpunk preset
 */
export declare function cyberpunkNeon(): (ToneMapPass | BloomPass | ColorGradingPass | FilmGrainPass)[];
/**
 * Warm golden hour preset
 */
export declare function goldenHour(): (ToneMapPass | BloomPass | ColorGradingPass | VignettePass)[];
/**
 * Cool moonlight preset
 */
export declare function moonlight(): (ToneMapPass | ColorGradingPass | VignettePass)[];
/**
 * Horror atmosphere preset
 */
export declare function horrorAtmosphere(): (ToneMapPass | ColorGradingPass | VignettePass | FilmGrainPass)[];
/**
 * Clean realistic preset
 */
export declare function realistic(): (ToneMapPass | BloomPass | ColorGradingPass)[];
/**
 * High-key bright preset
 */
export declare function highKey(): (ToneMapPass | BloomPass | ColorGradingPass)[];
/**
 * Low-key dark preset
 */
export declare function lowKey(): (ToneMapPass | ColorGradingPass | VignettePass)[];
/**
 * Pastel colors preset
 */
export declare function pastelColors(): (ToneMapPass | BloomPass | ColorGradingPass)[];
/**
 * Desaturated bleach bypass preset
 */
export declare function bleachBypass(): (ToneMapPass | ColorGradingPass | FilmGrainPass)[];
/**
 * Anime/cel-shaded style preset
 */
export declare function animeStyle(): (ToneMapPass | BloomPass | ColorGradingPass)[];
/**
 * Sepia tone preset
 */
export declare function sepiaTone(): (ToneMapPass | ColorGradingPass | VignettePass | FilmGrainPass)[];
/**
 * Black and white preset
 */
export declare function blackAndWhite(): (ToneMapPass | ColorGradingPass | FilmGrainPass)[];
/**
 * Infrared camera preset
 */
export declare function infrared(): (ToneMapPass | ColorGradingPass)[];
/**
 * Underwater look preset
 */
export declare function underwater(): (ToneMapPass | ColorGradingPass | VignettePass)[];
/**
 * Sunset/dusk preset
 */
export declare function sunset(): (ToneMapPass | BloomPass | ColorGradingPass | VignettePass)[];
/**
 * Foggy atmosphere preset
 */
export declare function foggy(): (ToneMapPass | BloomPass | ColorGradingPass)[];
/**
 * All post-processing presets
 */
export declare const postfxPresets: {
    cinematic: typeof cinematicLook;
    dramatic: typeof dramaticContrast;
    dreamy: typeof dreamyLook;
    vintage: typeof vintageFilm;
    cyberpunk: typeof cyberpunkNeon;
    goldenHour: typeof goldenHour;
    moonlight: typeof moonlight;
    horror: typeof horrorAtmosphere;
    realistic: typeof realistic;
    highKey: typeof highKey;
    lowKey: typeof lowKey;
    pastel: typeof pastelColors;
    bleach: typeof bleachBypass;
    anime: typeof animeStyle;
    sepia: typeof sepiaTone;
    blackAndWhite: typeof blackAndWhite;
    infrared: typeof infrared;
    underwater: typeof underwater;
    sunset: typeof sunset;
    foggy: typeof foggy;
};
//# sourceMappingURL=presets.d.ts.map