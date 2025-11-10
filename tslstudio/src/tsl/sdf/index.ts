/**
 * Signed Distance Field (SDF) Functions
 * 
 * Collection of SDF primitives and operations for:
 * - 2D and 3D shape primitives
 * - Boolean operations (union, intersection, subtraction)
 * - Domain operations (repetition, transformation)
 * - Smooth blending operations
 * 
 * SDFs are useful for:
 * - Raymarching
 * - Procedural modeling
 * - Soft shadows and ambient occlusion
 * - Collision detection
 * 
 * @module tsl/sdf
 */

// Primitive shapes
export * from './shapes.js'

// Boolean and domain operations
export * from './operations.js'
