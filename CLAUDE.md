# Mjolnir Design Studios — Claude Project Overview

**Last Updated:** 2026-03-08
**Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v3, Supabase, Stripe, Prisma, Three.js / R3F, GSAP, Framer Motion

---

## What This Project Is

**Mjolnir Design Studios** is a premium digital agency SaaS platform based in Tampa, FL ("Lightning Capital of the World"). It combines high-end business consulting, digital business development, and design services into a single one-stop software-as-a-service offering.

**Domain:** `mjolnirdesignstudios.com`

---

## Business Model

### Subscription Tiers (Stripe)
| Tier | Monthly | Annual | Target |
|------|---------|--------|--------|
| Base | $10 | $100 | Startups |
| Pro | $50 | $500 | Growing businesses |
| Elite | $500 | $5,000 | Enterprises |
| Custom | BTC only | BTC only | Custom / Bitcoin clients |

**Workshop Products:**
- Live Workshop (In-Person): $500 one-time payment via Stripe → Calendly scheduling
- Live Webinar (Virtual): $250 — Coming soon

### Core Product Lines
1. **Business Consulting** — Startups and existing businesses
2. **Digital Business Development** — Full-stack web & app builds
3. **Design Services** — 3D, AI integrations (Claude/Gemini/Grok), animations, API dev, avatars, logos, icons, components, video/image gen
4. **MjolnirUI Pro** — Premium web design studio / component library with freemium + paid tiers
5. **OdinAI** — Premium MCP server integration AI assistant (currently uses Ollama local model)
6. **Workshop Series** — Live in-person + webinar sessions (Calendly-managed)
7. **3D Modeling / Blender / Meshy** — Planned for late 2026+
8. **Premium 3D Printing** — High-tier service, planned 2026+

### Revenue Channels
- Stripe subscriptions (Base/Pro/Elite)
- Stripe one-time payments (workshops)
- Bitcoin payments (Custom tier — hardcoded BTC address in Pricing.tsx)
- Newsletter / Resend (educational tools)

---

## Project Architecture

