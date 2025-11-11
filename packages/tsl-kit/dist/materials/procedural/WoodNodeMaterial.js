/**
 * Procedural Wood Node Material
 *
 * A fully procedural wood material using TSL (Three.js Shading Language).
 * No textures required - all grain patterns generated via shader code.
 *
 * Features:
 * - 10 wood species (teak, walnut, oak, pine, maple, etc.)
 * - 4 finish types (raw, matte, semigloss, gloss)
 * - Fully customizable parameters
 * - Based on MeshPhysicalMaterial for realistic rendering
 *
 * @module materials/procedural
 */
import * as THREE from 'three';
import { Fn, uniform, vec4, float, positionLocal, mix, max, positionView } from 'three/tsl';
import { softLightMix, woodCenter, spaceWarp, woodRings, woodDetail, cellStructure } from './helpers';
// Wood generation function - combines all helpers
const wood = Fn(([p, centerSize, largeWarpScale, largeGrainStretch, smallWarpStrength, smallWarpScale, fineWarpStrength, fineWarpScale, ringThickness, ringBias, ringSizeVariance, ringVarianceScale, barkThickness, splotchScale, splotchIntensity, cellScale, cellSize, darkGrainColor, lightGrainColor]) => {
    const center = woodCenter(p, centerSize);
    const mainWarp = spaceWarp(spaceWarp(p, center, largeWarpScale, largeGrainStretch), smallWarpStrength, smallWarpScale, 0.17);
    const detailWarp = spaceWarp(mainWarp, fineWarpStrength, fineWarpScale, 0.17);
    const rings = woodRings(detailWarp.length(), float(1).div(ringThickness), ringBias, ringSizeVariance, ringVarianceScale, barkThickness);
    const detail = woodDetail(detailWarp, p, detailWarp.length(), splotchScale);
    const cells = cellStructure(mainWarp, cellScale, cellSize.div(max(float(10).mul(positionView.length()), 1)));
    const baseColor = mix(darkGrainColor, lightGrainColor, rings);
    return softLightMix(splotchIntensity, softLightMix(0.407, baseColor, cells), detail);
});
/**
 * Preset wood parameters for different species
 */
