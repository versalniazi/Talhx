"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, Pencil } from "lucide-react";
import { CATEGORY_LABELS, PACKAGES_BY_PRICE, getPackageBySlug, type ServicePackage } from "@/data/packages";
import { Field, FormAlert, Honeypot } from "@/components/ui/Field";
import { BillingLabel } from "@/components/pricing/PackageCard";
import { StepIndicator } from "./StepIndicator";
import { OrderSummary } from "./OrderSummary";
import { saveOrder } from "@/lib/client-order-store";
import { formatGBP } from "@/lib/format";
import type { PublicOrder } from "@/lib/orders/types";
import { hasErrors, validateCheckout, type CheckoutField, type CheckoutInput, type FieldErrors } from "@/lib/validation";

const EMPTY: CheckoutInput = { fullName: "", email: "", phone: "", businessName: "", website: "", location: "", requirements: "" };
const DRAFT_KEY = "talhx:checkout-draft";

const FIELD_ORDER: CheckoutField[] = ["fullName", "email", "phone", "businessName", "website", "location", "requirements"];

export function CheckoutFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = getPackageBySlug(params.get("package") ?? "");

  const [pkg, setPkg] = useState<ServicePackage | undefined>(initial);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CheckoutInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<CheckoutField>>({});
  const [agree, setAgree] = useState(false);
  const [agreeError, setAgreeError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const renderedAt = useRef(Date.now());
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Restore an in-progress draft (same tab only).
  useEffect(() => {
    try {
      const d = sessionStorage.getItem(DRAFT_KEY);
      if (d) setForm({ ...EMPTY, ...JSON.parse(d) });
    } catch {
      /* ignore */
    }
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      /* ignore */
    }
  }, [form]);

  // Move focus to the step heading for screen reader and keyboard users.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  function changePackage(slug: string) {
    const p = getPackageBySlug(slug);
    setPkg(p);
    const url = new URL(window.location.href);
    if (p) url.searchParams.set("package", p.slug);
    else url.searchParams.delete("package");
    window.history.replaceState(null, "", url);
  }

  function update(field: CheckoutField, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validateDetails() {
    const e = validateCheckout(form);
    setErrors(e);
    if (hasErrors(e)) {
      const first = FIELD_ORDER.find((f) => e[f]);
      if (first) document.getElementById(first)?.focus();
      return false;
    }
    return true;
  }

  async function placeOrder() {
    if (!pkg) return;
    if (!agree) {
      setAgreeError("Please confirm you agree to the Terms & Conditions and Refund Policy.");
      document.getElementById("agree")?.focus();
      return;
    }
    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, packageSlug: pkg.slug, company_url: honeypot, renderedAt: renderedAt.current }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; order?: PublicOrder; message?: string; fieldErrors?: FieldErrors<CheckoutField> };
      if (!res.ok || !data.order) {
        if (data.fieldErrors && hasErrors(data.fieldErrors)) {
          setErrors(data.fieldErrors);
          setStep(2);
        }
        setServerError(data.message || "Something went wrong placing your order. Please try again.");
        setSubmitting(false);
        return;
      }
      saveOrder(data.order);
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      router.push(`/payment-success?order=${encodeURIComponent(data.order.orderId)}&ref=${encodeURIComponent(data.order.paymentReference)}`);
    } catch {
      setServerError("We couldn't reach the server. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
      <div className="min-w-0">
        <StepIndicator current={step} />

        <div className="card mt-8 p-6 sm:p-8">
          {/* STEP 1 — package */}
          {step === 1 && (
            <section aria-labelledby="step-heading">
              <h2 id="step-heading" ref={headingRef} tabIndex={-1} className="text-2xl text-ink-900 focus:outline-none">
                {pkg ? "Your selected package" : "Choose a package"}
              </h2>

              {pkg ? (
                <div className="mt-6 rounded-2xl border border-volt-500/30 bg-volt-50/50 p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm text-volt-700">{CATEGORY_LABELS[pkg.category]}</p>
                      <p className="mt-1 text-xl font-semibold text-ink-900">{pkg.name}</p>
                      <p className="mt-2 max-w-md text-[15px] text-ink-600">{pkg.summary}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-3xl font-semibold tracking-tight text-ink-900">
                        {formatGBP(pkg.price)}
                        {pkg.billing === "monthly" && <span className="text-base font-normal text-ink-500">/month</span>}
                      </p>
                      <BillingLabel billing={pkg.billing} className="mt-2" />
                    </div>
                  </div>
                  <ul className="mt-5 grid gap-2 border-t border-volt-500/15 pt-5 text-sm text-ink-700 sm:grid-cols-2">
                    {pkg.included.map((i) => (
                      <li key={i} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-volt-600" aria-hidden="true" />
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mt-3 text-ink-600">Select the package you&apos;d like to order. You can review the details before paying.</p>
              )}

              <div className="mt-6">
                <label htmlFor="package-select" className="field-label">
                  {pkg ? "Change package" : "Package"}
                </label>
                <select id="package-select" className="field-input" value={pkg?.slug ?? ""} onChange={(e) => changePackage(e.target.value)}>
                  <option value="" disabled>
                    Select a package…
                  </option>
                  {PACKAGES_BY_PRICE.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name} — {formatGBP(p.price)}
                      {p.billing === "monthly" ? "/month" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <Link href="/pricing" className="btn-secondary">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to pricing
                </Link>
                <button type="button" className="btn-primary" disabled={!pkg} onClick={() => setStep(2)}>
                  Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </section>
          )}

          {/* STEP 2 — details */}
          {step === 2 && pkg && (
            <section aria-labelledby="step-heading">
              <h2 id="step-heading" ref={headingRef} tabIndex={-1} className="text-2xl text-ink-900 focus:outline-none">
                Your details
              </h2>
              <p className="mt-2 text-ink-600">We&apos;ll use these details to contact you about your order. Fields marked optional can be left blank.</p>

              <form
                noValidate
                className="relative mt-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (validateDetails()) setStep(3);
                }}
              >
                <Honeypot value={honeypot} onChange={setHoneypot} />
                {hasErrors(errors) && <FormAlert message="Please correct the highlighted fields below." />}
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <Field id="fullName" label="Full name" error={errors.fullName}>
                    {(a) => <input {...a} className="field-input" autoComplete="name" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} maxLength={100} />}
                  </Field>
                  <Field id="email" label="Email address" error={errors.email}>
                    {(a) => (
                      <input {...a} type="email" inputMode="email" className="field-input" autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} maxLength={254} />
                    )}
                  </Field>
                  <Field id="phone" label="Phone number" error={errors.phone}>
                    {(a) => <input {...a} type="tel" inputMode="tel" className="field-input" autoComplete="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} maxLength={30} />}
                  </Field>
                  <Field id="businessName" label="Business name" error={errors.businessName}>
                    {(a) => (
                      <input {...a} className="field-input" autoComplete="organization" value={form.businessName} onChange={(e) => update("businessName", e.target.value)} maxLength={120} />
                    )}
                  </Field>
                  <Field id="website" label="Website URL" optional error={errors.website} hint="For example: www.yourbusiness.co.uk">
                    {(a) => (
                      <input {...a} type="url" inputMode="url" className="field-input" autoComplete="url" value={form.website} onChange={(e) => update("website", e.target.value)} maxLength={300} />
                    )}
                  </Field>
                  <Field id="location" label="Business location" error={errors.location} hint="Town or city, e.g. Manchester">
                    {(a) => (
                      <input {...a} className="field-input" autoComplete="address-level2" value={form.location} onChange={(e) => update("location", e.target.value)} maxLength={120} />
                    )}
                  </Field>
                  <Field
                    id="requirements"
                    label="Additional requirements"
                    optional
                    className="sm:col-span-2"
                    error={errors.requirements}
                    hint="Pages to focus on, target areas, competitors, deadlines… Please don't include passwords."
                  >
                    {(a) => <textarea {...a} rows={5} className="field-input resize-y" value={form.requirements} onChange={(e) => update("requirements", e.target.value)} maxLength={3000} />}
                  </Field>
                </div>
                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
                  </button>
                  <button type="submit" className="btn-primary">
                    Review order <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* STEP 3 — review */}
          {step === 3 && pkg && (
            <section aria-labelledby="step-heading">
              <h2 id="step-heading" ref={headingRef} tabIndex={-1} className="text-2xl text-ink-900 focus:outline-none">
                Review your order
              </h2>
              {serverError && (
                <div className="mt-5">
                  <FormAlert message={serverError} />
                </div>
              )}

              <dl className="mt-6 divide-y divide-ink-900/10 rounded-2xl border border-ink-900/10">
                <div className="flex flex-col gap-1 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <dt className="text-sm text-ink-500">Package</dt>
                  <dd className="font-medium text-ink-900">
                    {pkg.name} <span className="ml-1 text-sm font-normal text-ink-500">({pkg.billing === "monthly" ? "Monthly service" : "One-time service"})</span>
                  </dd>
                </div>
                <div className="flex flex-col gap-1 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <dt className="text-sm text-ink-500">Estimated delivery</dt>
                  <dd className="text-ink-900">{pkg.delivery}</dd>
                </div>
                <div className="flex items-baseline justify-between bg-mist p-5">
                  <dt className="font-medium text-ink-900">Total</dt>
                  <dd className="text-3xl font-semibold tracking-tight text-ink-900">{formatGBP(pkg.price, { decimals: true })}</dd>
                </div>
              </dl>

              <div className="mt-6 rounded-2xl border border-ink-900/10 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-ink-900">Your details</h3>
                  <button type="button" onClick={() => setStep(2)} className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm text-volt-600 hover:bg-volt-50">
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit
                  </button>
                </div>
                <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                  {(
                    [
                      ["Full name", form.fullName],
                      ["Email", form.email],
                      ["Phone", form.phone],
                      ["Business", form.businessName],
                      ["Website", form.website || "—"],
                      ["Location", form.location],
                    ] as const
                  ).map(([k, val]) => (
                    <div key={k} className="min-w-0">
                      <dt className="text-ink-500">{k}</dt>
                      <dd className="break-words text-ink-900">{val}</dd>
                    </div>
                  ))}
                  {form.requirements && (
                    <div className="sm:col-span-2">
                      <dt className="text-ink-500">Additional requirements</dt>
                      <dd className="whitespace-pre-line break-words text-ink-900">{form.requirements}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="mt-6">
                <div className="flex items-start gap-3">
                  <input
                    id="agree"
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => {
                      setAgree(e.target.checked);
                      setAgreeError("");
                    }}
                    aria-invalid={Boolean(agreeError)}
                    aria-describedby={agreeError ? "agree-error" : undefined}
                    className="mt-1 h-5 w-5 shrink-0 rounded border-ink-900/30 accent-volt-500"
                  />
                  <label htmlFor="agree" className="text-sm leading-relaxed text-ink-700">
                    I agree to the{" "}
                    <Link href="/terms-and-conditions" target="_blank" className="text-volt-600 underline underline-offset-2">
                      Terms &amp; Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="/refund-policy" target="_blank" className="text-volt-600 underline underline-offset-2">
                      Refund Policy
                    </Link>
                    , and understand that work begins after my bank transfer has been verified.
                  </label>
                </div>
                {agreeError && (
                  <p id="agree-error" className="field-error">
                    {agreeError}
                  </p>
                )}
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button type="button" className="btn-secondary" onClick={() => setStep(2)} disabled={submitting}>
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
                </button>
                <button type="button" className="btn-gradient !min-h-[52px] px-7" onClick={placeOrder} disabled={submitting} aria-busy={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Creating your order…
                    </>
                  ) : (
                    <>
                      Continue to Payment <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        {pkg ? (
          <OrderSummary pkg={pkg} />
        ) : (
          <aside className="card p-6 text-sm text-ink-600" aria-label="Order summary">
            No package selected yet.{" "}
            <Link href="/pricing" className="text-volt-600 underline">
              Browse packages
            </Link>
            .
          </aside>
        )}
      </div>
    </div>
  );
}
