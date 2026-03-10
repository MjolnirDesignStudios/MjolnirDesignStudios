import { ShaderConfig } from '../shader-manager';

const laserFlowShader: ShaderConfig = {
  name: 'Laser Flow',
  description: 'Flowing laser beams with wisps and volumetric fog effects',
  category: 'energy',
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

    // Noise functions
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
      for (int i = 0; i < 5; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      vec2 center = vec2(0.5, 0.5);
      vec2 pos = uv - center;

      vec3 color = vec3(0.0);

      // Main laser beam
      float beamWidth = 0.02;
      float beam = 1.0 - smoothstep(beamWidth * 0.5, beamWidth * 1.5, abs(pos.x));
      beam *= smoothstep(0.0, 0.3, 1.0 - abs(pos.y));

      // Flowing energy along the beam
      float flow = sin(pos.y * 20.0 - u_time * 3.0) * 0.5 + 0.5;
      flow *= sin(pos.x * 50.0 + u_time * 2.0) * 0.5 + 0.5;
      beam *= flow;

      // Laser color (pink/magenta)
      vec3 laserColor = vec3(1.0, 0.47, 0.78);
      color += laserColor * beam * 2.0;

      // Wisps (small streaks)
      for (int i = 0; i < 12; i++) {
        float fi = float(i);
        vec2 wispPos = vec2(
          sin(fi * 0.5 + u_time * 1.5) * 0.3,
          mod(u_time * (0.5 + fi * 0.1) + fi * 0.2, 2.0) - 1.0
        );

        float wisp = 1.0 - length(pos - wispPos) * 8.0;
        wisp = max(0.0, wisp);
        wisp = pow(wisp, 3.0);

        vec3 wispColor = vec3(0.8, 0.9, 1.0);
        color += wispColor * wisp * 0.6;
      }

      // Volumetric fog
      vec2 fogUV = pos * 2.0;
      fogUV.x += u_time * 0.1;
      fogUV.y += u_time * 0.05;

      float fog = fbm(fogUV) * 0.3;
      fog *= smoothstep(0.2, 0.8, 1.0 - length(pos));

      vec3 fogColor = vec3(0.5, 0.3, 0.8);
      color += fogColor * fog;

      // Secondary beams
      for (int i = 0; i < 3; i++) {
        float fi = float(i) + 1.0;
        float offset = fi * 0.15;
        float secondaryBeam = 1.0 - smoothstep(0.01, 0.03, abs(pos.x - offset));
        secondaryBeam *= 1.0 - smoothstep(0.01, 0.03, abs(pos.x + offset));
        secondaryBeam *= smoothstep(0.0, 0.4, 1.0 - abs(pos.y));

        float secondaryFlow = sin(pos.y * 15.0 - u_time * 2.0 + fi) * 0.5 + 0.5;
        secondaryBeam *= secondaryFlow;

        vec3 secondaryColor = vec3(0.3, 0.8, 1.0);
        color += secondaryColor * secondaryBeam * 0.8;
      }

      // Energy particles
      for (int i = 0; i < 20; i++) {
        float fi = float(i);
        vec2 particlePos = vec2(
          hash(vec2(fi, 0.0)) * 2.0 - 1.0,
          mod(u_time * (0.3 + hash(vec2(fi, 1.0))) + fi * 0.1, 2.0) - 1.0
        );

        float particle = 1.0 - length(pos - particlePos) * 15.0;
        particle = max(0.0, particle);
        particle = pow(particle, 4.0);

        vec3 particleColor = mix(
          vec3(1.0, 0.4, 0.8),
          vec3(0.4, 0.8, 1.0),
          hash(vec2(fi, 2.0))
        );
        color += particleColor * particle * 0.5;
      }

      // Vignette
      float vignette = 1.0 - smoothstep(0.4, 0.9, length(pos));
      color *= vignette;

      gl_FragColor = vec4(color, 1.0);
    }
  `,
  uniforms: {
    u_time: 0,
    u_resolution: [800, 600]
  }
};

export default laserFlowShader;