import ConfirmButton from "@/components/portal/ConfirmButton";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin, fullName } from "@/lib/auth";
import { projectStatuses, fmtDateTime } from "@/lib/portalData";
import { updateProject, deleteProject, postUpdate, deleteUpdate } from "@/lib/actions";
import ActionForm from "@/components/portal/ActionForm";
import ProjectFields from "@/components/portal/ProjectFields";
import Progress from "@/components/portal/Progress";

export const metadata = { title: "Project" };

export default async function AdminProject({ params }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const { data: project } = await supabase.from("projects").select("*, profiles(id, first_name, last_name, email)").eq("id", id).maybeSingle();
  if (!project) notFound();
  const { data: updates } = await supabase.from("project_updates").select("*").eq("project_id", id).order("created_at", { ascending: false });

  return (
    <>
      <Link href="/admin/projects" className="pt-back">← All projects</Link>
      <div className="pt-head">
        <div>
          <h1 className="pt-h1">{project.title}</h1>
          <p className="pt-lead">
            for <Link href={`/admin/customers/${project.profiles?.id}`} className="pt-link">{fullName(project.profiles)}</Link>
          </p>
        </div>
        <div style={{ minWidth: 220 }}><Progress value={project.progress} /></div>
      </div>

      <div className="pt-cols">
        <div>
          <div className="pt-panel">
            <h2>Post an update</h2>
            <p className="pt-muted" style={{ marginBottom: 8, fontSize: 14 }}>The customer sees this in their portal straight away.</p>
            <ActionForm action={postUpdate} submitLabel="Post update" resetOnSuccess>
              <input type="hidden" name="project_id" value={project.id} />
              <label className="pt-label" htmlFor="message">Update</label>
              <textarea id="message" name="message" className="pt-textarea" placeholder="e.g. Homepage design approved. Starting development." required />
              <div className="pt-grid-2">
                <div>
                  <label className="pt-label" htmlFor="u_progress">New progress % <span className="pt-opt">(optional)</span></label>
                  <input id="u_progress" name="progress" type="number" min="0" max="100" className="pt-input" />
                </div>
                <div>
                  <label className="pt-label" htmlFor="u_status">Status</label>
                  <select id="u_status" name="status" className="pt-select" defaultValue="">
                    <option value="">Keep current</option>
                    {projectStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>
            </ActionForm>
          </div>

          <div className="pt-panel">
            <h2>Update history</h2>
            {(updates || []).length === 0 ? (
              <div className="pt-empty"><b>No updates posted yet</b></div>
            ) : (
              <ul className="pt-timeline">
                {updates.map((u) => (
                  <li key={u.id}>
                    <time>{fmtDateTime(u.created_at)}{u.progress != null ? ` · ${u.progress}%` : ""}</time>
                    <p>{u.message}</p>
                    <form action={deleteUpdate} style={{ marginTop: 6 }}>
                      <input type="hidden" name="id" value={u.id} />
                      <ConfirmButton message="Delete this update?">Delete</ConfirmButton>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <div className="pt-panel">
            <h2>Project details</h2>
            <ActionForm action={updateProject} submitLabel="Save project">
              <ProjectFields project={project} />
            </ActionForm>
          </div>
          <div className="pt-panel">
            <h2>Danger zone</h2>
            <form action={deleteProject}>
              <input type="hidden" name="id" value={project.id} />
              <ConfirmButton className="pt-btn danger" message="Delete this project and all its updates?">Delete this project</ConfirmButton>
            </form>
            <p className="pt-muted" style={{ marginTop: 10, fontSize: 13 }}>This also removes its updates and cannot be undone.</p>
          </div>
        </div>
      </div>
    </>
  );
}
