"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, Loader2, MessageCircle, UserRound, X } from "lucide-react";
import { GREETING, HUMAN_REQUEST } from "@/lib/chat/bot";
import type { ChatMessage, ConversationStatus } from "@/lib/chat/types";
import { CHAT_MESSAGE_MAX } from "@/lib/chat/types";
import { cn } from "@/lib/format";
import { v } from "@/lib/validation";

const STORAGE_KEY = "talhx:chat";
const SEEN_KEY = "talhx:chat-seen";

interface Session {
  id: string;
  token: string;
}

const localGreeting: ChatMessage = {
  id: "greeting",
  conversationId: "",
  from: "bot",
  text: GREETING.text,
  suggestions: GREETING.suggestions,
  createdAt: "",
};

function readSession(): Session | null {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return s && typeof s.id === "string" && typeof s.token === "string" ? s : null;
  } catch {
    return null;
  }
}

const time = (iso: string) =>
  iso ? new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso)) : "";

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([localGreeting]);
  const [status, setStatus] = useState<ConversationStatus>("bot");
  const [needsContact, setNeedsContact] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [unread, setUnread] = useState(0);
  const [contact, setContact] = useState({ name: "", email: "" });
  const [contactErrors, setContactErrors] = useState<{ name?: string; email?: string }>({});
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastAt = useRef("");

  const headers = useCallback(
    (s: Session | null = session): HeadersInit => ({ "Content-Type": "application/json", ...(s ? { "x-chat-token": s.token } : {}) }),
    [session],
  );

  const merge = useCallback((incoming: ChatMessage[]) => {
    if (!incoming.length) return;
    setMessages((prev) => {
      const ids = new Set(prev.map((m) => m.id));
      const next = [...prev, ...incoming.filter((m) => !ids.has(m.id))];
      return next;
    });
    for (const m of incoming) if (m.createdAt > lastAt.current) lastAt.current = m.createdAt;
  }, []);

  // Restore an existing conversation.
  useEffect(() => {
    const s = readSession();
    if (!s) return;
    setSession(s);
    fetch(`/api/chat/${s.id}`, { headers: { "x-chat-token": s.token } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: { messages: ChatMessage[]; status: ConversationStatus; needsContact: boolean }) => {
        setMessages(d.messages);
        setStatus(d.status);
        setNeedsContact(d.needsContact);
        lastAt.current = d.messages.at(-1)?.createdAt ?? "";
        const seen = localStorage.getItem(SEEN_KEY) ?? "";
        setUnread(d.messages.filter((m) => m.from === "agent" && m.createdAt > seen).length);
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setSession(null);
      });
  }, []);

  // Poll for replies: frequently while open, occasionally while closed and a person is involved.
  useEffect(() => {
    if (!session) return;
    if (!open && status === "bot") return;
    const interval = open ? 3000 : 20000;
    let stopped = false;
    const tick = async () => {
      if (document.hidden) return;
      try {
        const r = await fetch(`/api/chat/${session.id}?after=${encodeURIComponent(lastAt.current)}`, { headers: { "x-chat-token": session.token } });
        if (!r.ok || stopped) return;
        const d = (await r.json()) as { messages: ChatMessage[]; status: ConversationStatus; needsContact: boolean };
        setStatus(d.status);
        setNeedsContact(d.needsContact);
        if (d.messages.length) {
          merge(d.messages);
          if (!open) setUnread((u) => u + d.messages.filter((m) => m.from === "agent").length);
        }
      } catch {
        /* network blip — try again next tick */
      }
    };
    const t = setInterval(tick, interval);
    return () => {
      stopped = true;
      clearInterval(t);
    };
  }, [session, open, status, merge]);

  useEffect(() => {
    if (!open) return;
    setUnread(0);
    try {
      localStorage.setItem(SEEN_KEY, new Date().toISOString());
    } catch {
      /* ignore */
    }
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [open, messages, needsContact]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function ensureSession(): Promise<Session> {
    if (session) return session;
    const r = await fetch("/api/chat/start", { method: "POST", headers: headers(null), body: JSON.stringify({ page: pathname }) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).message || "Couldn't start the chat.");
    const d = (await r.json()) as { conversationId: string; token: string; messages: ChatMessage[]; status: ConversationStatus };
    const s = { id: d.conversationId, token: d.token };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {
      /* ignore */
    }
    setSession(s);
    setMessages(d.messages);
    lastAt.current = d.messages.at(-1)?.createdAt ?? "";
    return s;
  }

  async function send(text: string) {
    const t = text.trim();
    if (!t || sending) return;
    setSending(true);
    setError("");
    setInput("");
    const optimistic: ChatMessage = { id: `local-${Date.now()}`, conversationId: "", from: "visitor", text: t, createdAt: "" };
    setMessages((m) => [...m, optimistic]);
    try {
      const s = await ensureSession();
      const r = await fetch(`/api/chat/${s.id}/messages`, { method: "POST", headers: headers(s), body: JSON.stringify({ text: t }) });
      const d = (await r.json().catch(() => ({}))) as { messages?: ChatMessage[]; status?: ConversationStatus; needsContact?: boolean; message?: string };
      if (!r.ok || !d.messages) throw new Error(d.message || "Message not sent. Please try again.");
      setMessages((m) => m.filter((x) => x.id !== optimistic.id));
      merge(d.messages);
      if (d.status) setStatus(d.status);
      setNeedsContact(Boolean(d.needsContact));
    } catch (e) {
      setMessages((m) => m.filter((x) => x.id !== optimistic.id));
      setInput(t);
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  }

  async function submitContact(e: React.FormEvent) {
    e.preventDefault();
    const errs = { name: v.name(contact.name), email: v.email(contact.email) };
    setContactErrors(errs);
    if (errs.name || errs.email || !session) return;
    setSending(true);
    try {
      const r = await fetch(`/api/chat/${session.id}/contact`, { method: "POST", headers: headers(), body: JSON.stringify(contact) });
      const d = (await r.json().catch(() => ({}))) as { messages?: ChatMessage[]; fieldErrors?: typeof contactErrors; message?: string };
      if (!r.ok || !d.messages) {
        if (d.fieldErrors) setContactErrors(d.fieldErrors);
        else setError(d.message || "Couldn't save your details.");
        return;
      }
      merge(d.messages);
      setNeedsContact(false);
    } finally {
      setSending(false);
    }
  }

  const last = messages.at(-1);
  const suggestions = last?.from === "bot" && status === "bot" ? (last.suggestions ?? []) : [];
  const withPerson = status === "waiting" || status === "open";

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="chat-title"
          className="fixed inset-0 z-[60] flex flex-col bg-white shadow-2xl sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[600px] sm:max-h-[calc(100dvh-8rem)] sm:w-[380px] sm:overflow-hidden sm:rounded-3xl sm:border sm:border-ink-900/10"
        >
          <div className="dark-surface flex items-center justify-between gap-3 bg-ink-900 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-accent-gradient">
                {withPerson ? <UserRound className="h-5 w-5" aria-hidden="true" /> : <Bot className="h-5 w-5" aria-hidden="true" />}
              </span>
              <div>
                <h2 id="chat-title" className="text-base font-semibold">
                  TALHX Support
                </h2>
                <p className="text-xs text-white/60">
                  {status === "open" ? "Chatting with our team" : status === "waiting" ? "Waiting for a team member" : status === "closed" ? "Conversation closed — write to reopen" : "Assistant · ask for a person any time"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                buttonRef.current?.focus();
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 hover:bg-white/10"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-mist px-4 py-5" aria-live="polite" aria-relevant="additions">
            {messages.map((m) => (
              <Bubble key={m.id} m={m} onNavigate={() => setOpen(false)} />
            ))}

            {needsContact && (
              <form onSubmit={submitContact} noValidate className="rounded-2xl border border-ink-900/10 bg-white p-4">
                <p className="text-sm font-medium text-ink-900">Your details</p>
                <label htmlFor="chat-name" className="mt-3 block text-xs text-ink-600">
                  Name
                </label>
                <input
                  id="chat-name"
                  className="field-input mt-1 !py-2 text-sm"
                  autoComplete="name"
                  value={contact.name}
                  onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                  aria-invalid={Boolean(contactErrors.name)}
                  aria-describedby={contactErrors.name ? "chat-name-err" : undefined}
                />
                {contactErrors.name && (
                  <p id="chat-name-err" className="mt-1 text-xs text-red-700">
                    {contactErrors.name}
                  </p>
                )}
                <label htmlFor="chat-email" className="mt-3 block text-xs text-ink-600">
                  Email
                </label>
                <input
                  id="chat-email"
                  type="email"
                  className="field-input mt-1 !py-2 text-sm"
                  autoComplete="email"
                  value={contact.email}
                  onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                  aria-invalid={Boolean(contactErrors.email)}
                  aria-describedby={contactErrors.email ? "chat-email-err" : undefined}
                />
                {contactErrors.email && (
                  <p id="chat-email-err" className="mt-1 text-xs text-red-700">
                    {contactErrors.email}
                  </p>
                )}
                <button type="submit" className="btn-primary mt-3 w-full !min-h-[40px] text-sm" disabled={sending}>
                  Save details
                </button>
              </form>
            )}

            {suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    disabled={sending}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm transition",
                      s === HUMAN_REQUEST ? "border-ink-900 bg-ink-900 text-white hover:bg-ink-800" : "border-volt-500/30 bg-white text-volt-700 hover:bg-volt-50",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {sending && (
              <p className="flex items-center gap-2 text-xs text-ink-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> Sending…
              </p>
            )}
          </div>

          <form
            className="border-t border-ink-900/10 bg-white p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            {error && (
              <p role="alert" className="mb-2 px-1 text-xs text-red-700">
                {error}
              </p>
            )}
            <div className="flex items-end gap-2">
              <label htmlFor="chat-input" className="sr-only">
                Type your message
              </label>
              <textarea
                id="chat-input"
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={CHAT_MESSAGE_MAX}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Type your message…"
                className="max-h-32 min-h-[44px] flex-1 resize-none rounded-2xl border border-ink-900/15 px-4 py-2.5 text-[15px] focus:border-volt-500 focus:outline-none focus:ring-4 focus:ring-volt-500/15"
              />
              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-volt-500 text-white transition hover:bg-volt-600 disabled:opacity-40"
                aria-label="Send message"
              >
                <ArrowUp className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-2 px-1 text-[11px] leading-snug text-ink-500">
              Please don&apos;t share passwords or card details. See our{" "}
              <Link href="/privacy-policy" className="underline" onClick={() => setOpen(false)}>
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        </div>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : unread ? `Open chat, ${unread} new ${unread === 1 ? "reply" : "replies"}` : "Open chat"}
        className={cn(
          "fixed bottom-5 right-5 z-[61] flex h-14 w-14 items-center justify-center rounded-full bg-accent-gradient text-white shadow-[0_12px_32px_-8px_rgba(63,107,255,0.8)] transition hover:scale-105 sm:bottom-6 sm:right-6",
          open && "max-sm:hidden",
        )}
      >
        {open ? <X className="h-6 w-6" aria-hidden="true" /> : <MessageCircle className="h-6 w-6" aria-hidden="true" />}
        {!open && unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold">
            {unread}
          </span>
        )}
      </button>
    </>
  );
}

