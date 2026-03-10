import { ShaderConfig } from '../shader-manager';

const cyberpunkShader: ShaderConfig = {
  name: 'Cyberpunk',
  description: 'Neon cyberpunk cityscape with rain',
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

    // Noise function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      float time = u_time * 0.001;

      // Create city skyline
      float skyline = 0.0;
      for (float i = 0.0; i < 10.0; i++) {
        float x = i * 0.1 + 0.05;
        float height = random(vec2(i * 0.1, 0.0)) * 0.6 + 0.2;
        skyline += step(uv.y, height) * step(x, uv.x) * step(uv.x, x + 0.05);
      }

      // Neon lights
      vec3 neonColor = vec3(0.0, 1.0, 0.8);
      float neon = sin(uv.x * 50.0 + time * 5.0) * 0.5 + 0.5;
      neon *= step(uv.y, 0.8) * step(0.2, uv.y);

      // Rain effect
      float rain = 0.0;
      for (float i = 0.0; i < 50.0; i++) {
        float x = random(vec2(i, 0.0));
        float y = mod(uv.y + time * (random(vec2(i, 1.0)) * 2.0 + 1.0), 1.0);
        float width = random(vec2(i, 2.0)) * 0.002 + 0.001;
        rain += step(abs(uv.x - x), width) * step(y, 0.02);
      }

      // Combine effects
      vec3 color = vec3(0.05, 0.05, 0.1); // Dark background
      color += skyline * vec3(0.3, 0.3, 0.5); // Buildings
      color += neon * neonColor * 0.8; // Neon glow
      color += rain * vec3(0.6, 0.8, 1.0); // Rain

      // Add some noise for texture
      color += noise(uv * 100.0 + time) * 0.05;

      gl_FragColor = vec4(color, 1.0);
    }
  `,
  uniforms: {
    u_time: 0,
    u_resolution: [800, 600]
  }
};

export default cyberpunkShader;