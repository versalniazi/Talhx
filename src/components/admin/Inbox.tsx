"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUp, CheckCircle2, ExternalLink, LogOut, Mail, MessageSquare, Paperclip, RotateCcw, X } from "lucide-react";
import { AttachmentView } from "@/components/chat/AttachmentView";
import { prepareFile } from "@/components/chat/prepareFile";
import { LogoMark } from "@/components/ui/Logo";
import { STATUS_LABELS, type ChatMessage, type ConversationStatus, type PublicConversation } from "@/lib/chat/types";
import { ATTACHMENT_ACCEPT, CHAT_MESSAGE_MAX, formatBytes } from "@/lib/chat/types";
import { cn } from "@/lib/format";

type Tab = "active" | "bot" | "closed" | "all";
const TABS: { value: Tab; label: string }[] = [
  { value: "active", label: "Needs team" },
  { value: "bot", label: "Assistant only" },
  { value: "closed", label: "Closed" },
  { value: "all", label: "All" },
];

const inTab = (c: PublicConversation, t: Tab) =>
  t === "all" ? true : t === "active" ? c.status === "waiting" || c.status === "open" : c.status === t;

const STATUS_STYLE: Record<ConversationStatus, string> = {
  waiting: "bg-amber-100 text-amber-800",
  open: "bg-volt-100 text-volt-700",
  bot: "bg-ink-900/[0.06] text-ink-600",
  closed: "bg-emerald-100 text-emerald-800",
};

function ago(iso: string) {
  const s = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(iso));
}

const fullTime = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

