import AuthShell from "@/components/portal/AuthShell";
import ResetForm from "@/components/portal/ResetForm";
import NotConfigured from "@/components/portal/NotConfigured";
import { isConfigured } from "@/lib/supabase/config";

export const metadata = { title: "Set a new password" };

export default function ResetPage() {
  return (
    <AuthShell title="Set a new password" subtitle="Choose a strong password you have not used before.">
      {isConfigured ? <ResetForm /> : <NotConfigured />}
    </AuthShell>
  );
}
