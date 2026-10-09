import "server-only";
import type { NextRequest } from "next/server";
import { getChatStore } from "./store";
import { tokenMatches } from "./service";
import { getAgentSession } from "./auth";
import { errorResponse } from "@/lib/security";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/** Load a conversation for the visitor who owns it (token in the x-chat-token header). */
export async function visitorConversation(req: NextRequest, id: string) {
  if (!UUID.test(id)) return { error: errorResponse("Conversation not found.", 404) };
  const conv = await getChatStore().getConversation(id);
  if (!conv || !tokenMatches(conv, req.headers.get("x-chat-token"))) return { error: errorResponse("Conversation not found.", 404) };
  return { conv };
}

/** Require a signed-in team member. */
export async function requireAgent() {
  const session = await getAgentSession();
  return session ? { agent: session.name } : { error: errorResponse("Please sign in.", 401) };
}

export async function agentConversation(id: string) {
  if (!UUID.test(id)) return { error: errorResponse("Conversation not found.", 404) };
  const conv = await getChatStore().getConversation(id);
  return conv ? { conv } : { error: errorResponse("Conversation not found.", 404) };
}

export const needsContact = (c: { status: string; email: string }) => c.status !== "bot" && !c.email;
