/**
 * CSM Frustum
 * 
 * @author Three.js Contributors
 * @source https://github.com/mrdoob/three.js/blob/r181/examples/jsm/csm/CSMFrustum.js
 * @license MIT
 * @version Three.js r181
 * 
 * Represents the frustum of a Cascaded Shadow Map (CSM) instance.
 * Handles frustum splitting and cascade calculation for shadow mapping.
 * 
 * This class manages the near and far plane vertices in view space,
 * enabling proper cascade distribution across the camera's view frustum.
 * 
 * @example
 * ```typescript
 * import { CSMFrustum } from '@tslstudio/tsl-kit/shadows'
 * import { Matrix4 } from 'three/webgpu'
 * 
 * const frustum = new CSMFrustum({ webGL: false })
 * frustum.setFromProjectionMatrix(camera.projectionMatrix, 1000)
 * frustum.split([0.1, 0.3, 1.0], childFrustums)
 * ```
 */

import { Vector3, Matrix4 } from 'three/webgpu'

const inverseProjectionMatrix = /*@__PURE__*/ new Matrix4()

export interface CSMFrustumData {
  /** Use WebGL coordinate system (zNear = -1) or WebGPU (zNear = 0) */
  webGL?: boolean
  /** Projection matrix to initialize from */
  projectionMatrix?: Matrix4
  /** Maximum far plane distance */
  maxFar?: number
}

export interface FrustumVertices {
  near: Vector3[]
  far: Vector3[]
}

/**
 * CSM Frustum class for managing cascade shadow map frustums.
 * 
 * Supports both WebGL and WebGPU coordinate systems and provides
 * methods for frustum splitting and transformation.
 */
export class CSMFrustum {
  /** Near plane z-coordinate (-1 for WebGL, 0 for WebGPU) */
  public zNear: number

  /** Frustum vertices (near and far plane corners in view space) */
  public vertices: FrustumVertices

  /**
   * Constructs a new CSM frustum.
   * 
   * @param data - Configuration data for the frustum
   */
  constructor(data: CSMFrustumData = {}) {
    // WebGPU uses zNear = 0, WebGL uses zNear = -1
    this.zNear = data.webGL === true ? -1 : 0

    // Initialize near and far plane vertices
    this.vertices = {
      near: [
        new Vector3(),
        new Vector3(),
        new Vector3(),
        new Vector3()
      ],
      far: [
        new Vector3(),
        new Vector3(),
        new Vector3(),
        new Vector3()
      ]
    }

    if (data.projectionMatrix !== undefined) {
      this.setFromProjectionMatrix(data.projectionMatrix, data.maxFar || 10000)
    }
  }

  /**
   * Sets up this CSM frustum from the given projection matrix and max far value.
   * 
   * Calculates frustum corner vertices in view space by unprojecting
   * clip space coordinates through the inverse projection matrix.
   * 
   * @param projectionMatrix - The projection matrix, usually of the scene's camera
   * @param maxFar - The maximum far plane distance
   * @returns The vertices object for chaining
   */
  setFromProjectionMatrix(projectionMatrix: Matrix4, maxFar: number): FrustumVertices {
    const zNear = this.zNear
    const isOrthographic = projectionMatrix.elements[2 * 4 + 3] === 0

    inverseProjectionMatrix.copy(projectionMatrix).invert()

    // Frustum vertex order:
    // 3 --- 0  (near/far)
    // |     |
    // 2 --- 1
    // Clip space spans from [-1, 1]

    // Near plane vertices in clip space
    this.vertices.near[0].set(1, 1, zNear)
    this.vertices.near[1].set(1, -1, zNear)
    this.vertices.near[2].set(-1, -1, zNear)
    this.vertices.near[3].set(-1, 1, zNear)
    this.vertices.near.forEach((v) => {
      v.applyMatrix4(inverseProjectionMatrix)
    })

    // Far plane vertices in clip space
    this.vertices.far[0].set(1, 1, 1)
    this.vertices.far[1].set(1, -1, 1)
    this.vertices.far[2].set(-1, -1, 1)
    this.vertices.far[3].set(-1, 1, 1)
    this.vertices.far.forEach((v) => {
      v.applyMatrix4(inverseProjectionMatrix)

      const absZ = Math.abs(v.z)
      if (isOrthographic) {
        v.z *= Math.min(maxFar / absZ, 1.0)
      } else {
        v.multiplyScalar(Math.min(maxFar / absZ, 1.0))
      }
    })

    return this.vertices
  }

  /**
   * Splits this frustum into multiple sub-frustums based on the given breaks.
   * 
   * The breaks array defines where to split the frustum, with values
   * in the range [0, 1] representing normalized distances from near to far plane.
   * 
   * @param breaks - Array of split points (0 to 1), one less than number of cascades
   * @param target - Array to store the resulting child frustums
   * @example
   * ```typescript
   * // Create 3 cascades
   * const breaks = [0.1, 0.3] // 2 splits = 3 frustums
   * const frustums: CSMFrustum[] = []
   * mainFrustum.split(breaks, frustums)
   * // frustums[0]: near -> 10% of far
   * // frustums[1]: 10% -> 30% of far
   * // frustums[2]: 30% -> 100% of far
   * ```
   */
  split(breaks: number[], target: CSMFrustum[]): void {
    // Ensure target array is sized correctly
    while (breaks.length > target.length) {
      target.push(new CSMFrustum({ webGL: this.zNear === -1 }))
    }

    target.length = breaks.length

    // Split the frustum at each break point
    for (let i = 0; i < breaks.length; i++) {
      const cascade = target[i]

      // Previous break (0 for first cascade)
      const prev = i === 0 ? 0 : breaks[i - 1]
      // Current break
      const cur = breaks[i]

      // Interpolate near plane from parent's far plane
      for (let j = 0; j < 4; j++) {
        const vertNear = cascade.vertices.near[j]
        const vertFar = cascade.vertices.far[j]

        // Near plane vertices
        vertNear.lerpVectors(
          this.vertices.near[j],
          this.vertices.far[j],
          prev
        )

        // Far plane vertices
        vertFar.lerpVectors(
          this.vertices.near[j],
          this.vertices.far[j],
          cur
        )
      }
    }
  }

  /**
   * Transforms this frustum's vertices to a different space.
   * 
   * Useful for transforming frustum vertices from view space to light space
   * for shadow map calculations.
   * 
   * @param matrix - Transformation matrix to apply
   * @param target - Target frustum to store transformed vertices
   */
  toSpace(matrix: Matrix4, target: CSMFrustum): void {
    // Transform near plane vertices
    for (let i = 0; i < 4; i++) {
      target.vertices.near[i].copy(this.vertices.near[i]).applyMatrix4(matrix)
      target.vertices.far[i].copy(this.vertices.far[i]).applyMatrix4(matrix)
    }
  }
}

