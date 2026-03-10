import { ShaderConfig } from '../shader-manager';

export const neuralNet: ShaderConfig = {
  name: 'Neural Network',
  description: 'Organic neural network visualization with mouse interaction and dynamic patterns',
  category: 'abstract',
  premium: true,
  tier: 'pro',
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;
    varying vec2 vUv;
    uniform float u_time;
    uniform float u_ratio;
    uniform vec2 u_pointer_position;
    uniform float u_scroll_progress;
    uniform float u_hue;
    uniform float u_saturation;
    uniform float u_chroma;

    vec2 rotate(vec2 uv, float th) {
      return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
    }

    float neuro_shape(vec2 uv, float t, float p) {
      vec2 sine_acc = vec2(0.);
      vec2 res = vec2(0.);
      float scale = 8.0;
      for (int j = 0; j < 15; j++) {
        uv = rotate(uv, 1.0);
        sine_acc = rotate(sine_acc, 1.0);
        vec2 layer = uv * scale + float(j) + sine_acc - t;
        sine_acc += sin(layer) + 2.4 * p;
        res += (0.5 + 0.5 * cos(layer)) / scale;
        scale *= 1.2;
      }
      return res.x + res.y;
    }

    vec3 hsl2rgb(vec3 c) {
      vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
      return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
    }

    void main() {
      vec2 uv = 0.5 * vUv;
      uv.x *= u_ratio;

      vec2 pointer = vUv - u_pointer_position;
      pointer.x *= u_ratio;
      float p = clamp(length(pointer), 0.0, 1.0);
      p = 0.5 * pow(1.0 - p, 2.0);

      float t = 0.001 * u_time;
      float noise = neuro_shape(uv, t, p);
      noise = 1.2 * pow(noise, 3.0);
      noise += pow(noise, 10.0);
      noise = max(0.0, noise - 0.5);
      noise *= (1.0 - length(vUv - 0.5));

      float normalizedHue = u_hue / 360.0;
      vec3 hsl = vec3(
        normalizedHue + 0.1 * sin(3.0 * u_scroll_progress + 1.5),
        u_saturation,
        u_chroma * 0.5 + 0.2 * sin(2.0 * u_scroll_progress)
      );

      vec3 color = hsl2rgb(hsl);
      color *= noise;

      gl_FragColor = vec4(color, noise);
    }
  `,
  uniforms: {
    u_time: { value: 0 },
    u_ratio: { value: 1.777 },
    u_pointer_position: { value: [0.5, 0.5] },
    u_scroll_progress: { value: 0 },
    u_hue: { value: 200 },
    u_saturation: { value: 0.8 },
    u_chroma: { value: 0.6 }
  },
  controls: [
    {
      name: 'Hue',
      type: 'range',
      uniform: 'u_hue',
      min: 0,
      max: 360,
      step: 1,
      default: 200
    },
    {
      name: 'Saturation',
      type: 'range',
      uniform: 'u_saturation',
      min: 0.0,
      max: 1.0,
      step: 0.1,
      default: 0.8
    },
    {
      name: 'Chroma',
      type: 'range',
      uniform: 'u_chroma',
      min: 0.1,
      max: 1.0,
      step: 0.1,
      default: 0.6
    }
  ]
};