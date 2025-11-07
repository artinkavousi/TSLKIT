import { Fn, dot, max, normalize, pow, reflect } from 'three/tsl';

export const directionalLightNode = Fn(
  ([lightColor, lightIntensity, normal, lightPosition, viewDirection, specularPower]: any[]) => {
    const lightDirection = normalize(lightPosition);
    const lightReflection = reflect(lightDirection.negate(), normal);

    const shading = dot(normal, lightDirection).toVar();
    shading.assign(max(0, shading));

    const specular = dot(lightReflection, viewDirection).negate().toVar();
    specular.assign(max(0, specular));
    specular.assign(pow(specular, specularPower));

    return lightColor.mul(lightIntensity).mul(shading.add(specular));
  },
);
