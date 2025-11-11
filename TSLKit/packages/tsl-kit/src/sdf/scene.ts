import {
  Break,
  If,
  Loop,
  Node,
  ShaderNodeObject,
  float,
  getCurrentStack,
  stack,
  vec2,
  vec3
} from 'three/tsl';

type Vec3Node = ShaderNodeObject<Node>;
type FloatNode = ShaderNodeObject<Node>;

export interface RaymarchShadingContext {
  readonly origin: Vec3Node;
  readonly direction: Vec3Node;
  readonly position: Vec3Node;
  readonly normal: Vec3Node;
  readonly distance: FloatNode;
  readonly steps: FloatNode;
  readonly hitMask: FloatNode;
}

export type RaymarchDistanceFunction = (position: Vec3Node) => FloatNode;
export type RaymarchShadingFunction = (context: RaymarchShadingContext) => Vec3Node;

export interface RaymarchSceneConfig {
  readonly sdf: RaymarchDistanceFunction;
  readonly rayOrigin?: Vec3Node;
  readonly rayDirection?: Vec3Node;
  readonly maxSteps?: number;
  readonly maxDistance?: number;
  readonly epsilon?: number;
  readonly normalEpsilon?: number;
  readonly shading?: RaymarchShadingFunction;
}

export interface RaymarchSceneResult {
  readonly color: Vec3Node;
  readonly position: Vec3Node;
  readonly normal: Vec3Node;
  readonly distance: FloatNode;
  readonly steps: FloatNode;
  readonly hitMask: FloatNode;
  readonly origin: Vec3Node;
  readonly direction: Vec3Node;
}

const DEFAULT_SHADING: RaymarchShadingFunction = ({ hitMask }) => vec3(hitMask);

export function raymarchScene(config: RaymarchSceneConfig): RaymarchSceneResult {
  if (!getCurrentStack()) {
    const origin = vec3(config.rayOrigin ?? vec3(0.0, 0.0, -3.0)).toVar();
    const direction = vec3(config.rayDirection ?? vec3(0.0, 0.0, 1.0)).normalize().toVar();
    const distance = float(0.0).toVar();
    const steps = float(0.0).toVar();
    const hitMask = float(0.0).toVar();
    const position = vec3(0.0).toVar();
    const normal = vec3(0.0, 0.0, 1.0).toVar();

    const shading = config.shading ?? DEFAULT_SHADING;
    const color = shading({
      origin,
      direction,
      position,
      normal,
      distance,
      steps,
      hitMask
    });

    return {
      color,
      position,
      normal,
      distance,
      steps,
      hitMask,
      origin,
      direction
    };
  }

  let result: RaymarchSceneResult | undefined;

  stack(() => {
  const maxSteps = config.maxSteps ?? 96;
  const maxDistance = float(config.maxDistance ?? 100.0);
  const epsilon = float(config.epsilon ?? 0.001);
  const normalEpsilon = float(config.normalEpsilon ?? 0.0005);

  const origin = vec3(config.rayOrigin ?? vec3(0.0, 0.0, -3.0)).toVar();
  const direction = vec3(config.rayDirection ?? vec3(0.0, 0.0, 1.0)).normalize().toVar();

  const distanceFn = config.sdf;

  const totalDistance = float(0).toVar();
  const steps = float(0).toVar();
  const hitMask = float(0).toVar();
  const ray = vec3(origin).toVar();

  Loop({ start: 0, end: maxSteps }, () => {
    const distance = float(distanceFn(ray)).toVar();
    steps.addAssign(1.0);

    totalDistance.addAssign(distance);
    const nextPosition = vec3(origin.add(direction.mul(totalDistance))).toVar();

    If(distance.lessThan(epsilon), () => {
      hitMask.assign(1.0);
      ray.assign(nextPosition);
      Break();
    });

    ray.assign(nextPosition);

    If(totalDistance.greaterThan(maxDistance), () => {
      Break();
    });
  });

  const position = vec3(ray).toVar();
  const normal = vec3(0.0).toVar();

  If(hitMask.greaterThan(0.5), () => {
    const h = vec2(normalEpsilon, 0.0).toVar();
    const offset1 = float(distanceFn(vec3(position.add(vec3(h.x, h.y, h.y)))));
    const offset1Neg = float(distanceFn(vec3(position.sub(vec3(h.x, h.y, h.y)))));
    const offset2 = float(distanceFn(vec3(position.add(vec3(h.y, h.x, h.y)))));
    const offset2Neg = float(distanceFn(vec3(position.sub(vec3(h.y, h.x, h.y)))));
    const offset3 = float(distanceFn(vec3(position.add(vec3(h.y, h.y, h.x)))));
    const offset3Neg = float(distanceFn(vec3(position.sub(vec3(h.y, h.y, h.x)))));

    const normalVector = vec3(
      offset1.sub(offset1Neg),
      offset2.sub(offset2Neg),
      offset3.sub(offset3Neg)
    ).normalize();

    normal.assign(normalVector);
  });

  const shading = config.shading ?? DEFAULT_SHADING;
  const color = shading({
    origin,
    direction,
    position,
    normal,
    distance: totalDistance,
    steps,
    hitMask
  });

    result = {
      color,
      position,
      normal,
      distance: totalDistance,
      steps,
      hitMask,
      origin,
      direction
    };
  });

  if (!result) {
    throw new Error('Failed to construct raymarch scene.');
  }

  return result;
}
