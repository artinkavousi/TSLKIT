/**
 * SDF Primitive Shapes
 *
 * @author Maxime Heckel
 * @source https://github.com/MaximeHeckel/fragments-boilerplate
 * @license MIT
 * @version Ported to Three.js r181+
 *
 * Signed Distance Field functions for various 2D and 3D primitive shapes.
 * Based on Inigo Quilez's SDF library: https://iquilezles.org/articles/distfunctions/
 *
 * All functions return signed distance where:
 * - Negative values = inside shape
 * - Positive values = outside shape
 * - Zero = on surface
 */
/**
 * Sphere SDF (2D circle or 3D sphere)
 * @param _uv - Position (vec2 or vec3)
 * @param r - Radius (float, default: 0.0)
 * @returns Signed distance (float)
 */
export declare const sdSphere: any;
/**
 * 2D Box SDF (square or rectangle)
 * @param _uv - Position (vec2)
 * @param _size - Half-size (extent) along each axis (float, default: 0.0)
 * @returns Signed distance (float)
 */
export declare const sdBox2d: any;
/**
 * 3D Box SDF (cube or box)
 * @param p - Position (vec3)
 * @param b - Half-extents (vec3)
 * @returns Signed distance (float)
 */
export declare const sdBox3d: any;
/**
 * Diamond SDF (rotated square)
 * @param _uv - Position (vec2)
 * @param r - Radius (float, default: 0.0)
 * @returns Signed distance (float)
 */
export declare const sdDiamond: any;
/**
 * Regular Hexagon SDF
 * @param p - Position (vec2, default: vec2(0))
 * @param _r - Radius (float, default: 0.5)
 * @returns Signed distance (float)
 */
export declare const sdHexagon: any;
/**
 * Equilateral Triangle SDF
 * @param p - Position (vec2, default: vec2(0))
 * @param _r - Radius (float, default: 0.1)
 * @returns Signed distance (float)
 */
export declare const sdEquilateralTriangle: any;
/**
 * Line SDF (distance to vertical line at x=0)
 * @param p - Position coordinate (float)
 * @returns Signed distance (float)
 */
export declare const sdLine: any;
/**
 * Ring SDF (annulus/hollow circle)
 * @param _uv - Position (vec2)
 * @param s - Radius (float, default: 0.4)
 * @returns Signed distance (float)
 */
export declare const sdRing: any;
/**
 * Parallelogram SDF
 * @param _p - Position (vec2)
 * @param wi - Width (float)
 * @param he - Height (float)
 * @param sk - Skew (float)
 * @returns Signed distance (float)
 */
export declare const sdParallelogram: any;
/**
 * Rhombus SDF
 * @param _p - Position (vec2)
 * @param b - Size (vec2)
 * @returns Signed distance (float)
 */
export declare const sdRhombus: any;
/**
 * Triangle SDF (general)
 * @param _p - Position (vec2)
 * @param size - Size multiplier (float)
 * @returns Signed distance (float)
 */
export declare const sdTriangle: any;
//# sourceMappingURL=shapes.d.ts.map