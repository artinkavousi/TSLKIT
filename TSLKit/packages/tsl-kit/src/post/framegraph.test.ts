import { describe, expect, it } from 'vitest';
import { PerspectiveCamera, Scene } from 'three';
import { float, vec3, vec4 } from 'three/tsl';
import { createScenePassTargets, buildPostFramegraph } from './framegraph.js';
import type { FramegraphInputs } from './types.js';
import {
  bloomEffect,
  depthOfFieldEffect,
  gtaoEffect,
  ssgiEffect,
  ssrEffect,
  taaEffect
} from './effects/index.js';

const createBaseInputs = (scene: Scene, camera: PerspectiveCamera): FramegraphInputs => {
  const targets = createScenePassTargets(scene, camera);

  return {
    color: targets.color,
    depth: targets.depth ?? float(1),
    viewZ: targets.viewZ ?? float(1),
    normal: vec3(0, 0, 1),
    velocity: vec4(0, 0, 0, 0),
    metalness: float(0.5),
    roughness: float(0.2)
  };
};

describe('post framegraph', () => {
  it('generates a chained WebGPU plan', () => {
    const scene = new Scene();
    const camera = new PerspectiveCamera();
    camera.position.z = 5;

    const inputs = createBaseInputs(scene, camera);

    const plan = buildPostFramegraph(
      inputs,
      [
        { effect: bloomEffect, preset: 'cinematic' },
        { effect: depthOfFieldEffect, options: { focusDistance: 400, focalLength: 50, bokehScale: 2 } },
        { effect: gtaoEffect, preset: 'balanced' },
        { effect: ssgiEffect, preset: 'balanced' },
        { effect: ssrEffect, preset: 'balanced' },
        { effect: taaEffect, preset: 'balanced' }
      ],
      {
        renderer: 'webgpu',
        scene,
        camera,
        capabilities: {
          maxSamples: 8,
          supportsHalfFloat: true,
          supportsHistoryBuffer: true
        }
      }
    );

    expect(plan.passes).toMatchInlineSnapshot(`
      [
        {
          "effect": "bloom",
          "options": {
            "anamorphicSamples": 32,
            "anamorphicScale": 3,
            "mode": "standard",
            "radius": 0.1,
            "strength": 0.3,
            "threshold": 0.2,
          },
          "quality": "native",
          "renderer": "webgpu",
        },
        {
          "effect": "depthOfField",
          "options": {
            "bokehScale": 2,
            "focalLength": 50,
            "focusDistance": 400,
          },
          "quality": "native",
          "renderer": "webgpu",
        },
        {
          "effect": "gtao",
          "options": {
            "distanceExponent": 1,
            "distanceFallOff": 1,
            "radius": 0.6,
            "samples": 20,
            "scale": 1,
            "thickness": 1,
          },
          "quality": "native",
          "renderer": "webgpu",
        },
        {
          "effect": "ssgi",
          "options": {
            "aoIntensity": 1,
            "giIntensity": 6,
            "radius": 12,
            "screenSpaceOnly": true,
            "sliceCount": 2,
            "stepCount": 12,
          },
          "quality": "native",
          "renderer": "webgpu",
        },
        {
          "effect": "ssr",
          "options": {
            "blurQuality": 1,
            "intensity": 1,
            "maxDistance": 12,
            "quality": 0.75,
            "thickness": 0.15,
          },
          "quality": "native",
          "renderer": "webgpu",
        },
        {
          "effect": "taa",
          "options": {
            "blend": 0.9,
            "clampRadius": 0.05,
          },
          "quality": "native",
          "renderer": "webgpu",
        },
      ]
    `);
  });

  it('degrades gracefully on WebGL fallbacks', () => {
    const scene = new Scene();
    const camera = new PerspectiveCamera();
    camera.position.z = 5;

    const inputs = createBaseInputs(scene, camera);

    const plan = buildPostFramegraph(
      inputs,
      [
        { effect: bloomEffect, preset: 'anamorphic' },
        { effect: depthOfFieldEffect, options: { focusDistance: 400, focalLength: 50, bokehScale: 2 } },
        { effect: gtaoEffect, preset: 'cinematic' },
        { effect: ssgiEffect, preset: 'cinematic' },
        { effect: ssrEffect, preset: 'highQuality' },
        { effect: taaEffect, preset: 'cinematic' }
      ],
      {
        renderer: 'webgl',
        scene,
        camera,
        capabilities: {
          maxSamples: 4,
          supportsHalfFloat: false,
          supportsHistoryBuffer: false
        }
      }
    );

    expect(plan.passes).toMatchInlineSnapshot(`
      [
        {
          "effect": "bloom",
          "notes": [
            "Half-float buffers unavailable; radius clamped for WebGL.",
            "Anamorphic bloom disabled on fallback backend.",
          ],
          "options": {
            "anamorphicSamples": 48,
            "anamorphicScale": 3.5,
            "mode": "standard",
            "radius": 0.2,
            "strength": 0.85,
            "threshold": 0.8,
          },
          "quality": "fallback",
          "renderer": "webgl",
        },
        {
          "effect": "depthOfField",
          "notes": [
            "Half-float buffers unavailable; clamping bokeh scale for WebGL.",
          ],
          "options": {
            "bokehScale": 1.2,
            "focalLength": 50,
            "focusDistance": 400,
          },
          "quality": "fallback",
          "renderer": "webgl",
        },
        {
          "effect": "gtao",
          "notes": [
            "WebGL fallback limits samples and radius for stable SSAO.",
          ],
          "options": {
            "distanceExponent": 1.2,
            "distanceFallOff": 1,
            "radius": 0.5,
            "samples": 12,
            "scale": 1.1,
            "thickness": 1.2,
          },
          "quality": "fallback",
          "renderer": "webgl",
        },
        {
          "effect": "ssgi",
          "notes": [
            "WebGL fallback enforces screen-space sampling and fewer steps.",
          ],
          "options": {
            "aoIntensity": 1.2,
            "giIntensity": 10,
            "radius": 18,
            "screenSpaceOnly": true,
            "sliceCount": 2,
            "stepCount": 10,
          },
          "quality": "fallback",
          "renderer": "webgl",
        },
        {
          "effect": "ssr",
          "notes": [
            "WebGL fallback reduces SSR quality and blur refinement.",
          ],
          "options": {
            "blurQuality": 0.5,
            "intensity": 1.2,
            "maxDistance": 18,
            "quality": 0.5,
            "thickness": 0.2,
          },
          "quality": "fallback",
          "renderer": "webgl",
        },
        {
          "effect": "taa",
          "notes": [
            "History buffers are unavailable; returning unfiltered color.",
          ],
          "options": {
            "blend": 0.92,
            "clampRadius": 0.04,
          },
          "quality": "fallback",
          "renderer": "webgl",
        },
      ]
    `);
  });
});
