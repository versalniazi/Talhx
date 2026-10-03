"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadOrder, saveOrder } from "@/lib/client-order-store";
import type { PublicOrder } from "@/lib/orders/types";

type State = { status: "loading" } | { status: "ready"; order: PublicOrder } | { status: "missing" };

/** Resolve the current order from sessionStorage, falling back to the lookup API (requires ID + reference). */
export function useOrder() {
  const params = useSearchParams();
  const orderId = (params.get("order") ?? "").toUpperCase();
  const ref = (params.get("ref") ?? "").toUpperCase();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (!orderId) {
      setState({ status: "missing" });
      return;
    }
    const cached = loadOrder(orderId);
    if (cached && (!ref || cached.paymentReference === ref)) {
      setState({ status: "ready", order: cached });
      return;
    }
    if (!ref) {
      setState({ status: "missing" });
      return;
    }
    let cancelled = false;
    fetch(`/api/orders/lookup?id=${encodeURIComponent(orderId)}&ref=${encodeURIComponent(ref)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { order?: PublicOrder } | null) => {
        if (cancelled) return;
        if (d?.order) {
          saveOrder(d.order);
          setState({ status: "ready", order: d.order });
        } else setState({ status: "missing" });
      })
      .catch(() => !cancelled && setState({ status: "missing" }));
    return () => {
      cancelled = true;
    };
  }, [orderId, ref]);

  return { state, orderId, ref };
}
