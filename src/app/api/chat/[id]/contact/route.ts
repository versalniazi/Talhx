import type { NextRequest } from "next/server";
import { setVisitorContact } from "@/lib/chat/service";
import { visitorConversation } from "@/lib/chat/http";
import { sanitizeEmail, sanitizeText } from "@/lib/sanitize";
import { errorResponse, guardRequest, json, notify } from "@/lib/security";
import { v } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const blocked = guardRequest(req, "chat-contact", 10);
  if (blocked) return blocked;
  const { conv, error } = await visitorConversation(req, (await params).id);
  if (error) return error;

  const body = (await req.json().catch(() => ({}))) as { name?: unknown; email?: unknown };
  const name = sanitizeText(body.name, 100);
  const email = sanitizeEmail(body.email);
  const fieldErrors: Record<string, string> = {};
  const nameErr = v.name(name);
  const emailErr = v.email(email);
  if (nameErr) fieldErrors.name = nameErr;
  if (emailErr) fieldErrors.email = emailErr;
  if (Object.keys(fieldErrors).length) return errorResponse("Please check your details.", 422, fieldErrors);

  const m = await setVisitorContact(conv, name, email);
  await notify("Live chat: visitor left contact details", { conversationId: conv.id, name, email });
  return json({ ok: true, status: conv.status, needsContact: false, messages: [m] });
}
