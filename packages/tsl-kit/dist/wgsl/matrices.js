/**
 * WGSL Matrix Utility Functions
 *
 * Provides matrix operations for use in TSL compute shaders and materials.
 * These functions are compiled as WGSL code for optimal GPU performance.
 *
 * @module wgsl/matrices
 */
import { wgslFn } from 'three/tsl';
/**
 * Creates a look-at matrix from a direction and up vector
 *
 * @example
 * ```ts
 * import { mat3LookAt } from '@tslstudio/tsl-kit/wgsl';
 *
 * const lookAtMatrix = mat3LookAt(direction, up);
 * ```
 */
export const mat3LookAt = wgslFn(`
fn lookAt(direction: vec3<f32>, up: vec3<f32>) -> mat3x3<f32> {
	var direction_var = direction;
	if (direction_var.x * direction_var.x + direction_var.y * direction_var.y + direction_var.z * direction_var.z == 0.) {
		direction_var.z = 1.;
	}
	direction_var = normalize(direction_var);
	var x: vec3<f32> = cross(up, direction_var);
	if (x.x * x.x + x.y * x.y + x.z * x.z == 0.) {
		if (abs(up.z) == 1.) {
			direction_var.x = direction_var.x + (0.0001);
		} else { 
			direction_var.z = direction_var.z + (0.0001);
		}
		x = cross(up, direction_var);
	}
	x = normalize(x);
	return mat3x3<f32>(x, cross(direction_var, x), direction_var);
}
`);
/**
 * Creates a 3x3 rotation matrix from Euler angles (XYZ order)
 *
 * @example
 * ```ts
 * import { mat3RotationXYZ } from '@tslstudio/tsl-kit/wgsl';
 *
 * const rotationMatrix = mat3RotationXYZ(eulerAngles);
 * ```
 */
export const mat3RotationXYZ = wgslFn(`
fn rotationXYZ(euler:vec3<f32>) -> mat3x3<f32> {
  let a = cos(euler.x); let b = sin(euler.x);
  let c = cos(euler.y); let d = sin(euler.y);
  let e = cos(euler.z); let f = sin(euler.z);
  let ae = a * e; let af = a * f; let be = b * e; let bf = b * f;
  return mat3x3<f32>(
    vec3<f32>(c * e, af + be * d, bf - ae * d),
    vec3<f32>(-c * f, ae - bf * d, be + af * d),
    vec3<f32>(d, -b * c, a * c)
  );
}
`);
/**
 * Composes a 4x4 transformation matrix from position, rotation, and scale
 *
 * @example
 * ```ts
 * import { mat4Compose } from '@tslstudio/tsl-kit/wgsl';
 *
 * const transformMatrix = mat4Compose(position, rotationMatrix, scale);
 * ```
 */
export const mat4Compose = wgslFn(`
fn compose(pos: vec3<f32>, rmat: mat3x3<f32>, scale: vec3<f32>) -> mat4x4<f32> {
	return mat4x4<f32>(
    rmat[0][0] * scale.x, rmat[0][1] * scale.x, rmat[0][2] * scale.x, 0.,
    rmat[1][0] * scale.y, rmat[1][1] * scale.y, rmat[1][2] * scale.y, 0.,
    rmat[2][0] * scale.z, rmat[2][1] * scale.z, rmat[2][2] * scale.z, 0.,
    pos.x, pos.y, pos.z, 1.
  );
}
`);
//# sourceMappingURL=matrices.js.map