import type { NextRequest } from "next/server";
import { getChatStore } from "@/lib/chat/store";
import { agentConversation, requireAgent } from "@/lib/chat/http";
import { setStatus } from "@/lib/chat/service";
import { toPublicConversation } from "@/lib/chat/types";
import { errorResponse, isSameOrigin, json } from "@/lib/security";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** Conversation with messages. Opening it marks visitor messages as read. */
export async function GET(_req: NextRequest, { params }: Ctx) {
  const { error: authError } = await requireAgent();
  if (authError) return authError;
  const { conv, error } = await agentConversation((await params).id);
  if (error) return error;
  if (conv.unreadForAgent > 0) {
    conv.unreadForAgent = 0;
    await getChatStore().saveConversation(conv);
  }
  const messages = await getChatStore().getMessages(conv.id);
  return json({ ok: true, conversation: toPublicConversation(conv), messages });
}

/** Close or reopen a conversation. */
export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!isSameOrigin(req)) return errorResponse("Request blocked.", 403);
  const { agent, error: authError } = await requireAgent();
  if (authError) return authError;
  const { conv, error } = await agentConversation((await params).id);
  if (error) return error;
  const body = (await req.json().catch(() => ({}))) as { status?: unknown };
  if (body.status !== "open" && body.status !== "closed") return errorResponse("Invalid status.", 422);
  const m = await setStatus(conv, body.status, agent);
  return json({ ok: true, conversation: toPublicConversation(conv), messages: m ? [m] : [] });
}
