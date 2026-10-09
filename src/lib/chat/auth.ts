import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Team inbox authentication.
 *
 * CHAT_AGENTS          "Name:password,Other Name:another-password" (server-only env var)
 * CHAT_SESSION_SECRET  long random string used to sign login cookies
 */

export const SESSION_COOKIE = "talhx_agent";
const SESSION_HOURS = 12;

export interface AgentSession {
  name: string;
  exp: number;
}

function agents(): { name: string; password: string }[] {
  return (process.env.CHAT_AGENTS ?? "")
    .split(",")
    .map((pair) => {
      const i = pair.indexOf(":");
      return i > 0 ? { name: pair.slice(0, i).trim(), password: pair.slice(i + 1).trim() } : null;
    })
    .filter((a): a is { name: string; password: string } => Boolean(a && a.name && a.password));
}

function secret() {
  const s = process.env.CHAT_SESSION_SECRET;
  return s && s.length >= 32 ? s : null;
}

export function inboxConfigured() {
  return Boolean(secret()) && agents().length > 0;
}

const sha = (s: string) => createHash("sha256").update(s).digest();

/** Constant-time check of a name/password pair. Returns the agent's display name. */
export function verifyAgent(name: string, password: string): string | null {
  let match: string | null = null;
  for (const a of agents()) {
    const nameOk = a.name.toLowerCase() === name.trim().toLowerCase();
    const passOk = timingSafeEqual(sha(a.password), sha(password));
    if (nameOk && passOk) match = a.name;
  }
  return match;
}

const b64 = (s: string) => Buffer.from(s).toString("base64url");
const sign = (payload: string, key: string) => createHmac("sha256", key).update(payload).digest("base64url");

export function createSessionValue(name: string) {
  const key = secret();
  if (!key) throw new Error("CHAT_SESSION_SECRET is not set (min 32 characters)");
  const payload = b64(JSON.stringify({ name, exp: Date.now() + SESSION_HOURS * 3600_000, n: randomBytes(8).toString("hex") }));
  return `${payload}.${sign(payload, key)}`;
}

export function readSessionValue(value: string | undefined): AgentSession | null {
  const key = secret();
  if (!key || !value) return null;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload, key));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as AgentSession;
    if (typeof data.name !== "string" || data.exp < Date.now()) return null;
    // Agent removed from CHAT_AGENTS => session no longer valid.
    if (!agents().some((a) => a.name === data.name)) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getAgentSession() {
  return readSessionValue((await cookies()).get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_HOURS * 3600,
};
