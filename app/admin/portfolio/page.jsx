import { requireAdmin } from "@/lib/auth";
import { createPortfolio, togglePortfolio, deletePortfolio } from "@/lib/actions";
import PortfolioForm from "@/components/portal/PortfolioForm";
import ConfirmButton from "@/components/portal/ConfirmButton";

export const metadata = { title: "Website projects" };

export default async function AdminPortfolio() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("portfolio").select("*").order("created_at", { ascending: false });
  const list = data || [];

  return (
    <>
      <div className="pt-head">
        <div>
          <h1 className="pt-h1">Website projects</h1>
          <p className="pt-lead">Add your latest work. It appears on the public <a className="pt-link" href="/work" target="_blank">Our Work</a> page.</p>
        </div>
      </div>
      <div className="pt-cols">
        <div className="pt-panel">
          <h2>Published work</h2>
          {list.length === 0 ? (
            <div className="pt-empty"><b>Nothing added yet</b>Use the form to add your first project.</div>
          ) : (
            <div className="pt-gallery">
              {list.map((p) => (
                <div key={p.id} className="pt-thumb">
                  {p.image_url ? <img src={p.image_url} alt={p.title} /> : <div className="pt-noimg">No image</div>}
                  <div className="pt-thumb-body">
                    <small className="pt-muted">{p.category || "Project"}{p.published ? "" : " · hidden"}</small>
                    <h3>{p.title}</h3>
                    <div className="pt-actions-row">
                      <form action={togglePortfolio}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="published" value={p.published ? "false" : "true"} />
                        <button className="pt-btn ghost sm">{p.published ? "Hide" : "Show"}</button>
                      </form>
                      <form action={deletePortfolio}>
                        <input type="hidden" name="id" value={p.id} />
                        <ConfirmButton message="Delete this project from the website?">Delete</ConfirmButton>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="pt-panel">
          <h2>Add a project</h2>
          <PortfolioForm action={createPortfolio} />
        </div>
      </div>
    </>
  );
}
