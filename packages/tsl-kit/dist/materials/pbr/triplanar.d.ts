/**
 * Triplanar Texture Mapping
 *
 * Project textures from 3 axes to avoid UV distortion on complex geometry.
 *
 * @module materials/pbr/triplanar
 */
/**
 * Triplanar texture sampling with world-space normals
 *
 * @param tex - Texture sampler
 * @param scale - UV scale multiplier
 * @param sharpness - Blend sharpness between axes (higher = sharper transitions)
 */
export declare const triplanarMapping: any;
/**
 * Triplanar with separate textures per axis
 *
 * @param texX - Texture for X axis
 * @param texY - Texture for Y axis
 * @param texZ - Texture for Z axis
 * @param scale - UV scale
 * @param sharpness - Blend sharpness
 */
export declare const triplanarMappingSeparate: any;
/**
 * Triplanar normal mapping
 *
 * @param normalTex - Normal map texture
 * @param scale - UV scale
 * @param sharpness - Blend sharpness
 * @param strength - Normal strength multiplier
 */
export declare const triplanarNormal: any;
/**
 * Box projection for cube-mapped environments
 *
 * @param position - World position
 * @param normal - World normal
 * @param boxMin - Bounding box minimum
 * @param boxMax - Bounding box maximum
 */
export declare const boxProjection: any;
//# sourceMappingURL=triplanar.d.ts.map