/**
 * CSM Shadow Node
 * 
 * @author Three.js Contributors
 * @source https://github.com/mrdoob/three.js/blob/r181/examples/jsm/csm/CSMShadowNode.js
 * @license MIT
 * @version Three.js r181
 * 
 * Cascaded Shadow Maps (CSM) implementation for WebGPU renderer.
 * 
 * CSM is an industry-standard technique for high-quality shadows in large outdoor scenes.
 * It divides the camera frustum into multiple cascades, each with its own shadow map,
 * providing better shadow resolution where needed (close to camera) while still covering
 * distant areas.
 * 
 * **Features**:
 * - 3+ cascade support (configurable)
 * - Multiple split modes: uniform, logarithmic, practical, custom
 * - Fade between cascades (optional)
 * - Automatic shadow bias per cascade
 * - WebGPU-only (for WebGL, use legacy CSM implementation)
 * 
 * @example
 * ```typescript
 * import { CSMShadowNode } from '@tslstudio/tsl-kit/shadows'
 * import { DirectionalLight } from 'three/webgpu'
 * 
 * const light = new DirectionalLight(0xffffff, 1)
 * const csm = new CSMShadowNode(light, {
 *   cascades: 3,
 *   mode: 'practical',
 *   maxFar: 1000,
 *   fade: true
 * })
 * 
 * // Update every frame
 * csm.updateFrustums()
 * ```
 */

import {
  Vector2,
  Vector3,
  MathUtils,
  Matrix4,
  Box3,
  Object3D,
  WebGLCoordinateSystem,
  ShadowBaseNode,
  DirectionalLight,
  Camera
} from 'three/webgpu'

import { CSMFrustum } from './CSMFrustum'
import {
  viewZToOrthographicDepth,
  reference,
  uniform,
  float,
  vec4,
  vec2,
  If,
  Fn,
  min,
  renderGroup,
  positionView,
  shadow
} from 'three/tsl'

// Module-level reusable objects to avoid allocations
const _cameraToLightMatrix = /*@__PURE__*/ new Matrix4()
const _lightSpaceFrustum = /*@__PURE__*/ new CSMFrustum()
const _center = /*@__PURE__*/ new Vector3()
const _bbox = /*@__PURE__*/ new Box3()
const _uniformArray: number[] = []
const _logArray: number[] = []
const _lightDirection = /*@__PURE__*/ new Vector3()
const _lightOrientationMatrix = /*@__PURE__*/ new Matrix4()
const _lightOrientationMatrixInverse = /*@__PURE__*/ new Matrix4()
const _up = /*@__PURE__*/ new Vector3(0, 1, 0)

/**
 * Lightweight directional light helper for CSM cascades.
 * Each cascade gets its own LwLight instance.
 */
class LwLight extends Object3D {
  public target: Object3D
  public castShadow = true
  public shadow: any // DirectionalLightShadow
  declare public parent: Object3D | null // From Object3D
  declare public position: Vector3 // From Object3D

  constructor() {
    super()
    this.target = new Object3D()
  }
}

/**
 * Split mode for cascade distribution
 */
export type CSMMode = 'practical' | 'uniform' | 'logarithmic' | 'custom'

/**
 * Custom split callback signature
 */
export type CustomSplitsCallback = (
  cascades: number,
  near: number,
  far: number,
  breaks: number[]
) => void

/**
 * Configuration data for CSM shadow node
 */
export interface CSMShadowNodeData {
  /** Number of cascades (default: 3) */
  cascades?: number
  /** Maximum far plane distance (default: 100000) */
  maxFar?: number
  /** Frustum split mode (default: 'practical') */
  mode?: CSMMode
  /** Light margin for shadow map bounds (default: 200) */
  lightMargin?: number
  /** Custom split callback (required if mode='custom') */
  customSplitsCallback?: CustomSplitsCallback
}

/**
 * CSM Shadow Node - Cascaded Shadow Maps for WebGPU
 * 
 * Extends ShadowBaseNode to provide multi-cascade shadow mapping
 * with configurable split modes and optional fade between cascades.
 */
export class CSMShadowNode extends ShadowBaseNode {
  /** The main directional light */
  public light: DirectionalLight

  /** The scene's camera */
  public camera: Camera | null = null

