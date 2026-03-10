import { ShaderConfig } from './shader-manager';

// Import all user shaders explicitly
import accretionShader from './user/accretion';
import atomicShader from './user/atomic';
import atmosphereShader from './user/atmosphere';
import auraWavesShader from './user/aura-waves';
import bifrostShader from './user/bifrost';
import blackHoleShader from './user/black-hole';
import colorHaloShader from './user/colorhalo';
import darkVeilShader from './user/darkveil';
import globeShader from './user/globe';
import gravityLensShader from './user/gravitylens';
import hyperspeedShader from './user/hyperspeed';
import laserFlowShader from './user/laser-flow';
import lightPillarShader from './user/light-pillar';
import lightningShader from './user/lightning';
import liquidRibbonsShader from './user/liquidribbons';
import matrixRainShader from './user/matrix-rain';
import neuralNetShader from './user/neuralnet';
import rippleGridShader from './user/ripple-grid';
import silkyLinesShader from './user/silkylines';
import singularityShader from './user/singularity';
import starFieldShader from './user/starfield';
import swirlingGasShader from './user/swirling-gas';

// Import preset shaders
import nebulaShader from './presets/nebula';
import cyberpunkShader from './presets/cyberpunk';

export class ShaderLoader {
  private shaderCache: Map<string, ShaderConfig> = new Map();
  private loadedShaders: Set<string> = new Set();

  // Registry of all available shaders
  private shaderRegistry: Record<string, ShaderConfig> = {
    // User shaders
    accretion: accretionShader,
    atomic: atomicShader,
    atmosphere: atmosphereShader,
    'aura-waves': auraWavesShader,
    bifrost: bifrostShader,
    'black-hole': blackHoleShader,
    colorhalo: colorHaloShader,
    darkveil: darkVeilShader,
    globe: globeShader,
    gravitylens: gravityLensShader,
    hyperspeed: hyperspeedShader,
    'laser-flow': laserFlowShader,
    'light-pillar': lightPillarShader,
    lightning: lightningShader,
    liquidribbons: liquidRibbonsShader,
    'matrix-rain': matrixRainShader,
    neuralnet: neuralNetShader,
    'ripple-grid': rippleGridShader,
    silkylines: silkyLinesShader,
    singularity: singularityShader,
    starfield: starFieldShader,
    'swirling-gas': swirlingGasShader,
    // Preset shaders
    nebula: nebulaShader,
    cyberpunk: cyberpunkShader,
  };

  async loadShader(shaderName: string): Promise<ShaderConfig> {
    // Check cache first
    if (this.shaderCache.has(shaderName)) {
      return this.shaderCache.get(shaderName)!;
    }

    // Check registry
    const shader = this.shaderRegistry[shaderName];
    if (shader) {
      this.shaderCache.set(shaderName, shader);
      this.loadedShaders.add(shaderName);
      return shader;
    }

    throw new Error(`Shader ${shaderName} not found`);
  }

  private async loadPresetShader(shaderName: string): Promise<ShaderConfig | null> {
    // Use registry instead of dynamic imports
    const shader = this.shaderRegistry[shaderName];
    return shader || null;
  }

  private async loadUserShader(shaderName: string): Promise<ShaderConfig | null> {
    // Use registry instead of dynamic imports
    const shader = this.shaderRegistry[shaderName];
    return shader || null;
  }

  async discoverShaders(): Promise<string[]> {
    // Return all shaders from registry
    return Object.keys(this.shaderRegistry);
  }

  getAvailableShaders(): string[] {
    return Object.keys(this.shaderRegistry);
  }

  clearCache() {
    this.shaderCache.clear();
    this.loadedShaders.clear();
  }

  // Utility method to validate shader config
  validateShaderConfig(config: any): config is ShaderConfig {
    return (
      typeof config === 'object' &&
      typeof config.name === 'string' &&
      typeof config.description === 'string' &&
      typeof config.vertexShader === 'string' &&
      typeof config.fragmentShader === 'string'
    );
  }
}