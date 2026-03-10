import { ShaderConfig } from '../shader-manager';

const nebulaShader: ShaderConfig = {
  name: 'Nebula',
  description: 'Cosmic nebula with swirling colors',
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

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      uv = uv * 2.0 - 1.0;
      uv.x *= u_resolution.x / u_resolution.y;

      float time = u_time * 0.5;

      // Create swirling nebula effect
      float r = length(uv);
      float angle = atan(uv.y, uv.x);

      float wave1 = sin(r * 10.0 - time * 2.0 + angle * 3.0);
      float wave2 = sin(r * 15.0 + time * 1.5 - angle * 2.0);
      float wave3 = sin(r * 8.0 - time * 3.0 + angle * 4.0);

      vec3 color1 = vec3(0.8, 0.2, 0.5); // Pink
      vec3 color2 = vec3(0.2, 0.5, 0.8); // Blue
      vec3 color3 = vec3(0.5, 0.8, 0.2); // Green

      vec3 finalColor = color1 * (wave1 * 0.5 + 0.5) +
                       color2 * (wave2 * 0.5 + 0.5) +
                       color3 * (wave3 * 0.5 + 0.5);

      finalColor *= 1.0 - r * 0.3; // Fade to center

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
  uniforms: {
    u_time: 0,
    u_resolution: [800, 600]
  }
};

export default nebulaShader;