// lib/cdn-config.ts
export type CDNProvider = 'local' | 'cloudinary' | 'vercel' | 'aws';

export interface CDNConfig {
  provider: CDNProvider;
  baseUrl: string;
  localPath?: string;
  cloudName?: string;
  bucket?: string;
}

// Environment-based configuration
const getCDNConfig = (): CDNConfig => {
  const provider = (process.env.CDN_PROVIDER || 'local') as CDNProvider;

  switch (provider) {
    case 'cloudinary':
      return {
        provider: 'cloudinary',
        baseUrl: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`,
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      };

    case 'local':
    default:
      return {
        provider: 'local',
        baseUrl: process.env.CDN_LOCAL_BASE_URL || 'http://localhost:3000',
        localPath: process.env.CDN_LOCAL_PATH || 'M:/MjolnirCDN',
      };
  }
};

export const cdnConfig = getCDNConfig();

// Asset URL generator
export const getAssetUrl = (assetPath: string, provider?: CDNProvider): string => {
  const config = provider ? getCDNConfig() : cdnConfig;

  // If it's already a public path (starts with /), return as-is
  if (assetPath.startsWith('/')) {
    return assetPath;
  }

  switch (config.provider) {
    case 'cloudinary':
      // Convert local path to Cloudinary format
      const cloudinaryPath = assetPath.replace(/\\/g, '/').replace(/^M:\/MjolnirCDN\//, '');
      return `${config.baseUrl}/image/upload/v1/${cloudinaryPath}`;

    case 'local':
    default:
      // Convert local path to web-accessible URL
      const webPath = assetPath.replace(/\\/g, '/').replace(/^M:\/MjolnirCDN\//, '/cdn/');
      return `${config.baseUrl}${webPath}`;
  }
};

// Pre-defined asset URLs for common assets
export const ASSETS = {
  // 3D Models
  mjolnirModel: 'M:/MjolnirCDN/models/Mjolnir.glb',

  // Images (using public folder paths for now)
  xicaruImage: '/Images/ProjectMOASS.png',
  mjolnirForgeFlyer: '/Images/Logos/Mjolnir_Forge_Flyer_Small.png',
  mjolnirLogo: '/Images/Logos/mjolnir_logo_official.png',
  bitcoinWizard: '/Images/ProjectMOASS.png',

  // Backgrounds
  gridBackground: '/Images/Backgrounds/footer-grid.svg',
  energyTunnel: '/Images/EnergyTunnel.jpeg',
  mjolnirBackground: '/Images/Mjolnir.jpeg',
} as const;

// Get web URLs for assets
export const getAssetUrls = () => ({
  mjolnirModel: getAssetUrl(ASSETS.mjolnirModel),
  xicaruImage: getAssetUrl(ASSETS.xicaruImage),
  mjolnirForgeFlyer: getAssetUrl(ASSETS.mjolnirForgeFlyer),
  mjolnirLogo: getAssetUrl(ASSETS.mjolnirLogo),
  bitcoinWizard: getAssetUrl(ASSETS.bitcoinWizard),
  gridBackground: getAssetUrl(ASSETS.gridBackground),
  energyTunnel: getAssetUrl(ASSETS.energyTunnel),
  mjolnirBackground: getAssetUrl(ASSETS.mjolnirBackground),
});