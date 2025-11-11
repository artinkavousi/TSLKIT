/**
 * Tiled Lights Node
 * 
 * @author Three.js Contributors
 * @source https://github.com/mrdoob/three.js/blob/r181/examples/jsm/tsl/lighting/TiledLightsNode.js
 * @license MIT
 * @version Three.js r181
 * 
 * A custom LightsNode implementation using tiled deferred lighting for efficient
 * rendering of hundreds or thousands of point lights.
 * 
 * Tiled lighting divides the screen into tiles (e.g., 32x32 pixels) and uses a
 * compute shader to determine which lights affect each tile. This dramatically
 * reduces the number of light calculations needed per fragment.
 * 
 * **Features**:
 * - Supports 1000+ point lights with high performance
 * - GPU-based light culling via compute shaders
 * - Configurable tile size and max light count
 * - Automatic screen-space tile assignment
 * - WebGPU-only (requires compute shader support)
 * 
 * @example
 * ```typescript
 * import { TiledLightsNode, tiledLights } from '@tslstudio/tsl-kit/lighting'
 * import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js'
 * 
 * const renderer = new WebGPURenderer()
 * 
 * // Create tiled lighting node (1024 max lights, 32px tiles)
 * const tiledLightsNode = tiledLights(1024, 32)
 * 
 * // Replace default lighting
 * renderer.lightsNode = tiledLightsNode
 * 
 * // Add lots of point lights to scene as usual
 * for (let i = 0; i < 1000; i++) {
 *   const light = new PointLight(0xffffff, 1, 100)
 *   scene.add(light)
 * }
 * ```
 */

import {
  DataTexture,
  FloatType,
  RGBAFormat,
  Vector2,
  Vector3,
  LightsNode,
  NodeUpdateType,
  Light
} from 'three/webgpu'

import {
  attributeArray,
  nodeProxy,
  int,
  float,
  vec2,
  ivec2,
  ivec4,
  uniform,
  Break,
  Loop,
  positionView,
  Fn,
  If,
  Return,
  textureLoad,
  instanceIndex,
  screenCoordinate,
  directPointLight,
  Node,
  NodeBuilder,
  NodeFrame
} from 'three/tsl'

/**
 * TSL function that checks if a circle intersects with an axis-aligned bounding box (AABB).
 * Used for light culling in screen space.
 *
 * @tsl
 * @function
 * @param circleCenter - The center of the circle in screen space
 * @param radius - The radius of the circle
 * @param minBounds - The minimum bounds of the AABB (tile min)
 * @param maxBounds - The maximum bounds of the AABB (tile max)
 * @returns True if the circle intersects the AABB
 */
export const circleIntersectsAABB = /*@__PURE__*/ Fn(([circleCenter, radius, minBounds, maxBounds]) => {
  // Find the closest point on the AABB to the circle's center
  const closestX = minBounds.x.max(circleCenter.x.min(maxBounds.x))
  const closestY = minBounds.y.max(circleCenter.y.min(maxBounds.y))

  // Compute the distance between the circle's center and the closest point
  const distX = circleCenter.x.sub(closestX)
  const distY = circleCenter.y.sub(closestY)

  // Calculate the squared distance
  const distSquared = distX.mul(distX).add(distY.mul(distY))

  return distSquared.lessThanEqual(radius.mul(radius))
}).setLayout({
  name: 'circleIntersectsAABB',
  type: 'bool',
  inputs: [
    { name: 'circleCenter', type: 'vec2' },
    { name: 'radius', type: 'float' },
    { name: 'minBounds', type: 'vec2' },
    { name: 'maxBounds', type: 'vec2' }
  ]
})

// Module-level reusable objects
const _vector3 = /*@__PURE__*/ new Vector3()
const _size = /*@__PURE__*/ new Vector2()

/**
 * A custom version of LightsNode implementing tiled lighting.
 * 
 * This node replaces the renderer's default lighting with a tiled deferred
 * approach that can efficiently handle 1000+ point lights.
 */
export class TiledLightsNode extends LightsNode {
  /** Maximum number of lights supported */
  public maxLights: number

