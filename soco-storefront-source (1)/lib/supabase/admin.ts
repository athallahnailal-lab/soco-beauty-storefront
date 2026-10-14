import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase admin client.
 * Import ONLY from Route Handlers / server-only modules. Never expose this key to the browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createSupabaseClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
}
