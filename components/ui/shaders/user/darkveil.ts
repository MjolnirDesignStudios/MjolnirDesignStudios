import { ShaderConfig } from '../shader-manager';

export const darkVeil: ShaderConfig = {
  name: 'Dark Veil',
  description: 'CPPN-based dark veil with organic patterns and flowing shadows',
  category: 'dark',
  tier: 'base',
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
    uniform float uContrast;
    uniform float uFlowSpeed;
    uniform float uTurbulence;
    uniform float uShadowDensity;
    uniform float uEdgeSoftness;
    uniform vec3 uShadowColor;
    uniform float uFade;
    varying vec2 vUv;

    const float PI = 3.14159265359;
    const float TWO_PI = 6.28318530718;

    // CPPN functions
    float sigmoid(float x) {
      return 1.0 / (1.0 + exp(-x));
    }

    float tanh(float x) {
      float e = exp(2.0 * x);
      return (e - 1.0) / (e + 1.0);
    }

    float sin_wave(float x) {
      return sin(x);
    }

    float cos_wave(float x) {
      return cos(x);
    }

    float gauss(float x, float sigma) {
      return exp(-x * x / (2.0 * sigma * sigma));
    }

    // CPPN network
    float cppn(vec2 p, float t) {
      float x = p.x;
      float y = p.y;

      // Layer 1
      float n1 = sin_wave(x * 2.0 + t) * cos_wave(y * 1.5 - t * 0.7);
      float n2 = sigmoid(x * 3.0 - y * 2.0 + t * 1.2);
      float n3 = tanh(x * 1.8 + y * 2.2 + t * 0.9);

      // Layer 2
      float n4 = sin_wave(n1 * 2.0 + n2 * 1.5) * gauss(n3, 0.5);
      float n5 = cos_wave(n2 * 1.8 - n1 * 1.2) + sigmoid(n3 * 2.5);
      float n6 = tanh(n1 * 1.3 + n2 * 2.1 + n3 * 0.8);

      // Layer 3
      float n7 = sin_wave(n4 * 1.5 + n5 * 2.0) * cos_wave(n6 * 1.8);
      float n8 = sigmoid(n5 * 2.2 - n4 * 1.7) + tanh(n6 * 1.9);

      // Output
      return sigmoid(n7 * 2.0 + n8 * 1.5) * 2.0 - 1.0;
    }

    float fbm(vec2 p, float t) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;

      for(int i = 0; i < 4; i++) {
        vec2 q = p * frequency;
        value += amplitude * cppn(q, t * frequency * 0.1);
        amplitude *= 0.5;
        frequency *= 2.0;
      }

      return value * 0.5 + 0.5;
    }

    vec2 flow(vec2 p, float t) {
      float angle = cppn(p * 0.5, t) * TWO_PI;
      return vec2(cos(angle), sin(angle)) * uFlowSpeed;
    }

    void main() {
      vec2 uv = vUv;
      vec2 p = (uv - 0.5) * uScale;
      vec2 mouse = (uMouse / uResolution - 0.5) * 2.0;

      float time = uTime * uSpeed;

      // Add mouse interaction
      p += mouse * uTurbulence * 0.1;

      // Flow field advection
      vec2 flowDir = flow(p, time);
      p += flowDir * 0.01;

      // Generate CPPN-based pattern
      float pattern = fbm(p, time);

      // Add turbulence
      float turb = cppn(p * 2.0, time * 2.0) * uTurbulence;
      pattern = mix(pattern, turb, 0.3);

      // Apply contrast
      pattern = pow(pattern, uContrast);

      // Create shadow density
      float shadow = smoothstep(0.3, 0.7, pattern) * uShadowDensity;

      // Add edge softness
      float dist = length(uv - 0.5);
      float edge = 1.0 - smoothstep(0.4 - uEdgeSoftness, 0.5 + uEdgeSoftness, dist);
      shadow *= edge;

      // Apply intensity
      shadow *= uIntensity;

      // Create final color
      vec3 color = mix(vec3(1.0), uShadowColor, shadow);

      // Apply fade
      color *= uFade;

      gl_FragColor = vec4(color, 1.0);
    }
  `,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: [1920, 1080] },
    uMouse: { value: [960, 540, 0, 0] },
    uSpeed: { value: 0.5 },
    uScale: { value: 3.0 },
    uIntensity: { value: 1.0 },
    uContrast: { value: 1.5 },
    uFlowSpeed: { value: 0.2 },
    uTurbulence: { value: 0.3 },
    uShadowDensity: { value: 0.8 },
    uEdgeSoftness: { value: 0.1 },
    uShadowColor: { value: [0.1, 0.05, 0.15] },
    uFade: { value: 1.0 }
  },
  controls: [
    {
      name: 'Speed',
      type: 'range',
      uniform: 'uSpeed',
      min: 0.1,
      max: 2.0,
      step: 0.1,
      default: 0.5
    },
    {
      name: 'Scale',
      type: 'range',
      uniform: 'uScale',
      min: 1.0,
      max: 8.0,
      step: 0.1,
      default: 3.0
    },
    {
      name: 'Intensity',
      type: 'range',
      uniform: 'uIntensity',
      min: 0.1,
      max: 2.0,
      step: 0.1,
      default: 1.0
    },
    {
      name: 'Contrast',
      type: 'range',
      uniform: 'uContrast',
      min: 0.5,
      max: 3.0,
      step: 0.1,
      default: 1.5
    },
    {
      name: 'Flow Speed',
      type: 'range',
      uniform: 'uFlowSpeed',
      min: 0.0,
      max: 1.0,
      step: 0.1,
      default: 0.2
    },
    {
      name: 'Turbulence',
      type: 'range',
      uniform: 'uTurbulence',
      min: 0.0,
      max: 1.0,
      step: 0.1,
      default: 0.3
    },
    {
      name: 'Shadow Density',
      type: 'range',
      uniform: 'uShadowDensity',
      min: 0.0,
      max: 1.0,
      step: 0.1,
      default: 0.8
    },
    {
      name: 'Edge Softness',
      type: 'range',
      uniform: 'uEdgeSoftness',
      min: 0.0,
      max: 0.5,
      step: 0.01,
      default: 0.1
    },
    {
      name: 'Shadow Color',
      type: 'color',
      uniform: 'uShadowColor',
      default: '#1A0D26'
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