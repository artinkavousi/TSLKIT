# TSL/WebGPU Best Practices

> **Source**: Maxime Heckel portfolio and fragments-boilerplate  
> **Analysis Date**: November 10, 2025  
> **Purpose**: Document proven patterns for porting modules to r181+

---

## Table of Contents

1. [Code Organization](#code-organization)
2. [TSL Function Patterns](#tsl-function-patterns)
3. [Type Safety & Immutability](#type-safety--immutability)
4. [Function Metadata & Layout](#function-metadata--layout)
5. [Helper Function Patterns](#helper-function-patterns)
6. [Performance Patterns](#performance-patterns)
7. [Documentation Standards](#documentation-standards)
8. [Common Pitfalls](#common-pitfalls)

---

## Code Organization

### File Structure Pattern

```typescript
// 1. Imports (grouped by category)
import { Fn, vec3, vec4, float, dot } from 'three/tsl'
import { Node } from 'three/webgpu'

// 2. Helper functions (if needed)
export const helperFunction = Fn(/*...*/)

// 3. Main function export
export const mainFunction = Fn(/*...*/)
```

### Import Organization

**✅ GOOD:**
```typescript
// Group imports logically
import { 
  Fn, 
  vec3, vec4, 
  float, 
  dot, abs, max, min 
} from 'three/tsl'
```

**❌ BAD:**
```typescript
// Random order, hard to maintain
import { float, Fn, max, vec4, dot, vec3, abs, min } from 'three/tsl'
```

---

## TSL Function Patterns

### 1. Pure Function Export Pattern (Simple)

**Used in**: Lighting functions, simple utilities

```typescript
import { Fn, float, dot, max } from 'three/tsl'

export const createFresnelNode = Fn(([viewDir, normal, power = 1]) => {
  return float(1)
    .sub(max(0, dot(viewDir, normal)))
    .pow(power)
})
```

**Characteristics:**
- No internal state
- Single return value
- Default parameters supported
- Clean, functional style

### 2. Complex Function with Metadata Pattern

**Used in**: Noise functions, mathematical operations

```typescript
import { Fn, vec3, float } from 'three/tsl'

export const simplexNoise3d = /*#__PURE__*/ Fn<ShaderNodeObject<Node>>(([v_immutable]) => {
  const v = vec3(v_immutable).toVar()
  
  // ... implementation
  
  return result
}).setLayout({
  name: 'snoise',           // Shader function name
  type: 'float',            // Return type
  inputs: [
    { name: 'v', type: 'vec3' }
  ]
})
```

**Characteristics:**
- `/*#__PURE__*/` for tree-shaking
- Type annotation: `Fn<ShaderNodeObject<Node>>`
- `.setLayout()` for shader metadata
- Explicit shader name mapping

### 3. Overloaded Function Pattern

**Used in**: Common helpers with multiple type signatures

```typescript
import { Fn, overloadingFn, vec3, vec4, float } from 'three/tsl'

// Version for vec3
const mod289_vec3 = /*#__PURE__*/ Fn(([x_immutable]) => {
  const x = vec3(x_immutable).toVar()
  return x.sub(floor(x.mul(1.0 / 289.0)).mul(289.0))
}).setLayout({
  name: 'mod289_vec3',
  type: 'vec3',
  inputs: [{ name: 'x', type: 'vec3' }]
})

// Version for vec4
const mod289_vec4 = /*#__PURE__*/ Fn(([x_immutable]) => {
  const x = vec4(x_immutable).toVar()
  return x.sub(floor(x.mul(1.0 / 289.0)).mul(289.0))
}).setLayout({
  name: 'mod289_vec4',
  type: 'vec4',
  inputs: [{ name: 'x', type: 'vec4' }]
})

// Overloaded export
// @ts-ignore
export const mod289 = /*#__PURE__*/ overloadingFn([mod289_vec3, mod289_vec4])
```

**Characteristics:**
- Separate implementation for each type
- Combined with `overloadingFn`
- `@ts-ignore` for TypeScript (TSL handles types)
- Distinct names for internal functions

---

## Type Safety & Immutability

### Immutable Parameters Pattern

**✅ BEST PRACTICE:**
```typescript
export const myFunction = Fn(([v_immutable]) => {
  const v = vec3(v_immutable).toVar()  // Make mutable copy
  
  // Now safe to mutate
  v.mulAssign(2.0)
  
  return v
})
```

**Why:**
- Parameters are immutable by default in TSL
- `.toVar()` creates mutable variable
- Prevents accidental parameter mutation
- Clear intent: parameter → variable conversion

### Variable Declaration Pattern

```typescript
// ✅ GOOD - Explicit typing and mutation control
const position = vec3(inputPos).toVar()
const velocity = vec3(0, 0, 0).toVar()

// ❌ BAD - Unclear mutation intent
let position = inputPos  // JavaScript let, not TSL
```

### Assignment Patterns

```typescript
// Immutable operations (creates new value)
const result = a.add(b).mul(c)

// Mutable operations (modifies variable)
velocity.addAssign(acceleration)
position.mulAssign(0.99)  // Damping

// Explicit assignment
velocity.assign(newVelocity)
```

---

## Function Metadata & Layout

### Complete Layout Pattern

```typescript
export const myShader = /*#__PURE__*/ Fn(([input1, input2, input3]) => {
  // implementation
}).setLayout({
  name: 'myShader',        // Shader function name (must be unique)
  type: 'vec3',            // Return type
  inputs: [
    { name: 'input1', type: 'vec3' },
    { name: 'input2', type: 'float' },
    { name: 'input3', type: 'vec4' }
  ]
})
```

### When to Use `.setLayout()`

**Required:**
- Complex noise functions
- Mathematical utilities
- Functions used in multiple contexts
- Library functions for reuse

**Optional:**
- Simple one-liners
- Material-specific functions
- Internal helpers

---

## Helper Function Patterns

### Shared Helper Pattern

**File: `common.ts`**
```typescript
// Common helpers used by multiple modules
export const mod289 = /*#__PURE__*/ overloadingFn([...])
export const permute = /*#__PURE__*/ overloadingFn([...])
export const taylorInvSqrt = /*#__PURE__*/ overloadingFn([...])
export const fade = /*#__PURE__*/ Fn(/*...*/)
```

**Usage:**
```typescript
// In other modules
import { mod289, permute, fade } from './common'

export const simplexNoise3d = Fn(([v_immutable]) => {
  const v = vec3(v_immutable).toVar()
  const i = vec3(floor(v.add(dot(v, C.yyy)))).toVar()
  i.assign(mod289(i))  // Use shared helper
  // ...
})
```

**Benefits:**
- Reduces code duplication
- Ensures consistent implementations
- Easier to optimize/update
- Better tree-shaking

### Local Helper Pattern

```typescript
// Inside same file, before main function
const localHelper = /*#__PURE__*/ Fn(([x]) => {
  return x.mul(2.0).add(1.0)
}).setLayout({
  name: 'localHelper',
  type: 'float',
  inputs: [{ name: 'x', type: 'float' }]
})

export const mainFunction = Fn(([input]) => {
  return localHelper(input)
})
```

---

## Performance Patterns

### 1. Use `/*#__PURE__*/` for Tree-Shaking

```typescript
// ✅ GOOD - Enables dead code elimination
export const myFunc = /*#__PURE__*/ Fn(/*...*/)

// ❌ BAD - Cannot be tree-shaken if unused
export const myFunc = Fn(/*...*/)
```

### 2. Minimize Variable Allocations

```typescript
// ✅ GOOD - Reuse variables
const temp = vec3().toVar()
temp.assign(a.add(b))
result.addAssign(temp)

// ❌ BAD - Excessive allocations
const temp1 = vec3(a.add(b)).toVar()
const temp2 = vec3(result.add(temp1)).toVar()
```

### 3. Use In-Place Operations

```typescript
// ✅ GOOD - In-place (faster)
velocity.addAssign(force)
position.mulAssign(dampening)

// ❌ BAD - Creates new values (slower)
velocity = velocity.add(force)
position = position.mul(dampening)
```

### 4. Avoid Redundant Type Conversions

```typescript
// ✅ GOOD - Convert once
const v = vec3(input).toVar()
const result = v.mul(2.0)

// ❌ BAD - Multiple conversions
const v = vec3(input).toVar()
const result = vec3(v).mul(2.0)  // vec3(v) is redundant
```

### 5. Constant Folding

```typescript
// ✅ GOOD - Compute constants at compile time
const C = vec2(1.0 / 6.0, 1.0 / 3.0)  // Computed once
const result = v.add(dot(v, C.yyy))

// ❌ BAD - Recomputed every invocation
const result = v.add(dot(v, vec2(1.0 / 6.0, 1.0 / 3.0).yyy))
```

---

## Documentation Standards

### JSDoc for Complex Functions

```typescript
/**
 * 3D Simplex noise function.
 * 
 * Generates coherent noise values in 3D space using the Simplex algorithm.
 * Faster and has fewer directional artifacts than Perlin noise.
 * 
 * @param v - 3D input coordinate (vec3)
 * @returns Noise value in range [-1, 1] (float)
 * 
 * @example
 * const noiseValue = simplexNoise3d(vec3(x, y, z))
 * material.colorNode = color(noiseValue, noiseValue, noiseValue)
 */
export const simplexNoise3d = /*#__PURE__*/ Fn(/*...*/)
```

### Inline Comments for Complex Logic

```typescript
export const complexFunction = Fn(([input]) => {
  // Step 1: Transform input to grid space
  const gridPos = floor(input.add(offset))
  
  // Step 2: Calculate interpolation weights
  // Using cubic Hermite curve (smoothstep)
  const weights = fade(fract(input))
  
  // Step 3: Sample corners and interpolate
  const corners = sampleCorners(gridPos)
  return mix(corners, weights)
})
```

### File Header Pattern

```typescript
/**
 * Simplex Noise 3D
 * 
 * @author Maxime Heckel
 * @source https://github.com/MaximeHeckel/portfolio
 * @license MIT
 * @version Three.js r170 (ported to r181)
 * 
 * Implementation of Ken Perlin's Simplex Noise algorithm in 3D.
 * Based on Stefan Gustavson's implementation.
 */

import { Fn, vec3, float } from 'three/tsl'

export const simplexNoise3d = /*#__PURE__*/ Fn(/*...*/)
```

---

## Common Pitfalls

### 1. Forgetting `.toVar()` for Mutable Variables

```typescript
// ❌ WRONG - Cannot mutate parameter
export const bad = Fn(([value]) => {
  value.addAssign(1.0)  // ERROR: value is immutable
  return value
})

// ✅ CORRECT
export const good = Fn(([value_immutable]) => {
  const value = float(value_immutable).toVar()
  value.addAssign(1.0)
  return value
})
```

### 2. Mixing JavaScript and TSL Operations

```typescript
// ❌ WRONG - JavaScript math on TSL values
export const bad = Fn(([x]) => {
  const result = x * 2.0 + 1.0  // JavaScript operators
  return result
})

// ✅ CORRECT - Use TSL operations
export const good = Fn(([x]) => {
  const result = x.mul(2.0).add(1.0)
  return result
})
```

### 3. Incorrect Type Conversions

```typescript
// ❌ WRONG - Type mismatch
export const bad = Fn(([v]) => {
  const value = vec3(v).toVar()  // Assumes v is vec3
  return value.length()
})

// ✅ CORRECT - Explicit type in parameter
export const good = Fn(([v_immutable]) => {
  const v = vec3(v_immutable).toVar()  // Explicit conversion
  return v.length()
})
```

### 4. Missing `return` Statement

```typescript
// ❌ WRONG - No return
export const bad = Fn(([x]) => {
  const result = x.mul(2.0)
  // Missing return!
})

// ✅ CORRECT
export const good = Fn(([x]) => {
  return x.mul(2.0)
})
```

### 5. Shadowing Variable Names

```typescript
// ❌ CONFUSING - Variable shadowing
export const bad = Fn(([x]) => {
  const x = vec3(x).toVar()  // Shadows parameter 'x'
  return x
})

// ✅ BETTER - Clear naming
export const good = Fn(([x_immutable]) => {
  const x = vec3(x_immutable).toVar()
  return x
})
```

---

## Migration Checklist

### Pre-Migration Review
- [ ] Identify all parameters (mark as `_immutable`)
- [ ] Locate all variable mutations (add `.toVar()`)
- [ ] Find shared helpers (move to `common.ts`)
- [ ] Check for JavaScript math operators (convert to TSL)
- [ ] Verify return statements exist

### During Migration
- [ ] Update imports (`three/tsl`, `three/webgpu`)
- [ ] Convert `tslFn` → `Fn`
- [ ] Add `/*#__PURE__*/` for exports
- [ ] Add `.setLayout()` if needed
- [ ] Convert parameter names to `_immutable` convention
- [ ] Add `.toVar()` for mutable variables
- [ ] Use in-place operations where possible

### Post-Migration Verification
- [ ] Code compiles without errors
- [ ] Visual output matches original
- [ ] No TypeScript errors (except intentional `@ts-ignore`)
- [ ] Performance is comparable or better
- [ ] Documentation is complete

---

## Quick Reference Card

### Function Declaration
```typescript
export const functionName = /*#__PURE__*/ Fn(([param_immutable]) => {
  const param = type(param_immutable).toVar()
  // logic
  return result
}).setLayout({
  name: 'functionName',
  type: 'returnType',
  inputs: [{ name: 'param', type: 'paramType' }]
})
```

### Common Patterns
```typescript
// Immutable parameter → mutable variable
const x = float(x_immutable).toVar()

// In-place operations
value.addAssign(delta)
value.mulAssign(factor)

// Function composition
const result = func1(func2(input))

// Conditional
const result = cond(condition, trueValue, falseValue)
```

---

**Status**: ✅ Ready for use  
**Last Updated**: November 10, 2025

