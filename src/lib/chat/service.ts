import "server-only";
import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { getChatStore } from "./store";
import { GREETING, botReply, type BotReply } from "./bot";
import type { ChatMessage, Conversation, Sender } from "./types";
import { notify } from "@/lib/security";

export const hashToken = (t: string) => createHash("sha256").update(t).digest("hex");

export function tokenMatches(conv: Conversation, token: string | null) {
  if (!token) return false;
  const a = Buffer.from(conv.tokenHash, "hex");
  const b = Buffer.from(hashToken(token), "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

function message(conversationId: string, from: Sender, text: string, extra: Partial<ChatMessage> = {}): ChatMessage {
  return { id: randomUUID(), conversationId, from, text, createdAt: new Date().toISOString(), ...extra };
}

async function append(conv: Conversation, m: ChatMessage) {
  const store = getChatStore();
  await store.addMessage(m);
  conv.lastMessageAt = m.createdAt;
  conv.updatedAt = m.createdAt;
  conv.lastMessagePreview = `${m.from === "agent" ? `${m.agentName}: ` : m.from === "bot" ? "Assistant: " : ""}${m.text}`.slice(0, 140);
  conv.messageCount += 1;
  if (m.from === "visitor" && conv.status !== "bot") conv.unreadForAgent += 1;
  return m;
}

const botMessage = (convId: string, r: BotReply) =>
  message(convId, "bot", r.text, { ...(r.links ? { links: r.links } : {}), ...(r.suggestions ? { suggestions: r.suggestions } : {}) });

export async function startConversation(page: string) {
  const token = randomBytes(24).toString("hex");
  const now = new Date().toISOString();
  const conv: Conversation = {
    id: randomUUID(),
    tokenHash: hashToken(token),
    name: "",
    email: "",
    status: "bot",
    page,
    createdAt: now,
    updatedAt: now,
    lastMessageAt: now,
    lastMessagePreview: "",
    unreadForAgent: 0,
    messageCount: 0,
  };
  const greeting = await append(conv, botMessage(conv.id, GREETING));
  await getChatStore().createConversation(conv);
  return { conv, token, messages: [greeting] };
}

/** Visitor sends a message. Returns new messages (visitor + any bot reply) and whether a handoff form is needed. */
export async function visitorMessage(conv: Conversation, text: string) {
  const out: ChatMessage[] = [await append(conv, message(conv.id, "visitor", text))];
  let needsContact = false;

  if (conv.status === "closed") conv.status = "waiting";

  if (conv.status === "bot") {
    const r = botReply(text);
    if (r.handoff) {
      out.push(await append(conv, botMessage(conv.id, r)));
      const res = await requestHuman(conv, { skipSave: true });
      out.push(...res.messages);
      needsContact = res.needsContact;
    } else {
      out.push(await append(conv, botMessage(conv.id, r)));
    }
  } else {
    await notify("New live chat message", { conversationId: conv.id, name: conv.name, text: text.slice(0, 200) });
  }
  await getChatStore().saveConversation(conv);
  return { messages: out, needsContact };
}

export async function requestHuman(conv: Conversation, opts: { skipSave?: boolean } = {}) {
  const messages: ChatMessage[] = [];
  let needsContact = false;
  if (conv.status === "bot") {
    conv.status = "waiting";
    conv.unreadForAgent = Math.max(conv.unreadForAgent, 1);
    needsContact = !conv.email;
    messages.push(
      await append(
        conv,
        message(
          conv.id,
          "system",
          needsContact
            ? "A member of our team will reply here. Please leave your name and email so we can follow up if you leave the page."
            : "A member of our team will reply here as soon as possible.",
        ),
      ),
    );
    await notify("Live chat: visitor wants a person", { conversationId: conv.id, name: conv.name, email: conv.email, page: conv.page });
  } else {
    needsContact = !conv.email;
  }
  if (!opts.skipSave) await getChatStore().saveConversation(conv);
  return { messages, needsContact };
}

export async function setVisitorContact(conv: Conversation, name: string, email: string) {
  conv.name = name;
  conv.email = email;
  const m = await append(conv, message(conv.id, "system", `Thanks, ${name.split(" ")[0]}. We'll reply here, and by email to ${email} if you've left.`));
  await getChatStore().saveConversation(conv);
  return m;
}

export async function agentMessage(conv: Conversation, agentName: string, text: string) {
  const m = await append(conv, message(conv.id, "agent", text, { agentName }));
  if (conv.status !== "closed") conv.status = "open";
  conv.assignedTo ??= agentName;
  conv.unreadForAgent = 0;
  await getChatStore().saveConversation(conv);
  return m;
}

export async function setStatus(conv: Conversation, status: "open" | "closed", agentName: string) {
  if (conv.status === status) return null;
  conv.status = status;
  const m = await append(
    conv,
    message(conv.id, "system", status === "closed" ? `${agentName} closed this conversation.` : `${agentName} reopened this conversation.`),
  );
  if (status === "closed") conv.unreadForAgent = 0;
  await getChatStore().saveConversation(conv);
  return m;
}
