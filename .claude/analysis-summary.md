# Mjolnir Design Studios — Project Viability Summary

**Date:** 2026-03-08
**Verdict: HIGH POTENTIAL — but needs critical fixes before production launch**

---

## Executive Summary

Mjolnir Design Studios is a well-conceived premium SaaS platform with a distinctive brand identity, strong visual design philosophy, and a comprehensive service offering that legitimately commands premium pricing. The Norse mythology theme ("Thunderous UI/UX," Tampa Lightning Capital branding) creates a memorable identity that differentiates it from generic agencies.

**The business concept is solid and commercially viable.** The tech stack is modern and impressive. However, there are currently **5 production-blocking bugs** that would prevent the site from functioning correctly if deployed today, plus several security issues that need immediate attention.

---

## Viability Score: 7.5/10

| Dimension | Score | Notes |
|-----------|-------|-------|
| Business Concept | 9/10 | Strong niche, premium positioning, multiple revenue streams |
| Brand/Design | 9/10 | Distinctive, memorable, premium feel |
| Architecture | 7/10 | Good structure, dual-auth confusion, needs cleanup |
| Code Quality | 6/10 | Several broken imports, mock data in production |
| Security | 5/10 | No webhook verification, weak admin auth, live keys in file |
| Performance | 6/10 | Heavy GPU load, FOUC, unoptimized images, large JSON |
| Integration Status | 6/10 | Most integrations wired but incomplete/broken |
| Production Readiness | 4/10 | `output: 'export'` bug alone makes it non-functional |

---

## Top 5 Must-Fix Before Launch

### 1. Remove `output: 'export'` from `next.config.ts`
**This single setting makes every API route non-functional.** Stripe checkout, HubSpot, Calendly, Supabase writes — everything will silently fail. Remove this line immediately.

### 2. Fix Auth System (Choose One)
The project has NextAuth half-installed but broken, and Supabase Auth actually working. Remove the dead NextAuth code (`auth.ts`, `app/api/auth/`) and commit fully to Supabase Auth — which is already working well with GitHub and Twitter OAuth.

### 3. Fix OdinAI API Route
Two broken imports: wrong function name for Supabase client, object-not-number token limit bug, wrong array access for reply. OdinAI is a flagship product — it needs to work.

### 4. Create Real Stripe Price IDs
The checkout will fail for every subscription tier because the price IDs are placeholder strings (`price_new_base_monthly` etc.). Create real prices in your Stripe dashboard and update the component.

### 5. Add Missing Environment Variables
- `SUPABASE_SERVICE_ROLE_KEY` — server-side database operations
- `STRIPE_WEBHOOK_SECRET` — payment confirmation
- `HUBSPOT_API_KEY` — CRM sync

---

## Service Integration Status

### ✅ Working / Well-Configured
- **Supabase Auth** — GitHub + Twitter OAuth, protected route redirects
- **Stripe Checkout** — Session creation works (once `output: 'export'` removed)
- **HubSpot Contact Sync** — Create/update logic is solid (needs API key in env)
- **Calendly Webhook** — Receives and processes bookings (needs signature verification)
- **Cloudinary** — Configured as image CDN

### ⚠️ Partially Working
- **Stripe Webhooks** — Receives events but no fulfillment logic (no subscription tier update, no email)
- **OdinAI** — Broken imports + uses local Ollama (dev only, not production-ready)
- **Admin Dashboard** — UI is excellent, but uses hardcoded mock data

### ❌ Not Functional / Not Yet Built
- **NextAuth** — Dead code, broken config
- **Prisma** — Missing `DATABASE_URL`, minimal schema
- **Resend** — Planned but not implemented
- **Remotion** — Planned but not implemented
- **Web3 Wallet Login** — UI shows "Coming Soon," `signInWithWeb3` may not exist in Supabase SDK
- **Webinar Product** — UI shows "Coming Soon"
- **Component Paywall** — MjolnirUI registry exists but no paywall gates implemented
- **Business Prompt Generator** — Planned feature, not started

---

## Revenue Readiness

| Product | Can Take Money? | Issue |
|---------|-----------------|-------|
| Base Subscription | ❌ No | `output: 'export'` + placeholder price IDs |
| Pro Subscription | ❌ No | Same |
| Elite Subscription | ❌ No | Same |
| Custom (Bitcoin) | ✅ Yes | BTC address shown in modal, no server needed |
| Live Workshop | ❌ No | `output: 'export'` blocks checkout |
| Webinar | ❌ No | Not built yet |

