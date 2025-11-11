/**
 * Vignette Pass
 *
 * Darkens the edges of the screen for a cinematic look.
 *
 * @module postfx/passes/VignettePass
 */
import { ShaderPass } from '../core/PostPass';
/**
 * Vignette effect pass
 */
export class VignettePass extends ShaderPass {
    constructor(options = {}) {
        const uniforms = {
            tDiffuse: { value: null },
            offset: { value: options.offset !== undefined ? options.offset : 1.0 },
            darkness: { value: options.darkness !== undefined ? options.darkness : 1.0 }
        };
        super({
            uniforms,
            fragmentShader: vignetteFragmentShader
        }, { name: 'VignettePass' });
    }
    setOffset(offset) {
        this.uniforms.offset.value = offset;
    }
    setDarkness(darkness) {
        this.uniforms.darkness.value = darkness;
    }
}
const vignetteFragmentShader = `
uniform sampler2D tDiffuse;
uniform float offset;
uniform float darkness;

varying vec2 vUv;

void main() {
  vec4 texel = texture2D(tDiffuse, vUv);
  vec2 uv = (vUv - 0.5) * 2.0;
  float dist = length(uv);
  float vignette = smoothstep(offset, offset - darkness, dist);
  gl_FragColor = vec4(texel.rgb * vignette, texel.a);
}
`;
//# sourceMappingURL=VignettePass.js.map