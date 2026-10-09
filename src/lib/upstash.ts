import "server-only";
import { createClient } from "redis";

/**
 * Shared Redis access for orders and live chat.
 *
 * Supported configurations (first match wins):
 *  1. Upstash REST: any env var ending in KV_REST_API_URL or REDIS_REST_URL plus its matching
 *     *_TOKEN — covers KV_REST_API_URL, UPSTASH_REDIS_REST_URL and custom prefixes Vercel adds
 *     when connecting storage (e.g. STORAGE_KV_REST_API_URL).
 *  2. Any Redis connection string: REDIS_URL, KV_URL or a prefixed variant (e.g. STORAGE_REDIS_URL).
 *     This is what Vercel's native "Redis" storage sets.
 */

type Backend = { kind: "rest"; url: string; token: string; source: string } | { kind: "tcp"; url: string; source: string };

function detect(): Backend | null {
  const env = process.env;
  const keys = Object.keys(env).sort((a, b) => a.length - b.length); // prefer unprefixed names
  for (const key of keys) {
    const m = key.match(/^(.*?)(KV_REST_API_URL|REDIS_REST_URL)$/);
    if (!m || !env[key]) continue;
    const tokenKey = `${m[1]}${m[2].replace(/URL$/, "TOKEN")}`;
    if (env[tokenKey]) return { kind: "rest", url: env[key]!, token: env[tokenKey]!, source: key };
  }
  for (const key of keys) {
    if (/(^|_)(REDIS_URL|KV_URL)$/.test(key) && /^rediss?:\/\//.test(env[key] ?? "")) {
      return { kind: "tcp", url: env[key]!, source: key };
    }
  }
  return null;
}

let cached: Backend | null | undefined;
const backend = () => (cached === undefined ? (cached = detect()) : cached);

/** True when a persistent Redis database is configured. */
export const redisConfigured = () => backend() !== null;
/** Name of the env var the connection came from (for diagnostics; never the value). */
export const redisSource = () => backend()?.source ?? null;

type TcpClient = ReturnType<typeof createClient>;
const g = globalThis as unknown as { __talhxRedis?: Promise<TcpClient> };

function tcpClient(url: string) {
  if (!g.__talhxRedis) {
    const client = createClient({ url, socket: { connectTimeout: 5000, reconnectStrategy: (n) => Math.min(n * 200, 2000) } });
    client.on("error", (e) => console.warn("[redis]", (e as Error).message));
    g.__talhxRedis = client.connect().then(() => client).catch((e) => {
      g.__talhxRedis = undefined;
      throw e;
    });
  }
  return g.__talhxRedis;
}

export async function redis<T = unknown>(...args: (string | number)[]): Promise<T> {
  const b = backend();
  if (!b) throw new Error("[redis] not configured");
  if (b.kind === "tcp") {
    const client = await tcpClient(b.url);
    return (await client.sendCommand(args.map(String))) as T;
  }
  const res = await fetch(b.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${b.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  const data = (await res.json()) as { result?: T; error?: string };
  if (!res.ok || data.error) throw new Error(`[redis] ${data.error ?? res.status}`);
  return data.result as T;
}
