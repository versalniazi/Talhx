import type { NextRequest } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/chat/auth";
import { errorResponse, isSameOrigin, json } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return errorResponse("Request blocked.", 403);
  const res = json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
  return res;
}