const woodParams = {
    teak: {
        transformationMatrix: new THREE.Matrix4().identity(),
        centerSize: 1.11, largeWarpScale: 0.32, largeGrainStretch: 0.24, smallWarpStrength: 0.059,
        smallWarpScale: 2, fineWarpStrength: 0.006, fineWarpScale: 32.8, ringThickness: 1 / 34,
        ringBias: 0.03, ringSizeVariance: 0.03, ringVarianceScale: 4.4, barkThickness: 0.3,
        splotchScale: 0.2, splotchIntensity: 0.541, cellScale: 910, cellSize: 0.1,
        darkGrainColor: '#0c0504', lightGrainColor: '#926c50'
    },
    walnut: {
        transformationMatrix: new THREE.Matrix4().identity(),
        centerSize: 1.07, largeWarpScale: 0.42, largeGrainStretch: 0.34, smallWarpStrength: 0.016,
        smallWarpScale: 10.3, fineWarpStrength: 0.028, fineWarpScale: 12.7, ringThickness: 1 / 32,
        ringBias: 0.08, ringSizeVariance: 0.03, ringVarianceScale: 5.5, barkThickness: 0.98,
        splotchScale: 1.84, splotchIntensity: 0.97, cellScale: 710, cellSize: 0.31,
        darkGrainColor: '#311e13', lightGrainColor: '#523424'
    },
    white_oak: {
        transformationMatrix: new THREE.Matrix4().identity(),
        centerSize: 1.23, largeWarpScale: 0.21, largeGrainStretch: 0.21, smallWarpStrength: 0.034,
        smallWarpScale: 2.44, fineWarpStrength: 0.01, fineWarpScale: 14.3, ringThickness: 1 / 34,
        ringBias: 0.82, ringSizeVariance: 0.16, ringVarianceScale: 1.4, barkThickness: 0.7,
        splotchScale: 0.2, splotchIntensity: 0.541, cellScale: 800, cellSize: 0.28,
        darkGrainColor: '#8b4c21', lightGrainColor: '#c57e43'
    },
    pine: {
        transformationMatrix: new THREE.Matrix4().identity(),
        centerSize: 1.23, largeWarpScale: 0.21, largeGrainStretch: 0.18, smallWarpStrength: 0.041,
        smallWarpScale: 2.44, fineWarpStrength: 0.006, fineWarpScale: 23.2, ringThickness: 1 / 24,
        ringBias: 0.1, ringSizeVariance: 0.07, ringVarianceScale: 5, barkThickness: 0.35,
        splotchScale: 0.51, splotchIntensity: 3.32, cellScale: 1480, cellSize: 0.07,
        darkGrainColor: '#c58355', lightGrainColor: '#d19d61'
    },
    poplar: {
        transformationMatrix: new THREE.Matrix4().identity(),
        centerSize: 1.43, largeWarpScale: 0.33, largeGrainStretch: 0.18, smallWarpStrength: 0.04,
        smallWarpScale: 4.3, fineWarpStrength: 0.004, fineWarpScale: 33.6, ringThickness: 1 / 37,
        ringBias: 0.07, ringSizeVariance: 0.03, ringVarianceScale: 3.8, barkThickness: 0.3,
        splotchScale: 1.92, splotchIntensity: 0.71, cellScale: 830, cellSize: 0.04,
        darkGrainColor: '#716347', lightGrainColor: '#998966'
    },
    maple: {
        transformationMatrix: new THREE.Matrix4().identity(),
        centerSize: 1.4, largeWarpScale: 0.38, largeGrainStretch: 0.25, smallWarpStrength: 0.067,
        smallWarpScale: 2.5, fineWarpStrength: 0.005, fineWarpScale: 33.6, ringThickness: 1 / 35,
        ringBias: 0.1, ringSizeVariance: 0.07, ringVarianceScale: 4.6, barkThickness: 0.61,
        splotchScale: 0.46, splotchIntensity: 1.49, cellScale: 800, cellSize: 0.03,
        darkGrainColor: '#b08969', lightGrainColor: '#bc9d7d'
    },
    red_oak: {
        transformationMatrix: new THREE.Matrix4().identity(),
        centerSize: 1.21, largeWarpScale: 0.24, largeGrainStretch: 0.25, smallWarpStrength: 0.044,
        smallWarpScale: 2.54, fineWarpStrength: 0.01, fineWarpScale: 14.5, ringThickness: 1 / 34,
        ringBias: 0.92, ringSizeVariance: 0.03, ringVarianceScale: 5.6, barkThickness: 1.01,
        splotchScale: 0.28, splotchIntensity: 3.48, cellScale: 800, cellSize: 0.25,
        darkGrainColor: '#af613b', lightGrainColor: '#e0a27a'
    },
    cherry: {
        transformationMatrix: new THREE.Matrix4().identity(),
        centerSize: 1.33, largeWarpScale: 0.11, largeGrainStretch: 0.33, smallWarpStrength: 0.024,
        smallWarpScale: 2.48, fineWarpStrength: 0.01, fineWarpScale: 15.3, ringThickness: 1 / 36,
        ringBias: 0.02, ringSizeVariance: 0.04, ringVarianceScale: 6.5, barkThickness: 0.09,
        splotchScale: 1.27, splotchIntensity: 1.24, cellScale: 1530, cellSize: 0.15,
        darkGrainColor: '#913f27', lightGrainColor: '#b45837'
    },
    cedar: {
        transformationMatrix: new THREE.Matrix4().identity(),
        centerSize: 1.11, largeWarpScale: 0.39, largeGrainStretch: 0.12, smallWarpStrength: 0.061,
        smallWarpScale: 1.9, fineWarpStrength: 0.006, fineWarpScale: 4.8, ringThickness: 1 / 25,
        ringBias: 0.01, ringSizeVariance: 0.07, ringVarianceScale: 6.7, barkThickness: 0.1,
        splotchScale: 0.61, splotchIntensity: 2.54, cellScale: 630, cellSize: 0.19,
        darkGrainColor: '#9a5b49', lightGrainColor: '#ae745e'
    },
    mahogany: {
        transformationMatrix: new THREE.Matrix4().identity(),
        centerSize: 1.25, largeWarpScale: 0.26, largeGrainStretch: 0.29, smallWarpStrength: 0.044,
        smallWarpScale: 2.54, fineWarpStrength: 0.01, fineWarpScale: 15.3, ringThickness: 1 / 38,
        ringBias: 0.01, ringSizeVariance: 0.33, ringVarianceScale: 1.2, barkThickness: 0.07,
        splotchScale: 0.77, splotchIntensity: 1.39, cellScale: 1400, cellSize: 0.23,
        darkGrainColor: '#501d12', lightGrainColor: '#6d3722'
    }
};
/**
 * Available wood genus types
 */
