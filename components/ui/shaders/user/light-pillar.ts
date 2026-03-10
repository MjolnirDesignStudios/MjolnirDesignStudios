import { ShaderConfig } from '../shader-manager';

export const lightPillar: ShaderConfig = {
  name: 'Light Pillar',
  description: 'A mesmerizing vertical light pillar with wave deformations and gradient colors',
  category: 'atmospheric',
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
    uniform vec3 uTopColor;
    uniform vec3 uBottomColor;
    uniform float uIntensity;
    uniform float uGlowAmount;
    uniform float uPillarWidth;
    uniform float uPillarHeight;
    uniform float uNoiseIntensity;
    uniform float uPillarRotation;
    uniform float uZoom;
    varying vec2 vUv;

    const float PI = 3.141592653589793;
    const float E = 2.71828182845904523536;

    mat2 rot(float angle) {
      float s = sin(angle);
      float c = cos(angle);
      return mat2(c, -s, s, c);
    }

    float noise(vec2 coord) {
      float G = E;
      vec2 r = (G * sin(G * coord));
      return fract(r.x * r.y * (1.0 + coord.x));
    }

    vec3 applyWaveDeformation(vec2 pos, float timeOffset) {
      float frequency = 1.0;
      float amplitude = 1.0;
      vec2 deformed = pos;

      for(float i = 0.0; i < 4.0; i++) {
        deformed *= rot(0.4);
        float phase = timeOffset * i * 2.0;
        vec2 oscillation = cos(deformed * frequency - phase);
        deformed += oscillation * amplitude;
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      return vec3(deformed, 0.0);
    }

    void main() {
      vec2 uv = (vUv - 0.5) * 2.0;

      // Apply rotation
      float rotAngle = uPillarRotation * PI / 180.0;
      uv *= rot(rotAngle);

      // Apply zoom
      uv /= uZoom;

      // Create vertical gradient for pillar effect
      float verticalGradient = smoothstep(-uPillarHeight, uPillarHeight, uv.y);

      // Create horizontal falloff for pillar shape
      float horizontalFalloff = 1.0 - abs(uv.x) / uPillarWidth;
      horizontalFalloff = max(0.0, horizontalFalloff);

      // Apply wave deformation
      vec2 waveUV = uv;
      waveUV.y += uTime * 0.5;
      vec3 deformed = applyWaveDeformation(waveUV, uTime);

      // Create field distance effect
      vec2 cosinePair = cos(deformed.xy * 2.0);
      float fieldDistance = length(cosinePair) - 0.2;
      fieldDistance = abs(fieldDistance) * 0.15 + 0.01;

      // Combine effects
      float intensity = horizontalFalloff * (1.0 / fieldDistance) * verticalGradient;

      // Color gradient
      vec3 color = mix(uBottomColor, uTopColor, verticalGradient);

      // Apply glow
      color = tanh(color * uGlowAmount);

      // Add noise
      float rnd = noise(gl_FragCoord.xy * 0.01 + uTime * 0.1);
      color -= rnd * 0.1 * uNoiseIntensity;

      // Apply overall intensity
      color *= uIntensity;

      gl_FragColor = vec4(color, 1.0);
    }
  `,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: [1920, 1080] },
    uTopColor: { value: [0.322, 0.153, 1.0] }, // #5227FF
    uBottomColor: { value: [1.0, 0.624, 0.988] }, // #FF9FFC
    uIntensity: { value: 1.0 },
    uGlowAmount: { value: 0.005 },
    uPillarWidth: { value: 3.0 },
    uPillarHeight: { value: 0.4 },
    uNoiseIntensity: { value: 0.5 },
    uPillarRotation: { value: 0 },
    uZoom: { value: 1.0 }
  },
  controls: [
    {
      name: 'Top Color',
      type: 'color',
      uniform: 'uTopColor',
      default: '#5227FF'
    },
    {
      name: 'Bottom Color',
      type: 'color',
      uniform: 'uBottomColor',
      default: '#FF9FFC'
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
      name: 'Glow Amount',
      type: 'range',
      uniform: 'uGlowAmount',
      min: 0.001,
      max: 0.05,
      step: 0.001,
      default: 0.005
    },
    {
      name: 'Pillar Width',
      type: 'range',
      uniform: 'uPillarWidth',
      min: 0.5,
      max: 5.0,
      step: 0.1,
      default: 3.0
    },
    {
      name: 'Pillar Height',
      type: 'range',
      uniform: 'uPillarHeight',
      min: 0.1,
      max: 2.0,
      step: 0.1,
      default: 0.4
    },
    {
      name: 'Noise Intensity',
      type: 'range',
      uniform: 'uNoiseIntensity',
      min: 0.0,
      max: 1.0,
      step: 0.1,
      default: 0.5
    },
    {
      name: 'Rotation',
      type: 'range',
      uniform: 'uPillarRotation',
      min: -180,
      max: 180,
      step: 1,
      default: 0
    },
    {
      name: 'Zoom',
      type: 'range',
      uniform: 'uZoom',
      min: 0.5,
      max: 3.0,
      step: 0.1,
      default: 1.0
    }
  ]
};