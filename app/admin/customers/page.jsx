import Link from "next/link";
import { requireAdmin, fullName } from "@/lib/auth";
import { fmtDate } from "@/lib/portalData";

export const metadata = { title: "Customers" };

export default async function Customers({ searchParams }) {
  const sp = await searchParams;
  const q = String(sp?.q || "").trim().replace(/[,%()]/g, " ");
  const { supabase } = await requireAdmin();

  let query = supabase
    .from("profiles")
    .select("id, first_name, last_name, email, phone, company, created_at, projects(count)")
    .eq("role", "customer")
    .order("created_at", { ascending: false });
  if (q) query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,company.ilike.%${q}%`);
  const { data } = await query;
  const list = data || [];

  return (
    <>
      <div className="pt-head">
        <div>
          <h1 className="pt-h1">Customers</h1>
          <p className="pt-lead">{list.length} {q ? "match" : "registered"}{list.length === 1 ? "" : q ? "es" : ""}</p>
        </div>
        <form className="pt-inline" method="get">
          <input className="pt-input" style={{ width: 240 }} name="q" defaultValue={q} placeholder="Search name, email, phone…" />
          <button className="pt-btn sm">Search</button>
        </form>
      </div>
      {list.length === 0 ? (
        <div className="pt-panel pt-empty"><b>No customers found</b></div>
      ) : (
        <div className="pt-table-wrap">
          <table className="pt-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Company</th><th>Projects</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id}>
                  <td><Link href={`/admin/customers/${c.id}`} className="pt-link">{fullName(c)}</Link></td>
                  <td>{c.email}</td>
                  <td>{c.phone || "—"}</td>
                  <td>{c.company || "—"}</td>
                  <td>{c.projects?.[0]?.count ?? 0}</td>
                  <td>{fmtDate(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
