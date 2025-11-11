/**
 * Film Grain Pass
 * 
 * Adds analog film grain noise for a cinematic look.
 * 
 * @module postfx/passes/FilmGrainPass
 */

import * as THREE from 'three/webgpu';
import { ShaderPass } from '../core/PostPass';

export interface FilmGrainPassOptions {
  intensity?: number;
  scale?: number;
}

/**
 * Film grain effect pass
 */
export class FilmGrainPass extends ShaderPass {
  private time: number = 0;

  constructor(options: FilmGrainPassOptions = {}) {
    const uniforms = {
      tDiffuse: { value: null },
      time: { value: 0 },
      intensity: { value: options.intensity !== undefined ? options.intensity : 0.5 },
      scale: { value: options.scale !== undefined ? options.scale : 1.0 }
    };

    super(
      {
        uniforms,
        fragmentShader: filmGrainFragmentShader
      },
      { name: 'FilmGrainPass' }
    );
  }

  render(
    renderer: THREE.WebGPURenderer,
    writeBuffer: THREE.WebGLRenderTarget | null,
    readBuffer: THREE.WebGLRenderTarget,
    deltaTime: number
  ): void {
    this.time += deltaTime;
    this.uniforms.time.value = this.time;
    super.render(renderer, writeBuffer, readBuffer, deltaTime);
  }

  setIntensity(intensity: number): void {
    this.uniforms.intensity.value = intensity;
  }

  setScale(scale: number): void {
    this.uniforms.scale.value = scale;
  }
}

const filmGrainFragmentShader = `
uniform sampler2D tDiffuse;
uniform float time;
uniform float intensity;
uniform float scale;

varying vec2 vUv;

// Simple noise function
float random(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec4 texel = texture2D(tDiffuse, vUv);
  
  // Generate grain
  vec2 seed = vUv * scale + time;
  float grain = random(seed) * 2.0 - 1.0;
  
  // Apply grain
  vec3 color = texel.rgb + vec3(grain) * intensity;
  
  gl_FragColor = vec4(color, texel.a);
}
`;