function Bubble({ m, onNavigate }: { m: ChatMessage; onNavigate: () => void }) {
  if (m.from === "system") {
    return <p className="mx-auto max-w-[90%] rounded-xl bg-ink-900/[0.05] px-3 py-2 text-center text-xs leading-relaxed text-ink-600">{m.text}</p>;
  }
  const mine = m.from === "visitor";
  return (
    <div className={cn("flex flex-col", mine ? "items-end" : "items-start")}>
      {!mine && <p className="mb-1 px-1 text-[11px] text-ink-500">{m.from === "agent" ? `${m.agentName} · TALHX team` : "Assistant"}</p>}
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-line break-words rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed",
          mine ? "rounded-br-md bg-volt-500 text-white" : m.from === "agent" ? "rounded-bl-md border border-volt-500/25 bg-white text-ink-900" : "rounded-bl-md bg-white text-ink-800 shadow-sm",
        )}
      >
        {m.text}
        {m.links && m.links.length > 0 && (
          <span className="mt-2 flex flex-wrap gap-2">
            {m.links.map((l) => (
              <Link key={l.href} href={l.href} onClick={onNavigate} className="rounded-full bg-volt-50 px-3 py-1 text-sm font-medium text-volt-700 hover:bg-volt-100">
                {l.label} →
              </Link>
            ))}
          </span>
        )}
      </div>
      {m.createdAt && <p className="mt-1 px-1 text-[10px] text-ink-400">{time(m.createdAt)}</p>}
    </div>
  );
}
