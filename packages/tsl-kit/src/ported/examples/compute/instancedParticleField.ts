import { Vector3 } from 'three';
import {
  Fn,
  If,
  uniform,
  float,
  uv,
  vec2,
  vec3,
  hash,
  instancedArray,
  instanceIndex,
} from 'three/tsl';
import { SpriteNodeMaterial } from 'three/webgpu';

export interface InstancedParticleFieldResources {
  readonly particleCount: number;
  readonly positions: ReturnType<typeof instancedArray>;
  readonly velocities: ReturnType<typeof instancedArray>;
  readonly colors: ReturnType<typeof instancedArray>;
  readonly uniforms: {
    readonly gravity: ReturnType<typeof uniform>;
    readonly bounce: ReturnType<typeof uniform>;
    readonly friction: ReturnType<typeof uniform>;
    readonly size: ReturnType<typeof uniform>;
    readonly clickPosition: ReturnType<typeof uniform>;
  };
  readonly computeInit: any;
  readonly computeUpdate: any;
  readonly computeHit: any;
  readonly material: SpriteNodeMaterial;
}

export function createInstancedParticleField(particleCount: number): InstancedParticleFieldResources {
  const positions = instancedArray(particleCount, 'vec3');
  const velocities = instancedArray(particleCount, 'vec3');
  const colors = instancedArray(particleCount, 'vec3');

  const gravity = uniform(-0.00098);
  const bounce = uniform(0.8);
  const friction = uniform(0.99);
  const size = uniform(0.12);
  const clickPosition = uniform(new Vector3());

  const separation = 0.2;
  const amount = Math.sqrt(particleCount);
  const offset = float(amount / 2);

  const computeInit = Fn(() => {
    const position = positions.element(instanceIndex);
    const color = colors.element(instanceIndex);

    const x = instanceIndex.mod(amount);
    const z = instanceIndex.div(amount);

    position.x = offset.sub(x).mul(separation);
    position.z = offset.sub(z).mul(separation);

    const randX = hash(instanceIndex);
    const randY = hash(instanceIndex.add(2));
    const randZ = hash(instanceIndex.add(3));

    color.assign(vec3(randX, randY.mul(0.5), randZ));
  })().compute(particleCount);

  const computeUpdate = Fn(() => {
    const position = positions.element(instanceIndex);
    const velocity = velocities.element(instanceIndex);

    velocity.addAssign(vec3(0.0, gravity, 0.0));
    position.addAssign(velocity);

    velocity.mulAssign(friction);

    If(position.y.lessThan(0), () => {
      position.y = 0;
      velocity.y = velocity.y.negate().mul(bounce);

      velocity.x = velocity.x.mul(0.9);
      velocity.z = velocity.z.mul(0.9);
    });
  });

  const computeUpdateNode = computeUpdate().compute(particleCount);

  const computeHit = Fn(() => {
    const position = positions.element(instanceIndex);
    const velocity = velocities.element(instanceIndex);

    const dist = position.distance(clickPosition);
    const direction = position.sub(clickPosition).normalize();
    const distArea = float(3).sub(dist).max(0);

    const power = distArea.mul(0.01);
    const relativePower = power.mul(hash(instanceIndex).mul(1.5).add(0.5));

    velocity.assign(velocity.add(direction.mul(relativePower)));
  })().compute(particleCount);

  const material = new SpriteNodeMaterial();
  material.colorNode = uv().mul(colors.element(instanceIndex));
  material.positionNode = positions.toAttribute();
  material.scaleNode = size;
  material.alphaTestNode = uv().mul(2).distance(vec2(1));
  material.alphaToCoverage = true;
  material.transparent = false;

  return {
    particleCount,
    positions,
    velocities,
    colors,
    uniforms: {
      gravity,
      bounce,
      friction,
      size,
      clickPosition,
    },
    computeInit,
    computeUpdate: computeUpdateNode,
    computeHit,
    material,
  };
}
