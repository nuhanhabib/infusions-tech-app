import AuthShell from "@/components/portal/AuthShell";
import ForgotForm from "@/components/portal/ForgotForm";
import NotConfigured from "@/components/portal/NotConfigured";
import { isConfigured } from "@/lib/supabase/config";

export const metadata = { title: "Forgot password" };

export default function ForgotPage() {
  return (
    <AuthShell title="Forgot your password?" subtitle="Enter your email and we will send you a link to set a new one.">
      {isConfigured ? <ForgotForm /> : <NotConfigured />}
    </AuthShell>
  );
}
