import type { NextRequest } from "next/server";
import { startConversation } from "@/lib/chat/service";
import { sanitizeText } from "@/lib/sanitize";
import { guardRequest, json } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const blocked = guardRequest(req, "chat-start", 10);
  if (blocked) return blocked;
  const body = (await req.json().catch(() => ({}))) as { page?: unknown };
  const page = sanitizeText(body.page, 200);
  const { conv, token, messages } = await startConversation(page.startsWith("/") ? page : "/");
  return json({ ok: true, conversationId: conv.id, token, status: conv.status, messages }, 201);
}