### Directory Structure
```
app/
├── (protected)/          # Auth-gated routes (Supabase client-side check)
│   ├── admin/            # Full admin dashboard (Recharts, mock data → needs real queries)
│   ├── blocks/           # MjolnirUI Pro component registry dashboard
│   │   ├── dashboard/    # Welcome / component showcase
│   │   ├── build/        # Build page
│   │   ├── forge/        # Forge page
│   │   ├── installation/ # Installation docs
│   │   └── get-started/  # Onboarding
│   └── profile/          # User profile
├── (public)/             # Public pages
│   ├── page.tsx          # HOMEPAGE: Hero + About + Blocks + WorkshopSignup + Pricing + Footer
│   ├── login/            # Supabase OAuth (GitHub, Twitter) + Web3 (disabled)
│   ├── intake/           # Client intake form → Supabase + HubSpot
│   ├── pricing/          # Dedicated pricing page
│   ├── forge/            # Forge info page
│   ├── workshop/         # Workshop page
│   ├── success/          # Post-payment success page
│   ├── agreement/        # Agreement/contract page
│   └── termsofservice/   # Terms of service
├── api/
│   ├── auth/[...nextauth]/ # NextAuth route handler (BROKEN — see issues)
│   ├── stripe/
│   │   ├── checkout/     # Create Stripe checkout session
│   │   └── checkout/webhook/ # Stripe webhook handler
│   ├── calendly/webhook/ # Calendly booking webhook → Supabase + HubSpot
│   ├── hubspot/intake/   # HubSpot contact create/update
│   ├── intake/           # Intake form → Supabase workshop_intake table
│   ├── odin/chat/        # OdinAI chat endpoint (uses Ollama local)
│   ├── chat/odin/        # Duplicate Odin endpoint (needs consolidation)
│   ├── admin/
│   │   ├── dashboard/    # Dashboard metrics (USES MOCK DATA)
│   │   ├── contacts/     # Fetch HubSpot contacts
│   │   ├── payments/     # Fetch Stripe payment intents (REAL data)
│   │   └── agent-data/   # Agent data endpoint
│   └── meshy/generate/   # Meshy 3D generation endpoint
├── auth/
│   ├── signin/           # Alt sign-in page
│   └── admin/            # Admin auth page
└── cdn/[...path]/        # Local CDN proxy route

components/
├── Hero.tsx              # GSAP ScrollTrigger pinned hero
├── About.tsx             # About section
├── Blocks.tsx            # MjolnirUI blocks preview
├── Pricing.tsx           # Stripe + Bitcoin pricing cards
├── WorkshopSignup.tsx    # Workshop payment + Calendly QR
├── Footer.tsx            # Site footer
├── Forge.tsx             # Forge section
├── ai/                   # OdinAI components (Base/Pro/Elite tiers)
├── layout/               # UserDashboard, UserNavbar, UserSidebar, SidebarContext
├── mjolnirui/forge/      # Forge prompt components (V1/V2/V3, AgenticAI)
├── proto/                # HeroEpic prototype
├── three/                # Three.js Scene + SceneClient
├── ui/
│   ├── Animations/       # Background (R3F), Accretion, StarField, Globe, Lightning, etc.
│   ├── Banners/          # NewYear, Sponsorship banners
│   ├── Buttons/          # EmeraldShimmer, RainbowButton, ShimmerButton
│   ├── Dashboards/       # Header/sidebar for dashboard
│   ├── Navigation/       # Navbar, FloatingNav, CardNav, Sidebar
│   └── TextEffects/      # ColorfulText, GradientText, TextGenerateEffect
├── wallets/              # DigitalWallet, Lightning, XRPL connectors
└── gsap/                 # GSAPProvider

lib/
├── supabase/
│   ├── client.ts         # Browser Supabase client (anon key)
│   └── server.ts         # Server Supabase client (anon key + cookies)
├── cdn-assets.ts         # CDN asset references
├── cdn-config.ts         # CDN configuration
├── cloudinary.ts         # Cloudinary setup
└── utils.ts              # cn() utility

data/
├── LightningVFX.json     # 221KB Lottie animation
├── confetti.json         # 614KB Lottie animation
├── globe.json            # 418KB animation data
└── index.ts              # Data exports

prisma/
└── schema.prisma         # Single User model (minimal — most data in Supabase)

packages/
└── registry/index.json   # Component registry (to be populated)

mjolnirui-registry/       # Turborepo submodule — MjolnirUI component library
```

---

## Auth System

**Primary Auth: Supabase Auth**
The login page (`/login`) uses Supabase OAuth providers:
- GitHub OAuth
- Twitter/X OAuth
- Web3 Wallet (disabled, coming soon)

Protected routes use a client-side check in `app/(protected)/layout.tsx` that calls `supabaseClient.auth.getUser()` and redirects unauthenticated users.

**Secondary Auth: NextAuth (BROKEN)**
`app/api/auth/[...nextauth]/route.ts` imports from `@/auth`, but `auth.ts` is a React component, not a NextAuth config. NextAuth is not functional.

**Decision needed:** Consolidate to Supabase Auth only (recommended) or fix and integrate NextAuth.

---

## External Integrations

| Service | Status | Notes |
|---------|--------|-------|
| Stripe | Partial | Checkout works; webhook handler is bare-bones; price IDs are placeholders |
| Supabase | Working | Auth + DB; tables: `workshop_signups`, `workshop_intake`, `profiles` |
| HubSpot | Working | Contact create/update via API; HUBSPOT_API_KEY needed in .env |
| Calendly | Partial | Webhook receives bookings; NO signature verification |
| Cloudinary | Configured | `lib/cloudinary.ts` set up |
| Ollama | Dev only | OdinAI uses local Ollama (`annabelle` model) — won't work in production |
| Meshy | API key set | 3D generation endpoint exists |
| Prisma | Minimal | Only User model; DATABASE_URL not set in .env.local |
| tRPC | Installed | Dependencies present but no implementation found |
| Twitter API v2 | Installed | No usage found |
| Web3Auth | In code | Client component references; NEXT_PUBLIC_WEB3AUTH_CLIENT_ID not in env |
| Remotion | Not yet | Planned for animations/video/thumbnails |
| Resend | Not yet | Planned for newsletter |

