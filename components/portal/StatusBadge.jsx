import { statusMeta } from "@/lib/portalData";

export default function StatusBadge({ list, value }) {
  const m = statusMeta(list, value);
  return <span className={`pt-badge ${m.tone}`}>{m.label}</span>;
}
