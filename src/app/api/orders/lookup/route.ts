import type { NextRequest } from "next/server";
import { getStore } from "@/lib/orders/repository";
import { ORDER_ID_PATTERN, PAYMENT_REFERENCE_PATTERN } from "@/lib/orders/patterns";
import { toPublicOrder } from "@/lib/orders/types";
import { clientIp, errorResponse, json, rateLimit } from "@/lib/security";

export const dynamic = "force-dynamic";

/**
 * Look up an order. Requires BOTH the order ID and its payment reference, so an order
 * cannot be retrieved by guessing a single identifier.
 */
export async function GET(req: NextRequest) {
  if (!rateLimit(`lookup:${clientIp(req)}`, 30, 10 * 60 * 1000)) return errorResponse("Too many requests.", 429);

  const id = (req.nextUrl.searchParams.get("id") ?? "").toUpperCase();
  const ref = (req.nextUrl.searchParams.get("ref") ?? "").toUpperCase();
  if (!ORDER_ID_PATTERN.test(id) || !PAYMENT_REFERENCE_PATTERN.test(ref)) return errorResponse("Order not found.", 404);

  const order = await getStore().getOrder(id);
  if (!order || order.paymentReference !== ref) return errorResponse("Order not found.", 404);
  return json({ ok: true, order: toPublicOrder(order) });
}
