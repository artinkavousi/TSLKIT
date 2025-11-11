/**
 * Post-Processing Chain
 * 
 * Manages and renders a sequence of post-processing passes.
 * 
 * @module postfx/core/PostChain
 */

import * as THREE from 'three/webgpu';
import { PostPass } from './PostPass';

export interface PostChainOptions {
  width?: number;
  height?: number;
  renderToScreen?: boolean;
}

/**
 * Post-processing chain that manages multiple passes
 */
export class PostChain {
  passes: PostPass[] = [];
  
  private width: number;
  private height: number;
  private renderToScreen: boolean;
  
  private readBuffer: THREE.WebGLRenderTarget;
  private writeBuffer: THREE.WebGLRenderTarget;
  
  private renderTarget1: THREE.WebGLRenderTarget;
  private renderTarget2: THREE.WebGLRenderTarget;

  constructor(options: PostChainOptions = {}) {
    this.width = options.width || window.innerWidth;
    this.height = options.height || window.innerHeight;
    this.renderToScreen = options.renderToScreen !== undefined ? options.renderToScreen : true;

    // Create ping-pong render targets
    const rtParams: THREE.RenderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType,
      depthBuffer: false,
      stencilBuffer: false
    };

    this.renderTarget1 = new THREE.WebGLRenderTarget(this.width, this.height, rtParams);
    this.renderTarget1.texture.name = 'PostChain.rt1';

    this.renderTarget2 = new THREE.WebGLRenderTarget(this.width, this.height, rtParams);
    this.renderTarget2.texture.name = 'PostChain.rt2';

    this.readBuffer = this.renderTarget1;
    this.writeBuffer = this.renderTarget2;
  }

  /**
   * Add a pass to the chain
   */
  addPass(pass: PostPass): void {
    this.passes.push(pass);
    pass.initialize();
    pass.setSize(this.width, this.height);
  }

  /**
   * Insert a pass at a specific index
   */
  insertPass(pass: PostPass, index: number): void {
    this.passes.splice(index, 0, pass);
    pass.initialize();
    pass.setSize(this.width, this.height);
  }

  /**
   * Remove a pass from the chain
   */
  removePass(pass: PostPass): void {
    const index = this.passes.indexOf(pass);
    if (index !== -1) {
      this.passes.splice(index, 1);
      pass.dispose();
    }
  }

  /**
   * Render the entire post-processing chain
   * 
   * @param renderer - WebGPU renderer
   * @param inputBuffer - Source render target (from scene render)
   * @param deltaTime - Time since last frame
   */
  render(
    renderer: THREE.WebGPURenderer,
    inputBuffer: THREE.WebGLRenderTarget,
    deltaTime: number = 0
  ): void {
    // Set initial read buffer to input
    this.readBuffer = inputBuffer;
    this.writeBuffer = this.renderTarget1;

    let isLastEnabledPass = false;

    for (let i = 0; i < this.passes.length; i++) {
      const pass = this.passes[i];

      if (!pass.enabled) continue;

      // Check if this is the last enabled pass
      isLastEnabledPass = true;
      for (let j = i + 1; j < this.passes.length; j++) {
        if (this.passes[j].enabled) {
          isLastEnabledPass = false;
          break;
        }
      }

      // Last pass renders to screen if configured
      if (isLastEnabledPass && this.renderToScreen) {
        pass.renderToScreen = true;
      }

      // Render the pass
      pass.render(
        renderer,
        pass.needsSwap ? this.writeBuffer : null,
        this.readBuffer,
        deltaTime
      );

      // Swap buffers for next pass
      if (pass.needsSwap) {
        this.swapBuffers();
      }
    }
  }

  /**
   * Swap read and write buffers
   */
  private swapBuffers(): void {
    const tmp = this.readBuffer;
    this.readBuffer = this.writeBuffer;
    this.writeBuffer = tmp;
  }

  /**
   * Set the size of all passes and render targets
   */
  setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;

    this.renderTarget1.setSize(width, height);
    this.renderTarget2.setSize(width, height);

    for (const pass of this.passes) {
      pass.setSize(width, height);
    }
  }

  /**
   * Get the final output texture
   */
  getOutputTexture(): THREE.Texture {
    return this.readBuffer.texture;
  }

  /**
   * Dispose of all resources
   */
  dispose(): void {
    this.renderTarget1.dispose();
    this.renderTarget2.dispose();

    for (const pass of this.passes) {
      pass.dispose();
    }

    this.passes = [];
  }

  /**
   * Enable/disable a pass by name
   */
  setPassEnabled(name: string, enabled: boolean): void {
    const pass = this.passes.find(p => p.name === name);
    if (pass) {
      pass.enabled = enabled;
    }
  }

  /**
   * Get a pass by name
   */
  getPass(name: string): PostPass | undefined {
    return this.passes.find(p => p.name === name);
  }
}

/**
 * Helper function to create a post-processing chain
 * 
 * @param passes - Array of passes or pass configurations
 * @param options - Chain options
 */
export function makePostChain(
  passes: PostPass[],
  options: PostChainOptions = {}
): PostChain {
  const chain = new PostChain(options);
  
  for (const pass of passes) {
    chain.addPass(pass);
  }
  
  return chain;
}