export const WoodGenuses = ['teak', 'walnut', 'white_oak', 'pine', 'poplar', 'maple', 'red_oak', 'cherry', 'cedar', 'mahogany'];
/**
 * Available finish types
 */
export const Finishes = ['raw', 'matte', 'semigloss', 'gloss'];
/**
 * Get a wood preset with finish applied
 *
 * @param genus - Wood species name
 * @param finish - Finish type (affects clearcoat)
 * @returns Complete wood parameters
 */
export function GetWoodPreset(genus, finish) {
    const params = woodParams[genus];
    let clearcoat, clearcoatRoughness, clearcoatDarken;
    switch (finish) {
        case 'gloss':
            clearcoatDarken = 0.2;
            clearcoatRoughness = 0.1;
            clearcoat = 1;
            break;
        case 'semigloss':
            clearcoatDarken = 0.4;
            clearcoatRoughness = 0.4;
            clearcoat = 1;
            break;
        case 'matte':
            clearcoatDarken = 0.6;
            clearcoatRoughness = 1;
            clearcoat = 1;
            break;
        case 'raw':
        default:
            clearcoatDarken = 1;
            clearcoatRoughness = 0;
            clearcoat = 0;
    }
    return {
        ...params,
        transformationMatrix: new THREE.Matrix4().copy(params.transformationMatrix),
        genus,
        finish,
        clearcoat,
        clearcoatRoughness,
        clearcoatDarken
    };
}
/**
 * Procedural Wood Node Material
 *
 * @example
 * ```ts
 * // Using presets (recommended for common wood types)
 * const material = WoodNodeMaterial.fromPreset('walnut', 'gloss');
 *
 * // Using custom parameters (for advanced customization)
 * const material = new WoodNodeMaterial({
 *   centerSize: 1.2,
 *   ringThickness: 1/40,
 *   darkGrainColor: new THREE.Color('#2a1a0a'),
 *   lightGrainColor: new THREE.Color('#8b4513'),
 *   clearcoat: 1,
 *   clearcoatRoughness: 0.3
 * });
 *
 * // Mixing presets with custom overrides
 * const walnutParams = GetWoodPreset('walnut', 'raw');
 * const material = new WoodNodeMaterial({
 *   ...walnutParams,
 *   ringThickness: 1/50,  // Override specific parameter
 *   clearcoat: 1    // Add finish
 * });
 * ```
 */
