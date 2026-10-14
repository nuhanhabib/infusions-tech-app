import { redirect } from "next/navigation";
import AuthShell from "@/components/portal/AuthShell";
import RegisterForm from "@/components/portal/RegisterForm";
import NotConfigured from "@/components/portal/NotConfigured";
import { isConfigured } from "@/lib/supabase/config";
import { getCurrent } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Create account" };

export default async function RegisterPage() {
  const { user, profile } = await getCurrent();
  if (user && profile) redirect(profile.role === "admin" ? "/admin" : "/portal");

  return (
    <AuthShell title="Create your account" subtitle="Join the Infusions Tech client portal. It takes a minute.">
      {isConfigured ? <RegisterForm /> : <NotConfigured />}
    </AuthShell>
  );
}
