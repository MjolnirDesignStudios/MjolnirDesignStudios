# CDN Migration Guide for Mjolnir Design Studio

## 🚀 Quick Setup (5 minutes)

### 1. Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account (25GB storage, 25GB monthly bandwidth)
3. Get your Cloud Name, API Key, and API Secret from Dashboard

### 2. Update Environment Variables
Replace the placeholder values in `.env.local`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

### 3. Upload Large Assets to Cloudinary
Use the Cloudinary Media Library or API to upload:

**High Priority (Move First):**
- `public/Models/Mjolnir.glb` (10.25MB) → Upload as raw file
- `public/Images/Xicaru.jpeg` (7.13MB) → Upload as image
- `public/Images/Logos/mjolnir_forge_flyer_2025.png` (3.59MB) → Upload as image

**Medium Priority:**
- Large SVG files and backgrounds

### 4. Update Asset URLs
Replace local paths with CDN URLs in your components:

```typescript
// Before
<Image src="/Images/Xicaru.jpeg" ... />

// After
<Image src="https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/images/Xicaru.jpg" ... />
```

Or use the helper functions I created in `lib/cdn-assets.ts` and `lib/cloudinary.ts`.

## 📊 Expected Performance Improvements

- **Build Time**: 60-80% faster (no large assets to process)
- **Dev Server**: Instant hot reload
- **Page Load**: Faster initial loads with CDN distribution
- **SEO**: Better Core Web Vitals scores

## 🔧 Alternative CDN Options

If Cloudinary doesn't fit your needs:

### Vercel Blob (Free tier: 1GB)
```bash
npm install @vercel/blob
```

### AWS S3 + CloudFront
- More complex but very scalable
- Free tier: 5GB storage, 20,000 GET requests

### Bunny.net
- Competitive pricing
- Easy migration from Cloudinary

## 🎯 Migration Checklist

- [ ] Sign up for Cloudinary
- [ ] Update `.env.local` with real credentials
- [ ] Upload large assets to Cloudinary
- [ ] Update component imports to use CDN URLs
- [ ] Test locally with `npm run dev`
- [ ] Verify assets load correctly
- [ ] Remove large files from `public/` folder
- [ ] Commit and deploy

## 💡 Pro Tips

1. **Use transformations**: Cloudinary can resize, optimize, and convert formats automatically
2. **Lazy loading**: Combine with Next.js Image component for best performance
3. **Backup**: Keep local copies of assets until migration is complete
4. **Monitoring**: Use Cloudinary dashboard to track bandwidth usage

## 🆘 Need Help?

The helper functions I created will make migration easier. Check `lib/cloudinary.ts` and `lib/cdn-assets.ts` for examples.