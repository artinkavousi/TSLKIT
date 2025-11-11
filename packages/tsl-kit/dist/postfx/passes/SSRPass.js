/**
 * Screen Space Reflections Pass
 *
 * GPU-accelerated screen-space reflections using depth buffer raymarching.
 *
 * @module postfx/passes/SSRPass
 */
import * as THREE from 'three/webgpu';
import { PostPass } from '../core/PostPass';
/**
 * Screen Space Reflections pass
 *
 * Requires depth and normal buffers from scene render.
 */
export class SSRPass extends PostPass {
    constructor(camera, options = {}) {
        super({ name: 'SSRPass' });
        this.maxDistance = options.maxDistance !== undefined ? options.maxDistance : 10.0;
        this.resolution = options.resolution !== undefined ? options.resolution : 0.5;
        this.steps = options.steps !== undefined ? options.steps : 20;
        this.binarySearchSteps = options.binarySearchSteps !== undefined ? options.binarySearchSteps : 4;
        this.maxRoughness = options.maxRoughness !== undefined ? options.maxRoughness : 0.5;
        this.jitter = options.jitter !== undefined ? options.jitter : 0.5;
        this.fade = options.fade !== undefined ? options.fade : 0.5;
        this.thickness = options.thickness !== undefined ? options.thickness : 0.5;
    }
    initialize() {
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                tDepth: { value: null },
                tNormal: { value: null },
                cameraNear: { value: 0.1 },
                cameraFar: { value: 1000 },
                resolution: { value: new THREE.Vector2() },
                cameraProjectionMatrix: { value: new THREE.Matrix4() },
                cameraInverseProjectionMatrix: { value: new THREE.Matrix4() },
                maxDistance: { value: this.maxDistance },
                resolution_: { value: this.resolution },
                steps: { value: this.steps },
                binarySearchSteps: { value: this.binarySearchSteps },
                maxRoughness: { value: this.maxRoughness },
                jitter: { value: this.jitter },
                fade: { value: this.fade },
                thickness: { value: this.thickness }
            },
            vertexShader: defaultVertexShader,
            fragmentShader: ssrFragmentShader,
            depthTest: false,
            depthWrite: false
        });
        this.createFullScreenQuad(this.material);
    }
    render(renderer, writeBuffer, readBuffer, deltaTime) {
        if (!this.enabled || !this.fullScreenQuad || !this.material)
            return;
        this.material.uniforms.tDiffuse.value = readBuffer.texture;
        // Note: Requires depth and normal textures from scene render
        // this.material.uniforms.tDepth.value = depthTexture;
        // this.material.uniforms.tNormal.value = normalTexture;
        if (this.renderToScreen) {
            renderer.setRenderTarget(null);
        }
        else if (writeBuffer) {
            renderer.setRenderTarget(writeBuffer);
        }
        renderer.render(this.fullScreenQuad, orthoCamera);
    }
    setMaxDistance(distance) {
        this.maxDistance = distance;
        if (this.material) {
            this.material.uniforms.maxDistance.value = distance;
        }
    }
    setSteps(steps) {
        this.steps = steps;
        if (this.material) {
            this.material.uniforms.steps.value = steps;
        }
    }
}
const defaultVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;
const ssrFragmentShader = `
uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform sampler2D tNormal;
uniform vec2 resolution;
uniform float cameraNear;
uniform float cameraFar;
uniform mat4 cameraProjectionMatrix;
uniform mat4 cameraInverseProjectionMatrix;
uniform float maxDistance;
uniform float resolution_;
uniform int steps;
uniform int binarySearchSteps;
uniform float maxRoughness;
uniform float jitter;
uniform float fade;
uniform float thickness;

varying vec2 vUv;

// Get view space position from depth
vec3 getViewPosition(vec2 screenPosition, float depth) {
  vec4 clipSpacePosition = vec4(screenPosition * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
  vec4 viewSpacePosition = cameraInverseProjectionMatrix * clipSpacePosition;
  return viewSpacePosition.xyz / viewSpacePosition.w;
}

// Ray marching for SSR
vec4 rayMarch(vec3 rayOrigin, vec3 rayDir, float roughness) {
  vec3 currentPos = rayOrigin;
  vec4 result = vec4(0.0);
  
  // Simplified raymarch (full implementation would be more complex)
  for (int i = 0; i < 20; i++) {
    if (i >= steps) break;
    
    currentPos += rayDir * 0.1;
    
    // Project to screen space
    vec4 projectedPos = cameraProjectionMatrix * vec4(currentPos, 1.0);
    vec2 screenPos = (projectedPos.xy / projectedPos.w) * 0.5 + 0.5;
    
    // Check if in screen bounds
    if (screenPos.x < 0.0 || screenPos.x > 1.0 || screenPos.y < 0.0 || screenPos.y > 1.0) {
      break;
    }
    
    // Sample depth and compare
    float sampledDepth = texture2D(tDepth, screenPos).r;
    vec3 sampledPos = getViewPosition(screenPos, sampledDepth);
    
    // Hit detection (simplified)
    if (abs(sampledPos.z - currentPos.z) < thickness) {
      result = texture2D(tDiffuse, screenPos);
      result.a = 1.0;
      break;
    }
  }
  
  return result;
}

void main() {
  vec4 color = texture2D(tDiffuse, vUv);
  
  // Simplified SSR (full implementation would be more complex)
  // For now, just pass through
  gl_FragColor = color;
  
  /* Full implementation would:
  float depth = texture2D(tDepth, vUv).r;
  vec3 viewPos = getViewPosition(vUv, depth);
  vec3 normal = texture2D(tNormal, vUv).rgb * 2.0 - 1.0;
  vec3 viewDir = normalize(viewPos);
  vec3 reflectDir = reflect(viewDir, normal);
  
  // Raymarch for reflection
  vec4 reflection = rayMarch(viewPos, reflectDir, 0.0);
  
  // Blend with original color
  gl_FragColor = mix(color, reflection, reflection.a * fade);
  */
}
`;
const orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
//# sourceMappingURL=SSRPass.js.map