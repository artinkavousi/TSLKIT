/**
 * Matrix Transformation Utilities
 * 
 * Matrix operations for geometric transformations
 * 
 * @module materials/utils-matrix
 */

import { Fn, mat4, smoothstep } from 'three/tsl'
import { spherical } from './utils.js'

/**
 * Matrix rotation around X axis
 */
export const matRotX = Fn(([angle]: any) => {
  const cosVal = angle.cos().toVar()
  const sinVal = angle.sin().toVar()

  return mat4(1, 0, 0, 0, 0, cosVal, sinVal, 0, 0, sinVal.negate(), cosVal, 0, 0, 0, 0, 1)
})

/**
 * Matrix rotation around Y axis
 */
export const matRotY = Fn(([angle]: any) => {
  const cosVal = angle.cos().toVar()
  const sinVal = angle.sin().toVar()

  return mat4(cosVal, 0, sinVal.negate(), 0, 0, 1, 0, 0, sinVal, 0, cosVal, 0, 0, 0, 0, 1)
})

/**
 * Matrix rotation around Z axis
 */
export const matRotZ = Fn(([angle]: any) => {
  const cosVal = angle.cos().toVar()
  const sinVal = angle.sin().toVar()

  return mat4(cosVal, sinVal, 0, 0, sinVal.negate(), cosVal, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
})

/**
 * Combined rotation matrix (Y * X * Z order)
 */
export const matRotYXZ = Fn(([angles]: any) => {
  const RX = matRotX(angles.x)
  const RY = matRotY(angles.y)
  const RZ = matRotZ(angles.z)

  return RY.mul(RX).mul(RZ)
})

/**
 * Matrix scale transformation
 */
export const matScale = Fn(([scales]: any) => {
  return mat4(scales.x, 0, 0, 0, 0, scales.y, 0, 0, 0, 0, scales.z, 0, 0, 0, 0, 1)
})

/**
 * Matrix translation transformation
 */
export const matTrans = Fn(([vector]: any) => {
  return mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, vector.x, vector.y, vector.z, 1)
})

/**
 * Planar selection zone
 * 
 * Selects a zone in a plane through selCenter, rotated according to selAngles
 * Result is [0,1] inside plane, 0 below plane, 1 above plane
 */
export const selectPlanar = Fn(([pos, selAngles, selCenter, selWidth]: any) => {
  const s = spherical(selAngles.x, selAngles.y).mul(selWidth).toVar()
  const k = selCenter.sub(s.div(2)).sub(pos).dot(s).div(s.dot(s)).negate()

  return smoothstep(0, 1, k)
})