  /** Tile size in pixels (typically 16, 32, or 64) */
  public tileSize: number

  /** Lights that use standard material-based rendering (non-point lights) */
  public materialLights: Light[] = []

  /** Point lights that use tiled rendering */
  public tiledLights: Light[] = []

  /** Current buffer size (rounded up to tile boundaries) */
  private _bufferSize: Vector2 | null = null

  /** Storage buffer for light indices per tile */
  private _lightIndexes: any = null

  /** Screen-space tile index calculation node */
  private _screenTileIndex: any = null

  /** Compute shader for light culling */
  private _compute: any = null

  /** Texture storing light data (position, color, etc.) */
  private _lightsTexture: DataTexture | null = null

  /** Uniform for number of active lights */
  private _lightsCount: any

  /** Maximum lights per tile */
  private _tileLightCount = 8

  /** Uniform for screen size */
  private _screenSize: any

  /** Uniform for camera projection matrix */
  private _cameraProjectionMatrix: any

  /** Uniform for camera view matrix */
  private _cameraViewMatrix: any

  static get type(): string {
    return 'TiledLightsNode'
  }

  /**
   * Constructs a new tiled lights node.
   *
   * @param maxLights - The maximum number of lights (default: 1024)
   * @param tileSize - The tile size in pixels (default: 32)
   */
  constructor(maxLights = 1024, tileSize = 32) {
    super()

    this.maxLights = maxLights
    this.tileSize = tileSize

    this._lightsCount = uniform(0, 'int')
    this._screenSize = uniform(new Vector2())
    this._cameraProjectionMatrix = uniform('mat4')
    this._cameraViewMatrix = uniform('mat4')

    // Note: updateBeforeType might be set by parent class or framework
    // this.updateBeforeType = NodeUpdateType.RENDER
  }

  /**
   * Custom cache key including compute shader cache key.
   */
  customCacheKey(): string {
    return this._compute.getCacheKey() + super.customCacheKey()
  }

  /**
   * Update the lights texture with current light data.
   * Copies light positions, colors, intensities, etc. to GPU texture.
   */
  updateLightsTexture(): void {
    const { _lightsTexture: lightsTexture, tiledLights } = this

    if (!lightsTexture) return

    const data = lightsTexture.image.data
    const lineSize = lightsTexture.image.width * 4

    this._lightsCount.value = tiledLights.length

    for (let i = 0; i < tiledLights.length; i++) {
      const light = tiledLights[i] as any // Cast to any for dynamic properties

      // Get world position
      _vector3.setFromMatrixPosition(light.matrixWorld)

      // Store position and distance in first line
      const offset = i * 4
      data[offset + 0] = _vector3.x
      data[offset + 1] = _vector3.y
      data[offset + 2] = _vector3.z
      data[offset + 3] = light.distance || 0

      // Store color and decay in second line
      data[lineSize + offset + 0] = light.color.r * light.intensity
      data[lineSize + offset + 1] = light.color.g * light.intensity
      data[lineSize + offset + 2] = light.color.b * light.intensity
      data[lineSize + offset + 3] = light.decay || 1
    }

    lightsTexture.needsUpdate = true
  }

  /**
   * Update before rendering.
   * Updates light data and runs compute shader for light culling.
   */
  updateBefore(frame: NodeFrame): void {
    const { renderer, camera } = frame

    this.updateProgram(renderer)
    this.updateLightsTexture()

    this._cameraProjectionMatrix.value = camera.projectionMatrix
    this._cameraViewMatrix.value = camera.matrixWorldInverse

    renderer.getDrawingBufferSize(_size)
    this._screenSize.value.copy(_size)

    renderer.compute(this._compute)
  }

  /**
   * Set lights, separating point lights from others.
   * Point lights go to tiled rendering, others use standard material lighting.
   */
  setLights(lights: Light[]): this {
    const { tiledLights, materialLights } = this

    let materialIndex = 0
    let tiledIndex = 0

    for (const light of lights) {
      if ((light as any).isPointLight === true) {
        tiledLights[tiledIndex++] = light
      } else {
        materialLights[materialIndex++] = light
      }
    }

    materialLights.length = materialIndex
    tiledLights.length = tiledIndex

    return super.setLights(materialLights)
  }

