"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrent } from "@/lib/auth";
import { normalizePhone } from "@/lib/phone";

const str = (fd, key) => String(fd.get(key) ?? "").trim();
const or = (v) => (v === "" ? null : v);
const refresh = () => revalidatePath("/", "layout");

async function who() {
  const ctx = await getCurrent();
  if (!ctx.user || !ctx.profile) return { error: "Please log in again." };
  return ctx;
}

async function adminOnly() {
  const ctx = await who();
  if (ctx.error) return ctx;
  if (ctx.profile.role !== "admin") return { error: "Admins only." };
  return ctx;
}

function dbError(error) {
  if (!error) return null;
  if (error.code === "23505") return "That phone number is already used by another account.";
  return "Something went wrong. Please try again.";
}

/* ======================= CUSTOMER ACTIONS ======================= */

export async function submitOrder(_prev, fd) {
  const ctx = await who();
  if (ctx.error) return ctx;
  const service = str(fd, "service");
  const title = str(fd, "title");
  const details = str(fd, "details");
  if (!service) return { error: "Please choose a service." };
  if (title.length < 3) return { error: "Please give your order a short title." };
  if (details.length < 10) return { error: "Please describe what you need (at least a sentence)." };

  const { error } = await ctx.supabase.from("orders").insert({
    customer_id: ctx.user.id,
    service,
    title,
    details,
    budget: or(str(fd, "budget")),
    deadline: or(str(fd, "deadline")),
  });
  if (error) return { error: dbError(error) };
  refresh();
  return { ok: true, message: "Order sent. Our team will review it and get back to you." };
}

export async function cancelOrder(fd) {
  const ctx = await who();
  if (ctx.error) return;
  await ctx.supabase.from("orders").update({ status: "cancelled" }).eq("id", str(fd, "id")).eq("status", "new");
  refresh();
}

export async function sendMessage(_prev, fd) {
  const ctx = await who();
  if (ctx.error) return ctx;
  const body = str(fd, "body");
  if (!body) return { error: "Type a message first." };
  if (body.length > 2000) return { error: "Message is too long (max 2000 characters)." };

  const isAdmin = ctx.profile.role === "admin";
  const customerId = isAdmin ? str(fd, "customer_id") : ctx.user.id;
  if (!customerId) return { error: "No customer selected." };

  const { error } = await ctx.supabase
    .from("messages")
    .insert({ customer_id: customerId, sender: isAdmin ? "admin" : "customer", body });
  if (error) return { error: dbError(error) };
  refresh();
  return { ok: true };
}

export async function submitReview(_prev, fd) {
  const ctx = await who();
  if (ctx.error) return ctx;
  const kind = str(fd, "kind") === "feedback" ? "feedback" : "review";
  const rating = parseInt(str(fd, "rating"), 10);
  const comment = str(fd, "comment");
  if (!(rating >= 1 && rating <= 5)) return { error: "Please choose a star rating." };
  if (comment.length < 5) return { error: "Please write a few words." };

  const p = ctx.profile;
  const authorName = [p.first_name, p.last_name ? p.last_name[0] + "." : ""].filter(Boolean).join(" ") || "Customer";
  const { error } = await ctx.supabase.from("reviews").insert({
    customer_id: ctx.user.id,
    author_name: authorName,
    company: p.company || null,
    kind,
    rating,
    service: or(str(fd, "service")),
    comment,
  });
  if (error) return { error: dbError(error) };
  refresh();
  return {
    ok: true,
    message:
      kind === "review"
        ? "Thank you! Your review will appear on our website once our team approves it."
        : "Thank you! Your feedback went straight to our team.",
  };
}

export async function deleteMyReview(fd) {
  const ctx = await who();
  if (ctx.error) return;
  await ctx.supabase.from("reviews").delete().eq("id", str(fd, "id")).eq("customer_id", ctx.user.id);
  refresh();
}

export async function updateProfile(_prev, fd) {
  const ctx = await who();
  if (ctx.error) return ctx;
  const first = str(fd, "first_name");
  const last = str(fd, "last_name");
  const phone = normalizePhone(str(fd, "phone"));
  if (!first || !last) return { error: "Please enter your first and last name." };
  if (!phone) return { error: "Please enter a valid phone number." };

  const { error } = await ctx.supabase
    .from("profiles")
    .update({ first_name: first, last_name: last, phone, company: or(str(fd, "company")) })
    .eq("id", ctx.user.id);
  if (error) return { error: dbError(error) };
  refresh();
  return { ok: true, message: "Profile saved." };
}

export async function completeProfile(_prev, fd) {
  const ctx = await who();
  if (ctx.error) return ctx;
  const phone = normalizePhone(str(fd, "phone"));
  if (!phone) return { error: "Please enter a valid phone number (for example 01712345678)." };

  const update = { phone, company: or(str(fd, "company")) };
  const first = str(fd, "first_name");
  const last = str(fd, "last_name");
  if (first) update.first_name = first;
  if (last) update.last_name = last;

  const { error } = await ctx.supabase.from("profiles").update(update).eq("id", ctx.user.id);
  if (error) return { error: dbError(error) };
  refresh();
  redirect("/portal");
}

export async function changePassword(_prev, fd) {
  const ctx = await who();
  if (ctx.error) return ctx;
  const password = String(fd.get("password") || "");
  const confirm = String(fd.get("confirm") || "");
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirm) return { error: "The two passwords do not match." };
  const { error } = await ctx.supabase.auth.updateUser({ password });
  if (error) return { error: error.message || "Could not change the password." };
  return { ok: true, message: "Password changed." };
}

