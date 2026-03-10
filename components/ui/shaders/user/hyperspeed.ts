import { ShaderConfig } from '../shader-manager';

const hyperspeedShader: ShaderConfig = {
  name: 'Hyperspeed',
  description: 'High-speed tunnel effect with streaking lights and motion blur',
  category: 'space',
  tier: 'pro',
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

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      vec2 center = vec2(0.5, 0.5);
      vec2 pos = uv - center;

      // Create tunnel effect
      float dist = length(pos);
      float angle = atan(pos.y, pos.x);

      // Moving tunnel walls
      float tunnel = sin(angle * 8.0 + u_time * 2.0) * 0.1 + 0.9;
      tunnel *= sin(dist * 20.0 - u_time * 3.0) * 0.1 + 0.9;

      // Road lines
      float roadLines = sin(angle * 16.0) * 0.5 + 0.5;
      roadLines = smoothstep(0.45, 0.55, roadLines);
      roadLines *= sin(dist * 40.0 - u_time * 4.0) * 0.5 + 0.5;

      // Moving light streaks
      vec3 color = vec3(0.0);

      // Central light beams
      for (int i = 0; i < 8; i++) {
        float fi = float(i);
        float speed = 2.0 + fi * 0.5;
        float offset = u_time * speed + fi * 0.5;
        float lightPos = mod(offset, 2.0) - 1.0;

        float light = 1.0 - abs(uv.y - lightPos * 0.8);
        light = pow(light, 4.0);
        light *= sin(uv.x * 3.14159 + fi) * 0.5 + 0.5;

        vec3 lightColor = vec3(0.2, 0.8, 1.0); // Cyan lights
        color += lightColor * light * 0.3;
      }

      // Side light sticks
      for (int i = 0; i < 20; i++) {
        float fi = float(i);
        float x = (fi / 19.0 - 0.5) * 2.0;
        float speed = 1.0 + fi * 0.1;
        float y = mod(u_time * speed + fi * 0.1, 2.0) - 1.0;

        float distToLight = length(uv - vec2(x * 0.9, y));
        float light = 1.0 - smoothstep(0.0, 0.05, distToLight);

        vec3 stickColor = vec3(0.0, 1.0, 0.5); // Green side lights
        color += stickColor * light * 0.5;
      }

      // Car lights (moving particles)
      for (int i = 0; i < 15; i++) {
        float fi = float(i);
        vec2 carPos = vec2(
          (hash(vec2(fi, 0.0)) - 0.5) * 1.8,
          mod(u_time * (2.0 + hash(vec2(fi, 1.0))) + fi, 3.0) - 1.5
        );

        float carLight = 1.0 - length(uv - carPos) * 10.0;
        carLight = max(0.0, carLight);
        carLight = pow(carLight, 2.0);

        vec3 carColor = hash(vec2(fi, 2.0)) > 0.5 ?
          vec3(1.0, 0.2, 0.6) : // Pink/magenta cars
          vec3(0.2, 0.8, 1.0);  // Cyan cars

        color += carColor * carLight * 0.8;
      }

      // Road surface
      vec3 roadColor = vec3(0.05, 0.05, 0.05);
      color += roadColor * (1.0 - tunnel * 0.3);

      // Road markings
      color += vec3(0.3, 0.3, 0.3) * roadLines * 0.5;

      // Motion blur effect
      float blur = noise(uv * 50.0 + u_time) * 0.1;
      color += blur;

      // Vignette
      float vignette = 1.0 - smoothstep(0.3, 0.8, dist);
      color *= vignette;

      gl_FragColor = vec4(color, 1.0);
    }
  `,
  uniforms: {
    u_time: 0,
    u_resolution: [800, 600]
  }
};

export default hyperspeedShader;