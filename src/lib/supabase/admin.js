import { createClient } from "@supabase/supabase-js";

// Service-role client for server-only reads that need to bypass RLS —
// e.g. showing a reviewer's display_name to visitors who aren't that user.
// Never import this from a Client Component or expose its results beyond
// the specific public-safe fields being read.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}
