import { ShaderConfig } from '../shader-manager';

export const singularity: ShaderConfig = {
  name: 'Singularity',
  description: 'Cosmic singularity with swirling waves and color-shifting energy fields',
  category: 'cosmic',
  tier: 'base',
  vertexShader: `
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
      vUv = position * 0.5 + 0.5;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform float uSpeed;
    uniform float uIntensity;
    uniform float uSize;
    uniform float uWaveStrength;
    uniform float uColorShift;

    void main() {
      vec2 F = gl_FragCoord.xy;
      float i = 0.2 * uSpeed;
      float a;
      vec2 r = uResolution.xy;
      vec2 p = (F + F - r) / r.y / (0.7 * uSize);
      vec2 d = vec2(-1.0, 1.0);
      vec2 b = p - i * d;
      vec2 c = p * mat2(1.0, 1.0, d / (0.1 + i / dot(b, b)));
      vec2 v = c * mat2(cos(0.5 * log(a = dot(c, c)) + uTime * i * uSpeed + vec4(0.0, 33.0, 11.0, 0.0))) / i;
      vec2 w = vec2(0.0);

      for(float j = 0.0; j < 9.0; j++) {
        i++;
        w += 1.0 + sin(v * uWaveStrength);
        v += 0.7 * sin(v.yx * i + uTime * uSpeed) / i + 0.5;
      }

      i = length(sin(v / 0.3) * 0.4 + c * (3.0 + d));
      vec4 colorGrad = vec4(0.6, -0.4, -1.0, 0.0) * uColorShift;
      vec4 O = 1.0 - exp(-exp(c.x * colorGrad) / w.xyyx / (2.0 + i * i / 4.0 - i) / (0.5 + 1.0 / a) / (0.03 + abs(length(p) - 0.7)) * uIntensity);

      gl_FragColor = O;
    }
  `,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: [1920, 1080] },
    uSpeed: { value: 1.0 },
    uIntensity: { value: 1.2 },
    uSize: { value: 1.1 },
    uWaveStrength: { value: 1.0 },
    uColorShift: { value: 1.0 }
  },
  controls: [
    {
      name: 'Speed',
      type: 'range',
      uniform: 'uSpeed',
      min: 0.1,
      max: 3.0,
      step: 0.1,
      default: 1.0
    },
    {
      name: 'Intensity',
      type: 'range',
      uniform: 'uIntensity',
      min: 0.1,
      max: 3.0,
      step: 0.1,
      default: 1.2
    },
    {
      name: 'Size',
      type: 'range',
      uniform: 'uSize',
      min: 0.5,
      max: 2.0,
      step: 0.1,
      default: 1.1
    },
    {
      name: 'Wave Strength',
      type: 'range',
      uniform: 'uWaveStrength',
      min: 0.1,
      max: 3.0,
      step: 0.1,
      default: 1.0
    },
    {
      name: 'Color Shift',
      type: 'range',
      uniform: 'uColorShift',
      min: 0.1,
      max: 2.0,
      step: 0.1,
      default: 1.0
    }
  ]
};