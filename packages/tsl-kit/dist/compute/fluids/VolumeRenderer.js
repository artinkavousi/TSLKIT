/**
 * Volume Renderer for Fluid Simulation
 *
 * Renders 3D fluid density field as volumetric fog/smoke.
 *
 * @module compute/fluids/VolumeRenderer
 */
import * as THREE from 'three/webgpu';
/**
 * Volume renderer for 3D fluid density visualization
 */
export class VolumeRenderer {
    constructor(config = {}) {
        this.material = null;
        this.mesh = null;
        this.densityTexture = null;
        this.resolution = config.resolution || [128, 128, 128];
        this.densityScale = config.densityScale !== undefined ? config.densityScale : 1.0;
        this.stepSize = config.stepSize !== undefined ? config.stepSize : 0.01;
        this.maxSteps = config.maxSteps !== undefined ? config.maxSteps : 100;
        this.lightAbsorption = config.lightAbsorption !== undefined ? config.lightAbsorption : 0.1;
        this.lightScattering = config.lightScattering !== undefined ? config.lightScattering : 0.5;
        this.ambientLight = config.ambientLight !== undefined ? config.ambientLight : 0.2;
    }
    /**
     * Initialize volume renderer
     */
    async init() {
        // Create 3D texture for density field
        const [w, h, d] = this.resolution;
        const size = w * h * d;
        const data = new Float32Array(size);
        this.densityTexture = new THREE.Data3DTexture(data, w, h, d);
        this.densityTexture.format = THREE.RedFormat;
        this.densityTexture.type = THREE.FloatType;
        this.densityTexture.minFilter = THREE.LinearFilter;
        this.densityTexture.magFilter = THREE.LinearFilter;
        this.densityTexture.wrapS = THREE.ClampToEdgeWrapping;
        this.densityTexture.wrapT = THREE.ClampToEdgeWrapping;
        this.densityTexture.wrapR = THREE.ClampToEdgeWrapping;
        this.densityTexture.needsUpdate = true;
        // Create volume rendering material
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                densityTexture: { value: this.densityTexture },
                densityScale: { value: this.densityScale },
                stepSize: { value: this.stepSize },
                maxSteps: { value: this.maxSteps },
                lightAbsorption: { value: this.lightAbsorption },
                lightScattering: { value: this.lightScattering },
                ambientLight: { value: this.ambientLight },
                lightDirection: { value: new THREE.Vector3(1, 1, 1).normalize() },
                cameraPosition: { value: new THREE.Vector3() }
            },
            vertexShader: volumeVertexShader,
            fragmentShader: volumeFragmentShader,
            side: THREE.BackSide,
            transparent: true,
            depthWrite: false
        });
        // Create bounding box mesh
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        this.mesh = new THREE.Mesh(geometry, this.material);
    }
    /**
     * Update density data from fluid simulation
     */
    updateDensity(densityData) {
        if (!this.densityTexture)
            return;
        this.densityTexture.image.data = densityData;
        this.densityTexture.needsUpdate = true;
    }
    /**
     * Set rendering parameters
     */
    setDensityScale(scale) {
        this.densityScale = scale;
        if (this.material) {
            this.material.uniforms.densityScale.value = scale;
        }
    }
    setStepSize(size) {
        this.stepSize = size;
        if (this.material) {
            this.material.uniforms.stepSize.value = size;
        }
    }
    setLightAbsorption(absorption) {
        this.lightAbsorption = absorption;
        if (this.material) {
            this.material.uniforms.lightAbsorption.value = absorption;
        }
    }
    /**
     * Update camera position for rendering
     */
    updateCamera(camera) {
        if (this.material) {
            this.material.uniforms.cameraPosition.value.copy(camera.position);
        }
    }
    /**
     * Get the mesh for adding to scene
     */
    getMesh() {
        return this.mesh;
    }
    /**
     * Dispose resources
     */
    dispose() {
        this.densityTexture?.dispose();
        this.material?.dispose();
        this.mesh?.geometry.dispose();
    }
}
const volumeVertexShader = `
varying vec3 vPosition;
varying vec3 vWorldPosition;

void main() {
  vPosition = position;
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const volumeFragmentShader = `
uniform sampler3D densityTexture;
uniform float densityScale;
uniform float stepSize;
uniform int maxSteps;
uniform float lightAbsorption;
uniform float lightScattering;
uniform float ambientLight;
uniform vec3 lightDirection;
uniform vec3 cameraPosition;

varying vec3 vPosition;
varying vec3 vWorldPosition;

// Sample density at world position
float sampleDensity(vec3 uvw) {
  // Convert to texture coordinates [0,1]
  vec3 texCoord = uvw * 0.5 + 0.5;
  
  // Clamp to texture bounds
  if (texCoord.x < 0.0 || texCoord.x > 1.0 ||
      texCoord.y < 0.0 || texCoord.y > 1.0 ||
      texCoord.z < 0.0 || texCoord.z > 1.0) {
    return 0.0;
  }
  
  return texture(densityTexture, texCoord).r * densityScale;
}

// Raymarch through volume
vec4 raymarch(vec3 rayOrigin, vec3 rayDir) {
  vec3 currentPos = vPosition; // Start at back face
  vec4 color = vec4(0.0);
  float transmittance = 1.0;
  
  for (int i = 0; i < 100; i++) {
    if (i >= maxSteps) break;
    if (transmittance < 0.01) break;
    
    float density = sampleDensity(currentPos);
    
    if (density > 0.001) {
      // Simple lighting
      float lighting = ambientLight;
      
      // Add directional light contribution
      lighting += max(0.0, dot(normalize(currentPos), lightDirection)) * lightScattering;
      
      // Absorption
      float absorption = exp(-density * lightAbsorption * stepSize);
      
      // Accumulate color
      vec3 sampleColor = vec3(1.0) * lighting * density;
      color.rgb += sampleColor * transmittance * stepSize;
      
      // Update transmittance
      transmittance *= absorption;
    }
    
    // Step along ray
    currentPos += rayDir * stepSize;
    
    // Exit if outside bounds
    if (abs(currentPos.x) > 0.5 || abs(currentPos.y) > 0.5 || abs(currentPos.z) > 0.5) {
      break;
    }
  }
  
  color.a = 1.0 - transmittance;
  return color;
}

void main() {
  vec3 rayDir = normalize(vWorldPosition - cameraPosition);
  vec4 volumeColor = raymarch(vPosition, rayDir);
  
  gl_FragColor = volumeColor;
}
`;
//# sourceMappingURL=VolumeRenderer.js.map