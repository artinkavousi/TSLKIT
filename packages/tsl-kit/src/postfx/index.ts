/**
 * Post-Processing Effects Module
 * 
 * Collection of post-processing effects for Three.js TSL/WebGPU.
 * 
 * @module postfx
 */

// Core post-processing infrastructure
export * from './core';

// Individual passes
export * from './passes';

// Post-processing presets
export * from './presets';

// Core post-processing
export * from './bloom'
export * from './tonemapping'
export * from './gaussianBlur'

// Stylized effects
export * from './vignette'
export * from './filmGrain'
export * from './lcdEffect'
export * from './canvasWeave'
export * from './pixellation'
export * from './Sepia'
export * from './DotScreenNode'
export * from './SobelOperatorNode'
export * from './AfterImageNode'
export * from './BleachBypass'

// Advanced effects (Three.js r181 official)
export * from './chromaticAberration'
export * from './rgbShift'
export * from './fxaa'
export * from './smaa'
export * from './traa'
export * from './depthOfField'
// Temporarily disabled - import issues
// export * from './gtao'
// export * from './ssr'
// export * from './ssgi'
// export * from './motionBlur'
// export * from './lensflare'
// export * from './lut3d'
// export * from './outline'
// export * from './denoise'
// export * from './anamorphic'

