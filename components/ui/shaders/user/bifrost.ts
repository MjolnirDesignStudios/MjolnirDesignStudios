import { ShaderConfig } from '../shader-manager';

export const biFrost: ShaderConfig = {
  name: 'BiFrost Bridge',
  description: 'The Rainbow Bridge of Asgard - vertical energy beams with ROYGBIV spectrum and flowing wisps',
  category: 'mythical',
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
    uniform vec2 uMouse;
    uniform float uWispDensity;
    uniform float uTiltScale;
    uniform float uFlowTime;
    uniform float uFogTime;
    uniform float uBeamXFrac;
    uniform float uBeamYFrac;
    uniform float uFlowSpeed;
    uniform float uVLenFactor;
    uniform float uHLenFactor;
    uniform float uFogIntensity;
    uniform float uFogScale;
    uniform float uWSpeed;
    uniform float uWIntensity;
    uniform float uFlowStrength;
    uniform float uDecay;
    uniform float uFalloffStart;
    uniform float uFogFallSpeed;
    uniform vec3 uColor;
    uniform float uFade;
    varying vec2 vUv;

    const float PI = 3.14159265359;
    const float TWO_PI = 6.28318530718;
    const float EPS = 1e-6;
    const float DT_LOCAL = 0.0038;
    const float TAP_RADIUS = 6.0;
    const float R_H = 150.0;
    const float R_V = 150.0;
    const float FLARE_HEIGHT = 16.0;
    const float FLARE_AMOUNT = 8.0;
    const float FLARE_EXP = 2.0;
    const float TOP_FADE_START = 0.1;
    const float TOP_FADE_EXP = 1.0;
    const float FLOW_PERIOD = 0.5;
    const float FLOW_SHARPNESS = 1.5;
    const float W_BASE_X = 1.5;
    const float W_LAYER_GAP = 0.25;
    const float W_LANES = 10.0;
    const float W_SIDE_DECAY = 0.5;
    const float W_HALF = 0.01;
    const float W_AA = 0.15;
    const float W_CELL = 20.0;
    const float W_SEG_MIN = 0.01;
    const float W_SEG_MAX = 0.55;
    const float W_CURVE_AMOUNT = 15.0;
    const float W_CURVE_RANGE = FLARE_HEIGHT - 3.0;
    const float W_BOTTOM_EXP = 10.0;
    const float FOG_CONTRAST = 1.2;
    const float FOG_OCTAVES = 5.0;
    const float FOG_BOTTOM_BIAS = 0.8;
    const float FOG_TILT_MAX_X = 0.35;
    const float FOG_TILT_SHAPE = 1.5;
    const float FOG_BEAM_MIN = 0.0;
    const float FOG_BEAM_MAX = 0.75;
    const float FOG_MASK_GAMMA = 0.5;
    const float FOG_EXPAND_SHAPE = 12.2;
    const float FOG_EDGE_MIX = 0.5;
    const float HFOG_EDGE_START = 0.20;
    const float HFOG_EDGE_END = 0.98;
    const float HFOG_EDGE_GAMMA = 1.4;
    const float HFOG_Y_RADIUS = 25.0;
    const float HFOG_Y_SOFT = 60.0;
    const float EDGE_X0 = 0.22;
    const float EDGE_X1 = 0.995;
    const float EDGE_X_GAMMA = 1.25;
    const float EDGE_LUMA_T0 = 0.0;
    const float EDGE_LUMA_T1 = 2.0;
    const float DITHER_STRENGTH = 1.0;

    float g(float x) {
      return x <= 0.00031308 ? 12.92 * x : 1.055 * pow(x, 1.0 / 2.4) - 0.055;
    }

    float bs(vec2 p, vec2 q, float powr) {
      float d = distance(p, q), f = powr * uFalloffStart, r = (f * f) / (d * d + EPS);
      return powr * min(1.0, r);
    }

    float bsa(vec2 p, vec2 q, float powr, vec2 s) {
      vec2 d = p - q;
      float dd = (d.x * d.x) / (s.x * s.x) + (d.y * d.y) / (s.y * s.y), f = powr * uFalloffStart, r = (f * f) / (dd + EPS);
      return powr * min(1.0, r);
    }

    float tri01(float x) {
      float f = fract(x);
      return 1.0 - abs(f * 2.0 - 1.0);
    }

    float tauWf(float t, float tmin, float tmax) {
      float a = smoothstep(tmin, tmin + 0.015, t), b = 1.0 - smoothstep(tmax - 0.015, tmax, t);
      return max(0.0, a * b);
    }

    float h21(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 34.123);
      return fract(p.x * p.y);
    }

    float vnoise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      float a = h21(i), b = h21(i + vec2(1, 0)), c = h21(i + vec2(0, 1)), d = h21(i + vec2(1, 1));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    float fbm2(vec2 p) {
      float v = 0.0, amp = 0.6;
      mat2 m = mat2(0.86, 0.5, -0.5, 0.86);
      for(int i = 0; i < int(FOG_OCTAVES); ++i) {
        v += amp * vnoise(p);
        p = m * p * 2.03 + 17.1;
        amp *= 0.52;
      }
      return v;
    }

    float rGate(float x, float l) {
      float a = smoothstep(0.0, W_AA, x), b = 1.0 - smoothstep(l, l + W_AA, x);
      return max(0.0, a * b);
    }

    float flareY(float y) {
      float t = clamp(1.0 - (clamp(y, 0.0, FLARE_HEIGHT) / max(FLARE_HEIGHT, EPS)), 0.0, 1.0);
      return pow(t, FLARE_EXP);
    }

    float vWisps(vec2 uv, float topF) {
      float y = uv.y, yf = (y + uFlowTime * uWSpeed) / W_CELL;
      float dRaw = clamp(uWispDensity, 0.0, 2.0), d = dRaw <= 0.0 ? 1.0 : dRaw;
      float lanesF = floor(float(W_LANES) * min(d, 1.0) + 0.5);
      int lanes = int(max(1.0, lanesF));
      float sp = min(d, 1.0), ep = max(d - 1.0, 0.0);
      float fm = flareY(max(y, 0.0)), rm = clamp(1.0 - (y / max(W_CURVE_RANGE, EPS)), 0.0, 1.0), cm = fm * rm;
      const float G = 0.05;
      float xS = 1.0 + (FLARE_AMOUNT * W_CURVE_AMOUNT * G) * cm;
      float sPix = clamp(y / R_V, 0.0, 1.0), bGain = pow(1.0 - sPix, W_BOTTOM_EXP), sum = 0.0;

      for(int s = 0; s < 2; ++s) {
        float sgn = s == 0 ? -1.0 : 1.0;
        for(int i = 0; i < int(W_LANES); ++i) {
          if(i >= lanes) break;
          float off = W_BASE_X + float(i) * W_LAYER_GAP, xc = sgn * (off * xS);
          float dx = abs(uv.x - xc), lat = 1.0 - smoothstep(W_HALF, W_HALF + W_AA, dx), amp = exp(-off * W_SIDE_DECAY);
          float seed = h21(vec2(off, sgn * 17.0)), yf2 = yf + seed * 7.0, fy = fract(yf2);
          float seg = mix(W_SEG_MIN, W_SEG_MAX, h21(vec2(floor(yf2), off * 2.3)));
          float spR = h21(vec2(floor(yf2), off + sgn * 31.0)), seg1 = rGate(fy, seg) * step(spR, sp);
          if(ep > 0.0) {
            float spR2 = h21(vec2(floor(yf2) * 3.1 + 7.0, off * 5.3 + sgn * 13.0));
            float f2 = fract(fy + 0.5);
            seg1 += rGate(f2, seg * 0.9) * step(spR2, ep);
          }
          sum += amp * lat * seg1;
        }
      }
      float span = smoothstep(-3.0, 0.0, y) * (1.0 - smoothstep(R_V - 6.0, R_V, y));
      return uWIntensity * sum * topF * bGain * span;
    }

    void main() {
      vec2 C = uResolution * 0.5;
      float invW = 1.0 / max(C.x, 1.0);
      float sc = 512.0 / uResolution.x * 0.4;
      vec2 uv = (vUv * uResolution - C) * sc, off = vec2(uBeamXFrac * uResolution.x * sc, uBeamYFrac * uResolution.y * sc);
      vec2 uvc = uv - off;
      float a = 0.0, b = 0.0;
      float basePhase = 1.5 * PI + uDecay * 0.5;
      float tauMin = basePhase - uDecay;
      float tauMax = basePhase;
      float cx = clamp(uvc.x / (R_H * uHLenFactor), -1.0, 1.0), tH = clamp(TWO_PI - acos(cx), tauMin, tauMax);

      for(int k = -int(TAP_RADIUS); k <= int(TAP_RADIUS); ++k) {
        float tu = tH + float(k) * DT_LOCAL, wt = tauWf(tu, tauMin, tauMax);
        if(wt <= 0.0) continue;
        float spd = max(abs(sin(tu)), 0.02), u = clamp((basePhase - tu) / max(uDecay, EPS), 0.0, 1.0), env = pow(1.0 - abs(u * 2.0 - 1.0), 0.8);
        vec2 p = vec2((R_H * uHLenFactor) * cos(tu), 0.0);
        a += wt * bs(uvc, p, env * spd);
      }

      float yPix = uvc.y, cy = clamp(-yPix / (R_V * uVLenFactor), -1.0, 1.0), tV = clamp(TWO_PI - acos(cy), tauMin, tauMax);
      for(int k = -int(TAP_RADIUS); k <= int(TAP_RADIUS); ++k) {
        float tu = tV + float(k) * DT_LOCAL, wt = tauWf(tu, tauMin, tauMax);
        if(wt <= 0.0) continue;
        float yb = (-R_V) * cos(tu), s = clamp(yb / R_V, 0.0, 1.0), spd = max(abs(sin(tu)), 0.02);
        float env = pow(1.0 - s, 0.6) * spd;
        float cap = 1.0 - smoothstep(TOP_FADE_START, 1.0, s);
        cap = pow(cap, TOP_FADE_EXP);
        env *= cap;
        float ph = s / max(FLOW_PERIOD, EPS) + uFlowTime * uFlowSpeed;
        float fl = pow(tri01(ph), FLOW_SHARPNESS);
        env *= mix(1.0 - uFlowStrength, 1.0, fl);
        float m = pow(smoothstep(FLARE_HEIGHT, 0.0, yb), FLARE_EXP), wx = 1.0 + FLARE_AMOUNT * m;
        vec2 sig = vec2(wx, 1.0), p = vec2(0.0, yb);
        float mask = step(0.0, yb);
        b += wt * bsa(uvc, p, mask * env, sig);
      }

      float sPix = clamp(yPix / R_V, 0.0, 1.0), topA = pow(1.0 - smoothstep(TOP_FADE_START, 1.0, sPix), TOP_FADE_EXP);
      float L = a + b * topA;
      float w = vWisps(vec2(uvc.x, yPix), topA);
      float fog = 0.0;

      vec2 fuv = uvc * uFogScale;
      float mAct = step(1.0, length(uMouse.xy)), nx = ((uMouse.x - C.x) * invW) * mAct;
      float ax = abs(nx);
      float stMag = mix(ax, pow(ax, FOG_TILT_SHAPE), 0.35);
      float st = sign(nx) * stMag * uTiltScale;
      st = clamp(st, -FOG_TILT_MAX_X, FOG_TILT_MAX_X);
      vec2 dir = normalize(vec2(st, 1.0));
      fuv += uFogTime * uFogFallSpeed * dir;
      vec2 prp = vec2(-dir.y, dir.x);
      fuv += prp * (0.08 * sin(dot(uvc, prp) * 0.08 + uFogTime * 0.9));
      float n = fbm2(fuv + vec2(fbm2(fuv + vec2(7.3, 2.1)), fbm2(fuv + vec2(-3.7, 5.9))) * 0.6);
      n = pow(clamp(n, 0.0, 1.0), FOG_CONTRAST);
      float pixW = 1.0 / max(uResolution.y, 1.0);
      float wL = pixW;
      float m0 = pow(smoothstep(FOG_BEAM_MIN - wL, FOG_BEAM_MAX + wL, L), FOG_MASK_GAMMA);
      float bm = 1.0 - pow(1.0 - m0, FOG_EXPAND_SHAPE);
      bm = mix(bm * m0, bm, FOG_EDGE_MIX);
      float yP = 1.0 - smoothstep(HFOG_Y_RADIUS, HFOG_Y_RADIUS + HFOG_Y_SOFT, abs(yPix));
      float nxF = abs((vUv.x * uResolution.x - C.x) * invW), hE = 1.0 - smoothstep(HFOG_EDGE_START, HFOG_EDGE_END, nxF);
      hE = pow(clamp(hE, 0.0, 1.0), HFOG_EDGE_GAMMA);
      float hW = mix(1.0, hE, clamp(yP, 0.0, 1.0));
      float bBias = mix(1.0, 1.0 - sPix, FOG_BOTTOM_BIAS);
      float radialFade = 1.0 - smoothstep(0.0, 0.7, length(uvc) / 120.0);
      fog = n * uFogIntensity * 1.8 * bBias * bm * hW * radialFade;

      float LF = L + fog;
      float dith = (h21(vUv * uResolution) - 0.5) * (DITHER_STRENGTH / 255.0);
      float tone = g(LF + w);
      vec3 col = tone * uColor + dith;
      float alpha = clamp(g(L + w * 0.6) + dith * 0.6, 0.0, 1.0);
      float nxE = abs((vUv.x * uResolution.x - C.x) * invW), xF = pow(clamp(1.0 - smoothstep(EDGE_X0, EDGE_X1, nxE), 0.0, 1.0), EDGE_X_GAMMA);
      float scene = LF + max(0.0, w) * 0.5, hi = smoothstep(EDGE_LUMA_T0, EDGE_LUMA_T1, scene);
      float eM = mix(xF, 1.0, hi);
      col *= eM;
      alpha *= eM;
      col *= uFade;
      alpha *= uFade;

      gl_FragColor = vec4(col, alpha);
    }
  `,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: [1920, 1080] },
    uMouse: { value: [960, 540, 0, 0] },
    uWispDensity: { value: 3.0 },
    uTiltScale: { value: 0.018 },
    uFlowTime: { value: 0 },
    uFogTime: { value: 0 },
    uBeamXFrac: { value: 0.5 },
    uBeamYFrac: { value: 0.5 },
    uFlowSpeed: { value: 0.8 },
    uVLenFactor: { value: 6.0 },
    uHLenFactor: { value: 0.15 },
    uFogIntensity: { value: 0.8 },
    uFogScale: { value: 0.35 },
    uWSpeed: { value: 30 },
    uWIntensity: { value: 18 },
    uFlowStrength: { value: 0.6 },
    uDecay: { value: 1.0 },
    uFalloffStart: { value: 1.1 },
    uFogFallSpeed: { value: 1.2 },
    uColor: { value: [1.0, 1.0, 1.0] },
    uFade: { value: 1.0 }
  },
  controls: [
    {
      name: 'Wisp Density',
      type: 'range',
      uniform: 'uWispDensity',
      min: 0.0,
      max: 2.0,
      step: 0.1,
      default: 3.0
    },
    {
      name: 'Tilt Scale',
      type: 'range',
      uniform: 'uTiltScale',
      min: 0.0,
      max: 0.05,
      step: 0.001,
      default: 0.018
    },
    {
      name: 'Flow Speed',
      type: 'range',
      uniform: 'uFlowSpeed',
      min: 0.1,
      max: 2.0,
      step: 0.1,
      default: 0.8
    },
    {
      name: 'Fog Intensity',
      type: 'range',
      uniform: 'uFogIntensity',
      min: 0.0,
      max: 2.0,
      step: 0.1,
      default: 0.8
    },
    {
      name: 'Wisp Speed',
      type: 'range',
      uniform: 'uWSpeed',
      min: 10,
      max: 50,
      step: 1,
      default: 30
    },
    {
      name: 'Wisp Intensity',
      type: 'range',
      uniform: 'uWIntensity',
      min: 5,
      max: 30,
      step: 1,
      default: 18
    },
    {
      name: 'Flow Strength',
      type: 'range',
      uniform: 'uFlowStrength',
      min: 0.0,
      max: 1.0,
      step: 0.1,
      default: 0.6
    },
    {
      name: 'Beam Color',
      type: 'color',
      uniform: 'uColor',
      default: '#ffffff'
    },
    {
      name: 'Fade',
      type: 'range',
      uniform: 'uFade',
      min: 0.0,
      max: 1.0,
      step: 0.1,
      default: 1.0
    }
  ]
};