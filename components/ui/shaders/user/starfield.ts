import { ShaderConfig } from '../shader-manager';

export const starField: ShaderConfig = {
  name: 'Star Field',
  description: 'Volumetric star field with mouse-controlled rotation and golden hues',
  category: 'space',
  premium: true,
  tier: 'pro',
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
    uniform vec2 uMouse;
    uniform vec3 uHSV;
    uniform float uSpeed;

    #define iterations 17
    #define formuparam 0.53
    #define volsteps 20
    #define stepsize 0.1
    #define zoom 0.800
    #define tile 0.850
    #define brightness 0.0015
    #define darkmatter 0.300
    #define distfading 0.730
    #define saturation 0.850

    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution.xy - 0.5;
      uv.y *= uResolution.y / uResolution.x;
      vec3 dir = vec3(uv * zoom, 1.);

      float time = uTime * uSpeed + 0.25;

      float a1 = 0.5 + uMouse.x * 2.0;
      float a2 = 0.8 + uMouse.y * 2.0;
      mat2 rot1 = mat2(cos(a1), sin(a1), -sin(a1), cos(a1));
      mat2 rot2 = mat2(cos(a2), sin(a2), -sin(a2), cos(a2));
      dir.xz *= rot1;
      dir.xy *= rot2;
      vec3 from = vec3(1., 0.5, 0.5);
      from += vec3(time * 2., time, -2.);
      from.xz *= rot1;
      from.xy *= rot2;

      float s = 0.1, fade = 1.;
      vec3 v = vec3(0.);
      for (int r = 0; r < volsteps; r++) {
        vec3 p = from + s * dir * 0.5;
        p = abs(vec3(tile) - mod(p, vec3(tile * 2.)));
        float pa, a = pa = 0.;
        for (int i = 0; i < iterations; i++) {
          p = abs(p) / dot(p, p) - formuparam;
          a += abs(length(p) - pa);
          pa = length(p);
        }

        float dm = max(0., darkmatter - a * a * 0.001);
        a *= a * a;
        if (r > 6) fade *= 1. - dm;
        v += fade;
        v += vec3(s, s * s, s * s * s * s) * a * brightness * fade;
        fade *= distfading;
        s += stepsize;
      }
      v = mix(vec3(length(v)), v, saturation);

      vec3 rgb = hsv2rgb(uHSV);
      gl_FragColor = vec4(v * 0.01 * rgb, 1.0);
    }
  `,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: [1920, 1080] },
    uMouse: { value: [0.5, 0.5] },
    uHSV: { value: [40/360, 1.0, 1.0] }, // Golden-orange hue
    uSpeed: { value: 1.0 }
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
      name: 'Hue',
      type: 'range',
      uniform: 'uHSV',
      min: 0,
      max: 360,
      step: 1,
      default: 40,
      component: 0 // HSV[0] is hue
    },
    {
      name: 'Saturation',
      type: 'range',
      uniform: 'uHSV',
      min: 0,
      max: 1,
      step: 0.01,
      default: 1.0,
      component: 1 // HSV[1] is saturation
    },
    {
      name: 'Brightness',
      type: 'range',
      uniform: 'uHSV',
      min: 0,
      max: 1,
      step: 0.01,
      default: 1.0,
      component: 2 // HSV[2] is brightness
    }
  ]
};