import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { redis, redisConfigured } from "@/lib/upstash";
import { CHAT_MAX_MESSAGES, type ChatMessage, type Conversation } from "./types";

/**
 * Chat persistence. Uses Upstash Redis when configured (required on Vercel),
 * otherwise a local JSON file for development.
 */
export interface ChatStore {
  createConversation(c: Conversation): Promise<void>;
  getConversation(id: string): Promise<Conversation | undefined>;
  saveConversation(c: Conversation): Promise<void>;
  listConversations(limit?: number): Promise<Conversation[]>;
  addMessage(m: ChatMessage): Promise<void>;
  getMessages(conversationId: string): Promise<ChatMessage[]>;
}

class RedisChatStore implements ChatStore {
  async createConversation(c: Conversation) {
    await this.saveConversation(c);
  }
  async getConversation(id: string) {
    const raw = await redis<string | null>("GET", `chat:conv:${id}`);
    return raw ? (JSON.parse(raw) as Conversation) : undefined;
  }
  async saveConversation(c: Conversation) {
    await redis("SET", `chat:conv:${c.id}`, JSON.stringify(c));
    await redis("ZADD", "chat:convs", Date.parse(c.lastMessageAt), c.id);
  }
  async listConversations(limit = 100) {
    const ids = (await redis<string[] | null>("ZREVRANGE", "chat:convs", 0, limit - 1)) ?? [];
    if (!ids.length) return [];
    const raws = (await redis<(string | null)[] | null>("MGET", ...ids.map((id) => `chat:conv:${id}`))) ?? [];
    return raws.filter((r): r is string => Boolean(r)).map((r) => JSON.parse(r) as Conversation);
  }
  async addMessage(m: ChatMessage) {
    await redis("RPUSH", `chat:msgs:${m.conversationId}`, JSON.stringify(m));
    await redis("LTRIM", `chat:msgs:${m.conversationId}`, -CHAT_MAX_MESSAGES, -1);
  }
  async getMessages(conversationId: string) {
    const raws = (await redis<string[] | null>("LRANGE", `chat:msgs:${conversationId}`, 0, -1)) ?? [];
    return raws.map((r) => JSON.parse(r) as ChatMessage);
  }
}

interface FileShape {
  conversations: Record<string, Conversation>;
  messages: Record<string, ChatMessage[]>;
}

class FileChatStore implements ChatStore {
  private data: FileShape | null = null;
  private queue: Promise<unknown> = Promise.resolve();
  private persist = true;
  constructor(private readonly file: string) {}

  private async load() {
    if (this.data) return this.data;
    try {
      this.data = JSON.parse(await fs.readFile(this.file, "utf8")) as FileShape;
    } catch {
      this.data = { conversations: {}, messages: {} };
    }
    return this.data;
  }
  private async save() {
    if (!this.persist || !this.data) return;
    try {
      await fs.mkdir(path.dirname(this.file), { recursive: true });
      await fs.writeFile(`${this.file}.tmp`, JSON.stringify(this.data), { mode: 0o600 });
      await fs.rename(`${this.file}.tmp`, this.file);
    } catch {
      this.persist = false;
    }
  }
  private exclusive<T>(fn: (d: FileShape) => T | Promise<T>) {
    const run = this.queue.then(async () => fn(await this.load()));
    this.queue = run.catch(() => undefined);
    return run;
  }

  createConversation(c: Conversation) {
    return this.saveConversation(c);
  }
  async getConversation(id: string) {
    return (await this.load()).conversations[id];
  }
  saveConversation(c: Conversation) {
    return this.exclusive(async (d) => {
      d.conversations[c.id] = c;
      await this.save();
    });
  }
  async listConversations(limit = 100) {
    const d = await this.load();
    return Object.values(d.conversations)
      .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt))
      .slice(0, limit);
  }
  addMessage(m: ChatMessage) {
    return this.exclusive(async (d) => {
      const list = (d.messages[m.conversationId] ??= []);
      list.push(m);
      if (list.length > CHAT_MAX_MESSAGES) list.splice(0, list.length - CHAT_MAX_MESSAGES);
      await this.save();
    });
  }
  async getMessages(conversationId: string) {
    return [...((await this.load()).messages[conversationId] ?? [])];
  }
}

const g = globalThis as unknown as { __talhxChat?: ChatStore };

export function getChatStore(): ChatStore {
  if (!g.__talhxChat) {
    g.__talhxChat = redisConfigured()
      ? new RedisChatStore()
      : new FileChatStore(path.resolve(process.cwd(), process.env.DATA_DIR || ".data", "chat.json"));
  }
  return g.__talhxChat;
}
