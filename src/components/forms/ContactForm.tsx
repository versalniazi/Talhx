"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Field, FormAlert, Honeypot } from "@/components/ui/Field";
import { SERVICES } from "@/data/services";
import { PACKAGES_BY_PRICE } from "@/data/packages";
import { hasErrors, validateContact, type ContactField, type ContactInput, type FieldErrors } from "@/lib/validation";

const EMPTY: ContactInput = { name: "", email: "", phone: "", company: "", website: "", service: "", budget: "", message: "" };
const ORDER: ContactField[] = ["name", "email", "phone", "company", "website", "service", "budget", "message"];
const BUDGETS = ["Under £50", "£50–£100", "£100–£250", "£250–£500", "£500 or more", "Not sure yet"];
const GENERAL = ["Not sure yet", "Custom quote", "Help with an existing order"];

export function ContactForm() {
  const [form, setForm] = useState<ContactInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<ContactField>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const renderedAt = useRef(Date.now());
  const sentRef = useRef<HTMLHeadingElement>(null);

  // Prefill the service from ?service=… links elsewhere on the site.
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("service");
    if (!s) return;
    const all = [...GENERAL, ...SERVICES.map((x) => x.name), ...PACKAGES_BY_PRICE.map((p) => p.name)];
    const match = all.find((o) => o.toLowerCase() === s.toLowerCase());
    if (match) setForm((f) => ({ ...f, service: match }));
  }, []);

  useEffect(() => {
    if (sent) sentRef.current?.focus();
  }, [sent]);

  function update(k: ContactField, val: string) {
    setForm((f) => ({ ...f, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    const errs = validateContact(form);
    setErrors(errs);
    if (hasErrors(errs)) {
      const first = ORDER.find((k) => errs[k]);
      if (first) document.getElementById(`c-${first}`)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, company_url: honeypot, renderedAt: renderedAt.current }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; fieldErrors?: FieldErrors<ContactField> };
      if (!res.ok || !data.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        setServerError(data.message || "Something went wrong. Please try again.");
      } else {
        setSent(true);
        setForm(EMPTY);
      }
    } catch {
      setServerError("We couldn't reach the server. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="card p-8 text-center sm:p-12" role="status">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" aria-hidden="true" />
        <h2 ref={sentRef} tabIndex={-1} className="mt-5 text-2xl text-ink-900 focus:outline-none">
          Thank you — your enquiry has been sent
        </h2>
        <p className="mx-auto mt-3 max-w-md text-ink-600">We&apos;ll review your message and reply by email as soon as we can.</p>
        <button type="button" className="btn-secondary mt-8" onClick={() => setSent(false)}>
          Send another enquiry
        </button>
      </div>
    );
  }

  const id = (k: ContactField) => `c-${k}`;

  return (
    <form noValidate onSubmit={submit} className="card relative p-6 sm:p-8" aria-labelledby="contact-form-heading">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <h2 id="contact-form-heading" className="text-2xl text-ink-900">
        Send an enquiry
      </h2>
      <p className="mt-2 text-ink-600">Tell us about your business and what you&apos;d like to achieve.</p>
      {serverError && (
        <div className="mt-5">
          <FormAlert message={serverError} />
        </div>
      )}
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field id={id("name")} label="Name" error={errors.name}>
          {(a) => <input {...a} className="field-input" autoComplete="name" value={form.name} onChange={(e) => update("name", e.target.value)} maxLength={100} />}
        </Field>
        <Field id={id("email")} label="Email" error={errors.email}>
          {(a) => <input {...a} type="email" inputMode="email" className="field-input" autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} maxLength={254} />}
        </Field>
        <Field id={id("phone")} label="Phone" optional error={errors.phone}>
          {(a) => <input {...a} type="tel" inputMode="tel" className="field-input" autoComplete="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} maxLength={30} />}
        </Field>
        <Field id={id("company")} label="Company" optional error={errors.company}>
          {(a) => <input {...a} className="field-input" autoComplete="organization" value={form.company} onChange={(e) => update("company", e.target.value)} maxLength={120} />}
        </Field>
        <Field id={id("website")} label="Website" optional error={errors.website}>
          {(a) => <input {...a} type="url" inputMode="url" className="field-input" autoComplete="url" placeholder="www.example.co.uk" value={form.website} onChange={(e) => update("website", e.target.value)} maxLength={300} />}
        </Field>
        <Field id={id("service")} label="Service interested in" error={errors.service}>
          {(a) => (
            <select {...a} className="field-input" value={form.service} onChange={(e) => update("service", e.target.value)}>
              <option value="">Select…</option>
              <optgroup label="General">
                {GENERAL.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </optgroup>
              <optgroup label="Services">
                {SERVICES.map((s) => (
                  <option key={s.slug}>{s.name}</option>
                ))}
              </optgroup>
              <optgroup label="Packages">
                {PACKAGES_BY_PRICE.map((p) => (
                  <option key={p.slug}>{p.name}</option>
                ))}
              </optgroup>
            </select>
          )}
        </Field>
        <Field id={id("budget")} label="Budget" optional error={errors.budget} className="sm:col-span-2">
          {(a) => (
            <select {...a} className="field-input" value={form.budget} onChange={(e) => update("budget", e.target.value)}>
              <option value="">Select a budget range…</option>
              {BUDGETS.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          )}
        </Field>
        <Field id={id("message")} label="Message" error={errors.message} className="sm:col-span-2" hint="Please don't include passwords or payment card details.">
          {(a) => <textarea {...a} rows={6} className="field-input resize-y" value={form.message} onChange={(e) => update("message", e.target.value)} maxLength={3000} />}
        </Field>
      </div>
      <p className="mt-5 text-xs leading-relaxed text-ink-500">
        We&apos;ll use your details only to respond to your enquiry. See our{" "}
        <a href="/privacy-policy" className="underline underline-offset-2">
          Privacy Policy
        </a>
        .
      </p>
      <button type="submit" className="btn-gradient mt-6 w-full !min-h-[52px] sm:w-auto sm:px-8" disabled={submitting} aria-busy={submitting}>
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
        {submitting ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
}