  /** Number of cascades */
  public cascades: number

  /** Maximum far plane distance */
  public maxFar: number

  /** Frustum split mode */
  public mode: CSMMode

  /** Light margin for shadow bounds */
  public lightMargin: number

  /** Custom split callback (when mode='custom') */
  public customSplitsCallback?: CustomSplitsCallback

  /** Whether to fade between cascades */
  public fade = false

  /** Break points for cascade splits (0 to 1) */
  public breaks: number[] = []

  /** Internal cascade data (near/far pairs) */
  private _cascades: Vector2[] = []

  /** Main camera frustum */
  public mainFrustum: CSMFrustum | null = null

  /** Array of cascade frustums */
  public frustums: CSMFrustum[] = []

  /** Array of cascade lights (one per cascade) */
  public lights: LwLight[] = []

  /** Array of shadow nodes (one per cascade) */
  private _shadowNodes: any[] = []

  /**
   * Constructs a new CSM shadow node.
   * 
   * @param light - The directional light for CSM
   * @param data - CSM configuration
   */
  constructor(light: DirectionalLight, data: CSMShadowNodeData = {}) {
    super(light)

    this.light = light
    this.cascades = data.cascades || 3
    this.maxFar = data.maxFar || 100000
    this.mode = data.mode || 'practical'
    this.lightMargin = data.lightMargin || 200
    this.customSplitsCallback = data.customSplitsCallback
  }

  /**
   * Initialize the CSM system with camera and renderer.
   * Called automatically on first setup.
   * 
   * @param frame - Node frame containing camera and renderer
   */
  private _init({ camera, renderer }: { camera: Camera; renderer: any }): void {
    this.camera = camera

    const data = { webGL: renderer.coordinateSystem === WebGLCoordinateSystem }
    this.mainFrustum = new CSMFrustum(data)

    const light = this.light as DirectionalLight

    // Create one light per cascade
    for (let i = 0; i < this.cascades; i++) {
      const lwLight = new LwLight()
      lwLight.castShadow = true

      const lShadow = light.shadow.clone()
      lShadow.bias = lShadow.bias * (i + 1)

      this.lights.push(lwLight)
      lwLight.shadow = lShadow

      this._shadowNodes.push(shadow(lwLight, lShadow))
      this._cascades.push(new Vector2())
    }

    this.updateFrustums()
  }

  /**
   * Initialize cascades according to camera and breaks configuration.
   */
  private _initCascades(): void {
    if (!this.camera || !this.mainFrustum) return

    const camera = this.camera
    camera.updateProjectionMatrix()

    this.mainFrustum.setFromProjectionMatrix(camera.projectionMatrix, this.maxFar)
    this.mainFrustum.split(this.breaks, this.frustums)
  }

  /**
   * Compute break points based on split mode.
   */
  private _getBreaks(): void {
    if (!this.camera) return

    const camera = this.camera
    const far = Math.min(camera.far, this.maxFar)

    this.breaks.length = 0

    switch (this.mode) {
      case 'uniform':
        uniformSplit(this.cascades, camera.near, far, this.breaks)
        break

      case 'logarithmic':
        logarithmicSplit(this.cascades, camera.near, far, this.breaks)
        break

      case 'practical':
        practicalSplit(this.cascades, camera.near, far, 0.5, this.breaks)
        break

      case 'custom':
        if (this.customSplitsCallback === undefined) {
          console.error('CSM: Custom split scheme callback not defined.')
        } else {
          this.customSplitsCallback(this.cascades, camera.near, far, this.breaks)
        }
        break
    }
  }

  /**
   * Set light break points for each cascade.
   */
  private _setLightBreaks(): void {
    // Ensure cascades array is initialized (happens during _init)
    if (this._cascades.length === 0) return
    
    for (let i = 0, l = this.cascades; i < l; i++) {
      const amount = this.breaks[i]
      const prev = this.breaks[i - 1] || 0

      this._cascades[i].set(prev, amount)
    }
  }

