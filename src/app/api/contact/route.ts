import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { getStore } from "@/lib/orders/repository";
import { normalizeUrl, sanitizeEmail, sanitizeMultiline, sanitizeText } from "@/lib/sanitize";
import { errorResponse, guardRequest, json, looksLikeSpam, notify } from "@/lib/security";
import { hasErrors, validateContact, type ContactInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const blocked = guardRequest(req, "contact", 5);
  if (blocked) return blocked;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid request.", 400);
  }
  if (looksLikeSpam(body.company_url, body.renderedAt)) {
    return errorResponse("We couldn't process this request. Please try again.", 400);
  }

  const input: ContactInput = {
    name: sanitizeText(body.name, 100),
    email: sanitizeEmail(body.email),
    phone: sanitizeText(body.phone, 30),
    company: sanitizeText(body.company, 120),
    website: sanitizeText(body.website, 300),
    service: sanitizeText(body.service, 120),
    budget: sanitizeText(body.budget, 60),
    message: sanitizeMultiline(body.message, 3000),
  };
  const errors = validateContact(input);
  if (hasErrors(errors)) return errorResponse("Please correct the highlighted fields.", 422, errors as Record<string, string>);

  const enquiry = { id: randomUUID(), ...input, website: input.website ? normalizeUrl(input.website) : "", createdAt: new Date().toISOString() };
  await getStore().saveEnquiry(enquiry);
  await notify("New enquiry", { name: enquiry.name, service: enquiry.service, budget: enquiry.budget });

  return json({ ok: true });
}
