import { getChatStore } from "@/lib/chat/store";
import { requireAgent } from "@/lib/chat/http";
import { toPublicConversation } from "@/lib/chat/types";
import { json } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireAgent();
  if (error) return error;
  const convs = await getChatStore().listConversations(200);
  return json({ ok: true, conversations: convs.map(toPublicConversation) });
}
