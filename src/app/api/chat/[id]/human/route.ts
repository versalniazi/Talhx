import type { NextRequest } from "next/server";
import { requestHuman } from "@/lib/chat/service";
import { visitorConversation } from "@/lib/chat/http";
import { guardRequest, json } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const blocked = guardRequest(req, "chat-human", 10);
  if (blocked) return blocked;
  const { conv, error } = await visitorConversation(req, (await params).id);
  if (error) return error;
  const res = await requestHuman(conv);
  return json({ ok: true, status: conv.status, needsContact: res.needsContact, messages: res.messages });
}
