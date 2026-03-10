import { ShaderConfig } from '../shader-manager';

export const rippleGrid: ShaderConfig = {
  name: 'Ripple Grid',
  description: 'Animated grid with rippling waves, mouse interaction, and customizable colors',
  category: 'geometric',
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
    uniform bool uEnableRainbow;
    uniform vec3 uGridColor;
    uniform float uRippleIntensity;
    uniform float uGridSize;
    uniform float uGridThickness;
    uniform float uFadeDistance;
    uniform float uVignetteStrength;
    uniform float uGlowIntensity;
    uniform float uOpacity;
    uniform float uGridRotation;
    uniform vec2 uMousePosition;
    uniform float uMouseInfluence;
    varying vec2 vUv;

    const float PI = 3.141592653589793;

    mat2 rotate(float angle) {
      float s = sin(angle);
      float c = cos(angle);
      return mat2(c, -s, s, c);
    }

    void main() {
      vec2 uv = vUv * 2.0 - 1.0;
      uv.x *= uResolution.x / uResolution.y;

      // Apply grid rotation
      if (uGridRotation != 0.0) {
        uv = rotate(uGridRotation * PI / 180.0) * uv;
      }

      uv.y += 0.38; // Move down slightly
      uv /= 1.3;    // Make grid large and bold

      float dist = length(uv);
      float func = sin(PI * (uTime - dist));
      vec2 rippleUv = uv + uv * func * uRippleIntensity;

      // Mouse interaction
      if (uMouseInfluence > 0.0) {
        vec2 mouseUv = (uMousePosition * 2.0 - 1.0);
        mouseUv.x *= uResolution.x / uResolution.y;
        float mouseDist = length(uv - mouseUv);

        float influence = uMouseInfluence * exp(-mouseDist * mouseDist / 1.0);
        float mouseWave = sin(PI * (uTime * 2.0 - mouseDist * 3.0)) * influence;
        rippleUv += normalize(uv - mouseUv) * mouseWave * uRippleIntensity * 0.3;
      }

      // Create grid pattern
      vec2 a = sin(uGridSize * 0.5 * PI * rippleUv - PI / 2.0);
      vec2 b = abs(a);

      // Anti-aliasing
      float aaWidth = 0.5;
      vec2 smoothB = vec2(
        smoothstep(0.0, aaWidth, b.x),
        smoothstep(0.0, aaWidth, b.y)
      );

      // Build grid color
      vec3 color = vec3(0.0);
      color += exp(-uGridThickness * smoothB.x * (0.8 + 0.5 * sin(PI * uTime)));
      color += exp(-uGridThickness * smoothB.y);
      color += 0.5 * exp(-(uGridThickness / 4.0) * sin(smoothB.x));
      color += 0.5 * exp(-(uGridThickness / 3.0) * smoothB.y);

      // Add glow
      if (uGlowIntensity > 0.0) {
        color += uGlowIntensity * exp(-uGridThickness * 0.5 * smoothB.x);
        color += uGlowIntensity * exp(-uGridThickness * 0.5 * smoothB.y);
      }

      // Distance fade
      float ddd = exp(-2.0 * clamp(pow(dist, uFadeDistance), 0.0, 1.0));

      // Vignette
      vec2 vignetteCoords = vUv - 0.5;
      float vignetteDistance = length(vignetteCoords);
      float vignette = 1.0 - pow(vignetteDistance * 2.0, uVignetteStrength);
      vignette = clamp(vignette, 0.0, 1.0);

      // Color tint
      vec3 tint;
      if (uEnableRainbow) {
        tint = vec3(
          uv.x * 0.5 + 0.5 * sin(uTime),
          uv.y * 0.5 + 0.5 * cos(uTime),
          pow(cos(uTime), 4.0)
        ) + 0.5;
      } else {
        tint = uGridColor;
      }

      // Final composition
      float finalFade = ddd * vignette;
      float alpha = length(color) * finalFade * uOpacity;
      gl_FragColor = vec4(color * tint * finalFade * uOpacity, alpha);
    }
  `,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: [1920, 1080] },
    uEnableRainbow: { value: false },
    uGridColor: { value: [0.443, 0.8, 0.6] }, // #71cc99
    uRippleIntensity: { value: 0.05 },
    uGridSize: { value: 18 },
    uGridThickness: { value: 15.0 },
    uFadeDistance: { value: 1.5 },
    uVignetteStrength: { value: 2.0 },
    uGlowIntensity: { value: 0.3 },
    uOpacity: { value: 1.0 },
    uGridRotation: { value: 0 },
    uMousePosition: { value: [0.5, 0.5] },
    uMouseInfluence: { value: 0 }
  },
  controls: [
    {
      name: 'Enable Rainbow',
      type: 'checkbox',
      uniform: 'uEnableRainbow',
      default: false
    },
    {
      name: 'Grid Color',
      type: 'color',
      uniform: 'uGridColor',
      default: '#71cc99'
    },
    {
      name: 'Ripple Intensity',
      type: 'range',
      uniform: 'uRippleIntensity',
      min: 0.0,
      max: 0.2,
      step: 0.01,
      default: 0.05
    },
    {
      name: 'Grid Size',
      type: 'range',
      uniform: 'uGridSize',
      min: 5,
      max: 50,
      step: 1,
      default: 18
    },
    {
      name: 'Grid Thickness',
      type: 'range',
      uniform: 'uGridThickness',
      min: 1.0,
      max: 50.0,
      step: 1.0,
      default: 15.0
    },
    {
      name: 'Fade Distance',
      type: 'range',
      uniform: 'uFadeDistance',
      min: 0.5,
      max: 3.0,
      step: 0.1,
      default: 1.5
    },
    {
      name: 'Vignette Strength',
      type: 'range',
      uniform: 'uVignetteStrength',
      min: 0.5,
      max: 5.0,
      step: 0.1,
      default: 2.0
    },
    {
      name: 'Glow Intensity',
      type: 'range',
      uniform: 'uGlowIntensity',
      min: 0.0,
      max: 1.0,
      step: 0.1,
      default: 0.3
    },
    {
      name: 'Opacity',
      type: 'range',
      uniform: 'uOpacity',
      min: 0.0,
      max: 1.0,
      step: 0.1,
      default: 1.0
    },
    {
      name: 'Grid Rotation',
      type: 'range',
      uniform: 'uGridRotation',
      min: -180,
      max: 180,
      step: 1,
      default: 0
    }
  ]
};