/**
 * Bloom Pass
 * 
 * Glow effect for bright areas using gaussian blur.
 * 
 * @module postfx/passes/BloomPass
 */

import * as THREE from 'three/webgpu';
import { PostPass } from '../core/PostPass';

export interface BloomPassOptions {
  threshold?: number;
  strength?: number;
  radius?: number;
  levels?: number;
}

/**
 * Bloom post-processing pass
 */
export class BloomPass extends PostPass {
  private threshold: number;
  private strength: number;
  private radius: number;
  private levels: number;
  
  private separateRenderTargets: THREE.WebGLRenderTarget[] = [];
  private brightnessMaterial: THREE.ShaderMaterial | null = null;
  private blurMaterial: THREE.ShaderMaterial | null = null;
  private compositeMaterial: THREE.ShaderMaterial | null = null;

  constructor(options: BloomPassOptions = {}) {
    super({ name: 'BloomPass' });
    
    this.threshold = options.threshold !== undefined ? options.threshold : 1.0;
    this.strength = options.strength !== undefined ? options.strength : 0.5;
    this.radius = options.radius !== undefined ? options.radius : 0.85;
    this.levels = options.levels !== undefined ? options.levels : 5;
  }

  initialize(): void {
    // Create brightness filter material
    this.brightnessMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        threshold: { value: this.threshold }
      },
      vertexShader: defaultVertexShader,
      fragmentShader: brightnessFragmentShader
    });

    // Create blur material
    this.blurMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        resolution: { value: new THREE.Vector2() },
        direction: { value: new THREE.Vector2() }
      },
      vertexShader: defaultVertexShader,
      fragmentShader: blurFragmentShader
    });

    // Create composite material
    this.compositeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        bloomTexture: { value: null },
        strength: { value: this.strength }
      },
      vertexShader: defaultVertexShader,
      fragmentShader: compositeFragmentShader
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    this.fullScreenQuad = new THREE.Mesh(geometry, this.brightnessMaterial);
  }

  render(
    renderer: THREE.WebGPURenderer,
    writeBuffer: THREE.WebGLRenderTarget | null,
    readBuffer: THREE.WebGLRenderTarget,
    deltaTime: number
  ): void {
    if (!this.enabled || !this.fullScreenQuad) return;

    // Step 1: Extract bright pixels
    this.brightnessMaterial!.uniforms.tDiffuse.value = readBuffer.texture;
    this.fullScreenQuad.material = this.brightnessMaterial!;
    
    if (this.separateRenderTargets.length > 0) {
      renderer.setRenderTarget(this.separateRenderTargets[0]);
      renderer.render(this.fullScreenQuad, orthoCamera);
      
      // Step 2: Blur bright pixels (multi-level downsampling)
      for (let i = 0; i < this.levels - 1; i++) {
        // Horizontal blur
        this.blurMaterial!.uniforms.tDiffuse.value = this.separateRenderTargets[i].texture;
        this.blurMaterial!.uniforms.direction.value.set(1, 0);
        this.fullScreenQuad.material = this.blurMaterial!;
        
        // Vertical blur (to next level)
        this.blurMaterial!.uniforms.direction.value.set(0, 1);
        renderer.setRenderTarget(this.separateRenderTargets[i + 1]);
        renderer.render(this.fullScreenQuad, orthoCamera);
      }
      
      // Step 3: Composite bloom with original
      this.compositeMaterial!.uniforms.tDiffuse.value = readBuffer.texture;
      this.compositeMaterial!.uniforms.bloomTexture.value = this.separateRenderTargets[this.levels - 1].texture;
      this.fullScreenQuad.material = this.compositeMaterial!;
    }
    
    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
    } else if (writeBuffer) {
      renderer.setRenderTarget(writeBuffer);
    }
    
    renderer.render(this.fullScreenQuad, orthoCamera);
  }

  setSize(width: number, height: number): void {
    // Dispose old render targets
    for (const rt of this.separateRenderTargets) {
      rt.dispose();
    }
    this.separateRenderTargets = [];

    // Create downsampled render targets
    let w = width;
    let h = height;
    
    for (let i = 0; i < this.levels; i++) {
      w = Math.floor(w / 2);
      h = Math.floor(h / 2);
      
      const rt = new THREE.WebGLRenderTarget(w, h, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.HalfFloatType
      });
      
      this.separateRenderTargets.push(rt);
    }
  }

  setThreshold(threshold: number): void {
    this.threshold = threshold;
    if (this.brightnessMaterial) {
      this.brightnessMaterial.uniforms.threshold.value = threshold;
    }
  }

  setStrength(strength: number): void {
    this.strength = strength;
    if (this.compositeMaterial) {
      this.compositeMaterial.uniforms.strength.value = strength;
    }
  }

  dispose(): void {
    super.dispose();
    for (const rt of this.separateRenderTargets) {
      rt.dispose();
    }
    this.brightnessMaterial?.dispose();
    this.blurMaterial?.dispose();
    this.compositeMaterial?.dispose();
  }
}

const defaultVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const brightnessFragmentShader = `
uniform sampler2D tDiffuse;
uniform float threshold;
varying vec2 vUv;

void main() {
  vec4 texel = texture2D(tDiffuse, vUv);
  float brightness = dot(texel.rgb, vec3(0.2126, 0.7152, 0.0722));
  float contribution = max(0.0, brightness - threshold);
  contribution /= max(brightness, 0.00001);
  gl_FragColor = vec4(texel.rgb * contribution, texel.a);
}
`;

const blurFragmentShader = `
uniform sampler2D tDiffuse;
uniform vec2 resolution;
uniform vec2 direction;
varying vec2 vUv;

void main() {
  vec2 texelSize = 1.0 / resolution;
  vec4 color = vec4(0.0);
  
  // 9-tap gaussian blur
  color += texture2D(tDiffuse, vUv + direction * texelSize * -4.0) * 0.05;
  color += texture2D(tDiffuse, vUv + direction * texelSize * -3.0) * 0.09;
  color += texture2D(tDiffuse, vUv + direction * texelSize * -2.0) * 0.12;
  color += texture2D(tDiffuse, vUv + direction * texelSize * -1.0) * 0.15;
  color += texture2D(tDiffuse, vUv) * 0.16;
  color += texture2D(tDiffuse, vUv + direction * texelSize * 1.0) * 0.15;
  color += texture2D(tDiffuse, vUv + direction * texelSize * 2.0) * 0.12;
  color += texture2D(tDiffuse, vUv + direction * texelSize * 3.0) * 0.09;
  color += texture2D(tDiffuse, vUv + direction * texelSize * 4.0) * 0.05;
  
  gl_FragColor = color;
}
`;

const compositeFragmentShader = `
uniform sampler2D tDiffuse;
uniform sampler2D bloomTexture;
uniform float strength;
varying vec2 vUv;

void main() {
  vec4 original = texture2D(tDiffuse, vUv);
  vec4 bloom = texture2D(bloomTexture, vUv);
  gl_FragColor = original + bloom * strength;
}
`;

const orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

