"use client";

import { createBrowserClient } from "@supabase/ssr";

// Fallback placeholders prevent build-time crashes when env vars are
// injected at runtime. At runtime, NEXT_PUBLIC_ vars are always present.
export const supabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key"
);