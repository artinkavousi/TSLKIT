/**
 * WebGPU Renderer Setup Utilities
 * 
 * Helpers for initializing and configuring WebGPU renderer for Three.js r181+
 * 
 * @module core/renderer/WebGPUSetup
 */

import { WebGPURenderer } from 'three/webgpu'

/**
 * WebGPU Renderer initialization parameters
 */
export interface WebGPURendererParameters {
  canvas?: HTMLCanvasElement
  antialias?: boolean
  alpha?: boolean
  depth?: boolean
  stencil?: boolean
  powerPreference?: 'high-performance' | 'low-power' | 'default'
  logarithmicDepthBuffer?: boolean
  forceWebGL?: boolean
}

/**
 * WebGPU capability check result
 */
export interface WebGPUCapabilities {
  supported: boolean
  adapter: GPUAdapter | null
  features: string[]
  limits: Record<string, number>
  error?: string
}

/**
 * Check if WebGPU is supported in current environment
 */
export async function checkWebGPUSupport(): Promise<WebGPUCapabilities> {
  if (!navigator.gpu) {
    return {
      supported: false,
      adapter: null,
      features: [],
      limits: {},
      error: 'WebGPU not supported in this browser',
    }
  }

  try {
    const adapter = await navigator.gpu.requestAdapter()
    
    if (!adapter) {
      return {
        supported: false,
        adapter: null,
        features: [],
        limits: {},
        error: 'No WebGPU adapter available',
      }
    }

    const features = Array.from(adapter.features)
    const limits: Record<string, number> = {}
    
    // Extract key limits
    for (const [key, value] of Object.entries(adapter.limits)) {
      if (typeof value === 'number') {
        limits[key] = value
      }
    }

    return {
      supported: true,
      adapter,
      features,
      limits,
    }
  } catch (error) {
    return {
      supported: false,
      adapter: null,
      features: [],
      limits: {},
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Initialize WebGPU renderer with sensible defaults
 * 
 * @param canvas - Optional canvas element
 * @param parameters - Optional renderer parameters
 * @returns Initialized WebGPU renderer
 * 
 * @example
 * ```typescript
 * const renderer = await initWebGPURenderer()
 * renderer.setSize(window.innerWidth, window.innerHeight)
 * ```
 */
export async function initWebGPURenderer(
  canvas?: HTMLCanvasElement,
  parameters?: Partial<WebGPURendererParameters>
): Promise<WebGPURenderer> {
  // Check WebGPU support first
  const capabilities = await checkWebGPUSupport()
  
  if (!capabilities.supported) {
    throw new Error(`WebGPU initialization failed: ${capabilities.error}`)
  }

  // Create renderer with defaults
  const rendererParams = {
    canvas,
    antialias: parameters?.antialias ?? true,
    alpha: parameters?.alpha ?? true,
    powerPreference: parameters?.powerPreference ?? ('high-performance' as const),
  }

  const renderer = new WebGPURenderer(rendererParams as any)

  // Initialize WebGPU (required in r181+)
  await renderer.init()

  // Set pixel ratio
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  return renderer
}

/**
 * Configure renderer for optimal performance
 * 
 * @param renderer - WebGPU renderer instance
 */
export function configureRendererPerformance(renderer: WebGPURenderer): void {
  // Enable shader caching
  renderer.debug.checkShaderErrors = false

  // Set tone mapping
  renderer.toneMapping = 2 // ACESFilmicToneMapping

  // Set output color space (linearSRGB by default in WebGPU)
  // renderer.outputColorSpace is read-only in WebGPU
}

/**
 * Setup automatic resize handling
 * 
 * @param renderer - WebGPU renderer instance
 * @param camera - Camera to update aspect ratio
 * @param container - Container element (defaults to window)
 * @returns Cleanup function
 * 
 * @example
 * ```typescript
 * const cleanup = setupAutoResize(renderer, camera)
 * // Later: cleanup()
 * ```
 */
export function setupAutoResize(
  renderer: WebGPURenderer,
  camera: { aspect?: number; updateProjectionMatrix?: () => void },
  container: HTMLElement | Window = window
): () => void {
  const handleResize = (): void => {
    const width = container instanceof Window 
      ? window.innerWidth 
      : container.clientWidth
    const height = container instanceof Window 
      ? window.innerHeight 
      : container.clientHeight

    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    if (camera.aspect !== undefined && camera.updateProjectionMatrix) {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
  }

  // Initial resize
  handleResize()

  // Add listener
  window.addEventListener('resize', handleResize)

  // Return cleanup function
  return () => {
    window.removeEventListener('resize', handleResize)
  }
}

/**
 * Get renderer info for debugging
 * 
 * @param renderer - WebGPU renderer instance
 * @returns Renderer information
 */
export function getRendererInfo(renderer: WebGPURenderer): {
  memory: { geometries: number; textures: number }
  render: { calls: number; triangles: number; points: number; lines: number }
} {
  return {
    memory: {
      geometries: renderer.info.memory.geometries,
      textures: renderer.info.memory.textures,
    },
    render: {
      calls: renderer.info.render.calls,
      triangles: renderer.info.render.triangles,
      points: renderer.info.render.points,
      lines: renderer.info.render.lines,
    },
  }
}

