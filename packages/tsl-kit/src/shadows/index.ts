/**
 * Shadow Systems Module
 * 
 * Advanced shadow mapping techniques for Three.js WebGPU:
 * - CSM (Cascaded Shadow Maps) - Industry-standard technique for large outdoor scenes
 * - Tile Shadows - Improved shadow resolution through tiling
 * 
 * @module @tslstudio/tsl-kit/shadows
 */

export { CSMFrustum } from './CSMFrustum'
export type { CSMFrustumData, FrustumVertices } from './CSMFrustum'

export { CSMShadowNode } from './CSMShadowNode'
export type { CSMShadowNodeData, CSMMode, CustomSplitsCallback } from './CSMShadowNode'

// TileShadowNode will be exported once ported
// export { TileShadowNode } from './TileShadowNode'
// export { TileShadowNodeHelper } from './TileShadowNodeHelper'
