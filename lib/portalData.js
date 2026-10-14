import { serviceDetails } from "@/lib/serviceDetails";

export const projectStatuses = [
  { value: "planning", label: "Planning", tone: "info" },
  { value: "in_progress", label: "In progress", tone: "warn" },
  { value: "review", label: "In review", tone: "purple" },
  { value: "completed", label: "Completed", tone: "ok" },
  { value: "on_hold", label: "On hold", tone: "muted" },
];

export const orderStatuses = [
  { value: "new", label: "New", tone: "info" },
  { value: "reviewing", label: "Reviewing", tone: "warn" },
  { value: "accepted", label: "Accepted", tone: "ok" },
  { value: "rejected", label: "Rejected", tone: "bad" },
  { value: "completed", label: "Completed", tone: "ok" },
  { value: "cancelled", label: "Cancelled", tone: "muted" },
];

export const serviceOptions = [...serviceDetails.map((s) => s.title), "Other"];

export function statusMeta(list, value) {
  return list.find((s) => s.value === value) || { value, label: value, tone: "muted" };
}

export function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function fmtDateTime(d) {
  if (!d) return "";
  return new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}
