/**
 * Demo Module Map
 * Explicit imports for all available demos (Vite doesn't support variable dynamic imports)
 */

// Import all available demos
import * as simplexNoise2d from './individual/simplexNoise2d.js';
import * as simplexNoise3d from './individual/simplexNoise3d.js';
import * as simplexNoise4d from './individual/simplexNoise4d.js';
import * as perlinNoise3d from './individual/perlinNoise3d.js';
import * as classicNoise3d from './individual/classicNoise3d.js';
import * as curlNoise3d from './individual/curlNoise3d.js';
import * as curlNoise4d from './individual/curlNoise4d.js';
import * as voronoi from './individual/voronoi.js';
import * as fbm from './individual/fbm.js';
import * as turbulence from './individual/turbulence.js';
import * as fresnel from './individual/fresnel.js';
import * as diffuse from './individual/diffuse.js';
import * as phongSpecular from './individual/phongSpecular.js';
import * as blinnPhongSpecular from './individual/blinnPhongSpecular.js';
import * as hemisphere from './individual/hemisphere.js';
import * as directional from './individual/directional.js';
import * as tiledLights from './individual/tiledLights.js';
import * as bloom from './individual/bloom.js';
import * as vignette from './individual/vignette.js';
import * as filmGrain from './individual/filmGrain.js';
import * as sepia from './individual/sepia.js';
import * as dotScreen from './individual/dotScreen.js';
import * as sobel from './individual/sobel.js';
import * as afterImage from './individual/afterImage.js';
import * as bleach from './individual/bleach.js';
import * as chromaticAberration from './individual/chromaticAberration.js';
import * as rgbShift from './individual/rgbShift.js';
import * as pixellation from './individual/pixellation.js';
// lcdEffect and canvasWeave don't exist in Three.js - removed
import * as gaussianBlur from './individual/gaussianBlur.js';
import * as depthOfField from './individual/depthOfField.js';
import * as fxaa from './individual/fxaa.js';
import * as smaa from './individual/smaa.js';
import * as traa from './individual/traa.js';
import * as cosinePalette from './individual/cosinePalette.js';
import * as remap from './individual/remap.js';
import * as smoothMin from './individual/smoothMin.js';
import * as smoothMod from './individual/smoothMod.js';
import * as compose from './individual/compose.js';
// coordinates demo removed - no matching function
import * as rotate3dY from './individual/rotate3dY.js';
import * as screenAspectUV from './individual/screenAspectUV.js';
import * as repeatingPattern from './individual/repeatingPattern.js';
import * as median3 from './individual/median3.js';
import * as bloomEdge from './individual/bloomEdge.js';
import * as bayerMatrix from './individual/bayerMatrix.js';
import * as bayerMatrixTexture from './individual/bayerMatrixTexture.js';
import * as sdSphere from './individual/sdSphere.js';
import * as sdBox2d from './individual/sdBox2d.js';
import * as sdBox3d from './individual/sdBox3d.js';
import * as sdHexagon from './individual/sdHexagon.js';
import * as sdDiamond from './individual/sdDiamond.js';
import * as sdTriangle from './individual/sdTriangle.js';
import * as sdRing from './individual/sdRing.js';
import * as opUnion from './individual/opUnion.js';
import * as opSubtraction from './individual/opSubtraction.js';
import * as opIntersection from './individual/opIntersection.js';
import * as smin from './individual/smin.js';
import * as csmShadows from './individual/csmShadows.js';
import * as csmFrustum from './individual/csmFrustum.js';
import * as particleSystem from './individual/particleSystem.js';

// Demo map - add new demos here
export const demoMap = {
  // Noise
  simplexNoise2d,
  simplexNoise3d,
  simplexNoise4d,
  perlinNoise3d,
  classicNoise3d,
  curlNoise3d,
  curlNoise4d,
  voronoi,
  turbulence,
  fbm,
  
  // Lighting
  fresnel,
  diffuse,
  phongSpecular,
  blinnPhongSpecular,
  hemisphere,
  directional,
  tiledLights,
  
  // Shadows
  csmShadows,
  csmFrustum,
  
  // Post-FX
  bloom,
  vignette,
  filmGrain,
  sepia,
  dotScreen,
  sobel,
  afterImage,
  bleach,
  chromaticAberration,
  rgbShift,
  pixellation,
  lcdEffect: null,
  canvasWeave: null,
  gaussianBlur,
  depthOfField,
  fxaa,
  smaa,
  traa,
  
  // SDF
  sdSphere,
  sdBox2d,
  sdBox3d,
  sdHexagon,
  sdDiamond,
  sdTriangle,
  sdRing,
  opUnion,
  opSubtraction,
  opIntersection,
  smin,
  
  // Utils
  remap,
  smoothMin,
  smoothMod,
  cosinePalette,
  compose,
  coordinates: null,
  rotate3dY,
  screenAspectUV,
  repeatingPattern,
  median3,
  bloomEdge,
  
  // Math
  bayerMatrix,
  bayerMatrixTexture,
  
  // Compute
  particleSystem
};

export function getDemoModule(moduleId) {
  return demoMap[moduleId] || null;
}

export function isDemoAvailable(moduleId) {
  return demoMap[moduleId] !== null;
}

