/**
 * Tone Mapping Pass
 *
 * HDR to LDR tone mapping with multiple curve options.
 *
 * @module postfx/passes/ToneMapPass
 */
import { ShaderPass } from '../core/PostPass';
/**
 * Tone mapping pass with multiple tone curve options
 */
export class ToneMapPass extends ShaderPass {
    constructor(options = {}) {
        const uniforms = {
            tDiffuse: { value: null },
            exposure: { value: options.exposure || 1.0 },
            whitePoint: { value: options.whitePoint || 1.0 },
            mode: { value: getModeValue(options.mode || 'aces') }
        };
        super({
            uniforms,
            fragmentShader: toneMapFragmentShader
        }, { name: 'ToneMapPass' });
    }
    setMode(mode) {
        this.uniforms.mode.value = getModeValue(mode);
    }
    setExposure(exposure) {
        this.uniforms.exposure.value = exposure;
    }
    setWhitePoint(whitePoint) {
        this.uniforms.whitePoint.value = whitePoint;
    }
}
function getModeValue(mode) {
    const modes = {
        linear: 0,
        reinhard: 1,
        cineon: 2,
        aces: 3,
        filmic: 4,
        uncharted2: 5
    };
    return modes[mode];
}
const toneMapFragmentShader = `
uniform sampler2D tDiffuse;
uniform float exposure;
uniform float whitePoint;
uniform int mode;

varying vec2 vUv;

// Linear (no tone mapping)
vec3 linearToneMapping(vec3 color) {
  return color;
}

// Reinhard tone mapping
vec3 reinhardToneMapping(vec3 color) {
  return color / (color + vec3(1.0));
}

// Reinhard extended (with white point)
vec3 reinhardExtendedToneMapping(vec3 color, float maxWhite) {
  vec3 numerator = color * (1.0 + (color / vec3(maxWhite * maxWhite)));
  return numerator / (1.0 + color);
}

// Cineon/Filmic S-curve
vec3 cineonToneMapping(vec3 color) {
  color = max(vec3(0.0), color - 0.004);
  return pow((color * (6.2 * color + 0.5)) / (color * (6.2 * color + 1.7) + 0.06), vec3(2.2));
}

// ACES Filmic (Academy Color Encoding System)
vec3 acesFilmic(vec3 x) {
  float a = 2.51;
  float b = 0.03;
  float c = 2.43;
  float d = 0.59;
  float e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}

// Filmic (Jim Hejl and Richard Burgess-Dawson)
vec3 filmicToneMapping(vec3 color) {
  color = max(vec3(0.0), color - 0.004);
  return (color * (6.2 * color + 0.5)) / (color * (6.2 * color + 1.7) + 0.06);
}

// Uncharted 2 tone mapping (John Hable)
vec3 uncharted2Tonemap(vec3 x) {
  float A = 0.15;
  float B = 0.50;
  float C = 0.10;
  float D = 0.20;
  float E = 0.02;
  float F = 0.30;
  return ((x * (A * x + C * B) + D * E) / (x * (A * x + B) + D * F)) - E / F;
}

vec3 uncharted2ToneMapping(vec3 color) {
  float W = 11.2;
  float exposureBias = 2.0;
  vec3 curr = uncharted2Tonemap(exposureBias * color);
  vec3 whiteScale = 1.0 / uncharted2Tonemap(vec3(W));
  return curr * whiteScale;
}

void main() {
  vec4 texel = texture2D(tDiffuse, vUv);
  vec3 color = texel.rgb * exposure;
  
  // Apply tone mapping based on mode
  if (mode == 0) {
    color = linearToneMapping(color);
  } else if (mode == 1) {
    color = reinhardExtendedToneMapping(color, whitePoint);
  } else if (mode == 2) {
    color = cineonToneMapping(color);
  } else if (mode == 3) {
    color = acesFilmic(color);
  } else if (mode == 4) {
    color = filmicToneMapping(color);
  } else if (mode == 5) {
    color = uncharted2ToneMapping(color);
  }
  
  gl_FragColor = vec4(color, texel.a);
}
`;
//# sourceMappingURL=ToneMapPass.js.map