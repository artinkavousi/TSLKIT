/**
 * Post-Processing Pass Base Class
 * 
 * Foundation for all post-processing effects.
 * 
 * @module postfx/core/PostPass
 */

import * as THREE from 'three/webgpu';

export interface PostPassOptions {
  name?: string;
  enabled?: boolean;
  renderToScreen?: boolean;
}

/**
 * Base class for post-processing passes
 */
export abstract class PostPass {
  name: string;
  enabled: boolean;
  renderToScreen: boolean;
  needsSwap: boolean = true;
  
  protected material: THREE.Material | null = null;
  protected fullScreenQuad: THREE.Mesh | null = null;

  constructor(options: PostPassOptions = {}) {
    this.name = options.name || 'PostPass';
    this.enabled = options.enabled !== undefined ? options.enabled : true;
    this.renderToScreen = options.renderToScreen || false;
  }

  /**
   * Initialize the pass (create materials, geometry, etc.)
   */
  abstract initialize(): void;

  /**
   * Render the pass
   * 
   * @param renderer - WebGPU renderer
   * @param writeBuffer - Target render target
   * @param readBuffer - Source render target
   * @param deltaTime - Time since last frame
   */
  abstract render(
    renderer: THREE.WebGPURenderer,
    writeBuffer: THREE.WebGLRenderTarget | null,
    readBuffer: THREE.WebGLRenderTarget,
    deltaTime: number
  ): void;

  /**
   * Set the size of the pass
   */
  setSize(width: number, height: number): void {
    // Override in subclasses if needed
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    if (this.material) {
      this.material.dispose();
    }
    if (this.fullScreenQuad) {
      this.fullScreenQuad.geometry.dispose();
    }
  }

  /**
   * Create a full-screen quad for rendering
   */
  protected createFullScreenQuad(material: THREE.Material): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(2, 2);
    this.fullScreenQuad = new THREE.Mesh(geometry, material);
    this.fullScreenQuad.frustumCulled = false;
    return this.fullScreenQuad;
  }
}

/**
 * Shader pass - renders a full-screen shader effect
 */
export class ShaderPass extends PostPass {
  uniforms: Record<string, THREE.IUniform>;
  
  constructor(
    private shader: {
      uniforms?: Record<string, THREE.IUniform>;
      vertexShader?: string;
      fragmentShader?: string;
    },
    options: PostPassOptions = {}
  ) {
    super(options);
    this.uniforms = shader.uniforms || {};
  }

  initialize(): void {
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.shader.vertexShader || defaultVertexShader,
      fragmentShader: this.shader.fragmentShader || defaultFragmentShader,
      depthTest: false,
      depthWrite: false
    });
    
    this.createFullScreenQuad(this.material);
  }

  render(
    renderer: THREE.WebGPURenderer,
    writeBuffer: THREE.WebGLRenderTarget | null,
    readBuffer: THREE.WebGLRenderTarget,
    deltaTime: number
  ): void {
    if (!this.enabled || !this.fullScreenQuad) return;

    // Set input texture
    if (this.uniforms.tDiffuse) {
      this.uniforms.tDiffuse.value = readBuffer.texture;
    }

    // Render to target or screen
    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
    } else if (writeBuffer) {
      renderer.setRenderTarget(writeBuffer);
    }

    renderer.render(this.fullScreenQuad, orthoCamera);
  }
}

/**
 * Default vertex shader for full-screen quads
 */
const defaultVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

/**
 * Default fragment shader (pass-through)
 */
const defaultFragmentShader = `
uniform sampler2D tDiffuse;
varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(tDiffuse, vUv);
}
`;

/**
 * Orthographic camera for full-screen rendering
 */
const orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

