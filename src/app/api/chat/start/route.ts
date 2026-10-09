import type { NextRequest } from "next/server";
import { startConversation } from "@/lib/chat/service";
import { sanitizeText } from "@/lib/sanitize";
import { errorResponse, guardRequest, json } from "@/lib/security";
import { redisConfigured } from "@/lib/upstash";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const blocked = guardRequest(req, "chat-start", 10);
  if (blocked) return blocked;
  if (process.env.VERCEL && !redisConfigured()) {
    console.error("[chat] No Redis database connected — live chat disabled. Connect Upstash/Redis in Vercel → Storage.");
    return errorResponse("Live chat is temporarily unavailable.", 503);
  }
  const body = (await req.json().catch(() => ({}))) as { page?: unknown };
  const page = sanitizeText(body.page, 200);
  const { conv, token, messages } = await startConversation(page.startsWith("/") ? page : "/");
  return json({ ok: true, conversationId: conv.id, token, status: conv.status, messages }, 201);
}