**After the 5 critical fixes: Base/Pro/Elite/Workshop checkout will work.**

---

## Performance Assessment

**GPU Load:** The site runs Three.js stars + floating clouds + GSAP pinned scroll + Framer Motion simultaneously. On mobile/mid-range devices, this will cause frame drops. The 3D background (`Background.tsx`) references a missing `Mjolnir3D` component — likely a 3D hammer model not yet created.

**Bundle Size Concerns:**
- 614KB confetti.json loaded in data/
- 418KB globe.json loaded in data/
- 221KB LightningVFX.json loaded in data/
- Both `framer-motion` and `motion` packages (same library, doubled)
- Unused packages: tRPC, Twitter API v2

**Image Performance:** `unoptimized: true` in next.config.ts means no WebP, no responsive images. Combined with shader backgrounds, this is heavy.

**FOUC Issue:** `clientlayout.tsx` returning `null` until client hydration means every page shows nothing briefly on first load. This hurts perceived performance and SEO.

---

## Security Scorecard

| Issue | Severity | Status |
|-------|----------|--------|
| Live Stripe keys in `.env.production` | HIGH | File exists, gitignored, but risky |
| Calendly webhook no signature check | HIGH | Active vulnerability |
| Admin API no auth/role check | HIGH | Any user can call |
| Protected routes client-side only | MEDIUM | Content flashes before redirect |
| Bitcoin address hardcoded in component | LOW | Operationally risky |
| No rate limiting on API routes | MEDIUM | Not addressed |
| No CSRF protection | LOW | Next.js provides some protection |

---

## Architecture Recommendations

### Short Term (Before Launch)
1. Fix the 5 critical bugs
2. Consolidate auth to Supabase only
3. Add proper Next.js Middleware for protected routes
4. Add Calendly webhook signature verification
5. Add admin role check (store admin flag in Supabase user metadata)

### Medium Term (Month 1-2)
1. Replace Ollama with Anthropic Claude API for OdinAI
2. Wire admin dashboard to real Stripe + Supabase data
3. Implement Stripe webhook fulfillment (update user subscription tier in Supabase)
4. Add Resend for transactional emails and newsletter
5. Remove tRPC and Twitter API v2 dead dependencies
6. Fix FOUC — refactor ClientLayout

### Long Term (Quarter 1-2)
1. Build MjolnirUI component registry with paywall gates
2. Implement business prompt library
3. Add Remotion for video/animation assets
4. Blender/Meshy 3D integration
5. 3D Printing service tier

---

## Competitive Positioning

This platform is positioned to compete with:
- **Webflow** (design-forward SaaS)
- **Framer** (designer-focused tools)
- **Toptal/Upwork** premium tier agencies
- **UI component marketplaces** (Shadcn, Aceternity, etc.)

The differentiators that justify premium pricing:
1. **All-in-one**: Consulting + Dev + Design + AI tools in one platform
2. **Brand narrative**: Nordic/mythological identity resonates with technical founders
3. **3D/animation focus**: Few agencies specialize in this level of visual fidelity
4. **AI integration**: OdinAI as a proprietary tool creates lock-in
5. **Bitcoin support**: Appeals to Web3/privacy-first clients
6. **Tampa roots**: Regional brand identity + Lightning Capital narrative

---

## Bottom Line

**This is a commercially sound, technically ambitious project with a distinctive brand.** The visual design quality, business model breadth, and tech choices are all excellent. The main issues are implementation completeness rather than conceptual problems.

**Time to production-ready estimate:** 1-2 focused development days to fix the critical bugs and wire up the missing pieces. The platform is much closer to launch-ready than the bug count suggests — most issues are configuration errors (env vars, wrong import names) rather than architectural problems.

**Long-term revenue potential:** The subscription model combined with workshops and custom Bitcoin clients gives multiple revenue channels. At scale, Base ($10) × 1,000 users + Pro ($50) × 200 users + Elite ($500) × 20 users = $30,000/month baseline from subscriptions alone, not counting workshop revenue.

---

## Files Created by This Analysis
- `/CLAUDE.md` — Full project overview for future Claude sessions
- `/.claude/analysis-log.md` — Detailed bug and issue log with file:line references
- `/.claude/analysis-summary.md` — This file
