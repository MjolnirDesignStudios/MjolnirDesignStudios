import { ShaderConfig } from '../shader-manager';

const atmosphereShader: ShaderConfig = {
  name: 'Atmosphere',
  description: 'Floating particle atmosphere with golden glow and ethereal lighting',
  category: 'atmospheric',
  tier: 'base',
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

    // Hash function for pseudo-random numbers
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    // Noise function
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      vec3 color = vec3(0.0);

      // Create multiple layers of particles
      for (int i = 0; i < 50; i++) {
        float fi = float(i);

        // Create particle position with some randomness
        vec2 particlePos = vec2(
          hash(vec2(fi, 0.0)) * 2.0 - 1.0,
          hash(vec2(fi, 1.0)) * 2.0 - 1.0
        );

        // Add time-based movement
        particlePos.x += sin(u_time * 0.5 + fi) * 0.3;
        particlePos.y += cos(u_time * 0.3 + fi) * 0.2;

        // Calculate distance from particle center
        vec2 diff = uv - particlePos;
        float dist = length(diff);

        // Particle size with some variation
        float size = hash(vec2(fi, 2.0)) * 0.02 + 0.005;

        // Soft particle falloff
        float particle = 1.0 - smoothstep(0.0, size, dist);

        // Add some noise to particle opacity
        float opacityNoise = noise(uv * 10.0 + u_time * 0.1 + fi) * 0.5 + 0.5;
        particle *= opacityNoise;

        // Golden color with slight variation
        vec3 particleColor = vec3(0.949, 0.616, 0.169); // #f59e0b
        particleColor += hash(vec2(fi, 3.0)) * 0.1 - 0.05; // Add some color variation

        color += particleColor * particle * 0.8;
      }

      // Add subtle background gradient
      color += vec3(0.05, 0.02, 0.0) * (1.0 - uv.y * 0.5);

      // Add some atmospheric haze
      float haze = noise(uv * 3.0 + u_time * 0.05) * 0.1;
      color += vec3(0.1, 0.05, 0.0) * haze;

      gl_FragColor = vec4(color, 0.95);
    }
  `,
  uniforms: {
    u_time: 0,
    u_resolution: [800, 600]
  }
};

export default atmosphereShader;