import type { NextRequest } from "next/server";
import { getChatStore } from "@/lib/chat/store";
import { needsContact, visitorConversation } from "@/lib/chat/http";
import { clientIp, errorResponse, json, rateLimit } from "@/lib/security";

export const dynamic = "force-dynamic";

/** Poll for new messages. ?after=<ISO timestamp> returns only newer messages. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!rateLimit(`chat-poll:${clientIp(req)}`, 400, 10 * 60 * 1000)) return errorResponse("Too many requests.", 429);
  const { conv, error } = await visitorConversation(req, (await params).id);
  if (error) return error;
  const after = req.nextUrl.searchParams.get("after") ?? "";
  const all = await getChatStore().getMessages(conv.id);
  const messages = after ? all.filter((m) => m.createdAt > after) : all;
  return json({ ok: true, status: conv.status, needsContact: needsContact(conv), messages });
}
