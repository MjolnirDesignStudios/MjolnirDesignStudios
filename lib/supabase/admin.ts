// lib/supabase/admin.ts — Service Role Client (bypasses RLS)
// ⚠️ NEVER expose this client in browser code — server-only
//
// Lazy singleton: client is created on first use, not at module load time.
// This prevents build-time crashes when env vars are absent during
// Next.js static page data collection (Vercel build phase).
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "[supabase/admin] NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set"
    );
  }

  _client = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _client;
}

// Convenience re-export for call sites that use `supabaseAdmin` directly.
// This is a Proxy so existing imports keep working without changes.
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseAdmin() as any)[prop];
  },
});
