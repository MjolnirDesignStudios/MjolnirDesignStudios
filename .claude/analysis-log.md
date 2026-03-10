# Mjolnir Project — Detailed Analysis & Fix Log

**Analysis Date:** 2026-03-08
**Fix Session:** 2026-03-09
**Analyst:** Claude Sonnet 4.6

---

## SESSION 1 (2026-03-08) — Initial Analysis

See original analysis in this file's git history or summary in `analysis-summary.md`.

---

## SESSION 2 (2026-03-09) — Critical Fixes Implemented

### ✅ FIXED: `output: 'export'` removed from next.config.ts
**File:** `next.config.ts`
Removed the static export setting that was killing all API routes. Site now deploys as a full Node.js Next.js app (required for Stripe, HubSpot, Calendly, Supabase).

---

### ✅ FIXED: Supabase admin client created
**File:** `lib/supabase/admin.ts` (new)
Service role client that bypasses RLS — used in server-side API routes that need admin access (webhooks, intake form, admin dashboard).

---

### ✅ ADDED: Resend email service
**Package:** `resend@^6.9.3` installed
**File:** `lib/email.ts` (new)
Three email functions:
- `sendSubscriptionConfirmation()` — fires after successful Stripe checkout
- `sendWorkshopConfirmation()` — fires after Calendly booking
- `sendAdminNotification()` — internal alerts for new signups, payments, cancellations

---

### ✅ FIXED: Stripe checkout route
**File:** `app/api/stripe/checkout/route.ts`
- Updated to latest Stripe API version (`2025-08-27.basil`)
- Added user authentication — reads Supabase session to get user ID + email
- Passes `userId`, `tier`, `platform` as Stripe session metadata (needed by webhook)
- Pre-fills `customer_email` from Supabase auth
- Handles workshop products correctly

---

### ✅ COMPLETED: Stripe webhook fulfillment
**File:** `app/api/stripe/checkout/webhook/route.ts`
- Signature verification via `STRIPE_WEBHOOK_SECRET` ✅
- Handles: `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.deleted`, `customer.subscription.updated`
- Uses `supabaseAdmin` (service role) to update `profiles` table — bypasses RLS
- Fires `sendSubscriptionConfirmation()` Resend email on new subscription
- Fires `sendWorkshopConfirmation()` Resend email on workshop payment
- Admin notification email on all events
- Graceful fallback: returns 200 even on processing error (prevents Stripe retry storms)

---

### ✅ SECURED: Calendly webhook
**File:** `app/api/calendly/webhook/route.ts`
- HMAC-SHA256 signature verification using `CALENDLY_WEBHOOK_SIGNING_KEY`
- Timing-safe comparison (`timingSafeEqual`) to prevent timing attacks
- 5-minute stale event rejection
- Graceful dev mode (skips verification if key not set)
- Handles `invitee.created` and `invitee.canceled`
- Saves to `workshop_signups` via `supabaseAdmin`
- Syncs to HubSpot (create or update contact)
- Fires `sendWorkshopConfirmation()` + admin notification via Resend

---

### ✅ REBUILT: Intake form API route
**File:** `app/api/intake/route.ts` (recreated — Grok deleted it)
- Uses `supabaseAdmin` for reliable writes (bypasses RLS)
- Upserts on email (no duplicates)
- Full HubSpot sync (create or update contact)
- Admin notification email
- Non-fatal errors — partial success is still success

---

### ✅ CONFIRMED: Admin API routes have auth checks
**Files:** `app/api/admin/contacts/route.ts`, `app/api/admin/payments/route.ts`, `app/api/admin/dashboard/route.ts`
All admin routes now verify user is authenticated AND check email against admin allow-list (`contact@mjolnirdesignstudios.com`, `admin@mjolnirdesignstudios.com`).

---

### ✅ CONFIRMED: Real Stripe price IDs in Pricing.tsx
Grok updated these to real Stripe price IDs:
- Base Monthly: `price_1T7K1dFxkFUD7EnZr3zjSJbR`
- Base Annual: `price_1T7K3UFxkFUD7EnZCyYlsSMW`
- Pro Monthly: `price_1T7K7hFxkFUD7EnZWMC8HCxA`
- Pro Annual: `price_1T7K8KFxkFUD7EnZeweUODVB`
- Elite Monthly: `price_1T8rLOFxkFUD7EnZ6YqWV43v`
- Elite Annual: `price_1T8rLpFxkFUD7EnZbzpBrARl`

