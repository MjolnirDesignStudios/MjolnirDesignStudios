import { ShaderConfig } from '../shader-manager';

export const matrixRain: ShaderConfig = {
  name: 'Matrix Rain',
  description: 'Classic matrix rain effect with falling characters and special word highlights',
  category: 'cyberpunk',
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
    uniform float uSpeed;
    uniform float uDensity;
    uniform float uBrightness;
    uniform vec3 uSpecialColor;
    uniform float uSpecialChance;
    varying vec2 vUv;

    // Character pattern function - creates matrix-like characters
    float char(vec2 p, float c) {
        p = floor(p / vec2(4.0, -4.0));
        if (clamp(p.x, 0.0, 1.0) == p.x && clamp(p.y, 0.0, 1.0) == p.y) {
            float pattern = 0.0;
            // Simple character patterns
            if (c < 0.1) pattern = 0.0; // space
            else if (c < 0.2) pattern = 1.0; // full block
            else if (c < 0.4) pattern = mod(p.x + p.y, 2.0); // checker
            else if (c < 0.6) pattern = step(0.5, p.x); // right half
            else if (c < 0.8) pattern = step(0.5, p.y); // bottom half
            else pattern = step(0.5, p.x * p.y); // corner
            return pattern;
        }
        return 0.0;
    }

    float random(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float noise(vec2 p) {
        vec2 ip = floor(p);
        vec2 fp = fract(p);
        float a = random(ip);
        float b = random(ip + vec2(1.0, 0.0));
        float c = random(ip + vec2(0.0, 1.0));
        float d = random(ip + vec2(1.0, 1.0));
        vec2 u = fp * fp * (3.0 - 2.0 * fp);
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    void main() {
        vec2 uv = vUv;
        vec2 position = uv * uResolution;

        // Create falling rain effect
        float column = floor(position.x / 20.0);
        float time = uTime * uSpeed + column * 0.1;

        // Random character timing
        float charTime = floor(time * 10.0) / 10.0;
        float randomSeed = random(vec2(column, charTime));

        // Character position in column
        float charY = fract(time + randomSeed * 10.0);
        float charX = fract(position.x / 20.0) * 20.0;

        // Create character pattern
        vec2 charPos = vec2(charX, position.y - charY * uResolution.y);
        float charPattern = char(charPos, randomSeed);

        // Trail effect
        float trail = 1.0 - charY;
        trail = pow(trail, 0.5);

        // Color based on trail position
        vec3 color = vec3(0.0, 1.0, 0.0) * uBrightness; // Green matrix color

        // Special characters (simulating the special word effect)
        if (randomSeed < uSpecialChance) {
            color = uSpecialColor * uBrightness;
        }

        // Fade out over distance
        color *= trail * charPattern;

        // Add some glow
        color += vec3(0.0, 0.2, 0.0) * charPattern * 0.3;

        gl_FragColor = vec4(color, 1.0);
    }
  `,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: [1920, 1080] },
    uSpeed: { value: 1.0 },
    uDensity: { value: 1.0 },
    uBrightness: { value: 1.0 },
    uSpecialColor: { value: [0.97, 0.58, 0.10] }, // Bitcoin orange #F7931A
    uSpecialChance: { value: 0.001 }
  },
  controls: [
    {
      name: 'Speed',
      type: 'range',
      uniform: 'uSpeed',
      min: 0.1,
      max: 5.0,
      step: 0.1,
      default: 1.0
    },
    {
      name: 'Density',
      type: 'range',
      uniform: 'uDensity',
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
      default: 1.0
    },
    {
      name: 'Special Color',
      type: 'color',
      uniform: 'uSpecialColor',
      default: '#F7931A'
    },
    {
      name: 'Special Chance',
      type: 'range',
      uniform: 'uSpecialChance',
      min: 0.0,
      max: 0.01,
      step: 0.0001,
      default: 0.001
    }
  ]
};