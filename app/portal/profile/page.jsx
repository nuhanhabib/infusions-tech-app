import { requireUser } from "@/lib/auth";
import { updateProfile, changePassword } from "@/lib/actions";
import ActionForm from "@/components/portal/ActionForm";
import PasswordInput from "@/components/portal/PasswordInput";

export const metadata = { title: "Profile" };

export default async function Profile() {
  const { profile } = await requireUser();
  return (
    <>
      <div className="pt-head">
        <div>
          <h1 className="pt-h1">Profile</h1>
          <p className="pt-lead">Keep your contact details up to date.</p>
        </div>
      </div>
      <div className="pt-cols">
        <div className="pt-panel">
          <h2>Your details</h2>
          <ActionForm action={updateProfile} submitLabel="Save changes">
            <div className="pt-grid-2">
              <div>
                <label className="pt-label" htmlFor="first_name">First name</label>
                <input id="first_name" name="first_name" className="pt-input" defaultValue={profile.first_name} required />
              </div>
              <div>
                <label className="pt-label" htmlFor="last_name">Last name</label>
                <input id="last_name" name="last_name" className="pt-input" defaultValue={profile.last_name} required />
              </div>
            </div>
            <label className="pt-label" htmlFor="phone">Phone number</label>
            <input id="phone" name="phone" type="tel" className="pt-input" defaultValue={profile.phone || ""} required />
            <label className="pt-label">Email</label>
            <input className="pt-input" value={profile.email || ""} disabled readOnly />
            <label className="pt-label" htmlFor="company">Company <span className="pt-opt">(optional)</span></label>
            <input id="company" name="company" className="pt-input" defaultValue={profile.company || ""} />
          </ActionForm>
        </div>
        <div className="pt-panel">
          <h2>Change password</h2>
          <ActionForm action={changePassword} submitLabel="Update password" resetOnSuccess>
            <label className="pt-label">New password</label>
            <PasswordInput name="password" autoComplete="new-password" minLength={8} placeholder="At least 8 characters" />
            <label className="pt-label">Retype new password</label>
            <PasswordInput name="confirm" autoComplete="new-password" minLength={8} />
          </ActionForm>
          <p className="pt-muted" style={{ marginTop: 14, fontSize: 13 }}>Signed up with Google? Setting a password here lets you also log in with your email or phone.</p>
        </div>
      </div>
    </>
  );
}
