# Mjolnir Design Studios - OdinAI Reference File
# Version: 1.0.0
# Date: March 9, 2026
# Purpose: Self-healing reference for continuous iteration and design enhancement

## Project Overview
Mjolnir Design Studios is a premium digital agency SaaS platform combining business consulting, digital development, and design services. Built with Next.js 15, React 19, TypeScript, and modern web technologies.

## Core Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v3, GSAP, Framer Motion
- **3D/Graphics**: Three.js, React Three Fiber, WebGL Shaders
- **Backend**: Supabase (Auth + Database), Prisma
- **Payments**: Stripe integration
- **Deployment**: Vercel-ready configuration

### Directory Structure
```
mjolnir/
├── app/                          # Next.js App Router
│   ├── (protected)/             # Auth-gated routes
│   ├── (public)/                # Public pages
│   ├── api/                     # API routes
│   └── auth/                    # Authentication
├── components/                  # React components
│   ├── ui/                      # Base UI components
│   ├── mjolnirui/               # Mjolnir-specific components
│   ├── three/                   # 3D components
│   └── gsap/                    # Animation components
├── mjolnirui-registry/          # Turborepo monorepo
│   ├── packages/ui/             # UI component library
│   │   ├── src/
│   │   │   ├── components/      # React components
│   │   │   ├── shaders/         # WebGL shader system
│   │   │   │   ├── user/        # User-created shaders (23 total)
│   │   │   │   ├── presets/     # Built-in presets (2 total)
│   │   │   │   ├── shader-manager.ts
│   │   │   │   └── shader-loader.ts
│   │   │   └── index.ts         # Main exports
│   └── packages/config/         # Configuration registry
└── packages/config/registry/    # Component registry
```

## Shader System Architecture

### Core Components
1. **ShaderManager**: WebGL context management, shader compilation, rendering
2. **ShaderLoader**: Automatic filesystem discovery, dynamic imports
3. **ShaderConfig Interface**: Standardized shader configuration
4. **BackgroundStudio**: Premium React component with controls

### ShaderConfig Structure
```typescript
interface ShaderConfig {
  name: string;
  description: string;
  category?: string;              // atmospheric, cosmic, energy, etc.
  tier?: 'base' | 'pro';          // Access control
  vertexShader: string;
  fragmentShader: string;
  uniforms?: Record<string, any>;
  controls?: ControlDefinition[];
}
```

### Shader Categories & Tiers

#### Base Tier (Free - 13 Shaders)
- **Atmospheric** (4): Atmosphere, Aura Waves, Light Pillar, Swirling Gas
- **Cosmic** (2): Singularity, BiFrost Bridge
- **Geometric** (1): Ripple Grid
- **Dark** (1): Dark Veil
- **Mythical** (1): BiFrost Bridge
- **Space** (1): Hyperspeed (pro), Star Field (pro)
- **Energy** (1): Laser Flow (pro), Lightning (pro)
- **Cyberpunk** (1): Matrix Rain (pro)
- **Organic** (1): Silky Lines (pro)
- **Abstract** (1): Color Halo (pro)

#### Pro Tier (Premium - 10 Shaders)
- **Cosmic**: Black Hole, Accretion Disk
- **Energy**: Laser Flow, Lightning, Atomic Nucleus
- **Space**: Hyperspeed, Star Field
- **Cyberpunk**: Matrix Rain
- **Organic**: Silky Lines
- **Abstract**: Color Halo

### Automatic Discovery System
- **Filesystem Scanning**: `user/` directory for `.ts` shader files
- **Dynamic Imports**: Vite `import.meta.glob()` for hot reloading
- **Registry Integration**: Metadata stored in `packages/config/registry/index.json`
- **Type Safety**: Full TypeScript support with proper interfaces

## Component Registry System

### Registry Structure
```json
{
  "background-studio": {
    "name": "Background Studio",
    "description": "Premium WebGL shader background effects",
    "category": "background",
    "tier": "premium",
    "shaders": {
      "user": [
        {
          "name": "Shader Name",
          "file": "shaders/user/shader-file.ts",
          "description": "Shader description",
          "category": "category",
          "tier": "base|pro"
        }
      ]
    }
  }
}
```

## Critical Configuration Files

