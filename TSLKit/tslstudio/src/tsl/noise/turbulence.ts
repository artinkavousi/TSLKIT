/**
 * Turbulence Noise
 * 
 * Originally created by @XorDev
 * https://www.shadertoy.com/view/WclSWn
 * 
 * @module tsl/noise/turbulence
 */

import {
  Fn,
  float,
  sin,
  Loop,
  vec2,
  cos,
} from 'three/tsl'

/**
 * Turbulence noise function
 * 
 * Creates turbulent distortion by layering rotated sine waves
 * 
 * @param p - 2D input position
 * @param _time - Time parameter for animation
 * @param _num - Number of octaves (default: 10.0)
 * @param _amp - Amplitude (default: 0.7)
 * @param _speed - Animation speed (default: 0.3)
 * @param _freq - Base frequency (default: 2.0)
 * @param _exp - Frequency exponent (default: 1.4)
 * @returns Turbulent distorted position
 * 
 * @example
 * ```typescript
 * const distorted = turbulence(uv, time, 10, 0.7, 0.3, 2.0, 1.4)
 * ```
 */
export const turbulence = /*#__PURE__*/ Fn(
  ([p, _time, _num = 10.0, _amp = 0.7, _speed = 0.3, _freq = 2.0, _exp = 1.4]) => {
    // Turbulence parameters
    const freq = float(_freq).toVar()
    const speed = float(_speed).toVar()
    const amp = float(_amp).toVar()
    
    // Rotation angle for each octave
    const angle = 0.927295218 // atan(0.8/0.6)
    const c = cos(angle)
    const s = sin(angle)
    
    Loop({ start: 0.0, end: _num, type: 'float' }, ({ i }) => {
      // Rotate p
      const rotated = vec2(
        p.x.mul(c).sub(p.y.mul(s)),
        p.x.mul(s).add(p.y.mul(c))
      )
      
      // Scroll along the rotated y coordinate
      const phase = freq.mul(rotated.y).add(speed.mul(_time)).add(i)
      
      // Create perpendicular offset vector (rotate by 90 degrees)
      const offsetDir = vec2(c.negate(), s) // Perpendicular to rotation
      
      // Add a perpendicular sine wave offset
      p.addAssign(amp.mul(offsetDir).mul(sin(phase)).div(freq))
      
      // Scale down for the next octave
      freq.mulAssign(_exp)
    })
    
    return p
  }
)
