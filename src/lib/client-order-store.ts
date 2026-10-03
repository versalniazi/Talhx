"use client";

import type { PublicOrder } from "./orders/types";

/**
 * Keeps the current order in sessionStorage so the payment pages survive a refresh
 * without exposing order data in the URL beyond the order ID.
 */
const KEY = "talhx:orders";

function readAll(): Record<string, PublicOrder> {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveOrder(order: PublicOrder) {
  try {
    const all = readAll();
    all[order.orderId] = order;
    sessionStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable — the pages fall back to the lookup API */
  }
}

export function loadOrder(orderId: string): PublicOrder | undefined {
  return readAll()[orderId];
}
