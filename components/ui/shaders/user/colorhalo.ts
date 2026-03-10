import { ShaderConfig } from '../shader-manager';

export const colorHalo: ShaderConfig = {
  name: 'Color Halo',
  description: 'Colorful warp effect with swirling chromatic aberration and dynamic halos',
  category: 'abstract',
  premium: true,
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
    uniform vec2 uMouse;
    uniform float uSpeed;
    uniform float uScale;
    uniform float uIntensity;
    uniform float uWarpStrength;
    uniform float uColorShift;
    uniform float uHaloDensity;
    uniform float uRotationSpeed;
    uniform float uDistortion;
    uniform vec3 uBaseColor;
    uniform float uFade;
    varying vec2 vUv;

    const float PI = 3.14159265359;
    const float TWO_PI = 6.28318530718;

    vec3 palette(float t) {
      vec3 a = vec3(0.5, 0.5, 0.5);
      vec3 b = vec3(0.5, 0.5, 0.5);
      vec3 c = vec3(1.0, 1.0, 1.0);
      vec3 d = vec3(0.263, 0.416, 0.557);
      return a + b * cos(TWO_PI * (c * t + d));
    }

    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      for(int i = 0; i < 5; i++) {
        value += amplitude * noise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      return value;
    }

    vec2 rotate(vec2 p, float angle) {
      float s = sin(angle);
      float c = cos(angle);
      return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
    }

    void main() {
      vec2 uv = (vUv - 0.5) * 2.0;
      vec2 mouse = (uMouse / uResolution - 0.5) * 2.0;

      float time = uTime * uSpeed;

      // Create multiple rotating layers
      vec2 p1 = rotate(uv, time * uRotationSpeed);
      vec2 p2 = rotate(uv, -time * uRotationSpeed * 0.7);
      vec2 p3 = rotate(uv, time * uRotationSpeed * 1.3);

      // Scale and distort
      p1 *= uScale;
      p2 *= uScale * 1.2;
      p3 *= uScale * 0.8;

      // Add mouse interaction
      p1 += mouse * uDistortion;
      p2 += mouse * uDistortion * 0.8;
      p3 += mouse * uDistortion * 1.2;

      // Generate noise patterns
      float n1 = fbm(p1 + time * 0.5);
      float n2 = fbm(p2 - time * 0.3);
      float n3 = fbm(p3 + time * 0.7);

      // Create halo effects
      float dist = length(uv);
      float halo1 = 1.0 / (1.0 + dist * uHaloDensity);
      float halo2 = 1.0 / (1.0 + dist * uHaloDensity * 1.5);
      float halo3 = 1.0 / (1.0 + dist * uHaloDensity * 0.7);

      // Combine layers with warping
      float warp1 = sin(n1 * PI + time) * uWarpStrength;
      float warp2 = cos(n2 * PI - time * 0.8) * uWarpStrength;
      float warp3 = sin(n3 * PI + time * 1.2) * uWarpStrength;

      vec3 color1 = palette(n1 + warp1 + uColorShift);
      vec3 color2 = palette(n2 + warp2 + uColorShift * 1.3);
      vec3 color3 = palette(n3 + warp3 + uColorShift * 0.7);

      // Apply halos and intensity
      color1 *= halo1 * uIntensity;
      color2 *= halo2 * uIntensity * 0.8;
      color3 *= halo3 * uIntensity * 1.2;

      // Blend layers
      vec3 finalColor = color1 + color2 + color3;

      // Add base color tint
      finalColor = mix(finalColor, uBaseColor, 0.3);

      // Apply fade
      finalColor *= uFade;

      // Add vignette
      float vignette = 1.0 - smoothstep(0.5, 1.5, dist);
      finalColor *= vignette;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: [1920, 1080] },
    uMouse: { value: [960, 540, 0, 0] },
    uSpeed: { value: 1.0 },
    uScale: { value: 2.0 },
    uIntensity: { value: 1.5 },
    uWarpStrength: { value: 0.5 },
    uColorShift: { value: 0.0 },
    uHaloDensity: { value: 2.0 },
    uRotationSpeed: { value: 0.5 },
    uDistortion: { value: 0.3 },
    uBaseColor: { value: [0.5, 0.8, 1.0] },
    uFade: { value: 1.0 }
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
      name: 'Scale',
      type: 'range',
      uniform: 'uScale',
      min: 0.5,
      max: 5.0,
      step: 0.1,
      default: 2.0
    },
    {
      name: 'Intensity',
      type: 'range',
      uniform: 'uIntensity',
      min: 0.1,
      max: 3.0,
      step: 0.1,
      default: 1.5
    },
    {
      name: 'Warp Strength',
      type: 'range',
      uniform: 'uWarpStrength',
      min: 0.0,
      max: 1.0,
      step: 0.1,
      default: 0.5
    },
    {
      name: 'Color Shift',
      type: 'range',
      uniform: 'uColorShift',
      min: 0.0,
      max: 1.0,
      step: 0.1,
      default: 0.0
    },
    {
      name: 'Halo Density',
      type: 'range',
      uniform: 'uHaloDensity',
      min: 0.5,
      max: 5.0,
      step: 0.1,
      default: 2.0
    },
    {
      name: 'Rotation Speed',
      type: 'range',
      uniform: 'uRotationSpeed',
      min: 0.0,
      max: 2.0,
      step: 0.1,
      default: 0.5
    },
    {
      name: 'Distortion',
      type: 'range',
      uniform: 'uDistortion',
      min: 0.0,
      max: 1.0,
      step: 0.1,
      default: 0.3
    },
    {
      name: 'Base Color',
      type: 'color',
      uniform: 'uBaseColor',
      default: '#80C0FF'
    },
    {
      name: 'Fade',
      type: 'range',
      uniform: 'uFade',
      min: 0.0,
      max: 1.0,
      step: 0.1,
      default: 1.0
    }
  ]
};