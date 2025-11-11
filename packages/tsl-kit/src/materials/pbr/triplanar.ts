/**
 * Triplanar Texture Mapping
 * 
 * Project textures from 3 axes to avoid UV distortion on complex geometry.
 * 
 * @module materials/pbr/triplanar
 */

import { Fn, vec2, vec3, vec4, abs, pow, texture, positionWorld, normalWorld, max } from 'three/tsl';

/**
 * Triplanar texture sampling with world-space normals
 * 
 * @param tex - Texture sampler
 * @param scale - UV scale multiplier
 * @param sharpness - Blend sharpness between axes (higher = sharper transitions)
 */
export const triplanarMapping = Fn(([tex, scale, sharpness]) => {
  const pos = positionWorld.mul(scale);
  const normal = normalWorld;
  
  // Sample texture from each axis
  const xAxis = texture(tex, pos.yz);
  const yAxis = texture(tex, pos.xz);
  const zAxis = texture(tex, pos.xy);
  
  // Calculate blend weights based on normal
  const blendWeights = abs(normal).pow(sharpness);
  const blendSum = blendWeights.x.add(blendWeights.y).add(blendWeights.z);
  const blend = blendWeights.div(blendSum);
  
  // Blend the three projections
  const result = xAxis.mul(blend.x)
    .add(yAxis.mul(blend.y))
    .add(zAxis.mul(blend.z));
  
  return result;
});

/**
 * Triplanar with separate textures per axis
 * 
 * @param texX - Texture for X axis
 * @param texY - Texture for Y axis
 * @param texZ - Texture for Z axis
 * @param scale - UV scale
 * @param sharpness - Blend sharpness
 */
export const triplanarMappingSeparate = Fn(([texX, texY, texZ, scale, sharpness]) => {
  const pos = positionWorld.mul(scale);
  const normal = normalWorld;
  
  const xSample = texture(texX, pos.yz);
  const ySample = texture(texY, pos.xz);
  const zSample = texture(texZ, pos.xy);
  
  const blendWeights = abs(normal).pow(sharpness);
  const blendSum = blendWeights.x.add(blendWeights.y).add(blendWeights.z);
  const blend = blendWeights.div(blendSum);
  
  return xSample.mul(blend.x)
    .add(ySample.mul(blend.y))
    .add(zSample.mul(blend.z));
});

/**
 * Triplanar normal mapping
 * 
 * @param normalTex - Normal map texture
 * @param scale - UV scale
 * @param sharpness - Blend sharpness
 * @param strength - Normal strength multiplier
 */
export const triplanarNormal = Fn(([normalTex, scale, sharpness, strength]) => {
  const pos = positionWorld.mul(scale);
  const normal = normalWorld;
  
  // Sample normals from each axis
  const xNorm = texture(normalTex, pos.yz).xyz.mul(2).sub(1);
  const yNorm = texture(normalTex, pos.xz).xyz.mul(2).sub(1);
  const zNorm = texture(normalTex, pos.xy).xyz.mul(2).sub(1);
  
  // Adjust strength
  xNorm.xy.mulAssign(strength);
  yNorm.xy.mulAssign(strength);
  zNorm.xy.mulAssign(strength);
  
  // Calculate blend weights
  const blendWeights = abs(normal).pow(sharpness);
  const blendSum = blendWeights.x.add(blendWeights.y).add(blendWeights.z);
  const blend = blendWeights.div(blendSum);
  
  // Blend normals
  const blendedNormal = xNorm.mul(blend.x)
    .add(yNorm.mul(blend.y))
    .add(zNorm.mul(blend.z));
  
  return blendedNormal.normalize();
});

/**
 * Box projection for cube-mapped environments
 * 
 * @param position - World position
 * @param normal - World normal
 * @param boxMin - Bounding box minimum
 * @param boxMax - Bounding box maximum
 */
export const boxProjection = Fn(([position, normal, boxMin, boxMax]) => {
  const boxCenter = boxMin.add(boxMax).mul(0.5);
  const boxExtents = boxMax.sub(boxMin).mul(0.5);
  
  const intersection = position.sub(boxCenter).div(normal);
  const distToBox = boxExtents.sub(abs(position.sub(boxCenter))).div(abs(normal));
  
  const minDist = max(max(distToBox.x, distToBox.y), distToBox.z);
  const projectedPos = position.add(normal.mul(minDist));
  
  return projectedPos.sub(boxCenter);
});

