"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Honeypot } from "@/components/ui/Field";
import { v } from "@/lib/validation";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [honeypot, setHoneypot] = useState("");
  const renderedAt = useRef(Date.now());

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const err = v.email(email);
    if (err) {
      setError(err);
      document.getElementById("nl-email")?.focus();
      return;
    }
    if (!consent) {
      setError("Please tick the box to confirm you'd like to receive emails.");
      document.getElementById("nl-consent")?.focus();
      return;
    }
    setError("");
    setState("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, company_url: honeypot, renderedAt: renderedAt.current }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (!res.ok || !data.ok) {
        setError(data.message || "Something went wrong. Please try again.");
        setState("idle");
      } else setState("done");
    } catch {
      setError("We couldn't reach the server. Please try again.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <p className="flex items-center gap-2 text-white" role="status">
        <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden="true" /> Thanks — you&apos;re on the list.
      </p>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="relative w-full max-w-md">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="nl-email" className="sr-only">
          Email address
        </label>
        <input
          id="nl-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@business.co.uk"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "nl-error" : undefined}
          className="min-h-[48px] flex-1 rounded-full border border-white/15 bg-white/[0.06] px-5 text-white placeholder:text-white/40 focus:border-volt-300 focus:outline-none focus:ring-4 focus:ring-volt-300/20"
        />
        <button type="submit" className="btn-white" disabled={state === "sending"}>
          {state === "sending" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Subscribe
        </button>
      </div>
      <div className="mt-3 flex items-start gap-2.5">
        <input id="nl-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-volt-400" />
        <label htmlFor="nl-consent" className="text-xs leading-relaxed text-white/60">
          I&apos;d like to receive occasional emails from TALHX LIMITED with marketing tips and service updates. Unsubscribe at any time.
        </label>
      </div>
      {error && (
        <p id="nl-error" role="alert" className="mt-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </form>
  );
}
