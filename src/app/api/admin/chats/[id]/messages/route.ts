import type { NextRequest } from "next/server";
import { agentConversation, requireAgent } from "@/lib/chat/http";
import { agentMessage } from "@/lib/chat/service";
import { CHAT_MESSAGE_MAX, toPublicConversation } from "@/lib/chat/types";
import { sanitizeMultiline } from "@/lib/sanitize";
import { errorResponse, isSameOrigin, json } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(req)) return errorResponse("Request blocked.", 403);
  const { agent, error: authError } = await requireAgent();
  if (authError) return authError;
  const { conv, error } = await agentConversation((await params).id);
  if (error) return error;
  const body = (await req.json().catch(() => ({}))) as { text?: unknown };
  const text = sanitizeMultiline(body.text, CHAT_MESSAGE_MAX);
  if (!text) return errorResponse("Please type a reply.", 422);
  const m = await agentMessage(conv, agent, text);
  return json({ ok: true, conversation: toPublicConversation(conv), messages: [m] });
}
