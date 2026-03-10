import { ShaderConfig } from '../shader-manager';

export const silkyLines: ShaderConfig = {
  name: 'Silky Lines',
  description: 'Flowing silky lines with mouse interaction and organic wave patterns',
  category: 'organic',
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
    uniform vec3 uColor;
    uniform float uAmplitude;
    uniform float uDistance;
    uniform vec2 uMouse;
    uniform float uSpeed;

    #define PI 3.1415926538
    const int LINE_COUNT = 60;
    const float LINE_WIDTH = 1.2;
    const float LINE_BLUR = 3.0;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), f.x),
                 mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
    }

    float lineFn(vec2 uv, float index, vec2 mouse, float time) {
      float p = index / float(LINE_COUNT);
      float offset = (p - 0.5) * uDistance * 0.9;

      float mouseInfluence = length(uv - mouse) < 0.4 ? (1.0 - length(uv - mouse) / 0.4) : 0.0;

      float wave = sin(uv.x * 12.0 + time * uSpeed * 0.12 + p * 15.0) * 0.02;
      wave += noise(vec2(uv.x * 8.0 + time * uSpeed * 0.08, p * 30.0)) * 0.03;
      wave += mouseInfluence * uAmplitude * 0.25;

      float y = 0.5 + offset + wave * uAmplitude * 0.8;
      float dist = abs(uv.y - y);

      float width = LINE_WIDTH / uResolution.y * (1.0 - p * 0.7);
      float blur = LINE_BLUR / uResolution.y * (1.0 + mouseInfluence * 2.0);

      float alpha = smoothstep(width + blur, width - blur, dist);
      alpha *= (1.0 - p * 0.4);
      alpha *= 0.8 + mouseInfluence * 0.6;

      return alpha;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution.xy;
      vec3 color = vec3(0.0);
      float alpha = 0.0;

      for (int i = 0; i < 60; i++) {
        float strength = lineFn(uv, float(i), uMouse, uTime);
        color += uColor * strength;
        alpha += strength;
      }

      gl_FragColor = vec4(color, alpha);
    }
  `,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: [1920, 1080] },
    uColor: { value: [0.753, 0.518, 0.988] }, // #c084fc
    uAmplitude: { value: 1.0 },
    uDistance: { value: 1.1 },
    uMouse: { value: [0.5, 0.5] },
    uSpeed: { value: 0.4 }
  },
  controls: [
    {
      name: 'Amplitude',
      type: 'range',
      uniform: 'uAmplitude',
      min: 0.1,
      max: 3.0,
      step: 0.1,
      default: 1.0
    },
    {
      name: 'Distance',
      type: 'range',
      uniform: 'uDistance',
      min: 0.5,
      max: 2.0,
      step: 0.1,
      default: 1.1
    },
    {
      name: 'Speed',
      type: 'range',
      uniform: 'uSpeed',
      min: 0.1,
      max: 2.0,
      step: 0.1,
      default: 0.4
    },
    {
      name: 'Line Color',
      type: 'color',
      uniform: 'uColor',
      default: '#c084fc'
    }
  ]
};