  /**
   * Update shadow bounds for all cascades.
   */
  private _updateShadowBounds(): void {
    const frustums = this.frustums

    for (let i = 0; i < frustums.length; i++) {
      const shadowCam = this.lights[i].shadow.camera
      const frustum = this.frustums[i]

      // Get furthest points on frustum
      const nearVerts = frustum.vertices.near
      const farVerts = frustum.vertices.far
      const point1 = farVerts[0]

      let point2: Vector3

      if (point1.distanceTo(farVerts[2]) > point1.distanceTo(nearVerts[2])) {
        point2 = farVerts[2]
      } else {
        point2 = nearVerts[2]
      }

      let squaredBBWidth = point1.distanceTo(point2)

      if (this.fade && this.camera) {
        // Expand shadow extents by fade margin
        const camera = this.camera
        const far = Math.max(camera.far, this.maxFar)
        const linearDepth = frustum.vertices.far[0].z / (far - camera.near)
        const margin = 0.25 * Math.pow(linearDepth, 2.0) * (far - camera.near)

        squaredBBWidth += margin
      }

      shadowCam.left = -squaredBBWidth / 2
      shadowCam.right = squaredBBWidth / 2
      shadowCam.top = squaredBBWidth / 2
      shadowCam.bottom = -squaredBBWidth / 2
      shadowCam.updateProjectionMatrix()
    }
  }

  /**
   * Update frustums - must be called when camera or CSM settings change.
   */
  updateFrustums(): void {
    this._getBreaks()
    this._initCascades()
    this._updateShadowBounds()
    this._setLightBreaks()
  }

  /**
   * Setup TSL for fade mode.
   */
  private _setupFade(): any {
    if (!this.camera) return

    const cameraNear = reference('camera.near', 'float', this).setGroup(renderGroup)
    const cascades = reference('_cascades', 'vec2', this).setGroup(renderGroup).setName('cascades')

    const shadowFar = uniform('float')
      .setGroup(renderGroup)
      .setName('shadowFar')
      .onRenderUpdate(() => Math.min(this.maxFar, this.camera!.far))

    const linearDepth = viewZToOrthographicDepth(positionView.z, cameraNear, shadowFar).toVar('linearDepth')
    const lastCascade = this.cascades - 1

    return Fn((builder: any) => {
      // Note: setupShadowPosition from parent class (if exists) would be called here
      // this.setupShadowPosition(builder)

      const ret = vec4(1, 1, 1, 1).toVar('shadowValue')

      const cascade = vec2().toVar('cascade')
      const cascadeCenter = float().toVar('cascadeCenter')

      const margin = float().toVar('margin')

      const csmX = float().toVar('csmX')
      const csmY = float().toVar('csmY')

      for (let i = 0; i < this.cascades; i++) {
        const isLastCascade = i === lastCascade

        cascade.assign(cascades.element(i))

        cascadeCenter.assign(cascade.x.add(cascade.y).div(2.0))

        const closestEdge = linearDepth.lessThan(cascadeCenter).select(cascade.x, cascade.y)

        margin.assign(float(0.25).mul(closestEdge.pow(2.0)))

        csmX.assign(cascade.x.sub(margin.div(2.0)))

        if (isLastCascade) {
          csmY.assign(cascade.y)
        } else {
          csmY.assign(cascade.y.add(margin.div(2.0)))
        }

        const inRange = linearDepth.greaterThanEqual(csmX).and(linearDepth.lessThanEqual(csmY))

        If(inRange, () => {
          const dist = min(linearDepth.sub(csmX), csmY.sub(linearDepth)).toVar()

          let ratio = dist.div(margin).clamp(0.0, 1.0)

          if (i === 0) {
            // Don't fade at nearest edge
            ratio = linearDepth.greaterThan(cascadeCenter).select(ratio, 1)
          }

          ret.subAssign(this._shadowNodes[i].oneMinus().mul(ratio))
        })
      }

      return ret
    })()
  }

  /**
   * Setup TSL for standard (no fade) mode.
   */
  private _setupStandard(): any {
    if (!this.camera) return

    const cameraNear = reference('camera.near', 'float', this).setGroup(renderGroup)
    const cascades = reference('_cascades', 'vec2', this).setGroup(renderGroup).setName('cascades')

    const shadowFar = uniform('float')
      .setGroup(renderGroup)
      .setName('shadowFar')
      .onRenderUpdate(() => Math.min(this.maxFar, this.camera!.far))

    const linearDepth = viewZToOrthographicDepth(positionView.z, cameraNear, shadowFar).toVar('linearDepth')

    return Fn((builder: any) => {
      // Note: setupShadowPosition from parent class (if exists) would be called here
      // this.setupShadowPosition(builder)

      const ret = vec4(1, 1, 1, 1).toVar('shadowValue')
      const cascade = vec2().toVar('cascade')

      for (let i = 0; i < this.cascades; i++) {
        cascade.assign(cascades.element(i))

        If(linearDepth.greaterThanEqual(cascade.x).and(linearDepth.lessThanEqual(cascade.y)), () => {
          ret.assign(this._shadowNodes[i])
        })
      }

      return ret
    })()
  }

