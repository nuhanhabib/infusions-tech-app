import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/phone";

// Google sign-in lands here. We swap the code for a session, then send the person to the right place.
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"), "");
  const supabase = await createClient();
  if (!supabase || !code) return NextResponse.redirect(`${origin}/login?error=auth`);

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${origin}/login?error=auth`);

  if (next === "/reset-password") return NextResponse.redirect(`${origin}/reset-password`);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role, phone").eq("id", user.id).maybeSingle();

  if (profile?.role === "admin") return NextResponse.redirect(`${origin}/admin`);
  if (!profile?.phone) return NextResponse.redirect(`${origin}/portal/complete-profile`);
  return NextResponse.redirect(`${origin}${next || "/portal"}`);
}
