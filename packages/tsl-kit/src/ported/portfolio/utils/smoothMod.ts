import { Fn, PI, atan, cos, float, pow, sin } from 'three/tsl';

export const smoothMod = /*#__PURE__*/ Fn(([axis, amp, rad]: [any, any, any]) => {
  const top = cos(PI.mul(axis.div(amp))).mul(sin(PI.mul(axis.div(amp))));
  const bottom = pow(sin(PI.mul(axis.div(amp))), 2).add(pow(rad, 2));
  const at = atan(top.div(bottom));

  return amp.mul(0.5).sub(float(1).div(PI).mul(at));
}).setLayout({
  name: 'smoothMod',
  type: 'float',
  inputs: [
    { name: 'axis', type: 'float' },
    { name: 'amp', type: 'float' },
    { name: 'rad', type: 'float' },
  ],
});
