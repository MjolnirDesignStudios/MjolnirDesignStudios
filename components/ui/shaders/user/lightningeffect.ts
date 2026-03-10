import { ShaderConfig } from '../shader-manager';

export const lightningEffect: ShaderConfig = {
  name: 'Lightning',
  description: 'Procedural lightning storm with fractal noise and electric blue hues',
  category: 'energy',
  tier: 'pro',
  vertexShader: `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform float uHue;
    uniform float uXOffset;
    uniform float uSpeed;
    uniform float uIntensity;
    uniform float uSize;

    #define OCTAVE_COUNT 8

    vec3 hsv2rgb(vec3 c) {
      vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,0.0,1.0);
      return c.z * mix(vec3(1.0), rgb, c.y);
    }

    float hash11(float p) {
      p = fract(p * 0.1031);
      p *= p + 33.33;
      p *= p + p;
      return fract(p);
    }

    float hash12(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    mat2 rotate2d(float theta) {
      float c = cos(theta);
      float s = sin(theta);
      return mat2(c, -s, s, c);
    }

    float noise(vec2 p) {
      vec2 ip = floor(p);
      vec2 fp = fract(p);
      float a = hash12(ip);
      float b = hash12(ip + vec2(1.0, 0.0));
      float c = hash12(ip + vec2(0.0, 1.0));
      float d = hash12(ip + vec2(1.0, 1.0));
      vec2 t = smoothstep(0.0, 1.0, fp);
      return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < OCTAVE_COUNT; ++i) {
        value += amplitude * noise(p);
        p *= rotate2d(0.45);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution.xy;
      uv = 2.0 * uv - 1.0;
      uv.x *= uResolution.x / uResolution.y;
      uv.x += uXOffset;

      uv += 2.0 * fbm(uv * uSize + 0.8 * uTime * uSpeed) - 1.0;

      float dist = abs(uv.x);
      vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
      vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(uTime * uSpeed)) / dist, 1.0) * uIntensity;
      col = pow(col, vec3(1.0));
      gl_FragColor = vec4(col, 1.0);
    }
  `,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: [1920, 1080] },
    uHue: { value: 230 }, // Electric blue hue
    uXOffset: { value: 0 },
    uSpeed: { value: 1.0 },
    uIntensity: { value: 1.0 },
    uSize: { value: 1.0 }
  },
  controls: [
    {
      name: 'Hue',
      type: 'range',
      uniform: 'uHue',
      min: 180,
      max: 280,
      step: 1,
      default: 230
    },
    {
      name: 'X Offset',
      type: 'range',
      uniform: 'uXOffset',
      min: -2.0,
      max: 2.0,
      step: 0.1,
      default: 0
    },
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
      default: 1.0
    },
    {
      name: 'Size',
      type: 'range',
      uniform: 'uSize',
      min: 0.5,
      max: 2.0,
      step: 0.1,
      default: 1.0
    }
  ]
};