---

## Key Environment Variables

**Required (some missing from .env.local):**
```
NEXT_PUBLIC_SUPABASE_URL          ✅ set
NEXT_PUBLIC_SUPABASE_ANON_KEY     ✅ set
SUPABASE_SERVICE_ROLE_KEY         ❌ MISSING (needed for server-side admin ops)
STRIPE_SECRET_KEY                 ✅ set
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ✅ set
STRIPE_WEBHOOK_SECRET             ❌ MISSING (webhook will fail in production)
STRIPE_WORKSHOP_LIVE_PRICE_ID     ✅ set
NEXTAUTH_SECRET                   ❌ MISSING
HUBSPOT_API_KEY                   ❌ MISSING (PORTAL_ID and FORM_ID set, but not API key)
MESHY_API_KEY                     ✅ set
NEXT_PUBLIC_SITE_URL              ✅ set
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID    ❌ MISSING
DATABASE_URL                      ❌ MISSING (needed for Prisma)
```

---

## Planned Features (Not Yet Built)
- [ ] OdinAI — production AI (replace Ollama with Claude/Gemini API)
- [ ] MjolnirUI Pro — full component registry with freemium/paid paywalls
- [ ] Enhanced user dashboard with component library
- [ ] Admin dashboard with real data (currently uses mock data)
- [ ] Business prompt library (AI prompt generation from intake form)
- [ ] Remotion animations for social media
- [ ] Resend newsletter integration
- [ ] 3D modeling (Blender/Meshy integration)
- [ ] Premium 3D printing service
- [ ] Webinar product (Calendly + Zoom/streaming)

---

## Performance Considerations
- GSAP ScrollTrigger pin in Hero (heavy on mobile)
- Three.js background with 6000 stars + floating clouds
- Large Lottie JSON files (614KB confetti, 418KB globe, 221KB lightning)
- `images: { unoptimized: true }` in next.config.ts — kills Next.js image optimization
- `clientlayout.tsx` returns null before client mount — causes full-page FOUC
- Both Framer Motion AND Motion packages installed (same library, duplicated)
- Both GSAP and Framer Motion in use

---

## Critical Bugs To Fix (Priority Order)

1. **`output: 'export'` in next.config.ts** — Remove this or ALL API routes will be dead in production
2. **`auth.ts` is wrong file** — Root `auth.ts` is a React component, not NextAuth config
3. **`supabaseServer` import error** in `app/api/odin/chat/route.ts` — exports `createSupabaseServerClient` not `supabaseServer`
4. **`supabaseClient` import error** in `app/api/intake/route.ts` — same issue
5. **Missing `Mjolnir3D` component** referenced in `Background.tsx`
6. **Stripe price IDs are placeholder strings** — Need real Stripe price IDs
7. **STRIPE_WEBHOOK_SECRET missing** — Webhook handler will throw
8. **HUBSPOT_API_KEY missing** — HubSpot routes will return 500
9. **Calendly webhook has no signature verification** — Security risk
10. **Admin API has no role check** — Any authenticated user can access admin data

---

## Component Registry Plan (MjolnirUI Pro)
- Freemium tier: Basic components freely accessible
- Pro tier ($50/mo): Advanced components, 3D assets, premium templates
- Elite tier ($500/mo): Source code, custom builds, OdinAI access
- Registry location: `packages/registry/index.json` + `mjolnirui-registry/` submodule

## Upcoming Major Features
- **OdinAI Chatbot** — Full agentic AI assistant powered by Claude API
- **Enhanced User Dashboard** — Component library browser with paywall gates
- **Admin Dashboard** — Business intelligence with Recharts visualizations, real Stripe + Supabase data
- **Business Prompt Library** — Auto-generate detailed prompts from intake form data
