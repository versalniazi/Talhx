import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { getStore } from "@/lib/orders/repository";
import type { PaymentConfirmation } from "@/lib/orders/types";
import { sanitizeEmail, sanitizeMultiline, sanitizeText } from "@/lib/sanitize";
import { errorResponse, guardRequest, json, looksLikeSpam, notify } from "@/lib/security";
import { SCREENSHOT_TYPES, hasErrors, validatePayment, type PaymentInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

const EXT: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "application/pdf": "pdf" };

/** Check the file's magic bytes match its declared type, so renamed files are rejected. */
function matchesSignature(buf: Buffer, type: string) {
  const hex = buf.subarray(0, 12).toString("hex");
  switch (type) {
    case "image/png":
      return hex.startsWith("89504e470d0a1a0a");
    case "image/jpeg":
      return hex.startsWith("ffd8ff");
    case "image/webp":
      return hex.startsWith("52494646") && buf.subarray(8, 12).toString("ascii") === "WEBP";
    case "application/pdf":
      return buf.subarray(0, 5).toString("ascii") === "%PDF-";
    default:
      return false;
  }
}

/**
 * Record a customer's payment confirmation.
 * This NEVER marks a payment as received — it moves the order into manual review
 * ("Awaiting Payment Verification") until a team member checks the bank account.
 */
export async function POST(req: NextRequest) {
  const blocked = guardRequest(req, "payment", 6);
  if (blocked) return blocked;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return errorResponse("Invalid request.", 400);
  }

  if (looksLikeSpam(form.get("company_url"), form.get("renderedAt"))) {
    return errorResponse("We couldn't process this request. Please try again.", 400);
  }

  const input: PaymentInput = {
    customerName: sanitizeText(form.get("customerName"), 100),
    email: sanitizeEmail(form.get("email")),
    orderId: sanitizeText(form.get("orderId"), 30).toUpperCase(),
    paymentReference: sanitizeText(form.get("paymentReference"), 30).toUpperCase(),
    paymentDate: sanitizeText(form.get("paymentDate"), 10),
    amountPaid: sanitizeText(form.get("amountPaid"), 12),
  };
  const fileEntry = form.get("screenshot");
  const file = fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null;

  const errors = validatePayment(input, file);
  if (hasErrors(errors)) return errorResponse("Please correct the highlighted fields.", 422, errors as Record<string, string>);

  const store = getStore();
  const order = await store.getOrder(input.orderId);
  if (order && order.paymentReference !== input.paymentReference) {
    return errorResponse("The order number and payment reference don't match. Please check your details.", 422, {
      paymentReference: "This reference doesn't match the order number.",
    });
  }
  if (order && order.paymentStatus !== "pending" && order.paymentStatus !== "confirmation_submitted") {
    return errorResponse("This order's payment has already been reviewed. Please contact us if you need help.", 409);
  }

  let screenshot: PaymentConfirmation["screenshot"];
  if (file) {
    const buf = Buffer.from(await file.arrayBuffer());
    if (!SCREENSHOT_TYPES.includes(file.type) || !matchesSignature(buf, file.type)) {
      return errorResponse("The uploaded file isn't a valid image or PDF.", 422, { screenshot: "Upload a PNG, JPG, WebP or PDF file." });
    }
    screenshot = { fileName: sanitizeText(file.name, 120), mimeType: file.type, sizeBytes: file.size };
    try {
      // Stored outside /public with a random name so uploads are never directly web-accessible.
      const dir = path.resolve(process.cwd(), process.env.DATA_DIR || ".data", "uploads");
      await fs.mkdir(dir, { recursive: true });
      const storedAs = `${input.orderId}-${randomUUID()}.${EXT[file.type]}`;
      await fs.writeFile(path.join(dir, storedAs), buf, { mode: 0o600 });
      screenshot.storedAs = storedAs;
    } catch {
      // Read-only filesystem: keep metadata only. Connect object storage for production uploads.
    }
  }

  const confirmation: PaymentConfirmation = {
    ...input,
    amountPaid: Number(input.amountPaid.replace(/^£/, "")),
    notes: sanitizeMultiline(form.get("notes"), 1000) || undefined,
    screenshot,
    submittedAt: new Date().toISOString(),
    matchedOrder: Boolean(order),
  };

  if (order) {
    await store.updateOrder(order.orderId, {
      paymentStatus: "confirmation_submitted",
      orderStatus: "payment_review",
      paymentConfirmation: confirmation,
    });
  } else {
    // Order not found in this data store (e.g. after a redeploy). Keep the confirmation for manual matching.
    await store.saveEnquiry({
      id: randomUUID(),
      name: input.customerName,
      email: input.email,
      phone: "",
      company: "",
      website: "",
      service: `Unmatched payment confirmation: ${input.orderId}`,
      budget: "",
      message: JSON.stringify(confirmation),
      createdAt: confirmation.submittedAt,
    });
  }

  await notify("Payment confirmation submitted", {
    orderId: input.orderId,
    reference: input.paymentReference,
    amountPaid: confirmation.amountPaid,
    expected: order?.price ?? null,
    matchedOrder: Boolean(order),
  });

  return json({
    ok: true,
    status: "confirmation_submitted",
    statusLabel: "Awaiting Payment Verification",
    orderId: input.orderId,
  });
}