  /**
   * Setup the CSM shadow node.
   */
  setup(builder: any): any {
    if (this.camera === null) this._init(builder)

    return this.fade === true ? this._setupFade() : this._setupStandard()
  }

  /**
   * Update before rendering (place lights in scene).
   */
  updateBefore(/*builder*/): void {
    const light = this.light as DirectionalLight
    const parent = light.parent
    const camera = this.camera
    const frustums = this.frustums

    if (!parent || !camera) return

    // Make sure placeholder lights are in scene graph
    for (let i = 0; i < this.lights.length; i++) {
      const lwLight = this.lights[i]

      if (lwLight.parent === null) {
        parent.add(lwLight.target)
        parent.add(lwLight)
      }
    }

    _lightDirection.subVectors(light.target.position, light.position).normalize()

    // Light orientation matrices
    _lightOrientationMatrix.lookAt(light.position, light.target.position, _up)
    _lightOrientationMatrixInverse.copy(_lightOrientationMatrix).invert()

    // Update each cascade
    for (let i = 0; i < frustums.length; i++) {
      const lwLight = this.lights[i]
      const shadow = lwLight.shadow
      const shadowCam = shadow.camera
      const texelWidth = (shadowCam.right - shadowCam.left) / shadow.mapSize.width
      const texelHeight = (shadowCam.top - shadowCam.bottom) / shadow.mapSize.height

      _cameraToLightMatrix.multiplyMatrices(_lightOrientationMatrixInverse, camera.matrixWorld)
      frustums[i].toSpace(_cameraToLightMatrix, _lightSpaceFrustum)

      const nearVerts = _lightSpaceFrustum.vertices.near
      const farVerts = _lightSpaceFrustum.vertices.far

      _bbox.makeEmpty()

      for (let j = 0; j < 4; j++) {
        _bbox.expandByPoint(nearVerts[j])
        _bbox.expandByPoint(farVerts[j])
      }

      _bbox.getCenter(_center)
      _center.z = _bbox.max.z + this.lightMargin
      _center.x = Math.floor(_center.x / texelWidth) * texelWidth
      _center.y = Math.floor(_center.y / texelHeight) * texelHeight
      _center.applyMatrix4(_lightOrientationMatrix)

      lwLight.position.copy(_center)
      lwLight.target.position.copy(_center)
      lwLight.target.position.add(_lightDirection)
    }
  }

  /**
   * Dispose of CSM resources.
   */
  dispose(): void {
    for (let i = 0; i < this.lights.length; i++) {
      const light = this.lights[i]
      const parent = light.parent

      if (parent) {
        parent.remove(light.target)
        parent.remove(light)
      }
    }

    super.dispose()
  }
}

// Helper functions for frustum splitting

function uniformSplit(amount: number, near: number, far: number, target: number[]): void {
  for (let i = 1; i < amount; i++) {
    target.push((near + ((far - near) * i) / amount) / far)
  }

  target.push(1)
}

function logarithmicSplit(amount: number, near: number, far: number, target: number[]): void {
  for (let i = 1; i < amount; i++) {
    target.push((near * Math.pow(far / near, i / amount)) / far)
  }

  target.push(1)
}

function practicalSplit(
  amount: number,
  near: number,
  far: number,
  lambda: number,
  target: number[]
): void {
  _uniformArray.length = 0
  _logArray.length = 0
  logarithmicSplit(amount, near, far, _logArray)
  uniformSplit(amount, near, far, _uniformArray)

  for (let i = 1; i < amount; i++) {
    target.push(MathUtils.lerp(_uniformArray[i - 1], _logArray[i - 1], lambda))
  }

  target.push(1)
}