---

### ✅ CREATED: Supabase migration
**File:** `supabase/migrations/001_initial_schema.sql`
Full schema for:
- `profiles` — subscription tier, Stripe customer ID, token usage, admin flag
- `workshop_signups` — bookings, payment status, Calendly event ID
- `workshop_intake` — detailed intake form data
- RLS policies for user data isolation
- Service role full access policies
- Auto-create profile trigger on auth.users INSERT
- Auto-update `updated_at` triggers

---

### ✅ UPDATED: .env.local with all required variables
New entries added (with instructions):
- `SUPABASE_SERVICE_ROLE_KEY` — from Supabase dashboard
- `STRIPE_WEBHOOK_SECRET` — from Stripe webhooks dashboard
- `HUBSPOT_API_KEY` — from HubSpot private app
- `RESEND_API_KEY` — from resend.com
- `RESEND_FROM_EMAIL` — verified sending domain
- `ADMIN_EMAIL` — admin notification recipient
- `CALENDLY_WEBHOOK_SIGNING_KEY` — from Calendly webhooks
- Stripe price IDs documented with real values

---

## REMAINING TASKS BEFORE FRIDAY LAUNCH

### Action Required By You (env vars / external setup):
1. **Supabase** → Project Settings → API → Copy `service_role` key → paste into `SUPABASE_SERVICE_ROLE_KEY`
2. **Stripe** → Developers → Webhooks → Add endpoint `https://mjolnirdesignstudios.com/api/stripe/checkout/webhook` → events: `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.deleted` → copy signing secret → paste into `STRIPE_WEBHOOK_SECRET`
3. **HubSpot** → Settings → Integrations → Private Apps → Create app with contacts read/write → copy access token → paste into `HUBSPOT_API_KEY`
4. **Resend** → resend.com → Sign up → Add DNS records for `mjolnirdesignstudios.com` → create API key → paste into `RESEND_API_KEY`
5. **Calendly** → Integrations → Webhooks → Create webhook pointing to `https://mjolnirdesignstudios.com/api/calendly/webhook` → copy signing key → paste into `CALENDLY_WEBHOOK_SIGNING_KEY`
6. **Supabase SQL Editor** → run `supabase/migrations/001_initial_schema.sql`
7. **After first login** → run: `UPDATE public.profiles SET is_admin = TRUE WHERE email = 'contact@mjolnirdesignstudios.com';`

### Still To Build (next sessions):
- [x] OdinAI chat endpoint — **DONE (Session 3)** — `app/api/odin/chat/route.ts` using `@anthropic-ai/sdk`, tier gating (Base 2.5k / Pro 25k / Elite 100k tokens), model selection (haiku for Base/Pro, sonnet for Elite)
- [ ] Business prompt library — intake form → prompt generation → OdinAI
- [ ] MjolnirUI blocks component registry with paywall gates (Pro/Elite)
- [ ] Enhanced user dashboard — component browser with tier-based access
- [x] Admin dashboard — **DONE (Session 3)** — all admin routes now use `supabaseAdmin` (service role), tier breakdown added to dashboard metrics
- [ ] Agentic AI C-Suite (SEO agent, content agent, consulting agent)
- [ ] MjolnirUI.com separate project setup
- [ ] Background animation studio
- [x] Fix FOUC in clientlayout.tsx — **DONE (Session 3)** — removed `isMounted` null guard
- [x] Fix Mjolnir3D missing component in Background.tsx — **DONE (Session 3)** — removed JSX usage, commented for v2
- [ ] Performance: lazy-load Lottie JSONs, remove duplicate motion/framer-motion

### Also Added (Session 3):
- `ANTHROPIC_API_KEY` added to `.env.local` (placeholder with instructions)
- `@anthropic-ai/sdk` installed in package.json

---

## Architecture Decision: MjolnirUI.com

**Recommendation: Separate project (separate repo/folder), shared Supabase + Stripe**

| Concern | Decision |
|---|---|
| Repository | Separate `E:/2025/mjolnirui` folder |
| Supabase | Same project — add `platform` column to filter by site |
| Stripe | Same account — different products/price IDs |
| HubSpot | Same portal — tag contacts with `source: mjolnirui` |
| Resend | Same account — different `from:` email |
| Domain | mjolnirui.com on Vercel |
| Deploy | Vercel (needs server-side for API routes) |
| Admin view | MDS admin dashboard already shows all data since shared Supabase/Stripe |
