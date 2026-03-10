-- ============================================================
-- Mjolnir Design Studios — Initial Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Extensions ─────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── profiles ───────────────────────────────────────────────
-- Auto-created on user sign-up via trigger (see below)
CREATE TABLE IF NOT EXISTS public.profiles (
  id                  UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email               TEXT        UNIQUE,
  full_name           TEXT,
  avatar_url          TEXT,

  -- Subscription
  subscription_tier   TEXT        DEFAULT NULL,           -- 'Base' | 'Pro' | 'Elite' | NULL
  subscription_status TEXT        DEFAULT 'inactive',      -- 'active' | 'inactive' | 'past_due' | 'cancelled'
  stripe_customer_id  TEXT        UNIQUE DEFAULT NULL,
  last_payment_date   TIMESTAMPTZ DEFAULT NULL,

  -- Usage / tokens for OdinAI
  tokens_used         BIGINT      DEFAULT 0,
  tokens_limit        BIGINT      DEFAULT 0,

  -- Admin flag
  is_admin            BOOLEAN     DEFAULT FALSE,

  -- Platform (MDS vs MjolnirUI)
  platform            TEXT        DEFAULT 'mjolnir_design_studios',

  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── workshop_signups ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.workshop_signups (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  email               TEXT        NOT NULL,
  name                TEXT        NOT NULL,
  phone               TEXT,

  -- Workshop details
  workshop_type       TEXT        NOT NULL DEFAULT 'live', -- 'live' | 'webinar'
  scheduled_date      TIMESTAMPTZ,
  amount              NUMERIC(10,2) DEFAULT 500,
  status              TEXT        DEFAULT 'confirmed',      -- 'confirmed' | 'cancelled' | 'completed'
  payment_status      TEXT        DEFAULT 'pending',        -- 'pending' | 'paid' | 'refunded'

  -- Integration references
  source              TEXT        DEFAULT 'direct',         -- 'calendly' | 'direct' | 'qr'
  calendly_event_id   TEXT        UNIQUE DEFAULT NULL,
  stripe_payment_id   TEXT        DEFAULT NULL,
  last_workshop_payment TIMESTAMPTZ DEFAULT NULL,

  -- Platform
  platform            TEXT        DEFAULT 'mjolnir_design_studios',

  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── workshop_intake ─────────────────────────────────────────
-- Detailed intake form submitted after booking
CREATE TABLE IF NOT EXISTS public.workshop_intake (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  email               TEXT        NOT NULL UNIQUE,
  name                TEXT        NOT NULL,
  phone               TEXT,
  dob                 DATE,
  address             TEXT,

  -- Business info
  business_name       TEXT,
  industry            TEXT,
  current_website     TEXT,
  goals               TEXT,

  -- Integration
  calendly_event_id   TEXT,
  submitted_at        TIMESTAMPTZ DEFAULT NOW(),
  platform            TEXT        DEFAULT 'mjolnir_design_studios',

  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_profiles_email            ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer  ON public.profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_tier             ON public.profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_workshop_email            ON public.workshop_signups(email);
CREATE INDEX IF NOT EXISTS idx_workshop_status           ON public.workshop_signups(status);
CREATE INDEX IF NOT EXISTS idx_workshop_payment_status   ON public.workshop_signups(payment_status);
CREATE INDEX IF NOT EXISTS idx_intake_email              ON public.workshop_intake(email);

-- ── Auto-create profile on sign-up ──────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ── Auto-update updated_at ───────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS on_workshop_updated ON public.workshop_signups;
CREATE TRIGGER on_workshop_updated
  BEFORE UPDATE ON public.workshop_signups
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_intake  ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own row
CREATE POLICY "users_own_profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

-- Admins can read all profiles (service role bypasses RLS)
CREATE POLICY "service_role_full_access_profiles" ON public.profiles
  FOR ALL TO service_role USING (TRUE);

-- Workshop signups: only service role can write; users can read their own
CREATE POLICY "users_own_signups" ON public.workshop_signups
  FOR SELECT USING (email = auth.jwt()->>'email');
CREATE POLICY "service_role_full_access_signups" ON public.workshop_signups
  FOR ALL TO service_role USING (TRUE);

-- Intake: users can read their own
CREATE POLICY "users_own_intake" ON public.workshop_intake
  FOR SELECT USING (email = auth.jwt()->>'email');
CREATE POLICY "service_role_full_access_intake" ON public.workshop_intake
  FOR ALL TO service_role USING (TRUE);

-- ── Make yourself admin ───────────────────────────────────────
-- Run this AFTER your first login to grant yourself admin access:
-- UPDATE public.profiles SET is_admin = TRUE WHERE email = 'contact@mjolnirdesignstudios.com';
