import { projectStatuses, serviceOptions } from "@/lib/portalData";

// Shared fields for creating / editing a project.
export default function ProjectFields({ project = {}, customers = null, defaultCustomer = "" }) {
  return (
    <>
      {project.id && <input type="hidden" name="id" value={project.id} />}
      {customers && (
        <>
          <label className="pt-label" htmlFor="customer_id">Customer</label>
          <select id="customer_id" name="customer_id" className="pt-select" defaultValue={defaultCustomer} required>
            <option value="" disabled>Choose a customer…</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {[c.first_name, c.last_name].filter(Boolean).join(" ") || c.email}
                {c.company ? ` (${c.company})` : ""}
              </option>
            ))}
          </select>
        </>
      )}
      <label className="pt-label" htmlFor="title">Project title</label>
      <input id="title" name="title" className="pt-input" defaultValue={project.title || ""} required />
      <div className="pt-grid-2">
        <div>
          <label className="pt-label" htmlFor="service">Service</label>
          <select id="service" name="service" className="pt-select" defaultValue={project.service || ""}>
            <option value="">—</option>
            {serviceOptions.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="pt-label" htmlFor="status">Status</label>
          <select id="status" name="status" className="pt-select" defaultValue={project.status || "planning"}>
            {projectStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>
      <div className="pt-grid-2">
        <div>
          <label className="pt-label" htmlFor="start_date">Start date</label>
          <input id="start_date" name="start_date" type="date" className="pt-input" defaultValue={project.start_date || ""} />
        </div>
        <div>
          <label className="pt-label" htmlFor="due_date">Due date</label>
          <input id="due_date" name="due_date" type="date" className="pt-input" defaultValue={project.due_date || ""} />
        </div>
      </div>
      <label className="pt-label" htmlFor="progress">Progress (0 to 100)</label>
      <input id="progress" name="progress" type="number" min="0" max="100" className="pt-input" defaultValue={project.progress ?? 0} />
      <label className="pt-label" htmlFor="description">Description <span className="pt-opt">(customer can see this)</span></label>
      <textarea id="description" name="description" className="pt-textarea" defaultValue={project.description || ""} />
    </>
  );
}
