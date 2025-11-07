import {
  uv,
  Fn,
  instancedArray,
  instanceIndex,
  wgslFn,
  code,
} from 'three/tsl';

export interface RadialParticleInitializer {
  readonly spawnPositionsBuffer: ReturnType<typeof instancedArray>;
  readonly offsetPositionsBuffer: ReturnType<typeof instancedArray>;
  readonly computeNode: unknown;
  readonly positionNode: unknown;
  readonly colorNode: unknown;
  readonly scaleNode: unknown;
}

export function createRadialParticleInitializer(count: number): RadialParticleInitializer {
  const spawnPositionsBuffer = instancedArray(count, 'vec3');
  const offsetPositionsBuffer = instancedArray(count, 'vec3');

  const spawnPosition = spawnPositionsBuffer.element(instanceIndex);
  const offsetPosition = offsetPositionsBuffer.element(instanceIndex);

  const hash = code(`
      fn hash(index: u32) -> f32 {
        return fract(sin(f32(index) * 12.9898) * 43758.5453);
      }
    `);

  const computeInitWgsl = wgslFn(
    `
      fn computeInit(
        spawnPositions: ptr<storage, array<vec3f>, read_write>,
        offsetPositions: ptr<storage, array<vec3f>, read_write>,
        index: u32
      ) -> void {
        let h0 = hash(index);
        let h1 = hash(index + 1u);
        let h2 = hash(index + 2u);

        let distance = sqrt(h0 * 4.0);
        let theta = h1 * 6.28318530718;
        let phi = h2 * 3.14159265359;

        let x = distance * sin(phi) * cos(theta);
        let y = distance * sin(phi) * sin(theta);
        let z = distance * cos(phi);

        spawnPositions[index] = vec3f(x, y, z);
        offsetPositions[index] = vec3f(0.0);
      }
    `,
    [hash],
  );

  const computeNode = computeInitWgsl({
    spawnPositions: spawnPositionsBuffer,
    offsetPositions: offsetPositionsBuffer,
    index: instanceIndex,
  }).compute(count);

  const scaleNode = wgslFn(
    `
      fn scaleNode() -> f32 {
        return randValue(0.01, 0.04, 3u);
      }

      fn randValue(min: f32, max: f32, seed: u32) -> f32 {
        return hash(seed) * (max - min) + min;
      }
    `,
    [hash],
  )();

  const positionNode = Fn(() => {
    const pos = spawnPosition.add(offsetPosition);
    return pos;
  })();

  const particleColor = wgslFn(
    `
      fn colorNode(
        spawnPos: vec3f,
        offsetPos: vec3f,
        uvCoord: vec2f
      ) -> vec4f {
        let color = vec3f(0.24, 0.43, 0.96);
        let distanceToCenter = min(
          distance(spawnPos + offsetPos, vec3f(0.0, 0.0, 0.0)),
          2.75
        );

        let strength = distance(uvCoord, vec2f(0.5));

        let distColor = mix(
          vec3f(0.97, 0.7, 0.45),
          color,
          distanceToCenter * 0.4
        );

        let fillMask = 1.0 - strength * 2.0;
        let finalColor = mix(vec3f(0.0), distColor, fillMask);

        let circle = smoothstep(0.5, 0.49, strength);
        return vec4f(finalColor * circle, 1.0);
      }
    `,
  );

  const colorNode = particleColor({
    spawnPos: spawnPosition,
    offsetPos: offsetPosition,
    uvCoord: uv(),
  });

  return {
    spawnPositionsBuffer,
    offsetPositionsBuffer,
    computeNode,
    positionNode,
    colorNode,
    scaleNode,
  };
}
