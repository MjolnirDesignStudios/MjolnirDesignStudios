import { ShaderConfig } from '../shader-manager';

const globeShader: ShaderConfig = {
  name: 'Globe',
  description: '3D globe with atmospheric glow and data arcs visualization',
  vertexShader: `
    attribute vec3 a_position;
    void main() {
      gl_Position = vec4(a_position, 1.0);
    }
  `,
  fragmentShader: `
    precision mediump float;

    uniform float u_time;
    uniform vec2 u_resolution;

    // Noise functions for organic effects
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 4; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
      vec2 center = vec2(0.0, 0.0);

      // Globe sphere
      float dist = length(uv - center);
      float sphere = 1.0 - smoothstep(0.35, 0.4, dist);

      // Rotate globe
      float angle = u_time * 0.2;
      vec2 rotatedUV = vec2(
        uv.x * cos(angle) - uv.y * sin(angle),
        uv.x * sin(angle) + uv.y * cos(angle)
      );

      // Earth-like coloring with continents
      vec3 earthColor = vec3(0.1, 0.3, 0.8); // Ocean blue
      float continents = fbm(rotatedUV * 8.0 + u_time * 0.1);
      continents = smoothstep(0.4, 0.6, continents);

      vec3 landColor = vec3(0.2, 0.6, 0.2); // Land green
      vec3 color = mix(earthColor, landColor, continents);

      // Add some cloud cover
      float clouds = fbm(rotatedUV * 12.0 + u_time * 0.15) * 0.3;
      color = mix(color, vec3(0.9, 0.9, 1.0), clouds * sphere);

      // Atmospheric glow
      float atmosphere = 1.0 - smoothstep(0.35, 0.5, dist);
      atmosphere = pow(atmosphere, 2.0);
      vec3 atmosphereColor = vec3(0.3, 0.6, 1.0);
      color = mix(color, atmosphereColor, atmosphere * 0.3);

      // Data arcs effect
      vec2 arcUV = uv;
      float arcPattern = sin(arcUV.x * 10.0 + u_time * 2.0) * sin(arcUV.y * 8.0 + u_time * 1.5);
      arcPattern = smoothstep(0.7, 0.9, arcPattern);
      color += vec3(0.2, 0.8, 1.0) * arcPattern * 0.5 * sphere;

      // Ring pulses around connection points
      for (int i = 0; i < 6; i++) {
        float fi = float(i);
        vec2 point = vec2(sin(fi * 1.0 + u_time), cos(fi * 1.0 + u_time)) * 0.2;
        float ringDist = length(uv - point);
        float ring = sin(ringDist * 20.0 - u_time * 3.0) * 0.5 + 0.5;
        ring *= 1.0 - smoothstep(0.0, 0.1, ringDist);
        color += vec3(0.1, 0.5, 1.0) * ring * 0.3;
      }

      // Apply sphere mask
      color *= sphere;

      // Add subtle vignette
      float vignette = 1.0 - smoothstep(0.5, 1.0, dist);
      color *= vignette;

      gl_FragColor = vec4(color, 1.0);
    }
  `,
  uniforms: {
    u_time: 0,
    u_resolution: [800, 600]
  }
};

export default globeShader;