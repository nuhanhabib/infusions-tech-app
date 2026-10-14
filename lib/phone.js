// Phone helpers. Bangladeshi numbers (017..., 8801...) are stored as +8801XXXXXXXXX.
export function normalizePhone(input) {
  let s = String(input || "").trim().replace(/[\s\-().]/g, "");
  if (!s) return "";
  if (s.startsWith("00")) s = "+" + s.slice(2);
  if (/^01\d{9}$/.test(s)) return "+88" + s;
  if (/^8801\d{9}$/.test(s)) return "+" + s;
  if (/^\+\d{8,15}$/.test(s)) return s;
  return "";
}

export const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || "").trim());

// Only allow redirects inside our own site.
export function safeNext(next, fallback = "/portal") {
  if (typeof next === "string" && next.startsWith("/") && !next.startsWith("//")) return next;
  return fallback;
}
