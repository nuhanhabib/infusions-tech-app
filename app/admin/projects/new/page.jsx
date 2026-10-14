import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createProject } from "@/lib/actions";
import ActionForm from "@/components/portal/ActionForm";
import ProjectFields from "@/components/portal/ProjectFields";

export const metadata = { title: "New project" };

export default async function NewProject({ searchParams }) {
  const sp = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("profiles").select("id, first_name, last_name, email, company").eq("role", "customer").order("first_name");
  const preset = (data || []).some((c) => c.id === sp?.customer) ? sp.customer : "";

  return (
    <>
      <Link href="/admin/projects" className="pt-back">← All projects</Link>
      <h1 className="pt-h1" style={{ marginBottom: 20 }}>New project</h1>
      <div className="pt-panel" style={{ maxWidth: 720 }}>
        {(data || []).length === 0 ? (
          <div className="pt-empty"><b>No customers yet</b>A customer must register before you can create a project for them.</div>
        ) : (
          <ActionForm action={createProject} submitLabel="Create project">
            <ProjectFields customers={data} defaultCustomer={preset} />
          </ActionForm>
        )}
      </div>
    </>
  );
}
