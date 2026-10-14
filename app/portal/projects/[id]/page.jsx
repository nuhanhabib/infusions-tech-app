import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { projectStatuses, fmtDate, fmtDateTime } from "@/lib/portalData";
import StatusBadge from "@/components/portal/StatusBadge";
import Progress from "@/components/portal/Progress";

export const metadata = { title: "Project" };

export default async function ProjectPage({ params }) {
  const { id } = await params;
  const { supabase, user } = await requireUser();
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).eq("customer_id", user.id).maybeSingle();
  if (!project) notFound();
  const { data: updates } = await supabase
    .from("project_updates")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  return (
    <>
      <Link href="/portal/projects" className="pt-back">← All projects</Link>
      <div className="pt-head">
        <div>
          <h1 className="pt-h1">{project.title}</h1>
          <p className="pt-lead">{project.service || "Project"}</p>
        </div>
        <StatusBadge list={projectStatuses} value={project.status} />
      </div>

      <div className="pt-cols">
        <div className="pt-panel">
          <h2>Progress updates</h2>
          {(updates || []).length === 0 ? (
            <div className="pt-empty"><b>No updates yet</b>Our team will post updates here as work moves forward.</div>
          ) : (
            <ul className="pt-timeline">
              {updates.map((u) => (
                <li key={u.id}>
                  <time>{fmtDateTime(u.created_at)}{u.progress != null ? ` · ${u.progress}% done` : ""}</time>
                  <p>{u.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="pt-panel">
          <h2>Overview</h2>
          <Progress value={project.progress} />
          <dl className="pt-kv" style={{ marginTop: 18 }}>
            <dt>Started</dt><dd>{fmtDate(project.start_date || project.created_at)}</dd>
            <dt>Due</dt><dd>{fmtDate(project.due_date)}</dd>
            {project.description && (<><dt>About</dt><dd style={{ whiteSpace: "pre-wrap" }}>{project.description}</dd></>)}
          </dl>
          <div style={{ marginTop: 20 }}><Link href="/portal/messages" className="pt-btn ghost sm">Ask a question</Link></div>
        </div>
      </div>
    </>
  );
}
