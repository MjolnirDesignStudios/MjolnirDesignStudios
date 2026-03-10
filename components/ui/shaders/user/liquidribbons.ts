import { ShaderConfig } from '../shader-manager';

export const liquidRibbons: ShaderConfig = {
  name: 'Liquid Ribbons',
  description: 'Flowing liquid ribbons with interactive mouse bending and parallax effects',
  category: 'fluid',
  premium: true,
  tier: 'elite',
  vertexShader: `
    precision highp float;
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;

    uniform float iTime;
    uniform vec3 iResolution;
    uniform float animationSpeed;

    uniform bool enableTop;
    uniform bool enableMiddle;
    uniform bool enableBottom;

    uniform int topLineCount;
    uniform int middleLineCount;
    uniform int bottomLineCount;

    uniform float topLineDistance;
    uniform float middleLineDistance;
    uniform float bottomLineDistance;

    uniform vec3 topWavePosition;
    uniform vec3 middleWavePosition;
    uniform vec3 bottomWavePosition;

    uniform vec2 iMouse;
    uniform bool interactive;

    uniform float bendRadius;
    uniform float bendStrength;
    uniform float bendInfluence;

    uniform bool parallax;
    uniform float parallaxStrength;
    uniform vec2 parallaxOffset;
    uniform vec3 lineGradient[8];
    uniform int lineGradientCount;

    mat2 rotate(float r) {
      return mat2(cos(r), sin(r), -sin(r), cos(r));
    }

    vec3 getLineColor(float t) {
      if (lineGradientCount <= 0) return vec3(1.0, 0.4, 0.8);
      float clampedT = clamp(t, 0.0, 0.9999);
      float scaled = clampedT * float(lineGradientCount - 1);
      int idx = int(floor(scaled));
      float f = fract(scaled);
      int idx2 = min(idx + 1, lineGradientCount - 1);
      return mix(lineGradient[idx], lineGradient[idx2], f);
    }

    float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
      float time = iTime * animationSpeed;
      float x_movement = time * 0.1;
      float amp = sin(offset + time * 0.2) * 0.3;
      float y = sin(uv.x + offset + x_movement) * amp;

      if (shouldBend && interactive) {
        vec2 d = screenUv - mouseUv;
        float influence = exp(-dot(d, d) * bendRadius);
        float bendOffset = (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
        y += bendOffset;
      }

      float m = uv.y - y;
      return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
    }

    void mainImage(out vec4 fragColor, in vec2 fragCoord) {
      vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
      baseUv.y *= -1.0;

      if (parallax) baseUv += parallaxOffset;

      vec3 col = vec3(0.0);
      vec2 mouseUv = interactive ? (2.0 * iMouse - iResolution.xy) / iResolution.y : vec2(0.0);
      mouseUv.y *= -1.0;

      if (enableBottom) {
        for (int i = 0; i < 20; ++i) {
          if (i >= bottomLineCount) break;
          float fi = float(i);
          float t = fi / max(float(bottomLineCount - 1), 1.0);
          vec3 lineCol = getLineColor(t);
          float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
          vec2 ruv = baseUv * rotate(angle);
          col += lineCol * wave(
            ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),
            1.5 + 0.2 * fi,
            baseUv,
            mouseUv,
            true
          ) * 0.2;
        }
      }
      if (enableMiddle) {
        for (int i = 0; i < 20; ++i) {
          if (i >= middleLineCount) break;
          float fi = float(i);
          float t = fi / max(float(middleLineCount - 1), 1.0);
          vec3 lineCol = getLineColor(t);
          float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
          vec2 ruv = baseUv * rotate(angle);
          col += lineCol * wave(
            ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
            2.0 + 0.15 * fi,
            baseUv,
            mouseUv,
            true
          );
        }
      }
      if (enableTop) {
        for (int i = 0; i < 20; ++i) {
          if (i >= topLineCount) break;
          float fi = float(i);
          float t = fi / max(float(topLineCount - 1), 1.0);
          vec3 lineCol = getLineColor(t);
          float angle = topWavePosition.z * log(length(baseUv) + 1.0);
          vec2 ruv = baseUv * rotate(angle);
          ruv.x *= -1.0;
          col += lineCol * wave(
            ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),
            1.0 + 0.2 * fi,
            baseUv,
            mouseUv,
            true
          ) * 0.1;
        }
      }
      fragColor = vec4(col, 1.0);
    }

    void main() {
      vec4 color;
      mainImage(color, gl_FragCoord.xy);
      gl_FragColor = color;
    }
  `,
  uniforms: {
    iTime: { value: 0 },
    iResolution: { value: [1920, 1080, 1] },
    animationSpeed: { value: 1.0 },
    enableTop: { value: true },
    enableMiddle: { value: true },
    enableBottom: { value: true },
    topLineCount: { value: 10 },
    middleLineCount: { value: 15 },
    bottomLineCount: { value: 20 },
    topLineDistance: { value: 0.08 },
    middleLineDistance: { value: 0.06 },
    bottomLineDistance: { value: 0.04 },
    topWavePosition: { value: [10, 0.5, -0.4] },
    middleWavePosition: { value: [5, 0, 0.2] },
    bottomWavePosition: { value: [2.0, -0.7, 0.4] },
    iMouse: { value: [960, 540] },
    interactive: { value: true },
    bendRadius: { value: 5.0 },
    bendStrength: { value: -0.5 },
    bendInfluence: { value: 0 },
    parallax: { value: true },
    parallaxStrength: { value: 0.2 },
    parallaxOffset: { value: [0, 0] },
    lineGradient: { value: [
      [0.322, 0.153, 1.0],   // #5227FF
      [1.0, 0.624, 0.988],   // #FF9FFC
      [0.694, 0.620, 0.933]  // #B19EEF
    ] },
    lineGradientCount: { value: 3 }
  },
  controls: [
    {
      name: 'Animation Speed',
      type: 'range',
      uniform: 'animationSpeed',
      min: 0.1,
      max: 3.0,
      step: 0.1,
      default: 1.0
    },
    {
      name: 'Top Lines',
      type: 'range',
      uniform: 'topLineCount',
      min: 5,
      max: 20,
      step: 1,
      default: 10
    },
    {
      name: 'Middle Lines',
      type: 'range',
      uniform: 'middleLineCount',
      min: 5,
      max: 20,
      step: 1,
      default: 15
    },
    {
      name: 'Bottom Lines',
      type: 'range',
      uniform: 'bottomLineCount',
      min: 5,
      max: 20,
      step: 1,
      default: 20
    },
    {
      name: 'Bend Radius',
      type: 'range',
      uniform: 'bendRadius',
      min: 1.0,
      max: 10.0,
      step: 0.1,
      default: 5.0
    },
    {
      name: 'Bend Strength',
      type: 'range',
      uniform: 'bendStrength',
      min: -1.0,
      max: 1.0,
      step: 0.1,
      default: -0.5
    },
    {
      name: 'Parallax Strength',
      type: 'range',
      uniform: 'parallaxStrength',
      min: 0.0,
      max: 0.5,
      step: 0.01,
      default: 0.2
    },
    {
      name: 'Enable Top',
      type: 'checkbox',
      uniform: 'enableTop',
      default: true
    },
    {
      name: 'Enable Middle',
      type: 'checkbox',
      uniform: 'enableMiddle',
      default: true
    },
    {
      name: 'Enable Bottom',
      type: 'checkbox',
      uniform: 'enableBottom',
      default: true
    },
    {
      name: 'Interactive',
      type: 'checkbox',
      uniform: 'interactive',
      default: true
    },
    {
      name: 'Parallax',
      type: 'checkbox',
      uniform: 'parallax',
      default: true
    }
  ]
};