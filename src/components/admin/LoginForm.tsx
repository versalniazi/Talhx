"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { FormAlert } from "@/components/ui/Field";

export function LoginForm() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !password) {
      setError("Enter your name and password.");
      return;
    }
    setBusy(true);
    setError("");
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, password }) });
    const d = (await r.json().catch(() => ({}))) as { message?: string };
    if (r.ok) {
      window.location.href = "/admin";
      return;
    }
    setError(d.message || "Sign-in failed.");
    setBusy(false);
  }

  return (
    <form onSubmit={submit} noValidate className="mt-6 space-y-4">
      {error && <FormAlert message={error} />}
      <div>
        <label htmlFor="agent-name" className="field-label">
          Name
        </label>
        <input id="agent-name" className="field-input" autoComplete="username" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="agent-password" className="field-label">
          Password
        </label>
        <input id="agent-password" type="password" className="field-input" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit" className="btn-primary w-full" disabled={busy}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />} Sign in
      </button>
    </form>
  );
}
