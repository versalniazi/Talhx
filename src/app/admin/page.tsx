import { redirect } from "next/navigation";
import { getAgentSession } from "@/lib/chat/auth";
import { Inbox } from "@/components/admin/Inbox";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAgentSession();
  if (!session) redirect("/admin/login");
  return <Inbox agentName={session.name} />;
}
