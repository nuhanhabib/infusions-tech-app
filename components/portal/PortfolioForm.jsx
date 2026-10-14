"use client";

import { useActionState, useRef, useState, startTransition, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const MAX = 5 * 1024 * 1024;

// Add a "latest project" to the public website. The image is uploaded straight to Supabase Storage.
export default function PortfolioForm({ action }) {
  const [state, formAction, pending] = useActionState(action, {});
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  async function onSubmit(e) {
    e.preventDefault();
    setUploadError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const file = data.get("image");
    data.delete("image");

    if (file && file.size > 0) {
      if (!file.type.startsWith("image/")) return setUploadError("Please choose an image file.");
      if (file.size > MAX) return setUploadError("The image is larger than 5 MB. Please use a smaller one.");
      const supabase = createClient();
      if (!supabase) return setUploadError("The portal is not set up yet.");
      setUploading(true);
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("portfolio").upload(path, file, { contentType: file.type });
      setUploading(false);
      if (error) return setUploadError("Image upload failed. Check that the SQL setup was run (storage bucket).");
      data.set("image_url", supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl);
    }
    startTransition(() => formAction(data));
  }

  const busy = pending || uploading;
  return (
    <form ref={ref} onSubmit={onSubmit}>
      <label className="pt-label" htmlFor="title">Project name</label>
      <input id="title" name="title" className="pt-input" required />
      <div className="pt-grid-2">
        <div>
          <label className="pt-label" htmlFor="category">Category</label>
          <input id="category" name="category" className="pt-input" placeholder="e.g. Web development" />
        </div>
        <div>
          <label className="pt-label" htmlFor="link_url">Link <span className="pt-opt">(optional)</span></label>
          <input id="link_url" name="link_url" type="url" className="pt-input" placeholder="https://" />
        </div>
      </div>
      <label className="pt-label" htmlFor="description">Short description</label>
      <textarea id="description" name="description" className="pt-textarea" />
      <label className="pt-label" htmlFor="image">Cover image <span className="pt-opt">(up to 5 MB)</span></label>
      <input id="image" name="image" type="file" accept="image/*" className="pt-input" />
      {(uploadError || state?.error) && <p className="pt-alert error" role="alert">{uploadError || state.error}</p>}
      {state?.ok && <p className="pt-alert ok">{state.message}</p>}
      <div className="pt-form-actions">
        <button className="pt-btn" disabled={busy}>{uploading ? "Uploading image…" : pending ? "Saving…" : "Add to website"}</button>
      </div>
    </form>
  );
}
