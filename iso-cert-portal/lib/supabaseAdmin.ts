import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-only client using the service role key, which bypasses Row Level
// Security. Never import this from client-side code (components, hooks) —
// only from server routes (server.ts, api/**). It exists so a webhook with
// no authenticated user session (e.g. Stripe) can still write trusted rows.
//
// Built lazily (on first use, not at import time): server.ts loads
// .env.local via dotenv in its own top-level code, but ES module imports
// resolve — and this module's top-level code would run — before that,
// which would crash with an empty Supabase URL if the client were built
// eagerly here.
let client: SupabaseClient | null = null;

export const getSupabaseAdmin = (): SupabaseClient => {
  if (!client) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error(
        "Supabase admin client is missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY."
      );
    }
    client = createClient(supabaseUrl, serviceRoleKey);
  }
  return client;
};
