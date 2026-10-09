import type { NextRequest } from "next/server";
import { validateUpload } from "@/lib/chat/files";
import { agentConversation, requireAgent } from "@/lib/chat/http";
import { agentAttachment } from "@/lib/chat/service";
import { CHAT_MESSAGE_MAX, toPublicConversation } from "@/lib/chat/types";
import { sanitizeMultiline } from "@/lib/sanitize";
import { errorResponse, isSameOrigin, json } from "@/lib/security";

export const dynamic = "force-dynamic";

/** Team member sends a file (multipart: file, optional text). */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(req)) return errorResponse("Request blocked.", 403);
  const { agent, error: authError } = await requireAgent();
  if (authError) return authError;
  const { conv, error } = await agentConversation((await params).id);
  if (error) return error;

  const form = await req.formData().catch(() => null);
  if (!form) return errorResponse("Invalid upload.", 400);
  const file = await validateUpload(form.get("file"));
  if ("error" in file) return errorResponse(file.error, 422);

  const m = await agentAttachment(conv, agent, file, sanitizeMultiline(form.get("text"), CHAT_MESSAGE_MAX));
  return json({ ok: true, conversation: toPublicConversation(conv), messages: [m] });
}
