import Link from "next/link";
import { requireAdmin, fullName } from "@/lib/auth";
import { projectStatuses, fmtDate } from "@/lib/portalData";
import StatusBadge from "@/components/portal/StatusBadge";
import Progress from "@/components/portal/Progress";

export const metadata = { title: "Projects" };

export default async function AdminProjects({ searchParams }) {
  const sp = await searchParams;
  const status = projectStatuses.some((s) => s.value === sp?.status) ? sp.status : "";
  const { supabase } = await requireAdmin();

  let query = supabase.from("projects").select("*, profiles(first_name, last_name, email)").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data } = await query;
  const list = data || [];

  return (
    <>
      <div className="pt-head">
        <div>
          <h1 className="pt-h1">Projects</h1>
          <p className="pt-lead">Create projects, post updates and keep customers informed.</p>
        </div>
        <Link href="/admin/projects/new" className="pt-btn">+ New project</Link>
      </div>
      <div className="pt-filters">
        <Link href="/admin/projects" className={!status ? "active" : ""}>All</Link>
        {projectStatuses.map((s) => (
          <Link key={s.value} href={`/admin/projects?status=${s.value}`} className={status === s.value ? "active" : ""}>{s.label}</Link>
        ))}
      </div>
      {list.length === 0 ? (
        <div className="pt-panel pt-empty"><b>No projects here</b></div>
      ) : (
        <div className="pt-table-wrap">
          <table className="pt-table">
            <thead><tr><th>Project</th><th>Customer</th><th>Status</th><th style={{ width: 200 }}>Progress</th><th>Due</th></tr></thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td><Link href={`/admin/projects/${p.id}`} className="pt-link">{p.title}</Link></td>
                  <td>{fullName(p.profiles)}</td>
                  <td><StatusBadge list={projectStatuses} value={p.status} /></td>
                  <td><Progress value={p.progress} /></td>
                  <td>{fmtDate(p.due_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