  /**
   * Get a light index block for the current screen tile.
   * Each tile stores light indices in blocks (ivec4).
   */
  getBlock(block = 0): any {
    return this._lightIndexes.element(this._screenTileIndex.mul(int(2).add(int(block))))
  }

  /**
   * Get a light index at a specific element within the current tile.
   * Handles stride and offset calculations.
   */
  getTile(element: Node | number): any {
    element = int(element)

    const stride = int(4)
    const tileOffset = element.div(stride)
    const tileIndex = this._screenTileIndex.mul(int(2)).add(tileOffset)

    return this._lightIndexes.element(tileIndex).element(element.mod(stride))
  }

  /**
   * Get light data (position, color, distance, decay) from texture.
   */
  getLightData(index: Node | number): any {
    index = int(index)

    const dataA = textureLoad(this._lightsTexture, ivec2(index, 0))
    const dataB = textureLoad(this._lightsTexture, ivec2(index, 1))

    const position = dataA.xyz
    const viewPosition = this._cameraViewMatrix.mul(position)
    const distance = dataA.w
    const color = dataB.rgb
    const decay = dataB.w

    return {
      position,
      viewPosition,
      distance,
      color,
      decay
    }
  }

  /**
   * Setup lights for rendering.
   * Called during shader compilation to inject light loop.
   */
  setupLights(builder: NodeBuilder, lightNodes: any): void {
    this.updateProgram(builder.renderer)

    const lightingModel = builder.context.reflectedLight

    // Force declaration order before loop
    lightingModel.directDiffuse.toStack()
    lightingModel.directSpecular.toStack()

    super.setupLights(builder, lightNodes)

    // Tiled light loop
    Fn(() => {
      Loop(this._tileLightCount, ({ i }) => {
        const lightIndex = this.getTile(i)

        // Break if no more lights in this tile (0 = empty slot)
        If(lightIndex.equal(int(0)), () => {
          Break()
        })

        // Get light data and apply lighting
        const { color, decay, viewPosition, distance } = this.getLightData(lightIndex.sub(1))

        builder.lightsNode.setupDirectLight(
          builder,
          this,
          directPointLight({
            color,
            lightVector: viewPosition.sub(positionView),
            cutoffDistance: distance,
            decayExponent: decay
          })
        )
      })
    }, 'void')()
  }

  /**
   * Get buffer size rounded up to tile boundaries.
   */
  getBufferFitSize(value: number): number {
    const multiple = this.tileSize
    return Math.ceil(value / multiple) * multiple
  }

  /**
   * Set size and recreate buffers if needed.
   */
  setSize(width: number, height: number): this {
    width = this.getBufferFitSize(width)
    height = this.getBufferFitSize(height)

    if (!this._bufferSize || this._bufferSize.width !== width || this._bufferSize.height !== height) {
      this.create(width, height)
    }

    return this
  }

  /**
   * Update program based on current screen size.
   * Recreates buffers if screen size changed.
   */
  updateProgram(renderer: any): void {
    renderer.getDrawingBufferSize(_size)

    const width = this.getBufferFitSize(_size.width)
    const height = this.getBufferFitSize(_size.height)

    if (this._bufferSize === null) {
      this.create(width, height)
    } else if (this._bufferSize.width !== width || this._bufferSize.height !== height) {
      this.create(width, height)
    }
  }

