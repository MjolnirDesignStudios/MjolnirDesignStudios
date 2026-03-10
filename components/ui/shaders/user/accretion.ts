import { ShaderConfig } from '../shader-manager';

export const accretion: ShaderConfig = {
  name: 'Accretion Disk',
  description: 'Volumetric accretion disk with swirling gas clouds and dynamic turbulence',
  category: 'cosmic',
  tier: 'pro',
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform float uSpeed;
    uniform float uTurbulence;
    uniform float uDepth;
    uniform float uBrightness;
    uniform float uColorShift;
    varying vec2 vUv;

    vec4 tanhApprox(vec4 x) {
      vec4 x2 = x * x;
      return x * (3.0 + x2) / (3.0 + 3.0 * x2);
    }

    void main() {
      vec2 fragCoord = vUv * uResolution;
      vec2 I = fragCoord;

      float z = 0.0, d, i = 0.0;
      vec4 O = vec4(0.0);

      for(float step = 0.0; step < 20.0; step++) {
        i = step;
        vec3 p = z * normalize(vec3(I + I, 0) - uResolution.xyy) + 0.1 * uDepth;
        p = vec3(atan(p.y / 0.2, p.x) * 2.0, p.z / 3.0, length(p.xy) - 5.0 - z * 0.2);

        for(float turb = 0.0; turb < 7.0; turb++) {
          p += sin(p.yzx * (turb + 1.0) + uTime * uSpeed + 0.3 * i * uTurbulence) / (turb + 1.0);
        }

        d = length(vec4(0.4 * cos(p) - 0.4, p.z));
        z += d;

        vec4 color = (1.0 + cos(p.x + i * 0.4 + z + vec4(6, 1, 2, 0) * uColorShift)) / d;
        O += color * uBrightness;
      }

      O = tanhApprox(O * O / 400.0);
      gl_FragColor = O;
    }
  `,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: [1920, 1080] },
    uSpeed: { value: 1.0 },
    uTurbulence: { value: 1.2 },
    uDepth: { value: 1.0 },
    uBrightness: { value: 1.1 },
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
      name: 'Turbulence',
      type: 'range',
      uniform: 'uTurbulence',
      min: 0.1,
      max: 3.0,
      step: 0.1,
      default: 1.2
    },
    {
      name: 'Depth',
      type: 'range',
      uniform: 'uDepth',
      min: 0.1,
      max: 2.0,
      step: 0.1,
      default: 1.0
    },
    {
      name: 'Brightness',
      type: 'range',
      uniform: 'uBrightness',
      min: 0.1,
      max: 3.0,
      step: 0.1,
      default: 1.1
    },
    {
      name: 'Color Shift',
      type: 'range',
      uniform: 'uColorShift',
      min: 0.0,
      max: 2.0,
      step: 0.1,
      default: 1.0
    }
  ]
};