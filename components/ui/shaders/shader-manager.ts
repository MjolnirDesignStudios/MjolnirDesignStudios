import { ShaderLoader } from './shader-loader';

export interface ShaderConfig {
  name: string;
  description: string;
  category?: string;
  premium?: boolean;
  tier?: 'base' | 'pro' | 'elite';
  vertexShader: string;
  fragmentShader: string;
  uniforms?: Record<string, any>;
  attributes?: string[];
  controls?: Array<{
    name: string;
    type: 'range' | 'color' | 'select' | 'checkbox';
    uniform: string;
    min?: number;
    max?: number;
    step?: number;
    default?: any;
    component?: number; // For vector components
    options?: Array<{ label: string; value: any }>;
  }>;
}

export class ShaderManager {
  private gl: WebGLRenderingContext;
  private currentShader: WebGLProgram | null = null;
  private shaderLoader: ShaderLoader;
  private canvas: HTMLCanvasElement;
  private animationId: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!context) {
      throw new Error('WebGL not supported');
    }
    this.gl = context as WebGLRenderingContext;
    this.shaderLoader = new ShaderLoader();

    this.initWebGL();
  }

  private initWebGL() {
    const gl = this.gl;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
  }

  async loadShader(shaderName: string): Promise<void> {
    try {
      const config = await this.shaderLoader.loadShader(shaderName);
      const program = this.createShaderProgram(config);
      this.currentShader = program;
    } catch (error) {
      console.error(`Failed to load shader ${shaderName}:`, error);
      throw error;
    }
  }

  private createShaderProgram(config: ShaderConfig): WebGLProgram {
    const gl = this.gl;

    const vertexShader = this.compileShader(gl.VERTEX_SHADER, config.vertexShader);
    const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, config.fragmentShader);

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error('Shader program linking failed: ' + gl.getProgramInfoLog(program));
    }

    // Set default uniforms
    gl.useProgram(program);
    if (config.uniforms) {
      this.setUniforms(program, config.uniforms);
    }

    return program;
  }

  private compileShader(type: number, source: string): WebGLShader {
    const gl = this.gl;
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error('Shader compilation failed: ' + gl.getShaderInfoLog(shader));
    }

    return shader;
  }

  private setUniforms(program: WebGLProgram, uniforms: Record<string, any>) {
    const gl = this.gl;
    Object.entries(uniforms).forEach(([name, value]) => {
      const location = gl.getUniformLocation(program, name);
      if (location) {
        if (typeof value === 'number') {
          gl.uniform1f(location, value);
        } else if (Array.isArray(value)) {
          if (value.length === 2) {
            gl.uniform2f(location, value[0], value[1]);
          } else if (value.length === 3) {
            gl.uniform3f(location, value[0], value[1], value[2]);
          } else if (value.length === 4) {
            gl.uniform4f(location, value[0], value[1], value[2], value[3]);
          }
        }
      }
    });
  }

  render(time: number = 0) {
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (this.currentShader) {
      gl.useProgram(this.currentShader);

      // Update time uniform if it exists
      const timeLocation = gl.getUniformLocation(this.currentShader, 'u_time');
      if (timeLocation) {
        gl.uniform1f(timeLocation, time * 0.001);
      }

      // Update resolution uniform if it exists
      const resolutionLocation = gl.getUniformLocation(this.currentShader, 'u_resolution');
      if (resolutionLocation) {
        gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);
      }

      // Render quad
      this.renderQuad();
    }
  }

  private renderQuad() {
    const gl = this.gl;

    // Create quad vertices
    const vertices = new Float32Array([
      -1, -1, 0,
       1, -1, 0,
      -1,  1, 0,
       1,  1, 0
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(this.currentShader!, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  startAnimation() {
    const animate = (time: number) => {
      this.render(time);
      this.animationId = requestAnimationFrame(animate);
    };
    this.animationId = requestAnimationFrame(animate);
  }

  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  dispose() {
    this.stopAnimation();
    if (this.currentShader) {
      this.gl.deleteProgram(this.currentShader);
    }
  }

  getAvailableShaders(): string[] {
    return this.shaderLoader.getAvailableShaders();
  }
}