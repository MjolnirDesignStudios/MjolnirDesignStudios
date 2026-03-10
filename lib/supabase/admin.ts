// lib/supabase/admin.ts — Service Role Client (bypasses RLS)
// ⚠️ NEVER expose this client in browser code — server-only
import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("[supabase/admin] SUPABASE_SERVICE_ROLE_KEY is not set — admin operations will fail");
}

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
