export default function NotConfigured() {
  return (
    <div className="pt-alert error" role="alert">
      <b>The portal is not connected to its database yet.</b>
      <br />
      Add <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and{" "}
      <code>SUPABASE_SERVICE_ROLE_KEY</code> in your environment (see PORTAL-SETUP.md).
    </div>
  );
}
