import { createServerClient } from "@supabase/ssr";
import { createClient as createJsClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_ANON, isConfigured } from "./config";

// Server-side client that acts as the logged-in user (Row Level Security applies).
export async function createClient() {
  if (!isConfigured) return null;
  const store = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Called from a Server Component: cookies are refreshed by proxy.js instead.
        }
      },
    },
  });
}

// Server-only client with the service-role key. Bypasses security rules, so it is
// used ONLY inside the login/register API routes and never sent to the browser.
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!isConfigured || !key) return null;
  return createJsClient(SUPABASE_URL, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

// Public, cookie-free client for pages anyone can see (work + reviews).
export function createPublicClient() {
  if (!isConfigured) return null;
  return createJsClient(SUPABASE_URL, SUPABASE_ANON, { auth: { persistSession: false } });
}
