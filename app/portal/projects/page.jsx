import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { projectStatuses, fmtDate } from "@/lib/portalData";
import StatusBadge from "@/components/portal/StatusBadge";
import Progress from "@/components/portal/Progress";

export const metadata = { title: "My projects" };

export default async function Projects() {
  const { supabase, user } = await requireUser();
  const { data } = await supabase.from("projects").select("*").eq("customer_id", user.id).order("created_at", { ascending: false });
  const list = data || [];

  return (
    <>
      <div className="pt-head">
        <div>
          <h1 className="pt-h1">My projects</h1>
          <p className="pt-lead">Follow the progress of everything we are building for you.</p>
        </div>
      </div>
      {list.length === 0 ? (
        <div className="pt-panel pt-empty">
          <b>No projects yet</b>
          <Link href="/portal/orders" className="pt-link">Place your first order →</Link>
        </div>
      ) : (
        <div className="pt-cards">
          {list.map((p) => (
            <Link key={p.id} href={`/portal/projects/${p.id}`} className="pt-pcard">
              <div className="pt-row-between" style={{ marginTop: 0 }}>
                <StatusBadge list={projectStatuses} value={p.status} />
                {p.service && <small className="pt-muted">{p.service}</small>}
              </div>
              <h3>{p.title}</h3>
              {p.description && <p className="pt-clamp">{p.description}</p>}
              <Progress value={p.progress} />
              <div className="pt-meta"><span>Due: {fmtDate(p.due_date)}</span></div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
