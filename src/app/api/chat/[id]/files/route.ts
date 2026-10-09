import type { NextRequest } from "next/server";
import { validateUpload } from "@/lib/chat/files";
import { needsContact, visitorConversation } from "@/lib/chat/http";
import { visitorAttachment } from "@/lib/chat/service";
import { CHAT_MESSAGE_MAX } from "@/lib/chat/types";
import { sanitizeMultiline } from "@/lib/sanitize";
import { errorResponse, guardRequest, json, rateLimit } from "@/lib/security";

export const dynamic = "force-dynamic";

/** Visitor uploads a file (multipart: file, optional text). */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const blocked = guardRequest(req, "chat-file", 15, 10 * 60 * 1000);
  if (blocked) return blocked;
  const { conv, error } = await visitorConversation(req, (await params).id);
  if (error) return error;
  if (!rateLimit(`chat-file-conv:${conv.id}`, 10, 10 * 60 * 1000)) return errorResponse("You've sent a lot of files. Please wait a few minutes.", 429);

  const form = await req.formData().catch(() => null);
  if (!form) return errorResponse("Invalid upload.", 400);
  const file = await validateUpload(form.get("file"));
  if ("error" in file) return errorResponse(file.error, 422);

  const res = await visitorAttachment(conv, file, sanitizeMultiline(form.get("text"), CHAT_MESSAGE_MAX));
  return json({ ok: true, status: conv.status, needsContact: res.needsContact || needsContact(conv), messages: res.messages });
}
