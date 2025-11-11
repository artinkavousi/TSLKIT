/**
 * Color Grading Pass
 *
 * Cinematic color correction with lift/gamma/gain controls.
 *
 * @module postfx/passes/ColorGradingPass
 */
import * as THREE from 'three/webgpu';
import { ShaderPass } from '../core/PostPass';
/**
 * Color grading pass with lift/gamma/gain controls
 */
export class ColorGradingPass extends ShaderPass {
    constructor(options = {}) {
        const uniforms = {
            tDiffuse: { value: null },
            lift: { value: options.lift || new THREE.Vector3(0, 0, 0) },
            gamma: { value: options.gamma || new THREE.Vector3(1, 1, 1) },
            gain: { value: options.gain || new THREE.Vector3(1, 1, 1) },
            saturation: { value: options.saturation !== undefined ? options.saturation : 1.0 },
            contrast: { value: options.contrast !== undefined ? options.contrast : 1.0 },
            brightness: { value: options.brightness !== undefined ? options.brightness : 0.0 }
        };
        super({
            uniforms,
            fragmentShader: colorGradingFragmentShader
        }, { name: 'ColorGradingPass' });
    }
    setLift(lift) {
        this.uniforms.lift.value.copy(lift);
    }
    setGamma(gamma) {
        this.uniforms.gamma.value.copy(gamma);
    }
    setGain(gain) {
        this.uniforms.gain.value.copy(gain);
    }
    setSaturation(saturation) {
        this.uniforms.saturation.value = saturation;
    }
    setContrast(contrast) {
        this.uniforms.contrast.value = contrast;
    }
    setBrightness(brightness) {
        this.uniforms.brightness.value = brightness;
    }
}
const colorGradingFragmentShader = `
uniform sampler2D tDiffuse;
uniform vec3 lift;
uniform vec3 gamma;
uniform vec3 gain;
uniform float saturation;
uniform float contrast;
uniform float brightness;

varying vec2 vUv;

vec3 applyLiftGammaGain(vec3 color, vec3 lift, vec3 gamma, vec3 gain) {
  // Lift (shadows)
  color = color + lift;
  
  // Gamma (midtones)
  color = pow(max(color, vec3(0.0)), 1.0 / gamma);
  
  // Gain (highlights)
  color = color * gain;
  
  return color;
}

vec3 applySaturation(vec3 color, float saturation) {
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  return mix(vec3(luma), color, saturation);
}

vec3 applyContrast(vec3 color, float contrast) {
  return (color - 0.5) * contrast + 0.5;
}

void main() {
  vec4 texel = texture2D(tDiffuse, vUv);
  vec3 color = texel.rgb;
  
  // Apply lift/gamma/gain
  color = applyLiftGammaGain(color, lift, gamma, gain);
  
  // Apply brightness
  color += brightness;
  
  // Apply contrast
  color = applyContrast(color, contrast);
  
  // Apply saturation
  color = applySaturation(color, saturation);
  
  gl_FragColor = vec4(color, texel.a);
}
`;
//# sourceMappingURL=ColorGradingPass.js.map