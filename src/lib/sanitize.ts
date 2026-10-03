/**
 * Input sanitisation helpers (safe on client and server).
 * React escapes output by default; these helpers normalise input before it is stored or emailed.
 */

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const TAGS = /<\/?[a-z][^>]*>/gi;

export function sanitizeText(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return "";
  return value.replace(CONTROL_CHARS, "").replace(TAGS, "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

/** Like sanitizeText but keeps line breaks (for message/requirements fields). */
export function sanitizeMultiline(value: unknown, maxLength = 3000): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/\r\n?/g, "\n")
    .replace(CONTROL_CHARS, "")
    .replace(TAGS, "")
    .split("\n")
    .map((l) => l.replace(/[ \t]+/g, " ").trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeEmail(value: unknown): string {
  return sanitizeText(value, 254).toLowerCase().replace(/\s/g, "");
}

export function normalizeUrl(value: unknown): string {
  const v = sanitizeText(value, 300);
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}
