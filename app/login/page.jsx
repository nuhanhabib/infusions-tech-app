import { redirect } from "next/navigation";
import AuthShell from "@/components/portal/AuthShell";
import LoginForm from "@/components/portal/LoginForm";
import NotConfigured from "@/components/portal/NotConfigured";
import { isConfigured } from "@/lib/supabase/config";
import { getCurrent } from "@/lib/auth";
import { safeNext } from "@/lib/phone";

export const dynamic = "force-dynamic";
export const metadata = { title: "Log in" };

export default async function LoginPage({ searchParams }) {
  const sp = await searchParams;
  const { user, profile } = await getCurrent();
  if (user && profile) redirect(profile.role === "admin" ? "/admin" : "/portal");

  const next = sp?.next ? safeNext(sp.next, "") : "";
  const initialError = sp?.error ? "Google sign-in did not finish. Please try again." : "";

  return (
    <AuthShell title="Welcome back" subtitle="Log in to your client portal with your email or phone number.">
      {isConfigured ? <LoginForm next={next} initialError={initialError} /> : <NotConfigured />}
    </AuthShell>
  );
}
