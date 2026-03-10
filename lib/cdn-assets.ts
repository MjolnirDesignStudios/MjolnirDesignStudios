// lib/cdn-assets.ts
// CDN URLs for large assets
export const CDN_ASSETS = {
  // 3D Models
  mjolnirModel: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/raw/upload/v1/models/mjolnir.glb',

  // Large Images
  xicaruImage: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/images/Xicaru.jpg',
  mjolnirForgeFlyer: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/images/mjolnir_forge_flyer_2025.png',

  // Backgrounds & SVGs
  gridBackground: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/backgrounds/grid.svg',
  energyTunnel: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/backgrounds/EnergyTunnel.jpg',
} as const;

// Helper function to get CDN URL with fallback
export const getCDNAsset = (assetKey: keyof typeof CDN_ASSETS, fallback?: string) => {
  const url = CDN_ASSETS[assetKey];
  if (!url.includes('YOUR_CLOUD_NAME')) {
    return url;
  }
  // Fallback to local if CDN not configured
  return fallback || '';
};