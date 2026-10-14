import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Who is logged in right now? (cached per request)
export const getCurrent = cache(async () => {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, user: null, profile: null };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, profile: null };
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return { supabase, user, profile };
});

// Any logged-in person. Customers without a phone number (Google sign-in) are sent to finish their profile.
export async function requireUser({ allowIncomplete = false } = {}) {
  const ctx = await getCurrent();
  if (!ctx.user || !ctx.profile) redirect("/login");
  if (ctx.profile.role === "admin") redirect("/admin");
  if (!allowIncomplete && !ctx.profile.phone) redirect("/portal/complete-profile");
  return ctx;
}

export async function requireAdmin() {
  const ctx = await getCurrent();
  if (!ctx.user || !ctx.profile) redirect("/login");
  if (ctx.profile.role !== "admin") redirect("/portal");
  return ctx;
}

export const fullName = (p) => [p?.first_name, p?.last_name].filter(Boolean).join(" ").trim() || p?.email || "Customer";
