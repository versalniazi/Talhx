import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Order } from "./types";

/**
 * Data access layer.
 *
 * The site ships with a simple JSON-file store (falling back to in-memory storage when the
 * filesystem is read-only, e.g. on serverless hosts). It is suitable for development and
 * low-volume single-server deployments only.
 *
 * When Upstash Redis credentials are set (see UpstashStore below), that is used instead.
 *
 * To connect a different database (Postgres, MySQL, MongoDB, Supabase, etc.), implement the
 * `DataStore` interface below and return your implementation from `getStore()`.
 * Nothing else in the application needs to change.
 */

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  service: string;
  budget: string;
  message: string;
  createdAt: string;
}

export interface Subscriber {
  email: string;
  createdAt: string;
}

export interface DataStore {
  createOrder(order: Order): Promise<void>;
  getOrder(orderId: string): Promise<Order | undefined>;
  updateOrder(orderId: string, patch: Partial<Order>): Promise<Order | undefined>;
  paymentReferenceExists(reference: string): Promise<boolean>;
  saveEnquiry(enquiry: Enquiry): Promise<void>;
  saveSubscriber(subscriber: Subscriber): Promise<boolean>;
}

interface StoreShape {
  orders: Record<string, Order>;
  enquiries: Enquiry[];
  subscribers: Subscriber[];
}

class JsonFileStore implements DataStore {
  private data: StoreShape | null = null;
  private queue: Promise<unknown> = Promise.resolve();
  private persist = true;

  constructor(private readonly file: string) {}

  private async load(): Promise<StoreShape> {
    if (this.data) return this.data;
    try {
      this.data = JSON.parse(await fs.readFile(this.file, "utf8")) as StoreShape;
    } catch {
      this.data = { orders: {}, enquiries: [], subscribers: [] };
    }
    return this.data;
  }

  private async save() {
    if (!this.persist || !this.data) return;
    try {
      await fs.mkdir(path.dirname(this.file), { recursive: true });
      const tmp = `${this.file}.tmp`;
      await fs.writeFile(tmp, JSON.stringify(this.data, null, 2), { encoding: "utf8", mode: 0o600 });
      await fs.rename(tmp, this.file);
    } catch (err) {
      // Read-only filesystem: keep working in memory.
      this.persist = false;
      console.warn("[data-store] Persisting to disk failed; using in-memory storage only.", (err as Error).message);
    }
  }

  /** Serialise writes so concurrent requests cannot clobber each other. */
  private exclusive<T>(fn: (d: StoreShape) => Promise<T> | T): Promise<T> {
    const run = this.queue.then(async () => {
      const d = await this.load();
      return fn(d);
    });
    this.queue = run.catch(() => undefined);
    return run;
  }

  createOrder(order: Order) {
    return this.exclusive(async (d) => {
      d.orders[order.orderId] = order;
      await this.save();
    });
  }

  async getOrder(orderId: string) {
    const d = await this.load();
    return d.orders[orderId];
  }

  updateOrder(orderId: string, patch: Partial<Order>) {
    return this.exclusive(async (d) => {
      const existing = d.orders[orderId];
      if (!existing) return undefined;
      const updated = { ...existing, ...patch, orderId, updatedAt: new Date().toISOString() };
      d.orders[orderId] = updated;
      await this.save();
      return updated;
    });
  }

  async paymentReferenceExists(reference: string) {
    const d = await this.load();
    return Object.values(d.orders).some((o) => o.paymentReference === reference);
  }

  saveEnquiry(enquiry: Enquiry) {
    return this.exclusive(async (d) => {
      d.enquiries.push(enquiry);
      await this.save();
    });
  }

  saveSubscriber(subscriber: Subscriber) {
    return this.exclusive(async (d) => {
      if (d.subscribers.some((s) => s.email === subscriber.email)) return false;
      d.subscribers.push(subscriber);
      await this.save();
      return true;
    });
  }
}

/**
 * Upstash Redis store (REST API, no extra dependencies). Used automatically when
 * Upstash credentials are present — e.g. after adding "Upstash for Redis" from the
 * Vercel Marketplace, which sets KV_REST_API_URL / KV_REST_API_TOKEN.
 * Required on serverless hosts such as Vercel, where the filesystem is not persistent.
 */
class UpstashStore implements DataStore {
  constructor(
    private readonly url: string,
    private readonly token: string,
  ) {}

  private async cmd<T = unknown>(...args: (string | number)[]): Promise<T> {
    const res = await fetch(this.url, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(args),
      cache: "no-store",
    });
    const data = (await res.json()) as { result?: T; error?: string };
    if (!res.ok || data.error) throw new Error(`[data-store] Upstash error: ${data.error ?? res.status}`);
    return data.result as T;
  }

  async createOrder(order: Order) {
    await this.cmd("SET", `order:${order.orderId}`, JSON.stringify(order));
    await this.cmd("SET", `ref:${order.paymentReference}`, order.orderId);
    await this.cmd("LPUSH", "orders", order.orderId);
  }

  async getOrder(orderId: string) {
    const raw = await this.cmd<string | null>("GET", `order:${orderId}`);
    return raw ? (JSON.parse(raw) as Order) : undefined;
  }

  async updateOrder(orderId: string, patch: Partial<Order>) {
    const existing = await this.getOrder(orderId);
    if (!existing) return undefined;
    const updated = { ...existing, ...patch, orderId, updatedAt: new Date().toISOString() };
    await this.cmd("SET", `order:${orderId}`, JSON.stringify(updated));
    return updated;
  }

  async paymentReferenceExists(reference: string) {
    return (await this.cmd<number>("EXISTS", `ref:${reference}`)) === 1;
  }

  async saveEnquiry(enquiry: Enquiry) {
    await this.cmd("LPUSH", "enquiries", JSON.stringify(enquiry));
  }

  async saveSubscriber(subscriber: Subscriber) {
    const added = await this.cmd<number>("SADD", "subscribers", subscriber.email);
    if (added === 1) await this.cmd("HSET", "subscriber_dates", subscriber.email, subscriber.createdAt);
    return added === 1;
  }
}

const globalForStore = globalThis as unknown as { __talhxStore?: DataStore };

export function getStore(): DataStore {
  if (!globalForStore.__talhxStore) {
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    if (url && token) {
      globalForStore.__talhxStore = new UpstashStore(url, token);
    } else {
      if (process.env.VERCEL) {
        console.warn("[data-store] No Upstash Redis configured on Vercel: orders will NOT persist. See README › Deploying to Vercel.");
      }
      const dir = path.resolve(process.cwd(), process.env.DATA_DIR || ".data");
      globalForStore.__talhxStore = new JsonFileStore(path.join(dir, "store.json"));
    }
  }
  return globalForStore.__talhxStore;
}
