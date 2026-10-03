import { randomInt } from "node:crypto";

export { PAYMENT_REFERENCE_PATTERN, ORDER_ID_PATTERN } from "./patterns";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion

/** Payment reference in the form TALHX-123456 (well within the 18-character UK bank reference limit). */
export function generatePaymentReference(): string {
  return `TALHX-${randomInt(100000, 1000000)}`;
}

/** Order ID in the form ORD-261003-7K3Q. */
export function generateOrderId(now = new Date()): string {
  const yy = String(now.getUTCFullYear()).slice(-2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  let suffix = "";
  for (let i = 0; i < 4; i++) suffix += ALPHABET[randomInt(0, ALPHABET.length)];
  return `ORD-${yy}${mm}${dd}-${suffix}`;
}
