import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON, isConfigured } from "./config";

let client;

// Browser-side Supabase client (used for Google sign-in and image upload).
export function createClient() {
  if (!isConfigured) return null;
  if (!client) client = createBrowserClient(SUPABASE_URL, SUPABASE_ANON);
  return client;
}