  /**
   * Create or recreate all buffers and compute shader for the given size.
   */
  create(width: number, height: number): void {
    const { tileSize, maxLights } = this

    const bufferSize = new Vector2(width, height)
    const lineSize = Math.floor(bufferSize.width / tileSize)
    const count = Math.floor((bufferSize.width * bufferSize.height) / (tileSize * tileSize))

    // Create lights texture (2 lines: position/distance, color/decay)
    const lightsData = new Float32Array(maxLights * 4 * 2)
    const lightsTexture = new DataTexture(lightsData, lightsData.length / 8, 2, RGBAFormat, FloatType)

    // Create light indices buffer (ivec4 per tile, 2 blocks)
    const lightIndexesArray = new Int32Array(count * 4 * 2)
    const lightIndexes = attributeArray(lightIndexesArray, 'ivec4').setName('lightIndexes')

    // Helper functions for compute shader (using local scope)
    const getBlock = (index: number) => {
      const tileIndex = instanceIndex.mul(int(2)).add(int(index))
      return lightIndexes.element(tileIndex)
    }

    const getTile = (elementIndex: Node | number) => {
      elementIndex = int(elementIndex)

      const stride = int(4)
      const tileOffset = elementIndex.div(stride)
      const tileIndex = instanceIndex.mul(int(2)).add(tileOffset)

      return lightIndexes.element(tileIndex).element(elementIndex.mod(stride))
    }

    // Compute shader for light culling
    const compute = Fn(() => {
      const { _cameraProjectionMatrix: cameraProjectionMatrix, _screenSize: screenSize } = this

      const tiledBufferSize = bufferSize.clone().divideScalar(tileSize).floor()

      // Calculate current tile's screen-space bounds
      const tileScreen = vec2(
        instanceIndex.mod(tiledBufferSize.width),
        instanceIndex.div(tiledBufferSize.width)
      )
        .mul(tileSize)
        .div(screenSize)

      const blockSize = float(tileSize).div(screenSize)
      const minBounds = tileScreen
      const maxBounds = minBounds.add(blockSize)

      const index = int(0).toVar()

      // Clear tile blocks
      getBlock(0).assign(ivec4(0))
      getBlock(1).assign(ivec4(0))

      // Test each light against this tile
      Loop(this.maxLights, ({ i }) => {
        // Early exit if tile is full or all lights processed
        If(index.greaterThanEqual(this._tileLightCount).or(int(i).greaterThanEqual(int(this._lightsCount))), () => {
          Return()
        })

        const { viewPosition, distance } = this.getLightData(i)

        // Project light to screen space
        const projectedPosition = cameraProjectionMatrix.mul(viewPosition)
        const ndc = projectedPosition.div(projectedPosition.w)
        const screenPosition = ndc.xy.mul(0.5).add(0.5).flipY()

        // Calculate light's screen-space radius
        const distanceFromCamera = viewPosition.z
        const pointRadius = distance.div(distanceFromCamera)

        // Test if light intersects tile
        If(circleIntersectsAABB(screenPosition, pointRadius, minBounds, maxBounds), () => {
          getTile(index).assign(i.add(int(1))) // Store 1-based index (0 = empty)
          index.addAssign(int(1))
        })
      })
    })()
      .compute(count)
      .setName('Update Tiled Lights')

    // Screen coordinate to tile index calculation
    const screenTile = screenCoordinate.div(tileSize).floor().toVar()
    const screenTileIndex = screenTile.x.add(screenTile.y.mul(lineSize))

    // Store all references
    this._bufferSize = bufferSize
    this._lightIndexes = lightIndexes
    this._screenTileIndex = screenTileIndex
    this._compute = compute
    this._lightsTexture = lightsTexture
  }

  /**
   * Check if this node has any lights.
   */
  get hasLights(): boolean {
    return super.hasLights || this.tiledLights.length > 0
  }
}

/**
 * TSL function that creates a tiled lights node.
 *
 * @tsl
 * @function
 * @param maxLights - The maximum number of lights (default: 1024)
 * @param tileSize - The tile size in pixels (default: 32)
 * @returns The tiled lights node
 * 
 * @example
 * ```typescript
 * import { tiledLights } from '@tslstudio/tsl-kit/lighting'
 * 
 * // Create with defaults (1024 lights, 32px tiles)
 * const lights = tiledLights()
 * 
 * // Or customize
 * const lights = tiledLights(2048, 64)
 * 
 * // Use in renderer
 * renderer.lightsNode = lights
 * ```
 */
export const tiledLights = /*@__PURE__*/ nodeProxy(TiledLightsNode)