### 1. Shader Manager (`shader-manager.ts`)
- WebGL context initialization
- Shader program compilation
- Uniform management
- Rendering pipeline

### 2. Shader Loader (`shader-loader.ts`)
- Automatic shader discovery
- Dynamic module loading
- Error handling and fallbacks
- Performance optimization

### 3. Background Studio (`background-studio.tsx`)
- React component with premium UI
- Real-time parameter controls
- Shader switching interface
- Performance monitoring

### 4. Registry (`packages/config/registry/index.json`)
- Component metadata
- Shader listings with tiers
- Dependency management
- Version control

## Build & Development

### Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "type-check": "tsc --noEmit"
}
```

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
```

### Path Mappings (tsconfig.json)
```json
{
  "paths": {
    "@/*": ["./*"],
    "@/packages/*": ["../mjolnirui-registry/packages/*/src"]
  }
}
```

## Quality Assurance

### TypeScript Configuration
- Strict mode enabled
- Path mapping for monorepo
- Isolated modules
- ESNext modules with bundler resolution

### Linting & Formatting
- ESLint with Next.js rules
- Prettier for code formatting
- Pre-commit hooks (planned)

### Testing Strategy
- Component unit tests (planned)
- Shader validation tests (planned)
- E2E testing with Playwright (planned)

## Performance Optimizations

### Shader System
- WebGL context sharing
- Shader program caching
- Uniform batching
- Frame rate limiting

### Build Optimizations
- Tree shaking
- Code splitting
- Image optimization disabled (`images: { unoptimized: true }`)
- Bundle analysis (planned)

### Runtime Optimizations
- Intersection Observer for visibility
- RequestAnimationFrame throttling
- Memory leak prevention
- Error boundaries

## Known Issues & Solutions

### 1. Path Resolution
**Issue**: Monorepo path mapping complexity
**Solution**: Use relative imports for internal packages, maintain clear export structure

### 2. Shader Loading
**Issue**: Dynamic imports in production
**Solution**: Pre-build shader registry, lazy loading with error boundaries

### 3. Type Safety
**Issue**: Complex shader uniform types
**Solution**: Strong TypeScript interfaces, runtime validation

### 4. Performance
**Issue**: Heavy WebGL contexts on mobile
**Solution**: Progressive enhancement, canvas fallbacks

## Future Enhancements

### Phase 1: Core Stability
- [ ] Complete shader test suite
- [ ] Performance monitoring dashboard
- [ ] Error reporting system
- [ ] Automated shader validation

### Phase 2: Advanced Features
- [ ] Shader presets and templates
- [ ] Real-time collaboration
- [ ] Advanced post-processing effects
- [ ] Mobile optimizations

### Phase 3: Ecosystem
- [ ] Plugin system for custom shaders
- [ ] Community shader marketplace
- [ ] Integration with design tools
- [ ] AI-powered shader generation

## Self-Healing Guidelines

### Error Detection
1. **TypeScript Errors**: Run `npx tsc --noEmit` regularly
2. **Build Failures**: Check for missing dependencies or path issues
3. **Runtime Errors**: Monitor console for WebGL/shader issues
4. **Import Errors**: Verify export structure and path mappings

### Automated Fixes
1. **Missing Exports**: Add to `packages/ui/src/index.ts`
2. **Path Issues**: Use relative imports for monorepo packages
3. **Type Errors**: Update interfaces in `shader-manager.ts`
4. **Build Issues**: Check `next.config.js` and environment variables

### Continuous Improvement
1. **Performance**: Monitor bundle size and runtime performance
2. **Compatibility**: Test across browsers and devices
3. **Accessibility**: Ensure keyboard navigation and screen reader support
4. **Security**: Regular dependency updates and security audits

## Contact & Support

### Development Team
- **Lead Developer**: Mjolnir Design Studios
- **Tech Stack**: Next.js, React, TypeScript, WebGL
- **Repository**: Private monorepo with Turborepo

### Documentation
- **API Docs**: Inline JSDoc comments
- **Component Docs**: Storybook (planned)
- **User Guide**: Integrated help system (planned)

---

*This reference file is automatically maintained by OdinAI for continuous self-healing and improvement of the Mjolnir Design Studios platform.*