/* ========================= ADMIN ACTIONS ======================== */

function projectFields(fd) {
  const progress = Math.max(0, Math.min(100, parseInt(str(fd, "progress") || "0", 10) || 0));
  return {
    title: str(fd, "title"),
    description: or(str(fd, "description")),
    service: or(str(fd, "service")),
    status: str(fd, "status") || "planning",
    progress,
    start_date: or(str(fd, "start_date")),
    due_date: or(str(fd, "due_date")),
  };
}

export async function createProject(_prev, fd) {
  const ctx = await adminOnly();
  if (ctx.error) return ctx;
  const customerId = str(fd, "customer_id");
  const fields = projectFields(fd);
  if (!customerId) return { error: "Please choose a customer." };
  if (fields.title.length < 3) return { error: "Please enter a project title." };

  const { data, error } = await ctx.supabase
    .from("projects")
    .insert({ customer_id: customerId, ...fields })
    .select("id")
    .single();
  if (error) return { error: dbError(error) };
  refresh();
  redirect(`/admin/projects/${data.id}`);
}

export async function updateProject(_prev, fd) {
  const ctx = await adminOnly();
  if (ctx.error) return ctx;
  const fields = projectFields(fd);
  if (fields.title.length < 3) return { error: "Please enter a project title." };
  const { error } = await ctx.supabase.from("projects").update(fields).eq("id", str(fd, "id"));
  if (error) return { error: dbError(error) };
  refresh();
  return { ok: true, message: "Project saved." };
}

export async function deleteProject(fd) {
  const ctx = await adminOnly();
  if (ctx.error) return;
  await ctx.supabase.from("projects").delete().eq("id", str(fd, "id"));
  refresh();
  redirect("/admin/projects");
}

export async function postUpdate(_prev, fd) {
  const ctx = await adminOnly();
  if (ctx.error) return ctx;
  const projectId = str(fd, "project_id");
  const message = str(fd, "message");
  const status = str(fd, "status");
  const progressRaw = str(fd, "progress");
  if (message.length < 3) return { error: "Write the update message." };

  let progress = progressRaw === "" ? null : Math.max(0, Math.min(100, parseInt(progressRaw, 10) || 0));
  if (status === "completed" && progress === null) progress = 100;

  const { error } = await ctx.supabase.from("project_updates").insert({ project_id: projectId, message, progress });
  if (error) return { error: dbError(error) };

  const patch = {};
  if (progress !== null) patch.progress = progress;
  if (status) patch.status = status;
  if (Object.keys(patch).length) await ctx.supabase.from("projects").update(patch).eq("id", projectId);

  refresh();
  return { ok: true, message: "Update posted. The customer can see it now." };
}

export async function deleteUpdate(fd) {
  const ctx = await adminOnly();
  if (ctx.error) return;
  await ctx.supabase.from("project_updates").delete().eq("id", str(fd, "id"));
  refresh();
}

export async function setOrderStatus(fd) {
  const ctx = await adminOnly();
  if (ctx.error) return;
  await ctx.supabase.from("orders").update({ status: str(fd, "status") }).eq("id", str(fd, "id"));
  refresh();
}

export async function acceptOrderCreateProject(fd) {
  const ctx = await adminOnly();
  if (ctx.error) return;
  const { data: order } = await ctx.supabase.from("orders").select("*").eq("id", str(fd, "id")).maybeSingle();
  if (!order) return;
  const { data: project } = await ctx.supabase
    .from("projects")
    .insert({
      customer_id: order.customer_id,
      title: order.title,
      description: order.details,
      service: order.service,
      status: "planning",
      progress: 0,
      due_date: order.deadline,
    })
    .select("id")
    .single();
  await ctx.supabase.from("orders").update({ status: "accepted" }).eq("id", order.id);
  refresh();
  if (project) redirect(`/admin/projects/${project.id}`);
}

export async function setReviewApproved(fd) {
  const ctx = await adminOnly();
  if (ctx.error) return;
  await ctx.supabase.from("reviews").update({ approved: str(fd, "approved") === "true" }).eq("id", str(fd, "id"));
  refresh();
}

export async function deleteReview(fd) {
  const ctx = await adminOnly();
  if (ctx.error) return;
  await ctx.supabase.from("reviews").delete().eq("id", str(fd, "id"));
  refresh();
}

export async function createPortfolio(_prev, fd) {
  const ctx = await adminOnly();
  if (ctx.error) return ctx;
  const title = str(fd, "title");
  if (title.length < 3) return { error: "Please enter a project title." };
  const { error } = await ctx.supabase.from("portfolio").insert({
    title,
    category: or(str(fd, "category")),
    description: or(str(fd, "description")),
    image_url: or(str(fd, "image_url")),
    link_url: or(str(fd, "link_url")),
    published: true,
  });
  if (error) return { error: dbError(error) };
  refresh();
  return { ok: true, message: "Project added to the website." };
}

export async function togglePortfolio(fd) {
  const ctx = await adminOnly();
  if (ctx.error) return;
  await ctx.supabase.from("portfolio").update({ published: str(fd, "published") === "true" }).eq("id", str(fd, "id"));
  refresh();
}

export async function deletePortfolio(fd) {
  const ctx = await adminOnly();
  if (ctx.error) return;
  await ctx.supabase.from("portfolio").delete().eq("id", str(fd, "id"));
  refresh();
}
