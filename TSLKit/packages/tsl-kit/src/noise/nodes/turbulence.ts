import { Fn, Loop, Node, ShaderNodeObject, float, mat2, sin, vec2 } from 'three/tsl';

type TurbulenceInputs = [ShaderNodeObject<Node>, ShaderNodeObject<Node>, ShaderNodeObject<Node>?, ShaderNodeObject<Node>?, ShaderNodeObject<Node>?, ShaderNodeObject<Node>?, ShaderNodeObject<Node>?];

export const turbulence = /*#__PURE__*/ Fn<ShaderNodeObject<Node>>(
  ([pInput, timeInput, numInput = float(10.0), ampInput = float(0.7), speedInput = float(0.3), freqInput = float(2.0), expInput = float(1.4)]: TurbulenceInputs) => {
    const p = vec2(pInput).toVar();
    const time = float(timeInput).toVar();
    const octaveCount = float(numInput).toVar();
    const amp = float(ampInput).toVar();
    const speed = float(speedInput).toVar();
    const freq = float(freqInput).toVar();
    const exponent = float(expInput).toVar();

    const rot = mat2(0.6, -0.8, 0.8, 0.6).toVar();
    const iteration = float(0).toVar();

    Loop({ start: float(0), end: octaveCount, type: 'float' }, () => {
      const phase = freq.mul(p.mul(rot).y).add(speed.mul(time)).add(iteration);
      p.addAssign(amp.mul(rot[0]).mul(sin(phase)).div(freq));
      rot.mulAssign(mat2(0.6, -0.8, 0.8, 0.6));
      freq.mulAssign(exponent);
      iteration.addAssign(1.0);
    });

    return p;
  }
).setLayout({
  name: 'turbulence2d',
  type: 'vec2',
  inputs: [
    { name: 'p', type: 'vec2' },
    { name: 'time', type: 'float' },
    { name: 'octaves', type: 'float' },
    { name: 'amplitude', type: 'float' },
    { name: 'speed', type: 'float' },
    { name: 'frequency', type: 'float' },
    { name: 'exponent', type: 'float' }
  ]
});
