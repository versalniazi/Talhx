"use client";

import { useEffect, useState } from "react";
import { Download, FileSpreadsheet, FileText, ImageOff, Loader2 } from "lucide-react";
import { formatBytes, type ChatAttachment } from "@/lib/chat/types";
import { cn } from "@/lib/format";

/**
 * Shows a chat attachment. Files are fetched with the caller's credentials
 * (visitor token header, or the team's sign-in cookie), never via a public URL.
 */
export function AttachmentView({
  attachment,
  url,
  headers,
  tone = "light",
}: {
  attachment: ChatAttachment;
  url: string;
  headers?: HeadersInit;
  tone?: "light" | "dark";
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const headerKey = JSON.stringify(headers ?? {});

  useEffect(() => {
    if (!attachment.isImage) return;
    let objectUrl: string | null = null;
    let cancelled = false;
    fetch(url, { headers })
      .then((r) => (r.ok ? r.blob() : Promise.reject()))
      .then((b) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(b);
        setSrc(objectUrl);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, attachment.isImage, headerKey]);

  async function download() {
    setBusy(true);
    try {
      const r = await fetch(`${url}?download=1`, { headers });
      if (!r.ok) throw new Error();
      const href = URL.createObjectURL(await r.blob());
      const a = document.createElement("a");
      a.href = href;
      a.download = attachment.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(href), 10_000);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  if (attachment.isImage && !failed) {
    return (
      <button type="button" onClick={() => src && window.open(src, "_blank", "noopener")} className="block overflow-hidden rounded-xl" aria-label={`Open image ${attachment.name}`}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={attachment.name} className="max-h-60 w-auto max-w-full object-contain" />
        ) : (
          <span className="flex h-32 w-48 items-center justify-center bg-ink-900/[0.05]">
            <Loader2 className="h-5 w-5 animate-spin text-ink-400" aria-hidden="true" />
          </span>
        )}
      </button>
    );
  }

  const Icon = failed ? ImageOff : /sheet|excel|csv/.test(attachment.type) ? FileSpreadsheet : FileText;
  return (
    <button
      type="button"
      onClick={download}
      disabled={busy}
      className={cn(
        "flex w-full max-w-[260px] items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition",
        tone === "dark" ? "border-white/25 bg-white/10 hover:bg-white/20" : "border-ink-900/10 bg-mist hover:bg-volt-50",
      )}
      aria-label={`Download ${attachment.name}`}
    >
      <Icon className={cn("h-8 w-8 shrink-0", tone === "dark" ? "text-white/80" : "text-volt-600")} aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{attachment.name}</span>
        <span className={cn("block text-xs", tone === "dark" ? "text-white/70" : "text-ink-500")}>
          {failed ? "Couldn't load — try again" : formatBytes(attachment.size)}
        </span>
      </span>
      {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Download className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />}
    </button>
  );
}
