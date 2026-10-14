import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { isEmail, normalizePhone, safeNext } from "@/lib/phone";

const BAD = "Wrong email/phone or password.";

export async function POST(req) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "The portal is not set up yet." }, { status: 503 });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const identifier = String(body.identifier || "").trim();
  const password = String(body.password || "");
  if (!identifier || !password) return NextResponse.json({ error: "Enter your email or phone and your password." }, { status: 400 });

  // Work out the email: either typed directly, or looked up from the phone number.
  let email = "";
  if (isEmail(identifier)) {
    email = identifier.toLowerCase();
  } else {
    const phone = normalizePhone(identifier);
    if (!phone) return NextResponse.json({ error: "Enter a valid email or phone number." }, { status: 400 });
    const admin = createAdminClient();
    if (!admin) return NextResponse.json({ error: "Phone login is not set up yet. Use your email." }, { status: 503 });
    const { data } = await admin.from("profiles").select("email").eq("phone", phone).maybeSingle();
    if (!data?.email) return NextResponse.json({ error: BAD }, { status: 401 });
    email = data.email;
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data?.user) return NextResponse.json({ error: BAD }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
  const fallback = profile?.role === "admin" ? "/admin" : "/portal";
  const redirect = profile?.role === "admin" ? "/admin" : safeNext(body.next, fallback);
  return NextResponse.json({ ok: true, redirect });
}
