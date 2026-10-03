// Client-safe copies of the identifier patterns (reference.ts uses node:crypto).
export const PAYMENT_REFERENCE_PATTERN = /^TALHX-\d{6}$/;
export const ORDER_ID_PATTERN = /^ORD-\d{6}-[A-HJ-NP-Z2-9]{4}$/;
