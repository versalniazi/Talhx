import { redirect } from "next/navigation";
import { getAgentSession, inboxConfigured } from "@/lib/chat/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { LogoMark } from "@/components/ui/Logo";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getAgentSession()) redirect("/admin");
  const configured = inboxConfigured();
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="card w-full max-w-sm p-8">
        <div className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-semibold tracking-[0.08em]">TALHX</span>
        </div>
        <h1 className="mt-6 text-2xl text-ink-900">Team inbox</h1>
        <p className="mt-1 text-sm text-ink-600">Sign in to reply to live chat conversations.</p>
        {configured ? (
          <LoginForm />
        ) : (
          <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            The inbox isn&apos;t set up yet. Add the <code>CHAT_AGENTS</code> and <code>CHAT_SESSION_SECRET</code> environment variables, then redeploy.
          </p>
        )}
      </div>
    </main>
  );
}
