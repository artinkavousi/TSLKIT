/**
 * Base class for all TSL-based materials
 * 
 * Provides common functionality for materials using Three.js Shading Language
 * 
 * @module core/materials/NodeMaterialBase
 */

import { NodeMaterial } from 'three/webgpu'
import type { Side, Color } from 'three'

/**
 * Base options for all node materials
 */
export interface NodeMaterialBaseOptions {
  /** Material name for debugging */
  name?: string
  /** Enable/disable transparency */
  transparent?: boolean
  /** Alpha test threshold */
  alphaTest?: number
  /** Depth write */
  depthWrite?: boolean
  /** Depth test */
  depthTest?: boolean
  /** Side rendering */
  side?: Side
}

/**
 * Abstract base class for TSL materials
 * 
 * Provides common functionality:
 * - Parameter management
 * - Update lifecycle
 * - Type-safe properties
 * - Disposal cleanup
 */
export abstract class NodeMaterialBase extends NodeMaterial {
  protected _needsUpdate = false
  protected _time = 0
  protected _parameters: Record<string, unknown> = {}

  constructor(options?: NodeMaterialBaseOptions) {
    super()

    if (options) {
      this.applyOptions(options)
    }

    this.setupMaterial()
  }

  /**
   * Setup material-specific properties
   * Override in derived classes
   */
  protected abstract setupMaterial(): void

  /**
   * Apply base options to material
   */
  protected applyOptions(options: NodeMaterialBaseOptions): void {
    if (options.name) this.name = options.name
    if (options.transparent !== undefined) this.transparent = options.transparent
    if (options.alphaTest !== undefined) this.alphaTest = options.alphaTest
    if (options.depthWrite !== undefined) this.depthWrite = options.depthWrite
    if (options.depthTest !== undefined) this.depthTest = options.depthTest
    if (options.side !== undefined) this.side = options.side
  }

  /**
   * Update material (called each frame)
   * 
   * @param deltaTime - Time since last update in seconds
   */
  public update(deltaTime: number): void {
    this._time += deltaTime
    this.onUpdate(deltaTime)
  }

  /**
   * Override in derived classes for custom update logic
   */
  protected onUpdate(_deltaTime: number): void {
    // Override in derived classes
  }

  /**
   * Get material parameter
   */
  protected getParameter<T>(key: string): T | undefined {
    return this._parameters[key] as T | undefined
  }

  /**
   * Set material parameter
   */
  protected setParameter<T>(key: string, value: T): void {
    this._parameters[key] = value
    this._needsUpdate = true
  }

  /**
   * Get current animation time
   */
  public get time(): number {
    return this._time
  }

  /**
   * Reset animation time
   */
  public resetTime(): void {
    this._time = 0
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    super.dispose()
    this._parameters = {}
  }
}

/**
 * Helper to create type-safe material parameter getter/setter
 */
export function createMaterialProperty<T>(
  material: NodeMaterialBase,
  key: string,
  defaultValue: T
): {
  get: () => T
  set: (value: T) => void
} {
  return {
    get: () => (material as any)._parameters[key] ?? defaultValue,
    set: (value: T) => {
      (material as any)._parameters[key] = value
      ;(material as any)._needsUpdate = true
      material.needsUpdate = true
    },
  }
}

/**
 * Options for procedural materials
 */
export interface ProceduralMaterialOptions extends NodeMaterialBaseOptions {
  /** Texture scale */
  scale?: number
  /** Primary color */
  color1?: Color | number
  /** Secondary color */
  color2?: Color | number
  /** Random seed */
  seed?: number
  /** Animation speed */
  speed?: number
}

/**
 * Base class for procedural materials
 */
export abstract class ProceduralMaterialBase extends NodeMaterialBase {
  protected _scale = 1.0
  protected _seed = 0
  protected _speed = 1.0

  constructor(options?: ProceduralMaterialOptions) {
    super(options)

    if (options?.scale !== undefined) this._scale = options.scale
    if (options?.seed !== undefined) this._seed = options.seed
    if (options?.speed !== undefined) this._speed = options.speed
  }

  public get scale(): number {
    return this._scale
  }

  public set scale(value: number) {
    this._scale = value
    this.needsUpdate = true
  }

  public get seed(): number {
    return this._seed
  }

  public set seed(value: number) {
    this._seed = value
    this.needsUpdate = true
  }

  public get speed(): number {
    return this._speed
  }

  public set speed(value: number) {
    this._speed = value
  }
}

