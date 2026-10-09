import "server-only";

/** Minimal Upstash Redis REST client. Returns null when Upstash is not configured. */
export function upstashConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

export async function redis<T = unknown>(...args: (string | number)[]): Promise<T> {
  const cfg = upstashConfig();
  if (!cfg) throw new Error("[upstash] not configured");
  const res = await fetch(cfg.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  const data = (await res.json()) as { result?: T; error?: string };
  if (!res.ok || data.error) throw new Error(`[upstash] ${data.error ?? res.status}`);
  return data.result as T;
}
