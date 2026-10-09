import type { NextRequest } from "next/server";
import { visitorMessage } from "@/lib/chat/service";
import { needsContact, visitorConversation } from "@/lib/chat/http";
import { CHAT_MESSAGE_MAX } from "@/lib/chat/types";
import { sanitizeMultiline } from "@/lib/sanitize";
import { errorResponse, guardRequest, json, rateLimit } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const blocked = guardRequest(req, "chat-msg", 40, 5 * 60 * 1000);
  if (blocked) return blocked;
  const { conv, error } = await visitorConversation(req, (await params).id);
  if (error) return error;
  if (!rateLimit(`chat-conv:${conv.id}`, 30, 5 * 60 * 1000)) return errorResponse("You're sending messages too quickly. Please wait a moment.", 429);

  const body = (await req.json().catch(() => ({}))) as { text?: unknown };
  const text = sanitizeMultiline(body.text, CHAT_MESSAGE_MAX);
  if (!text) return errorResponse("Please type a message.", 422);

  const res = await visitorMessage(conv, text);
  return json({ ok: true, status: conv.status, needsContact: res.needsContact || needsContact(conv), messages: res.messages });
}
