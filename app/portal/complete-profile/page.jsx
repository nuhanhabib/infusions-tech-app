import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { completeProfile } from "@/lib/actions";
import ActionForm from "@/components/portal/ActionForm";

export const metadata = { title: "Finish your profile" };

export default async function CompleteProfile() {
  const { profile } = await requireUser({ allowIncomplete: true });
  if (profile.phone) redirect("/portal");
  return (
    <div className="pt-panel" style={{ maxWidth: 560, margin: "0 auto" }}>
      <h1 className="pt-h1" style={{ fontSize: 26 }}>One last step</h1>
      <p className="pt-lead">We need your phone number so our team can reach you about your projects.</p>
      <ActionForm action={completeProfile} submitLabel="Continue to my portal">
        {!profile.first_name && (
          <div className="pt-grid-2">
            <div>
              <label className="pt-label" htmlFor="first_name">First name</label>
              <input id="first_name" name="first_name" className="pt-input" required />
            </div>
            <div>
              <label className="pt-label" htmlFor="last_name">Last name</label>
              <input id="last_name" name="last_name" className="pt-input" required />
            </div>
          </div>
        )}
        <label className="pt-label" htmlFor="phone">Phone number</label>
        <input id="phone" name="phone" type="tel" className="pt-input" placeholder="01712345678" required />
        <label className="pt-label" htmlFor="company">Company <span className="pt-opt">(optional)</span></label>
        <input id="company" name="company" className="pt-input" defaultValue={profile.company || ""} />
      </ActionForm>
    </div>
  );
}
