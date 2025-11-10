/**
 * Material Utilities
 * 
 * Core utilities for procedural material generation
 * 
 * @module materials/utils
 */

import {
  Fn,
  vec3,
  float,
  cos,
  sin,
  min,
  max,
  add,
  sub,
  select,
  If,
  mx_noise_float,
  type Node,
} from 'three/tsl'
import { Color, Vector3 } from 'three'

/**
 * HSL helper function for color conversion
 */
const hslHelper = /*#__PURE__*/ Fn(([h, s, l, n]) => {
  const k = n.add(h.mul(12)).mod(12)
  const a = s.mul(min(l, sub(1, l)))
  return l.sub(a.mul(max(-1, min(min(k.sub(3), sub(9, k)), 1))))
})

/**
 * Convert HSL to RGB
 * 
 * @param h - Hue [0, 1]
 * @param s - Saturation [0, 1]
 * @param l - Lightness [0, 1]
 * @returns RGB color
 */
export const hsl = /*#__PURE__*/ Fn(([h, s, l]) => {
  h = h.fract().add(1).fract()
  s = s.clamp(0, 1)
  l = l.clamp(0, 1)

  const r = hslHelper(h, s, l, 0)
  const g = hslHelper(h, s, l, 8)
  const b = hslHelper(h, s, l, 4)

  return vec3(r, g, b)
})

/**
 * Convert RGB to HSL
 * 
 * @param rgb - RGB color
 * @returns HSL color
 */
export const toHsl = /*#__PURE__*/ Fn(([rgb]) => {
  const R = float(rgb.x).toVar()
  const G = float(rgb.y).toVar()
  const B = float(rgb.z).toVar()

  const mx = max(R, max(G, B)).toVar()
  const mn = min(R, min(G, B)).toVar()

  const H = float(0).toVar()
  const S = float(0).toVar()
  const L = add(mx, mn).div(2)

  If(mn.notEqual(mx), () => {
    const delta = sub(mx, mn).toVar()

    S.assign(select(L.lessThanEqual(0.5), delta.div(add(mn, mx)), delta.div(sub(2, add(mn, mx)))))
    
    If(mx.equal(R), () => {
      H.assign(sub(G, B).div(delta).add(select(G.lessThanEqual(B), 6, 0)))
    })
      .ElseIf(mx.equal(G), () => {
        H.assign(sub(B, R).div(delta).add(2))
      })
      .Else(() => {
        H.assign(sub(R, G).div(delta).add(4))
      })
    
    H.divAssign(6)
  })

  return vec3(H, S, L)
})

/**
 * Convert spherical coordinates to Cartesian
 * 
 * @param phi - Phi angle
 * @param theta - Theta angle
 * @returns 3D position on unit sphere
 */
export const spherical = /*#__PURE__*/ Fn(([phi, theta]) => {
  return vec3(
    sin(theta).mul(sin(phi)),
    cos(phi),
    cos(theta).mul(sin(phi))
  )
})

/**
 * Simple vector noise
 * 
 * @param v - Input vector
 * @returns Noise value [-1, 1]
 */
export const vnoise = /*#__PURE__*/ Fn(([v]) => {
  return v.dot(vec3(12.9898, 78.233, -97.5123))
    .sin()
    .mul(43758.5453)
    .fract()
    .mul(2)
    .sub(1)
})

/**
 * Scaled noise with octave
 * 
 * @param pos - Position
 * @param scale - Scale factor
 * @param octave - Octave multiplier
 * @param seed - Random seed
 * @returns Noise value
 */
export function noised(pos: Node, scale: Node | number = 1, octave: Node | number = 1, seed: Node | number = 0): Node {
  const scaleNode = typeof scale === 'number' ? float(scale) : scale
  const octaveNode = typeof octave === 'number' ? float(octave) : octave
  const seedNode = typeof seed === 'number' ? float(seed) : seed
  
  return mx_noise_float(pos.mul(scaleNode, octaveNode).add(seedNode))
}

/**
 * Base noise function (MaterialX noise)
 */
export const noise = mx_noise_float

/**
 * Prepare material parameters
 * 
 * Converts numeric values to TSL nodes, handles Color and Vector3
 * 
 * @param userParams - User-provided parameters
 * @param defaults - Default parameter values
 * @returns Prepared parameters as TSL nodes
 */
export function prepare(userParams: any, defaults: any): any {
  let propertyNames: string[] = []
  
  for (const item of userParams) {
    if (item && typeof item === 'object') {
      propertyNames = Object.keys(item)
      break
    }
  }

  const params = { ...defaults }

  for (const key of propertyNames) {
    if (typeof userParams[key] !== 'undefined') {
      params[key] = userParams[key]
    }
  }

  for (const name of Object.keys(params)) {
    if (typeof params[name] === 'number') {
      params[name] = float(params[name])
    } else if (params[name] instanceof Color) {
      params[name] = vec3(params[name].r, params[name].g, params[name].b)
    } else if (params[name] instanceof Vector3) {
      params[name] = vec3(params[name].x, params[name].y, params[name].z)
    }
  }

  return params
}

/**
 * TSL Function wrapper with defaults
 * 
 * Wraps a TSL function with default parameter handling
 * 
 * @param jsFunc - JavaScript function to wrap
 * @param defaults - Default parameters
 * @returns Wrapped TSL function with defaults property
 */
export function TSLFn(jsFunc: any, defaults: any): any {
  const fn = Fn(jsFunc)
  const customProps = new Map()
  customProps.set('defaults', defaults)
  customProps.set('opacity', null)
  customProps.set('roughness', null)
  customProps.set('normal', null)

  const target = function() {}
  Object.setPrototypeOf(target, Object.getPrototypeOf((fn as any).call))

  return new Proxy(target, {
    get(target, prop, receiver) {
      if (prop === 'defaults' || prop === 'opacity' || prop === 'roughness' || prop === 'normal') {
        return customProps.get(prop as string)
      }
      if (prop === 'fn') {
        return fn
      }
      return Reflect.get(fn as any, prop, receiver)
    },
    set(target, prop, value, receiver) {
      if (prop === 'defaults' || prop === 'opacity' || prop === 'roughness' || prop === 'normal') {
        customProps.set(prop as string, value)
        return true
      }
      return Reflect.set(fn as any, prop, value, receiver)
    },
    apply(target, thisArg, args) {
      return Reflect.apply(fn as any, thisArg, args)
    },
    getOwnPropertyDescriptor(target, prop) {
      if (prop === 'defaults') {
        return {
          value: customProps.get('defaults'),
          writable: true,
          enumerable: true,
          configurable: true,
        }
      }
      return Reflect.getOwnPropertyDescriptor(fn as any, prop)
    }
  })
}