export function Inbox({ agentName }: { agentName: string }) {
  const [convs, setConvs] = useState<PublicConversation[]>([]);
  const [tab, setTab] = useState<Tab>("active");
  const [selected, setSelected] = useState<string | null>(null);
  const [thread, setThread] = useState<{ conversation: PublicConversation; messages: ChatMessage[] } | null>(null);
  const [reply, setReply] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const listEnd = useRef<HTMLDivElement>(null);
  const loggedOut = useRef(false);

  const handleAuth = useCallback((r: Response) => {
    if (r.status === 401 && !loggedOut.current) {
      loggedOut.current = true;
      window.location.href = "/admin/login";
    }
    return r;
  }, []);

  const loadList = useCallback(async () => {
    const r = handleAuth(await fetch("/api/admin/chats", { cache: "no-store" }));
    if (r.ok) setConvs(((await r.json()) as { conversations: PublicConversation[] }).conversations);
  }, [handleAuth]);

  const loadThread = useCallback(
    async (id: string) => {
      const r = handleAuth(await fetch(`/api/admin/chats/${id}`, { cache: "no-store" }));
      if (r.ok) {
        const d = (await r.json()) as { conversation: PublicConversation; messages: ChatMessage[] };
        setThread((prev) => (prev?.conversation.id === id && prev.messages.length === d.messages.length && prev.conversation.status === d.conversation.status ? prev : d));
        setConvs((cs) => cs.map((c) => (c.id === id ? d.conversation : c)));
      }
    },
    [handleAuth],
  );

  useEffect(() => {
    loadList();
    const t = setInterval(() => !document.hidden && loadList(), 5000);
    return () => clearInterval(t);
  }, [loadList]);

  useEffect(() => {
    if (!selected) return;
    setThread(null);
    loadThread(selected);
    const t = setInterval(() => !document.hidden && loadThread(selected), 3000);
    return () => clearInterval(t);
  }, [selected, loadThread]);

  useEffect(() => {
    listEnd.current?.scrollIntoView({ block: "end" });
  }, [thread?.messages.length]);

  const waitingCount = convs.filter((c) => c.status === "waiting" || (c.status === "open" && c.unreadForAgent > 0)).length;
  useEffect(() => {
    document.title = `${waitingCount ? `(${waitingCount}) ` : ""}Team Inbox | TALHX`;
  }, [waitingCount]);

  async function chooseFile(f: File | null) {
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!f) return;
    setError("");
    const prepared = await prepareFile(f);
    if (typeof prepared === "string") setError(prepared);
    else setFile(prepared);
  }

  async function sendReply() {
    const text = reply.trim();
    if ((!text && !file) || !selected || busy) return;
    setBusy(true);
    setError("");
    let res: Response;
    if (file) {
      const form = new FormData();
      form.append("file", file);
      if (text) form.append("text", text);
      res = await fetch(`/api/admin/chats/${selected}/files`, { method: "POST", body: form });
    } else {
      res = await fetch(`/api/admin/chats/${selected}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
    }
    const r = handleAuth(res);
    const d = (await r.json().catch(() => ({}))) as { conversation?: PublicConversation; messages?: ChatMessage[]; message?: string };
    if (r.ok && d.conversation && d.messages) {
      setReply("");
      setFile(null);
      setThread((t) => (t ? { conversation: d.conversation!, messages: [...t.messages, ...d.messages!] } : t));
      setConvs((cs) => cs.map((c) => (c.id === selected ? d.conversation! : c)));
    } else setError(d.message || "Reply not sent.");
    setBusy(false);
  }

  async function changeStatus(status: "open" | "closed") {
    if (!selected) return;
    setBusy(true);
    const r = handleAuth(
      await fetch(`/api/admin/chats/${selected}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }),
    );
    const d = (await r.json().catch(() => ({}))) as { conversation?: PublicConversation; messages?: ChatMessage[] };
    if (r.ok && d.conversation) {
      setThread((t) => (t ? { conversation: d.conversation!, messages: [...t.messages, ...(d.messages ?? [])] } : t));
      setConvs((cs) => cs.map((c) => (c.id === selected ? d.conversation! : c)));
    }
    setBusy(false);
  }

  async function logout() {
    loggedOut.current = true;
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  const visible = convs.filter((c) => inTab(c, tab));
  const conv = thread?.conversation;

  return (
    <div className="flex h-[100dvh] flex-col">
      <header className="dark-surface flex items-center justify-between gap-4 bg-ink-900 px-4 py-3 text-white sm:px-6">
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-7 w-7" />
          <span className="font-semibold tracking-[0.08em]">TALHX</span>
          <span className="ml-2 hidden text-sm text-white/50 sm:inline">Team inbox</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-white/70 sm:inline">Signed in as {agentName}</span>
          <button type="button" onClick={logout} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 hover:bg-white/10">
            <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Conversation list */}
        <aside className={cn("flex w-full flex-col border-r border-ink-900/10 bg-white md:w-[360px] md:shrink-0", selected && "max-md:hidden")} aria-label="Conversations">
          <div role="tablist" aria-label="Filter conversations" className="flex gap-1 overflow-x-auto border-b border-ink-900/10 p-2">
            {TABS.map((t) => {
              const count = convs.filter((c) => inTab(c, t.value)).length;
              return (
                <button
                  key={t.value}
                  role="tab"
                  type="button"
                  aria-selected={tab === t.value}
                  onClick={() => setTab(t.value)}
                  className={cn(
                    "whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition",
                    tab === t.value ? "bg-ink-900 text-white" : "text-ink-600 hover:bg-mist",
                  )}
                >
                  {t.label} <span className="ml-0.5 opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
          <ul className="flex-1 divide-y divide-ink-900/[0.06] overflow-y-auto">
            {visible.length === 0 && (
              <li className="p-8 text-center text-sm text-ink-500">
                <MessageSquare className="mx-auto mb-2 h-6 w-6 text-ink-300" aria-hidden="true" />
                No conversations here yet.
              </li>
            )}
            {visible.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setSelected(c.id)}
                  aria-current={selected === c.id ? "true" : undefined}
                  className={cn("block w-full px-4 py-3.5 text-left transition hover:bg-mist", selected === c.id && "bg-volt-50/70")}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className={cn("truncate text-[15px]", c.unreadForAgent ? "font-semibold text-ink-900" : "text-ink-800")}>
                      {c.name || "Website visitor"}
                    </span>
                    <span className="shrink-0 text-xs text-ink-400">{ago(c.lastMessageAt)}</span>
                  </span>
                  <span className="mt-1 flex items-center gap-2">
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", STATUS_STYLE[c.status])}>{STATUS_LABELS[c.status]}</span>
                    {c.unreadForAgent > 0 && (
                      <span className="rounded-full bg-red-500 px-1.5 text-[11px] font-semibold text-white" aria-label={`${c.unreadForAgent} unread`}>
                        {c.unreadForAgent}
                      </span>
                    )}
                  </span>
                  <span className="mt-1.5 line-clamp-2 block text-sm text-ink-500">{c.lastMessagePreview}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Thread */}
        <section className={cn("flex min-w-0 flex-1 flex-col", !selected && "max-md:hidden")} aria-label="Conversation">
          {!selected ? (
            <div className="flex flex-1 items-center justify-center p-8 text-center text-ink-500">Select a conversation to view and reply.</div>
          ) : !conv ? (
            <div className="flex flex-1 items-center justify-center text-ink-500">Loading…</div>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-ink-900/10 bg-white px-4 py-3 sm:px-6">
                <div className="flex min-w-0 items-start gap-3">
                  <button type="button" onClick={() => setSelected(null)} className="mt-0.5 rounded-full p-1.5 hover:bg-mist md:hidden" aria-label="Back to conversations">
                    <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <div className="min-w-0">
                    <h1 className="truncate text-lg text-ink-900">{conv.name || "Website visitor"}</h1>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-500">
                      {conv.email ? (
                        <a href={`mailto:${conv.email}`} className="inline-flex items-center gap-1 text-volt-600 hover:underline">
                          <Mail className="h-3.5 w-3.5" aria-hidden="true" /> {conv.email}
                        </a>
                      ) : (
                        <span>No email yet</span>
                      )}
                      {conv.page && (
                        <a href={conv.page} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> {conv.page}
                        </a>
                      )}
                      <span>Started {fullTime(conv.createdAt)}</span>
                      {conv.assignedTo && <span>Handled by {conv.assignedTo}</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", STATUS_STYLE[conv.status])}>{STATUS_LABELS[conv.status]}</span>
                  {conv.status === "closed" ? (
                    <button type="button" onClick={() => changeStatus("open")} disabled={busy} className="btn-secondary !min-h-[36px] !px-3 text-sm">
                      <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reopen
                    </button>
                  ) : (
                    <button type="button" onClick={() => changeStatus("closed")} disabled={busy} className="btn-secondary !min-h-[36px] !px-3 text-sm">
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Close
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-5 sm:px-6" aria-live="polite">
                {thread!.messages.map((m) =>
                  m.from === "system" ? (
                    <p key={m.id} className="mx-auto max-w-md text-center text-xs text-ink-500">
                      {m.text}
                    </p>
                  ) : (
                    <div key={m.id} className={cn("flex flex-col", m.from === "visitor" ? "items-start" : "items-end")}>
                      <p className="mb-1 px-1 text-[11px] text-ink-500">
                        {m.from === "visitor" ? conv.name || "Visitor" : m.from === "agent" ? m.agentName : "Assistant (automatic)"}
                      </p>
                      <div
                        className={cn(
                          "max-w-[80%] whitespace-pre-line break-words rounded-2xl px-4 py-2.5 text-[15px]",
                          m.from === "visitor" && "rounded-bl-md border border-ink-900/10 bg-white text-ink-900",
                          m.from === "agent" && "rounded-br-md bg-volt-500 text-white",
                          m.from === "bot" && "rounded-br-md bg-ink-900/[0.06] text-ink-700",
                        )}
                      >
                        {m.attachment && (
                          <span className={cn("block", m.text && "mb-2")}>
                            <AttachmentView attachment={m.attachment} url={`/api/admin/chats/${conv.id}/files/${m.attachment.id}`} tone={m.from === "agent" ? "dark" : "light"} />
                          </span>
                        )}
                        {m.text}
                      </div>
                    </div>
                  ),
                )}
                <div ref={listEnd} />
              </div>

              <form
                className="border-t border-ink-900/10 bg-white p-3 sm:px-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendReply();
                }}
              >
                {error && (
                  <p role="alert" className="mb-2 text-sm text-red-700">
                    {error}
                  </p>
                )}
                {conv.status === "bot" && (
                  <p className="mb-2 text-xs text-ink-500">This visitor is talking to the assistant. Replying will take over the conversation.</p>
                )}
                {file && (
                  <div className="mb-2 flex items-center gap-2 rounded-xl border border-ink-900/10 bg-mist px-3 py-2 text-sm">
                    <Paperclip className="h-4 w-4 shrink-0 text-volt-600" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate text-ink-800">{file.name}</span>
                    <span className="shrink-0 text-xs text-ink-500">{formatBytes(file.size)}</span>
                    <button type="button" onClick={() => setFile(null)} className="rounded-full p-1 text-ink-500 hover:bg-white hover:text-ink-900" aria-label={`Remove ${file.name}`}>
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                )}
                <div className="flex items-end gap-2">
                  <input ref={fileInputRef} type="file" accept={ATTACHMENT_ACCEPT} className="sr-only" tabIndex={-1} onChange={(e) => chooseFile(e.target.files?.[0] ?? null)} />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={busy}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-ink-500 hover:bg-mist hover:text-volt-600 disabled:opacity-40"
                    aria-label="Attach an image or document"
                    title="Attach an image or document (max 4 MB)"
                  >
                    <Paperclip className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <label htmlFor="reply" className="sr-only">
                    Reply
                  </label>
                  <textarea
                    id="reply"
                    rows={2}
                    value={reply}
                    maxLength={CHAT_MESSAGE_MAX}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendReply();
                      }
                    }}
                    placeholder={`Reply as ${agentName}… (Enter to send, Shift+Enter for a new line)`}
                    className="field-input min-h-[48px] flex-1 resize-y"
                  />
                  <button type="submit" disabled={(!reply.trim() && !file) || busy} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-volt-500 text-white hover:bg-volt-600 disabled:opacity-40" aria-label="Send reply">
                    <ArrowUp className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
