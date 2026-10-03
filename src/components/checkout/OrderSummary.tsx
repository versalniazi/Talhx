import { Clock, Lock } from "lucide-react";
import type { ServicePackage } from "@/data/packages";
import { BillingLabel } from "@/components/pricing/PackageCard";
import { formatGBP } from "@/lib/format";

export function OrderSummary({ pkg }: { pkg: ServicePackage }) {
  return (
    <aside className="card p-6" aria-label="Order summary">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-500">Order summary</p>
      <p className="mt-4 text-lg font-medium text-ink-900">{pkg.name}</p>
      <BillingLabel billing={pkg.billing} className="mt-2" />
      <p className="mt-4 flex items-center gap-2 text-sm text-ink-600">
        <Clock className="h-4 w-4 text-ink-400" aria-hidden="true" /> {pkg.delivery}
      </p>
      <dl className="mt-6 space-y-2 border-t border-ink-900/10 pt-5 text-sm">
        <div className="flex justify-between text-ink-600">
          <dt>Package price</dt>
          <dd className="tabular-nums">{formatGBP(pkg.price, { decimals: true })}</dd>
        </div>
        <div className="flex items-baseline justify-between pt-2 text-ink-900">
          <dt className="font-medium">Total{pkg.billing === "monthly" ? " (first month)" : ""}</dt>
          <dd className="text-2xl font-semibold tabular-nums">{formatGBP(pkg.price, { decimals: true })}</dd>
        </div>
      </dl>
      <p className="mt-5 flex items-start gap-2 rounded-xl bg-mist p-3 text-xs leading-relaxed text-ink-600">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Payment is made by UK bank transfer. Bank details and your unique reference are shown after you place your order.
      </p>
    </aside>
  );
}
