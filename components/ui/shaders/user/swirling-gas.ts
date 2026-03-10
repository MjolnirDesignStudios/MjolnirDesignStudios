import { ShaderConfig } from '../shader-manager';

export const swirlingGas: ShaderConfig = {
  name: 'Swirling Gas',
  description: 'Volumetric swirling gas clouds with dynamic lighting and depth',
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
    uniform float uSpeed;
    uniform float uIntensity;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uDensity;
    uniform float uTurbulence;
    varying vec2 vUv;

    // Noise functions
    float hash(float n) {
      return fract(sin(n) * 43758.5453);
    }

    float noise(vec3 x) {
      vec3 p = floor(x);
      vec3 f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      float n = p.x + p.y * 57.0 + 113.0 * p.z;
      return mix(
        mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
            mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
        mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
            mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z);
    }

    float fbm(vec3 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;

      for(int i = 0; i < 6; i++) {
        value += amplitude * noise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
      }

      return value;
    }

    vec3 palette(float t) {
      vec3 a = vec3(0.5, 0.5, 0.5);
      vec3 b = vec3(0.5, 0.5, 0.5);
      vec3 c = vec3(1.0, 1.0, 1.0);
      vec3 d = vec3(0.263, 0.416, 0.557);
      return a + b * cos(6.28318 * (c * t + d));
    }

    void main() {
      vec2 uv = (vUv - 0.5) * 2.0;
      uv.x *= uResolution.x / uResolution.y;

      vec3 color = vec3(0.0);

      // Ray marching setup
      vec3 ro = vec3(0.0, 0.0, -3.0);
      vec3 rd = normalize(vec3(uv, 1.0));

      float t = 0.0;
      float density = 0.0;

      // March through volume
      for(int i = 0; i < 100; i++) {
        vec3 p = ro + rd * t;

        // Create swirling motion
        float swirl = sin(p.y * 2.0 + uTime * uSpeed) * cos(p.x * 1.5 + uTime * uSpeed * 0.7);
        p.xz += vec2(sin(p.y + uTime * uSpeed), cos(p.y + uTime * uSpeed)) * swirl * 0.5;

        // Add turbulence
        p += fbm(p * uTurbulence + uTime * uSpeed * 0.5) * 0.3;

        // Distance field for gas clouds
        float dist = length(p) - 1.0;
        dist += fbm(p * 3.0 + uTime * uSpeed) * 0.2;

        // Accumulate density
        if(dist < 0.1) {
          float localDensity = exp(-dist * 10.0) * uDensity;
          density += localDensity * 0.01;
        }

        t += 0.02;
        if(t > 5.0) break;
      }

      // Color the gas
      if(density > 0.0) {
        vec3 gasColor = mix(uColor1, uColor2, density * 0.5 + sin(uTime * uSpeed) * 0.2 + 0.5);
        gasColor *= palette(density + uTime * 0.1);
        color = gasColor * density * uIntensity;
      }

      // Add some glow
      color += vec3(0.1, 0.05, 0.2) * density * 0.3;

      gl_FragColor = vec4(color, 1.0);
    }
  `,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: [1920, 1080] },
    uSpeed: { value: 1.0 },
    uIntensity: { value: 1.2 },
    uColor1: { value: [0.2, 0.1, 0.8] },
    uColor2: { value: [0.8, 0.2, 0.1] },
    uDensity: { value: 1.0 },
    uTurbulence: { value: 1.0 }
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
      name: 'Intensity',
      type: 'range',
      uniform: 'uIntensity',
      min: 0.1,
      max: 3.0,
      step: 0.1,
      default: 1.2
    },
    {
      name: 'Color 1',
      type: 'color',
      uniform: 'uColor1',
      default: '#331966'
    },
    {
      name: 'Color 2',
      type: 'color',
      uniform: 'uColor2',
      default: '#CC3319'
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
      name: 'Turbulence',
      type: 'range',
      uniform: 'uTurbulence',
      min: 0.1,
      max: 3.0,
      step: 0.1,
      default: 1.0
    }
  ]
};