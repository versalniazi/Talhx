import type { NextRequest } from "next/server";
import { getPackageBySlug } from "@/data/packages";
import { getStore } from "@/lib/orders/repository";
import { generateOrderId, generatePaymentReference } from "@/lib/orders/reference";
import { toPublicOrder, type Order } from "@/lib/orders/types";
import { normalizeUrl, sanitizeEmail, sanitizeMultiline, sanitizeText } from "@/lib/sanitize";
import { errorResponse, guardRequest, json, looksLikeSpam, notify } from "@/lib/security";
import { hasErrors, validateCheckout, type CheckoutInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

/** Create a new order. Price and service name are always taken from the server-side catalogue. */
export async function POST(req: NextRequest) {
  const blocked = guardRequest(req, "orders", 10);
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

  const pkg = getPackageBySlug(sanitizeText(body.packageSlug, 100));
  if (!pkg) return errorResponse("The selected package could not be found.", 400);

  const input: CheckoutInput = {
    fullName: sanitizeText(body.fullName, 100),
    email: sanitizeEmail(body.email),
    phone: sanitizeText(body.phone, 30),
    businessName: sanitizeText(body.businessName, 120),
    website: sanitizeText(body.website, 300),
    location: sanitizeText(body.location, 120),
    requirements: sanitizeMultiline(body.requirements, 3000),
  };
  const errors = validateCheckout(input);
  if (hasErrors(errors)) return errorResponse("Please correct the highlighted fields.", 422, errors as Record<string, string>);

  const store = getStore();
  let paymentReference = generatePaymentReference();
  for (let i = 0; i < 5 && (await store.paymentReferenceExists(paymentReference)); i++) {
    paymentReference = generatePaymentReference();
  }

  const now = new Date().toISOString();
  const order: Order = {
    orderId: generateOrderId(),
    customerName: input.fullName,
    email: input.email,
    phone: input.phone,
    businessName: input.businessName,
    website: input.website ? normalizeUrl(input.website) : "",
    location: input.location,
    serviceSlug: pkg.slug,
    serviceName: pkg.name,
    billing: pkg.billing,
    price: pkg.price,
    currency: "GBP",
    paymentReference,
    paymentStatus: "pending",
    orderStatus: "awaiting_payment",
    createdAt: now,
    updatedAt: now,
    requirements: input.requirements,
  };

  await store.createOrder(order);
  await notify("New order", { orderId: order.orderId, service: order.serviceName, price: order.price, reference: paymentReference });

  return json({ ok: true, order: toPublicOrder(order) }, 201);
}
