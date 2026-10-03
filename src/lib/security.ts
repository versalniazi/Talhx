import "server-only";
import { NextResponse, type NextRequest } from "next/server";

/* ---------- Rate limiting (per instance, in memory) ---------- */

const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  }
  return true;
}

export function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

/* ---------- Same-origin check (basic CSRF protection) ---------- */

export function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return req.headers.get("sec-fetch-site") !== "cross-site";
  try {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/* ---------- Anti-spam ---------- */

/** Honeypot must be empty and the form must have been open for at least 2 seconds. */
export function looksLikeSpam(honeypot: unknown, renderedAt: unknown): boolean {
  if (typeof honeypot === "string" && honeypot.trim() !== "") return true;
  const ts = Number(renderedAt);
  if (!Number.isFinite(ts)) return true;
  const elapsed = Date.now() - ts;
  return elapsed < 2000 || elapsed > 1000 * 60 * 60 * 24;
}

/* ---------- Responses ---------- */

export const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export const errorResponse = (message: string, status: number, fieldErrors?: Record<string, string>) =>
  json({ ok: false, message, ...(fieldErrors ? { fieldErrors } : {}) }, status);

/** Shared guard for public form endpoints. Returns a response if the request must be rejected. */
export function guardRequest(req: NextRequest, scope: string, limit = 8, windowMs = 10 * 60 * 1000) {
  if (!isSameOrigin(req)) return errorResponse("Request blocked.", 403);
  if (!rateLimit(`${scope}:${clientIp(req)}`, limit, windowMs)) {
    return errorResponse("Too many requests. Please wait a few minutes and try again.", 429);
  }
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > 6 * 1024 * 1024) return errorResponse("Request too large.", 413);
  return null;
}

/* ---------- Notifications ---------- */

/**
 * Sends a server-side notification if NOTIFICATION_WEBHOOK_URL is configured.
 * The URL is read from the server environment only and is never exposed to the browser.
 */
export async function notify(event: string, payload: Record<string, unknown>) {
  const url = process.env.NOTIFICATION_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, ...payload, text: `[TALHX] ${event}` }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    console.warn("[notify] webhook failed:", (err as Error).message);
  }
}
