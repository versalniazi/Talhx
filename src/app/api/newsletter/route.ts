import type { NextRequest } from "next/server";
import { getStore } from "@/lib/orders/repository";
import { sanitizeEmail } from "@/lib/sanitize";
import { errorResponse, guardRequest, json, looksLikeSpam } from "@/lib/security";
import { v } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const blocked = guardRequest(req, "newsletter", 5);
  if (blocked) return blocked;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid request.", 400);
  }
  if (looksLikeSpam(body.company_url, body.renderedAt)) return errorResponse("We couldn't process this request.", 400);
  if (body.consent !== true) return errorResponse("Please confirm you'd like to receive emails.", 422, { consent: "Please tick to confirm." });

  const email = sanitizeEmail(body.email);
  const err = v.email(email);
  if (err) return errorResponse(err, 422, { email: err });

  await getStore().saveSubscriber({ email, createdAt: new Date().toISOString() });
  // Same response whether new or existing, so the endpoint can't be used to check who is subscribed.
  return json({ ok: true });
}
