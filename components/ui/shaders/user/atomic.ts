import { ShaderConfig } from '../shader-manager';

export const atomic: ShaderConfig = {
  name: 'Atomic Nucleus',
  description: 'Premium nuclear reactor effect with core, plasma tendrils, orbital particles, and nebula mist',
  category: 'energy',
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
    uniform float uCoreIntensity;
    uniform float uCoreSpeed;
    uniform float uCorePulse;
    uniform float uShellIntensity;
    uniform float uShellSpeed;
    uniform float uTendrilCount;
    uniform float uTendrilIntensity;
    uniform float uParticleCount;
    uniform float uParticleSpeed;
    uniform float uMistDensity;
    uniform float uBreathing;
    uniform vec3 uCoreColor1;
    uniform vec3 uCoreColor2;
    uniform vec3 uShellColor1;
    uniform vec3 uShellColor2;
    varying vec2 vUv;

    const float PI = 3.14159265359;
    const float TAU = 6.28318530718;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), f.x),
                 mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
    }

    float fbm(vec2 p) {
      float a = 0.5, f = 4.0, n = 0.0;
      for(int i = 0; i < 5; i++) {
        n += a * noise(p * f);
        a *= 0.5;
        f *= 2.0;
      }
      return n;
    }

    vec3 nuclearCore(vec2 uv, float t) {
      float d = length(uv);
      float pulse = sin(t * uCoreSpeed * 10.0 + d * 20.0) * 0.5 + 0.5;
      float turb = fbm(uv * 15.0 + t * uCoreSpeed * 3.0 + pulse * 6.0);
      float core = smoothstep(0.28, 0.0, d) * turb * pulse * uCoreIntensity;

      vec3 col = mix(uCoreColor1, uCoreColor2, smoothstep(0.0, 0.28, d));
      return col * core * 8.0 + col * pulse * uCorePulse;
    }

    vec3 plasmaTendrils(vec2 uv, float t) {
      vec3 col = vec3(0.0);
      float count = uTendrilCount;
      for(int i = 0; i < 16; i++) {
        if (float(i) >= count) break;
        float fi = float(i) / count;
        float a = fi * TAU + t * 0.9;
        vec2 dir = vec2(cos(a), sin(a));
        vec2 p = uv - dir * 0.12;
        float n = fbm(p * 10.0 + t * 0.7);
        float d = length(p);
        float tendril = smoothstep(0.35, 0.1, d) * n * (1.0 - fi * 0.5);
        vec3 hue = mix(vec3(1.0, 0.7, 0.3), vec3(0.6, 0.3, 1.0), fi);
        col += hue * tendril * uTendrilIntensity;
      }
      return col;
    }

    vec3 energyShell(vec2 uv, float t) {
      float d = length(uv);
      float a = atan(uv.y, uv.x);
      float spiral = sin(a * 14.0 - t * uShellSpeed * 5.0 + d * 18.0) * 0.5 + 0.5;
      float shell = (smoothstep(0.38, 0.36, d) - smoothstep(0.50, 0.52, d));
      shell *= spiral;

      vec3 col = mix(uShellColor1, uShellColor2, sin(a * 4.0 + t) * 0.5 + 0.5);
      return col * shell * uShellIntensity * 4.0;
    }

    vec3 orbitalParticles(vec2 uv, float t) {
      vec3 col = vec3(0.0);
      float count = uParticleCount;
      for(int i = 0; i < 100; i++) {
        if (float(i) >= count) break;
        float fi = float(i) / count;
        float a = fi * TAU + t * uParticleSpeed;
        float r = 0.32 + sin(fi * 12.0 + t) * 0.18;
        vec2 pos = vec2(cos(a), sin(a)) * r;
        float d = length(uv - pos);
        float p = smoothstep(0.03, 0.008, d) * (0.6 + sin(t * 12.0 + fi * 25.0) * 0.4);
        vec3 hue = mix(vec3(0.8, 0.4, 1.0), vec3(0.3, 0.7, 1.0), fi);
        col += hue * p * 2.5;
      }
      return col;
    }

    vec3 nebulaMist(vec2 uv, float t) {
      vec2 p = uv * 5.0 + vec2(t * 0.04, t * 0.02);
      float n = fbm(p) + fbm(p * 2.0 + t * 0.1) * 0.5 + fbm(p * 4.0 + t * 0.2) * 0.25;
      float mist = pow(n, 3.0) * uMistDensity;
      return mix(vec3(0.1, 0.0, 0.3), vec3(0.2, 0.1, 0.6), n) * mist;
    }

    void main() {
      vec2 uv = vUv - 0.5;
      uv /= vec2(uResolution.y / uResolution.x, 1.0);
      uv *= 1.0 + sin(uTime * 0.4) * uBreathing * 0.1;

      float t = uTime * 0.9;
      vec3 color = vec3(0.0);

      color += nebulaMist(uv, t);
      color += orbitalParticles(uv, t);
      color += plasmaTendrils(uv, t);
      color += energyShell(uv, t);
      color += nuclearCore(uv, t);

      // Premium enhancement: Add energy glow and chromatic aberration
      float glow = exp(-length(uv) * 2.0) * 0.3;
      color += vec3(0.8, 0.4, 1.0) * glow;

      // Chromatic aberration effect
      vec2 caOffset = uv * 0.01;
      color.r += texture2D(uTexture, vUv + caOffset).r * 0.1;
      color.b += texture2D(uTexture, vUv - caOffset).b * 0.1;

      gl_FragColor = vec4(color, 1.0);
    }
  `,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: [1920, 1080] },
    uCoreIntensity: { value: 1.0 },
    uCoreSpeed: { value: 1.0 },
    uCorePulse: { value: 1.0 },
    uShellIntensity: { value: 1.0 },
    uShellSpeed: { value: 1.0 },
    uTendrilCount: { value: 12 },
    uTendrilIntensity: { value: 1.0 },
    uParticleCount: { value: 80 },
    uParticleSpeed: { value: 1.0 },
    uMistDensity: { value: 0.3 },
    uBreathing: { value: 1.0 },
    uCoreColor1: { value: [1.0, 1.0, 1.0] }, // #ffffff
    uCoreColor2: { value: [1.0, 0.58, 0.0] }, // #ff8c00
    uShellColor1: { value: [0.53, 0.0, 1.0] }, // #8b00ff
    uShellColor2: { value: [0.0, 0.82, 1.0] }  // #00d0ff
  },
  controls: [
    {
      name: 'Core Intensity',
      type: 'range',
      uniform: 'uCoreIntensity',
      min: 0.1,
      max: 3.0,
      step: 0.1,
      default: 1.0
    },
    {
      name: 'Core Speed',
      type: 'range',
      uniform: 'uCoreSpeed',
      min: 0.1,
      max: 3.0,
      step: 0.1,
      default: 1.0
    },
    {
      name: 'Core Pulse',
      type: 'range',
      uniform: 'uCorePulse',
      min: 0.1,
      max: 2.0,
      step: 0.1,
      default: 1.0
    },
    {
      name: 'Shell Intensity',
      type: 'range',
      uniform: 'uShellIntensity',
      min: 0.1,
      max: 3.0,
      step: 0.1,
      default: 1.0
    },
    {
      name: 'Shell Speed',
      type: 'range',
      uniform: 'uShellSpeed',
      min: 0.1,
      max: 3.0,
      step: 0.1,
      default: 1.0
    },
    {
      name: 'Tendril Count',
      type: 'range',
      uniform: 'uTendrilCount',
      min: 4,
      max: 16,
      step: 1,
      default: 12
    },
    {
      name: 'Tendril Intensity',
      type: 'range',
      uniform: 'uTendrilIntensity',
      min: 0.1,
      max: 3.0,
      step: 0.1,
      default: 1.0
    },
    {
      name: 'Particle Count',
      type: 'range',
      uniform: 'uParticleCount',
      min: 20,
      max: 100,
      step: 5,
      default: 80
    },
    {
      name: 'Particle Speed',
      type: 'range',
      uniform: 'uParticleSpeed',
      min: 0.1,
      max: 3.0,
      step: 0.1,
      default: 1.0
    },
    {
      name: 'Mist Density',
      type: 'range',
      uniform: 'uMistDensity',
      min: 0.0,
      max: 1.0,
      step: 0.1,
      default: 0.3
    },
    {
      name: 'Breathing',
      type: 'range',
      uniform: 'uBreathing',
      min: 0.0,
      max: 2.0,
      step: 0.1,
      default: 1.0
    },
    {
      name: 'Core Color 1',
      type: 'color',
      uniform: 'uCoreColor1',
      default: '#ffffff'
    },
    {
      name: 'Core Color 2',
      type: 'color',
      uniform: 'uCoreColor2',
      default: '#ff8c00'
    },
    {
      name: 'Shell Color 1',
      type: 'color',
      uniform: 'uShellColor1',
      default: '#8b00ff'
    },
    {
      name: 'Shell Color 2',
      type: 'color',
      uniform: 'uShellColor2',
      default: '#00d0ff'
    }
  ]
};