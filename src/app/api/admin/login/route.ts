import type { NextRequest } from "next/server";
import { SESSION_COOKIE, createSessionValue, inboxConfigured, sessionCookieOptions, verifyAgent } from "@/lib/chat/auth";
import { clientIp, errorResponse, isSameOrigin, json, rateLimit } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return errorResponse("Request blocked.", 403);
  if (!rateLimit(`admin-login:${clientIp(req)}`, 8, 15 * 60 * 1000)) {
    return errorResponse("Too many sign-in attempts. Please wait 15 minutes.", 429);
  }
  if (!inboxConfigured()) return errorResponse("The team inbox isn't set up yet. Add CHAT_AGENTS and CHAT_SESSION_SECRET.", 503);

  const body = (await req.json().catch(() => ({}))) as { name?: unknown; password?: unknown };
  const name = typeof body.name === "string" ? body.name.slice(0, 100) : "";
  const password = typeof body.password === "string" ? body.password.slice(0, 200) : "";
  const agent = verifyAgent(name, password);
  if (!agent) return errorResponse("Incorrect name or password.", 401);

  const res = json({ ok: true, name: agent });
  res.cookies.set(SESSION_COOKIE, createSessionValue(agent), sessionCookieOptions);
  return res;
}
