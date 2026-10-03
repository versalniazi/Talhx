"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Info, Loader2 } from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";
import { StepIndicator } from "@/components/checkout/StepIndicator";
import { BANK_DETAILS } from "@/lib/payment-details";
import { formatGBP } from "@/lib/format";
import { PAYMENT_STATUS_CUSTOMER_LABELS } from "@/lib/orders/types";
import { useOrder } from "./useOrder";

function DetailRow({ label, value, display, copyLabel }: { label: string; value: string; display?: string; copyLabel?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="min-w-0">
        <dt className="text-sm text-ink-500">{label}</dt>
        <dd className="mt-0.5 break-all font-mono text-lg font-medium tracking-wide text-ink-900">{display ?? value}</dd>
      </div>
      {copyLabel && <CopyButton value={value} label={copyLabel} />}
    </div>
  );
}

export function PaymentInstructions() {
  const { state } = useOrder();

  if (state.status === "loading") {
    return (
      <div className="flex items-center justify-center gap-3 py-24 text-ink-600" role="status">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Loading your order…
      </div>
    );
  }

  if (state.status === "missing") {
    return (
      <div className="card mx-auto max-w-xl p-8 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-amber-500" aria-hidden="true" />
        <h2 className="mt-4 text-2xl text-ink-900">We couldn&apos;t find this order</h2>
        <p className="mt-3 text-ink-600">
          The order link may be incomplete or have expired in this browser. If you&apos;ve already placed an order, please contact us with your order number and payment reference rather than placing it again.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/contact" className="btn-primary">
            Contact TALHX
          </Link>
          <Link href="/pricing" className="btn-secondary">
            View Pricing
          </Link>
        </div>
      </div>
    );
  }

  const { order } = state;
  const confirmHref = `/payment-pending?order=${encodeURIComponent(order.orderId)}&ref=${encodeURIComponent(order.paymentReference)}`;

  return (
    <div className="mx-auto max-w-3xl">
      <StepIndicator current={4} />

      <div className="mt-8 rounded-3xl border border-emerald-500/20 bg-emerald-50 p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="h-7 w-7 shrink-0 text-emerald-600" aria-hidden="true" />
          <div>
            <h2 className="text-2xl text-ink-900">Order submitted — please complete your bank transfer</h2>
            <p className="mt-2 text-ink-700">
              Thank you, {order.customerName.split(" ")[0]}. Your order <span className="font-mono font-medium">{order.orderId}</span> has been created. Work will begin after your payment has been verified.
            </p>
          </div>
        </div>
      </div>

      <section className="card mt-6 overflow-hidden" aria-labelledby="amount-heading">
        <div className="flex flex-col gap-4 bg-ink-900 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <h2 id="amount-heading" className="text-sm font-normal text-white/60">
              Amount to transfer
            </h2>
            <p className="mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">{formatGBP(order.price, { decimals: true })}</p>
            <p className="mt-2 text-sm text-white/60">
              {order.serviceName} · {order.billing === "monthly" ? "Monthly service (first month)" : "One-time service"}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-sm text-white/60">Order status</p>
            <p className="mt-1 inline-flex items-center gap-2 rounded-full bg-amber-400/15 px-3 py-1 text-sm font-medium text-amber-200">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden="true" />
              {PAYMENT_STATUS_CUSTOMER_LABELS[order.paymentStatus]}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-7">
          <h3 className="text-lg text-ink-900">Bank transfer details</h3>
          <dl className="mt-4 divide-y divide-ink-900/10 rounded-2xl border border-ink-900/10">
            <DetailRow label="Account name" value={BANK_DETAILS.accountName} copyLabel="account name" />
            <DetailRow label="Sort code" value={BANK_DETAILS.sortCode} display={BANK_DETAILS.sortCodeDisplay} copyLabel="sort code" />
            <DetailRow label="Account number" value={BANK_DETAILS.accountNumber} copyLabel="account number" />
            <div className="bg-volt-50/60">
              <DetailRow label="Payment reference (required)" value={order.paymentReference} copyLabel="payment reference" />
            </div>
            <DetailRow label="Bank" value={BANK_DETAILS.bank} />
            <DetailRow label="Currency" value={BANK_DETAILS.currency} />
          </dl>

          <div className="mt-6 space-y-3">
            <p className="flex items-start gap-2.5 rounded-xl border border-volt-200 bg-volt-50 p-4 text-[15px] text-ink-800">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-volt-600" aria-hidden="true" />
              <span>
                <strong className="font-semibold">Please use your unique order reference when making the bank transfer.</strong> Your reference is{" "}
                <span className="font-mono font-medium">{order.paymentReference}</span>.
              </span>
            </p>
            <p className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-[15px] text-ink-800">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
              <span>
                <strong className="font-semibold">Please transfer exactly the amount shown above</strong> ({formatGBP(order.price, { decimals: true })}).
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="card mt-6 p-6 sm:p-7" aria-labelledby="next-heading">
        <h2 id="next-heading" className="text-lg text-ink-900">
          What happens next
        </h2>
        <ol className="mt-4 space-y-3 text-[15px] text-ink-700">
          {[
            "Make the bank transfer from your banking app using the details and reference above.",
            "Click “I've Made the Payment” and submit the short confirmation form.",
            "We check our bank account and verify your payment. Payments are never confirmed automatically.",
            "Once verified, we email you and start work on your order.",
          ].map((t, i) => (
            <li key={t} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-900 text-xs text-white">{i + 1}</span>
              {t}
            </li>
          ))}
        </ol>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href={confirmHref} className="btn-gradient !min-h-[52px] px-7">
            I&apos;ve Made the Payment <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <p className="text-sm text-ink-500">Keep a note of your order number and reference: {order.orderId} / {order.paymentReference}</p>
        </div>
      </section>
    </div>
  );
}
