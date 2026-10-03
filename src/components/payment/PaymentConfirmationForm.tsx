"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Clock, FileUp, Loader2, MailCheck, X } from "lucide-react";
import { Field, FormAlert, Honeypot } from "@/components/ui/Field";
import { saveOrder } from "@/lib/client-order-store";
import { formatGBP } from "@/lib/format";
import { SCREENSHOT_MAX_BYTES, SCREENSHOT_TYPES, hasErrors, validatePayment, type FieldErrors, type PaymentField, type PaymentInput } from "@/lib/validation";
import { useOrder } from "./useOrder";

const EMPTY: PaymentInput = { customerName: "", email: "", orderId: "", paymentReference: "", paymentDate: "", amountPaid: "" };
const ORDER: PaymentField[] = ["customerName", "email", "orderId", "paymentReference", "paymentDate", "amountPaid", "screenshot"];

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export function PaymentConfirmationForm() {
  const { state, orderId, ref } = useOrder();
  const [form, setForm] = useState<PaymentInput>(EMPTY);
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors<PaymentField>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ orderId: string } | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [maxDate, setMaxDate] = useState<string>();
  const renderedAt = useRef(Date.now());
  const fileRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  // Prefill from the order where available.
  useEffect(() => {
    const today = todayISO();
    setMaxDate(today);
    if (state.status === "ready") {
      const o = state.order;
      setForm({
        customerName: o.customerName,
        email: o.email,
        orderId: o.orderId,
        paymentReference: o.paymentReference,
        paymentDate: today,
        amountPaid: o.price.toFixed(2),
      });
    } else if (state.status === "missing") {
      setForm((f) => ({ ...f, orderId: orderId || f.orderId, paymentReference: ref || f.paymentReference, paymentDate: today }));
    }
  }, [state, orderId, ref]);

  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  function update(field: keyof PaymentInput, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function onFile(f: File | null) {
    setErrors((e) => ({ ...e, screenshot: undefined }));
    if (f && !SCREENSHOT_TYPES.includes(f.type)) {
      setErrors((e) => ({ ...e, screenshot: "Upload a PNG, JPG, WebP or PDF file." }));
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    if (f && f.size > SCREENSHOT_MAX_BYTES) {
      setErrors((e) => ({ ...e, screenshot: "The file must be 5 MB or smaller." }));
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setFile(f);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    const errs = validatePayment(form, file);
    setErrors(errs);
    if (hasErrors(errs)) {
      const first = ORDER.find((k) => errs[k]);
      if (first) document.getElementById(first)?.focus();
      return;
    }

    setSubmitting(true);
    const body = new FormData();
    for (const [k, v] of Object.entries(form)) body.append(k, v.trim());
    if (notes.trim()) body.append("notes", notes.trim());
    if (file) body.append("screenshot", file);
    body.append("company_url", honeypot);
    body.append("renderedAt", String(renderedAt.current));

    try {
      const res = await fetch("/api/payment-confirmation", { method: "POST", body });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; fieldErrors?: FieldErrors<PaymentField> };
      if (!res.ok || !data.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        setServerError(data.message || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      if (state.status === "ready") {
        saveOrder({ ...state.order, paymentStatus: "confirmation_submitted", orderStatus: "payment_review" });
      }
      setDone({ orderId: form.orderId.trim().toUpperCase() });
    } catch {
      setServerError("We couldn't reach the server. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="card mx-auto max-w-2xl p-8 text-center sm:p-12" role="status">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-volt-50 text-volt-600">
          <MailCheck className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 ref={doneRef} tabIndex={-1} className="mt-6 text-3xl text-ink-900 focus:outline-none">
          Payment confirmation submitted
        </h2>
        <p className="mx-auto mt-3 max-w-md text-lg text-ink-600">Your order will be reviewed and processed after payment verification.</p>
        <dl className="mx-auto mt-8 max-w-sm divide-y divide-ink-900/10 rounded-2xl border border-ink-900/10 text-left text-sm">
          <div className="flex justify-between gap-4 p-4">
            <dt className="text-ink-500">Order number</dt>
            <dd className="font-mono font-medium text-ink-900">{done.orderId}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 p-4">
            <dt className="text-ink-500">Payment status</dt>
            <dd className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-800">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" /> Awaiting Payment Verification
            </dd>
          </div>
        </dl>
        <p className="mx-auto mt-6 max-w-md text-sm text-ink-500">
          We check every payment manually against our bank account. You&apos;ll receive an email from us once your payment has been verified and your order is underway.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">
            Back to homepage
          </Link>
          <Link href="/contact" className="btn-secondary">
            Contact TALHX
          </Link>
        </div>
      </div>
    );
  }

  const backHref = orderId && ref ? `/payment-success?order=${encodeURIComponent(orderId)}&ref=${encodeURIComponent(ref)}` : "/pricing";

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_320px]">
      <form noValidate onSubmit={submit} className="card relative p-6 sm:p-8" aria-labelledby="confirm-heading">
        <Honeypot value={honeypot} onChange={setHoneypot} />
        <h2 id="confirm-heading" className="text-2xl text-ink-900">
          Confirm your bank transfer
        </h2>
        <p className="mt-2 text-ink-600">Tell us about the transfer you&apos;ve made so we can match it to your order.</p>

        {serverError && (
          <div className="mt-5">
            <FormAlert message={serverError} />
          </div>
        )}

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <Field id="customerName" label="Customer name" error={errors.customerName}>
            {(a) => <input {...a} className="field-input" autoComplete="name" value={form.customerName} onChange={(e) => update("customerName", e.target.value)} maxLength={100} />}
          </Field>
          <Field id="email" label="Email" error={errors.email}>
            {(a) => <input {...a} type="email" inputMode="email" className="field-input" autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} maxLength={254} />}
          </Field>
          <Field id="orderId" label="Order number" error={errors.orderId} hint="e.g. ORD-261003-7K3Q">
            {(a) => (
              <input {...a} className="field-input font-mono uppercase" autoCapitalize="characters" value={form.orderId} onChange={(e) => update("orderId", e.target.value)} maxLength={20} />
            )}
          </Field>
          <Field id="paymentReference" label="Payment reference" error={errors.paymentReference} hint="e.g. TALHX-104826">
            {(a) => (
              <input
                {...a}
                className="field-input font-mono uppercase"
                autoCapitalize="characters"
                value={form.paymentReference}
                onChange={(e) => update("paymentReference", e.target.value)}
                maxLength={20}
              />
            )}
          </Field>
          <Field id="paymentDate" label="Payment date" error={errors.paymentDate}>
            {(a) => <input {...a} type="date" className="field-input" max={maxDate} value={form.paymentDate} onChange={(e) => update("paymentDate", e.target.value)} />}
          </Field>
          <Field id="amountPaid" label="Amount paid (£)" error={errors.amountPaid}>
            {(a) => (
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" aria-hidden="true">
                  £
                </span>
                <input {...a} inputMode="decimal" className="field-input pl-8" value={form.amountPaid} onChange={(e) => update("amountPaid", e.target.value)} maxLength={10} />
              </div>
            )}
          </Field>

          <Field id="screenshot" label="Payment screenshot" optional className="sm:col-span-2" error={errors.screenshot} hint="PNG, JPG, WebP or PDF, up to 5 MB.">
            {(a) => (
              <div>

                <input
                  {...a}
                  ref={fileRef}
                  type="file"
                  accept={SCREENSHOT_TYPES.join(",")}
                  className="peer sr-only"
                  onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                />
                <label
                  htmlFor="screenshot"
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-ink-900/20 bg-mist px-4 py-4 text-sm text-ink-600 transition hover:border-volt-500/50 hover:bg-volt-50/40 peer-focus-visible:ring-2 peer-focus-visible:ring-volt-500 peer-focus-visible:ring-offset-2"
                >
                  <FileUp className="h-5 w-5 text-volt-600" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate">{file ? file.name : "Choose a file to upload"}</span>
                </label>
                {file && (
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center gap-1 text-sm text-ink-600 hover:text-red-700"
                    onClick={() => {
                      setFile(null);
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" /> Remove file
                  </button>
                )}
              </div>
            )}
          </Field>

          <Field id="notes" label="Notes" optional className="sm:col-span-2">
            {(a) => <textarea {...a} rows={3} className="field-input resize-y" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={1000} />}
          </Field>
        </div>

        <p className="mt-6 text-sm text-ink-500">
          Submitting this form does not confirm that your payment has been received. We verify every payment manually before starting work.
        </p>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Link href={backHref} className="btn-secondary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to payment details
          </Link>
          <button type="submit" className="btn-gradient !min-h-[52px] px-7" disabled={submitting} aria-busy={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Submitting…
              </>
            ) : (
              "Submit Payment Confirmation"
            )}
          </button>
        </div>
      </form>

      <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start" aria-label="Order information">
        {state.status === "ready" && (
          <div className="card p-6">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-500">Your order</p>
            <p className="mt-3 font-medium text-ink-900">{state.order.serviceName}</p>
            <p className="mt-1 text-2xl font-semibold text-ink-900">{formatGBP(state.order.price, { decimals: true })}</p>
            <dl className="mt-4 space-y-1.5 border-t border-ink-900/10 pt-4 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-ink-500">Order</dt>
                <dd className="font-mono text-ink-900">{state.order.orderId}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-ink-500">Reference</dt>
                <dd className="font-mono text-ink-900">{state.order.paymentReference}</dd>
              </div>
            </dl>
          </div>
        )}
        <div className="rounded-3xl bg-ink-900 p-6 text-sm leading-relaxed text-white/70">
          <p className="font-medium text-white">Haven&apos;t paid yet?</p>
          <p className="mt-2">Go back to the payment details, make your transfer using your unique reference, then return to this page.</p>
        </div>
      </aside>
    </div>
  );
}