export class WoodNodeMaterial extends THREE.MeshPhysicalMaterial {
    static get type() {
        return 'WoodNodeMaterial';
    }
    constructor(params = {}) {
        super();
        this.isWoodNodeMaterial = true;
        // Get default parameters from teak/raw preset
        const defaultParams = GetWoodPreset('teak', 'raw');
        // Merge default params with provided params
        const finalParams = { ...defaultParams, ...params };
        // Set all parameters as properties
        for (const key in finalParams) {
            if (key === 'genus' || key === 'finish')
                continue;
            const value = finalParams[key];
            if (typeof value === 'string') {
                this[key] = new THREE.Color(value);
            }
            else {
                this[key] = value;
            }
        }
        // Create uniforms for shader
        const uniforms = {
            centerSize: uniform(this.centerSize).onObjectUpdate(({ material }) => material.centerSize),
            largeWarpScale: uniform(this.largeWarpScale).onObjectUpdate(({ material }) => material.largeWarpScale),
            largeGrainStretch: uniform(this.largeGrainStretch).onObjectUpdate(({ material }) => material.largeGrainStretch),
            smallWarpStrength: uniform(this.smallWarpStrength).onObjectUpdate(({ material }) => material.smallWarpStrength),
            smallWarpScale: uniform(this.smallWarpScale).onObjectUpdate(({ material }) => material.smallWarpScale),
            fineWarpStrength: uniform(this.fineWarpStrength).onObjectUpdate(({ material }) => material.fineWarpStrength),
            fineWarpScale: uniform(this.fineWarpScale).onObjectUpdate(({ material }) => material.fineWarpScale),
            ringThickness: uniform(this.ringThickness).onObjectUpdate(({ material }) => material.ringThickness),
            ringBias: uniform(this.ringBias).onObjectUpdate(({ material }) => material.ringBias),
            ringSizeVariance: uniform(this.ringSizeVariance).onObjectUpdate(({ material }) => material.ringSizeVariance),
            ringVarianceScale: uniform(this.ringVarianceScale).onObjectUpdate(({ material }) => material.ringVarianceScale),
            barkThickness: uniform(this.barkThickness).onObjectUpdate(({ material }) => material.barkThickness),
            splotchScale: uniform(this.splotchScale).onObjectUpdate(({ material }) => material.splotchScale),
            splotchIntensity: uniform(this.splotchIntensity).onObjectUpdate(({ material }) => material.splotchIntensity),
            cellScale: uniform(this.cellScale).onObjectUpdate(({ material }) => material.cellScale),
            cellSize: uniform(this.cellSize).onObjectUpdate(({ material }) => material.cellSize),
            darkGrainColor: uniform(new THREE.Color(this.darkGrainColor)).onObjectUpdate(({ material }, self) => self.value.set(material.darkGrainColor)),
            lightGrainColor: uniform(new THREE.Color(this.lightGrainColor)).onObjectUpdate(({ material }, self) => self.value.set(material.lightGrainColor)),
            transformationMatrix: uniform(new THREE.Matrix4().copy(this.transformationMatrix)).onObjectUpdate(({ material }) => material.transformationMatrix)
        };
        // Create color node using wood function
        const colorNode = wood(uniforms.transformationMatrix.mul(vec4(positionLocal, 1)).xyz, uniforms.centerSize, uniforms.largeWarpScale, uniforms.largeGrainStretch, uniforms.smallWarpStrength, uniforms.smallWarpScale, uniforms.fineWarpStrength, uniforms.fineWarpScale, uniforms.ringThickness, uniforms.ringBias, uniforms.ringSizeVariance, uniforms.ringVarianceScale, uniforms.barkThickness, uniforms.splotchScale, uniforms.splotchIntensity, uniforms.cellScale, uniforms.cellSize, uniforms.darkGrainColor, uniforms.lightGrainColor).mul(finalParams.clearcoatDarken || 1);
        this.colorNode = colorNode;
        this.clearcoatNode = finalParams.clearcoat;
        this.clearcoatRoughness = finalParams.clearcoatRoughness || 0;
    }
    /**
     * Create a wood material from a preset
     *
     * @param genus - Wood species
     * @param finish - Finish type
     * @returns New WoodNodeMaterial instance
     */
    static fromPreset(genus = 'teak', finish = 'raw') {
        const params = GetWoodPreset(genus, finish);
        return new WoodNodeMaterial(params);
    }
}
//# sourceMappingURL=WoodNodeMaterial.js.map