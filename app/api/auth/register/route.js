import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { isEmail, normalizePhone } from "@/lib/phone";

export async function POST(req) {
  const supabase = await createClient();
  const admin = createAdminClient();
  if (!supabase || !admin) return NextResponse.json({ error: "The portal is not set up yet." }, { status: 503 });

  let b;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  if (b.website) return NextResponse.json({ ok: true, redirect: "/login" }); // honeypot: bots fill this in

  const first = String(b.firstName || "").trim();
  const last = String(b.lastName || "").trim();
  const email = String(b.email || "").trim().toLowerCase();
  const phone = normalizePhone(b.phone);
  const company = String(b.company || "").trim();
  const password = String(b.password || "");
  const confirm = String(b.confirm || "");

  if (!first || !last) return NextResponse.json({ error: "Please enter your first and last name." }, { status: 400 });
  if (!phone) return NextResponse.json({ error: "Please enter a valid phone number (for example 01712345678)." }, { status: 400 });
  if (!isEmail(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  if (password !== confirm) return NextResponse.json({ error: "The two passwords do not match." }, { status: 400 });

  const { data: taken } = await admin.from("profiles").select("id").eq("phone", phone).maybeSingle();
  if (taken) return NextResponse.json({ error: "An account with this phone number already exists. Please log in." }, { status: 409 });

  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { first_name: first, last_name: last, phone, company },
  });
  if (error) {
    const exists = /already|registered|exists/i.test(error.message || "");
    return NextResponse.json(
      { error: exists ? "An account with this email already exists. Please log in." : "Could not create your account. Please try again." },
      { status: exists ? 409 : 500 }
    );
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) return NextResponse.json({ ok: true, redirect: "/login" });
  return NextResponse.json({ ok: true, redirect: "/portal" });
}
